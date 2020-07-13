import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import request from 'services/api'

export const getQuestions = createAsyncThunk(
  'questions/get',
  async (_, { getState }) => {
    const state = getState()
    const { user } = state.auth
    const { data } = await request({
      method: 'GET',
      url: 'questions',
      params: {
        userPhoneNumber: user.phoneNumber,
      },
    })
    const { questions } = data
    return questions
  },
)

const questionsSlice = createSlice({
  name: 'questions',
  initialState: {
    data: [],
    loading: false,
  },
  reducers: {
    setUser: (state, action) => (state.user = action.payload),
  },
  extraReducers: {
    [getQuestions.pending]: (state) => {
      state.loading = true
    },
    [getQuestions.fulfilled]: (state, action) => {
      state.data = action.payload
      state.loading = false
    },
  },
})

export const {
  reducer: questionsReducer,
  actions: {},
} = questionsSlice
