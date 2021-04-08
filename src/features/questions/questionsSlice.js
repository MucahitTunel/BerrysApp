import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import request from 'services/api'
import { setAskQuestion } from './askSlice'

export const getQuestions = createAsyncThunk(
  'questions/get',
  async (phoneNumber, { getState, dispatch }) => {
    return new Promise(async (resolve) => {
      const state = getState()
      const { user } = state.auth
      const { data } = await request({
        method: 'GET',
        url: 'questions',
        params: {
          userPhoneNumber: phoneNumber ? phoneNumber : user.phoneNumber,
        },
      })
      dispatch(setAskQuestion(null))
      const { questions, requestsToAsk, polls, compares } = data
      resolve({ questions, requestsToAsk, polls, compares })
    })
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

export const hidePoll = createAsyncThunk(
  'poll/hide',
  async (pollId, { getState }) => {
    const state = getState()
    const user = state.auth.user
    await request({
      method: 'POST',
      url: 'poll/hide',
      data: {
        userPhoneNumber: user.phoneNumber,
        pollId,
      },
    })
    return pollId
  },
)

export const hideCompare = createAsyncThunk(
  'compare/hide',
  async (compareId, { getState }) => {
    const state = getState()
    const user = state.auth.user
    await request({
      method: 'POST',
      url: 'compare/hide',
      data: {
        userPhoneNumber: user.phoneNumber,
        compareId,
      },
    })
    return compareId
  },
)

const questionsSlice = createSlice({
  name: 'questions',
  initialState: {
    data: [],
    requestsToAsk: [],
    polls: [],
    compares: [],
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
    readPoll: (state, action) => {
      const pollId = action.payload
      const newPolls = state.polls.map((p) => {
        if (p._id !== pollId) {
          return p
        } else {
          return {
            ...p,
            isNew: false,
          }
        }
      })
      state.polls = newPolls
    },
    readCompare: (state, action) => {
      const compareId = action.payload
      const newCompares = state.compares.map((c) => {
        if (c._id !== compareId) {
          return c
        } else {
          return {
            ...c,
            isNew: false,
          }
        }
      })
      state.compares = newCompares
    },
    setCompares: (state, action) => {
      state.compares = action.payload
    },
  },
  extraReducers: {
    [getQuestions.pending]: (state) => {
      state.loading = true
    },
    [getQuestions.fulfilled]: (state, action) => {
      state.data = action.payload.questions
      state.requestsToAsk = action.payload.requestsToAsk
      state.polls = action.payload.polls
      state.compares = action.payload.compares
      state.loading = false
    },
    [hideQuestion.fulfilled]: (state, action) => {
      state.data = state.data.filter((q) => q._id !== action.payload)
    },
    [hidePoll.fulfilled]: (state, action) => {
      state.polls = state.polls.filter((p) => p._id !== action.payload)
    },
    [hideCompare.fulfilled]: (state, action) => {
      state.compares = state.compares.filter((p) => p._id !== action.payload)
    },
  },
})

export const {
  reducer: questionsReducer,
  actions: { readQuestion, readCompare, readPoll, setCompares },
} = questionsSlice
