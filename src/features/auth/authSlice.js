import { Alert } from 'react-native'
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import AsyncStorage from '@react-native-community/async-storage'
import request from 'services/api'
import { formatPhoneNumber } from 'services/contacts/helpers'

export const postSignIn = async (userData, isFromBoot = false) => {
  try {
    if (!isFromBoot) {
      AsyncStorage.setItem('userData', JSON.stringify(userData))
    }
    // if (userData && userData.isNew) {
    //   NavigationService.navigate(Constants.Screens.Survey)
    // } else {
    //   NavigationService.navigate(Constants.Screens.Main)
    // }
  } catch (e) {
    console.log('ERROR - postSignIn')
    console.log(e)
  }
}

export const authBoot = createAsyncThunk('auth/boot', async () => {
  const userDataString = await AsyncStorage.getItem('userData')
  const userData = JSON.parse(userDataString)
  if (userData) {
    // const channel = pusher.subscribe(userData._id)
    // channel.bind('POINTS_UPDATED', data => {
    //   store.dispatch({ type: UPDATE_POINTS, payload: data.points })
    // })
    await postSignIn(userData)
  }
  return userData
})

export const logout = createAsyncThunk('auth/logout', async () => {
  await AsyncStorage.removeItem('userData')
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
    points: 0,
    loading: false,
    booting: true,
  },
  reducers: {},
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
  },
})

export const {
  reducer: authReducer,
  actions: {},
} = authSlice
