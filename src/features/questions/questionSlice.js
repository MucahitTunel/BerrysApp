import { Alert } from 'react-native'
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import request from 'services/api'

export const getQuestion = createAsyncThunk(
  'question/get',
  async (questionId, { getState }) => {
    const state = getState()
    const user = state.auth.user
    const { data } = await request({
      method: 'GET',
      url: 'question',
      params: { questionId, userPhoneNumber: user.phoneNumber },
    })
    const { question } = data
    return question
  },
)

export const voteComment = createAsyncThunk(
  'comment/vote',
  async ({ value, commentId, questionId }, { getState, dispatch }) => {
    const state = getState()
    const user = state.auth.user
    await request({
      method: 'POST',
      url: 'comment/vote',
      data: {
        userPhoneNumber: user.phoneNumber,
        value,
        commentId,
      },
    })
    dispatch(getQuestion(questionId))
  },
)

export const voteQuestion = createAsyncThunk(
  'question/vote',
  async ({ value, questionId }, { getState, dispatch }) => {
    const state = getState()
    const user = state.auth.user
    await request({
      method: 'POST',
      url: 'question/vote',
      data: {
        userPhoneNumber: user.phoneNumber,
        value,
        questionId,
      },
    })
    dispatch(getQuestion(questionId))
  },
)

export const flagQuestion = createAsyncThunk(
  'question/vote',
  async ({ value, question }, { getState, dispatch }) => {
    const state = getState()
    const user = state.auth.user
    const { _id: questionId, phoneNumber } = question
    if (phoneNumber === user.phoneNumber) {
      return Alert.alert('Warning', "You can't flag your own questions")
    }
    await request({
      method: 'POST',
      url: 'question/flag',
      data: {
        userPhoneNumber: user.phoneNumber,
        questionId,
        value,
      },
    })
    dispatch(getQuestion(questionId))
  },
)

export const submitComment = createAsyncThunk(
  'comment/submit',
  async ({ comment, questionId, isAnonymously }, { getState, dispatch }) => {
    const state = getState()
    const user = state.auth.user
    await request({
      method: 'POST',
      url: 'comment',
      data: {
        userPhoneNumber: user.phoneNumber,
        comment,
        questionId,
      },
    })
    dispatch(getQuestion(questionId))
  },
)

const questionSlice = createSlice({
  name: 'question',
  initialState: {
    data: null,
    loading: false,
  },
  reducers: {},
  extraReducers: {
    [getQuestion.pending]: (state) => {
      state.loading = true
    },
    [getQuestion.fulfilled]: (state, action) => {
      state.data = action.payload
      state.loading = false
    },
  },
})

export const {
  reducer: questionReducer,
  actions: {},
} = questionSlice
