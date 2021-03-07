import { Alert } from 'react-native'
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import request from 'services/api'
import { getQuestions } from './questionsSlice'
import * as NavigationService from 'services/navigation'
import { Screens } from 'constants'
import firebase from '../../services/firebase'

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
  async (
    { comment, questionId, isAnonymous, image = null },
    { getState, dispatch },
  ) => {
    const state = getState()
    const user = state.auth.user
    await request({
      method: 'POST',
      url: 'comment',
      data: {
        userPhoneNumber: user.phoneNumber,
        comment,
        questionId,
        isAnonymous,
        image,
      },
    })
    dispatch(getQuestion(questionId))
  },
)

export const createPoll = createAsyncThunk(
  'poll/create',
  async (_, { getState, dispatch }) => {
    const state = getState()
    const user = state.auth.user
    const { contacts, groups, question } = state.ask
    const { pollOptions } = state.question
    await request({
      method: 'POST',
      url: 'poll',
      data: {
        question,
        options: pollOptions,
        userPhoneNumber: user.phoneNumber,
        contacts,
        groups,
      },
    })
    dispatch(getQuestions())
    NavigationService.navigate(Screens.Main, { showSuccessModal: true })
  },
)

export const getPoll = createAsyncThunk(
  'poll/get',
  async (pollId, { getState }) => {
    const state = getState()
    const user = state.auth.user
    const { data } = await request({
      method: 'GET',
      url: 'poll',
      params: { pollId, userPhoneNumber: user.phoneNumber },
    })
    const { poll } = data
    return poll
  },
)

export const votePoll = createAsyncThunk(
  'poll/vote',
  async (option, { getState, dispatch }) => {
    const state = getState()
    const user = state.auth.user
    const { poll } = state.question
    const { data } = await request({
      method: 'POST',
      url: 'poll/vote',
      data: { pollId: poll._id, userPhoneNumber: user.phoneNumber, option },
    })
    return data.poll
  },
)

export const createCompare = createAsyncThunk(
  'compare/create',
  async (_, { getState, dispatch }) => {
    const state = getState()
    const user = state.auth.user
    const { contacts, groups, question } = state.ask
    const { compareImages } = state.question

    setTimeout(() => {
      NavigationService.navigate(Screens.Main, { showSuccessModal: true })
    }, 1200)

    let uploadedImages = []

    await Promise.all(
      compareImages.map(async (image) => {
        const url = await firebase.upload.uploadCompareImage(
          image,
          user.phoneNumber,
        )
        uploadedImages.push(url)
      }),
    )
    await request({
      method: 'POST',
      url: 'compare',
      data: {
        question,
        images: uploadedImages,
        userPhoneNumber: user.phoneNumber,
        contacts,
        groups,
      },
    })
    dispatch(getQuestions())
  },
)

export const getCompare = createAsyncThunk(
  'compare/get',
  async (compareId, { getState }) => {
    const state = getState()
    const user = state.auth.user
    const { data } = await request({
      method: 'GET',
      url: 'compare',
      params: { compareId, userPhoneNumber: user.phoneNumber },
    })
    const { compare } = data
    return compare
  },
)

export const voteCompare = createAsyncThunk(
  'compare/vote',
  async (image, { getState, dispatch }) => {
    const state = getState()
    const user = state.auth.user
    const { compare } = state.question
    const { data } = await request({
      method: 'POST',
      url: 'compare/vote',
      data: {
        compareId: compare._id,
        userPhoneNumber: user.phoneNumber,
        image,
      },
    })
    return data.compare
  },
)

const questionSlice = createSlice({
  name: 'question',
  initialState: {
    data: null,
    loading: false,
    pollOptions: [],
    poll: null,
    compareImages: [],
    compare: null,
  },
  reducers: {
    setPollOptions: (state, action) => {
      state.pollOptions = action.payload
    },
    setCompareImages: (state, action) => {
      state.compareImages = action.payload
    },
  },
  extraReducers: {
    [getQuestion.pending]: (state) => {
      state.loading = true
    },
    [getQuestion.fulfilled]: (state, action) => {
      state.data = action.payload
      state.loading = false
    },
    [createPoll.pending]: (state) => {
      state.loading = true
    },
    [createPoll.fulfilled]: (state) => {
      state.loading = false
    },
    [getPoll.fulfilled]: (state, action) => {
      state.poll = action.payload
    },
    [votePoll.fulfilled]: (state, action) => {
      state.poll = action.payload
    },
    [createCompare.pending]: (state) => {
      state.loading = true
    },
    [createCompare.fulfilled]: (state) => {
      state.loading = false
    },
    [getCompare.fulfilled]: (state, action) => {
      state.compare = action.payload
    },
    [voteCompare.fulfilled]: (state, action) => {
      state.compare = action.payload
    },
  },
})

export const {
  reducer: questionReducer,
  actions: { setPollOptions, setCompareImages },
} = questionSlice
