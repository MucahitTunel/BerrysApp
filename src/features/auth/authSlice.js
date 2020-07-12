import { Alert } from 'react-native'
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import request from 'services/api'
import { formatPhoneNumber } from 'services/contacts/helpers'

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
    return userData
    // put({ type: SIGN_IN_SUCCESS, payload: userData })
    // call(postSignIn, userData)
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
