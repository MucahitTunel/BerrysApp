import { Alert } from 'react-native'
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import AsyncStorage from '@react-native-community/async-storage'
import Pusher from 'pusher-js/react-native'
import Config from 'react-native-config'
import request from 'services/api'
import Constants from 'constants'
import * as NavigationService from 'services/navigation'
import generateVerificationCode from 'utils/generate-verification-code'
import { formatPhoneNumber } from '../contacts/helpers'

// Enable pusher logging - don't include this in production
Pusher.logToConsole = true

export const pusher = new Pusher(Config.PUSHER_CHANNELS_APP_KEY, {
  cluster: Config.PUSHER_CHANNELS_APP_CLUSTER,
  forceTLS: true,
})

export const postSignIn = async (userData, isFromBoot = false) => {
  if (!isFromBoot) {
    await AsyncStorage.setItem('userData', JSON.stringify(userData))
  }
}

export const authBoot = createAsyncThunk(
  'auth/boot',
  async (_, { dispatch }) => {
    const userDataString = await AsyncStorage.getItem('userData')
    const userData = JSON.parse(userDataString)
    if (userData) {
      const channel = pusher.subscribe(userData._id)
      channel.bind('POINTS_UPDATED', (data) => {
        dispatch(updatePoints(data.points))
      })
      await postSignIn(userData)
      dispatch(getUser(userData.phoneNumber))
    }
    return userData
  },
)

export const logout = createAsyncThunk('auth/logout', async () => {
  await AsyncStorage.removeItem('userData')
})

export const getUser = createAsyncThunk('auth/getUser', async (phoneNumber) => {
  const { data } = await request({
    method: 'GET',
    url: 'account/get-user',
    params: {
      phoneNumber: phoneNumber,
    },
  })
  const { user } = data
  return user
})

export const signIn = createAsyncThunk(
  'auth/signIn',
  async ({ phoneNumber, countryCode }) => {
    const { number, isValid } = formatPhoneNumber(phoneNumber, countryCode)
    if (!isValid) {
      return Alert.alert(
        'Error',
        `Cannot parse this phone number: ${phoneNumber}`,
      )
    }
    const verifyCode = generateVerificationCode()
    await request({
      method: 'POST',
      url: 'account/send-verify-sms',
      data: {
        phoneNumber: number,
        verifyCode,
      },
    })
    const userData = {
      phoneNumber: number,
      verifyCode,
      service: Constants.Services.PhoneNumber,
      isVerifying: true,
    }
    NavigationService.navigate(Constants.Screens.PhoneVerification)
    return userData
  },
)

export const verifyPhoneNumber = createAsyncThunk(
  'auth/verifyPhoneNumber',
  async ({ verifyCode }, { getState, dispatch }) => {
    const state = getState()
    const user = state.auth.user
    const { verifyCode: actualVerifyCode } = user
    const isMatched = verifyCode === actualVerifyCode
    if (!isMatched) {
      const error = new Error('Wrong verification code')
      Alert.alert('Error', error.message)
      throw error
    } else {
      dispatch(createAccount(user))
    }
  },
)

export const createAccount = createAsyncThunk(
  'auth/createAccount',
  async (user) => {
    const { data } = await request({
      method: 'POST',
      url: 'account/create',
      data: {
        user,
      },
    })
    const userData = data.user
    await postSignIn(userData)
    return userData
  },
)

export const resendVerifyCode = createAsyncThunk(
  'auth/resendVerifyCode',
  async (_, { getState }) => {
    const state = getState()
    const user = state.auth.user
    const { phoneNumber } = user
    const newVerifyCode = generateVerificationCode()
    const newUserData = {
      ...user,
      verifyCode: newVerifyCode,
    }
    await request({
      method: 'POST',
      url: 'account/send-verify-sms',
      data: {
        phoneNumber,
        verifyCode: newVerifyCode,
      },
    })
    Alert.alert(
      'The new verification code has been sent to your phone number',
      null,
    )
    return newUserData
  },
)

export const submitSurvey = createAsyncThunk(
  'auth/submitSurvey',
  async ({ value }, { getState }) => {
    const state = getState()
    const user = state.auth.user
    setTimeout(() => {
      NavigationService.navigate(Constants.Screens.Main)
    }, 1000)
    request({
      method: 'POST',
      url: 'survey',
      data: {
        userPhoneNumber: user.phoneNumber,
        value,
      },
    })
    return value
  },
)

export const updatePushToken = createAsyncThunk(
  'auth/updatePushToken',
  async ({ pushToken }, { getState }) => {
    const state = getState()
    const user = state.auth.user
    await request({
      method: 'POST',
      url: 'account/push-token',
      data: {
        pushToken,
        userId: user._id,
      },
    })
  },
)

export const updateName = createAsyncThunk(
  'auth/updateName',
  async ({ name }, { getState, dispatch }) => {
    const state = getState()
    const user = state.auth.user
    await request({
      method: 'POST',
      url: 'account/name',
      data: {
        name,
        userId: user._id,
      },
    })
    dispatch(getUser(user.phoneNumber))
  },
)

export const requestToAsk = createAsyncThunk(
  'requestToAsk/submit',
  async (contacts, { getState }) => {
    const state = getState()
    const user = state.auth.user
    const receivers = contacts
      .filter((c) => c.isSelected)
      .map((c) => ({ phoneNumber: c.phoneNumber }))
    await request({
      method: 'POST',
      url: 'account/request-to-ask',
      data: {
        receivers,
        userPhoneNumber: user.phoneNumber,
      },
    })
    setTimeout(() => {
      Alert.alert(
        'Success',
        `You invited ${receivers.length} people to ask you their questions`,
      )
    }, 500)
    NavigationService.navigate(Constants.Screens.Main)
  },
)

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    loading: false,
    booting: true,
  },
  reducers: {
    updatePoints: (state, action) => {
      state.user = {
        ...state.user,
        points: action.payload,
      }
    },
    setUserIsNew: (state, action) => {
      state.user = {
        ...state.user,
        isNew: action.payload,
      }
    },
  },
  extraReducers: {
    [signIn.pending]: (state) => {
      state.loading = true
    },
    [signIn.fulfilled]: (state, action) => {
      state.user = action.payload
      state.loading = false
    },
    [authBoot.pending]: (state) => {
      state.booting = true
    },
    [authBoot.fulfilled]: (state, action) => {
      state.booting = false
      state.user = action.payload
    },
    [authBoot.rejected]: (state) => {
      state.booting = false
      state.user = null
    },
    [logout.fulfilled]: (state) => {
      state.user = null
    },
    [getUser.fulfilled]: (state, action) => {
      state.user = action.payload
    },
    [resendVerifyCode.fulfilled]: (state, action) => {
      state.user = action.payload
    },
    [createAccount.fulfilled]: (state, action) => {
      state.user = action.payload
    },
    [submitSurvey.fulfilled]: (state, action) => {
      state.user = {
        ...state.user,
        survey: action.payload,
      }
    },
  },
})

export const {
  reducer: authReducer,
  actions: { updatePoints, setUserIsNew },
} = authSlice
