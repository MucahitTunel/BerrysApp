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

export const hideQuestion = createAsyncThunk(
  'questions/hide',
  async (questionId, { getState }) => {
    const state = getState()
    const user = state.auth.user
    await request({
      method: 'POST',
      url: 'question/hide',
      data: {
        userPhoneNumber: user.phoneNumber,
        questionId,
      },
    })
    return questionId
  },
)

const questionsSlice = createSlice({
  name: 'questions',
  initialState: {
    data: [],
    loading: false,
  },
  reducers: {},
  extraReducers: {
    [getQuestions.pending]: (state) => {
      state.loading = true
    },
    [getQuestions.fulfilled]: (state, action) => {
      state.data = action.payload
      state.loading = false
    },
    [hideQuestion.fulfilled]: (state, action) => {
      state.data = state.data.filter((q) => q._id !== action.payload)
    },
  },
})

export const {
  reducer: questionsReducer,
  actions: {},
} = questionsSlice
