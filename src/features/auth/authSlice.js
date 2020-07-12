import { Alert } from 'react-native'
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import AsyncStorage from '@react-native-community/async-storage'
import request from 'services/api'
import NavigationService from 'services/navigation'
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

export const signIn = createAsyncThunk(
  'users/signIn',
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
  },
  reducers: {
    setUser: (state, action) => (state.user = action.payload),
  },
  extraReducers: {
    [signIn.pending]: (state) => {
      state.loading = true
    },
    [signIn.fulfilled]: (state, action) => {
      state.user = action.payload
      state.loading = false
    },
  },
})

export const {
  reducer: authReducer,
  actions: {},
} = authSlice
