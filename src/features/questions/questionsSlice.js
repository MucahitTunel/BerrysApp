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
    const { questions, requestsToAsk } = data
    return { questions, requestsToAsk }
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
    requestsToAsk: [],
    loading: false,
  },
  reducers: {
    readQuestion: (state, action) => {
      const questionId = action.payload
      const newQuestions = state.data.map((q) => {
        if (q._id !== questionId) {
          return q
        } else {
          return {
            ...q,
            isNew: false,
          }
        }
      })
      state.data = newQuestions
    },
  },
  extraReducers: {
    [getQuestions.pending]: (state) => {
      state.loading = true
    },
    [getQuestions.fulfilled]: (state, action) => {
      state.data = action.payload.questions
      state.requestsToAsk = action.payload.requestsToAsk
      state.loading = false
    },
    [hideQuestion.fulfilled]: (state, action) => {
      state.data = state.data.filter((q) => q._id !== action.payload)
    },
  },
})

export const {
  reducer: questionsReducer,
  actions: { readQuestion },
} = questionsSlice
