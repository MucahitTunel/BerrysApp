import { Alert } from 'react-native'
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import AsyncStorage from '@react-native-community/async-storage'
import Pusher from 'pusher-js/react-native'
import Config from 'react-native-config'
import request from 'services/api'
import { formatPhoneNumber } from '../contacts/helpers'

// Enable pusher logging - don't include this in production
Pusher.logToConsole = true

export const pusher = new Pusher(Config.PUSHER_CHANNELS_APP_KEY, {
  cluster: Config.PUSHER_CHANNELS_APP_CLUSTER,
  forceTLS: true,
})

export const postSignIn = async (userData, isFromBoot = false) => {
  if (!isFromBoot) {
    AsyncStorage.setItem('userData', JSON.stringify(userData))
  }
  // TODO XIN Survey Screen
  // if (userData && userData.isNew) {
  //   NavigationService.navigate(Constants.Screens.Survey)
  // } else {
  //   NavigationService.navigate(Constants.Screens.Main)
  // }
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
  async ({ phoneNumber, password, countryCode }) => {
    const { number, isValid } = formatPhoneNumber(phoneNumber, countryCode)
    if (!isValid) {
      return Alert.alert(
        'Error',
        `Cannot parse this phone number: ${phoneNumber}`,
      )
    }
    const { data } = await request({
      method: 'POST',
      url: 'account/login-with-phone-number',
      data: {
        phoneNumber: number,
        password,
      },
    })
    const { user: userData } = data
    await postSignIn(userData)
    return userData
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
  },
})

export const {
  reducer: authReducer,
  actions: { updatePoints },
} = authSlice
