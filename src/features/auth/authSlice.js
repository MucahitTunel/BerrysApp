import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

const signIn = createAsyncThunk(
  'users/signIn',
  async ({ phoneNumber, password, countryCode }) => {},
)

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    points: 0,
  },
  reducers: {},
  extraReducers: {
    [signIn.fulfilled]: (state, action) => {},
  },
})

export const {
  reducer: authReducer,
  actions: {},
} = authSlice
