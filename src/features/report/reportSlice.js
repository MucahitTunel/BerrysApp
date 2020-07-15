import { Alert } from 'react-native'
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import request from 'services/api'

export const submitReport = createAsyncThunk(
  'report/submit',
  async ({ email, message }, { getState }) => {
    const state = getState()
    const user = state.auth.user
    await request({
      method: 'POST',
      url: 'account/report',
      data: {
        userPhoneNumber: user.phoneNumber,
        email,
        message,
      },
    })
    return Alert.alert('Success', 'Your report has been successfully sent')
  },
)

const reportSlice = createSlice({
  name: 'report',
  initialState: {
    loading: false,
  },
  reducers: {},
  extraReducers: {
    [submitReport.pending]: (state) => {
      state.loading = true
    },
    [submitReport.fulfilled]: (state) => {
      state.loading = false
    },
  },
})

export const {
  reducer: reportReducer,
  actions: {},
} = reportSlice
