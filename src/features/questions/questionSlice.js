import { Alert } from 'react-native'
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import request from 'services/api'
import Constants from 'constants'
import * as NavigationService from 'services/navigation'
import { getQuestions } from './questionsSlice'

export const askQuestion = createAsyncThunk(
  'question/ask',
  async (_, { getState, dispatch }) => {
    const state = getState()
    const user = state.auth.user
    const ask = state.question
    const { question, contacts } = ask
    await request({
      method: 'POST',
      url: 'question/add',
      data: {
        content: question,
        contacts,
        userPhoneNumber: user.phoneNumber,
      },
    })
    dispatch(getQuestions())
    Alert.alert('Success', 'Your question has been submitted!')
    NavigationService.navigate(Constants.Screens.Main)
  },
)

const questionSlice = createSlice({
  name: 'question',
  initialState: {
    question: null,
    contacts: [],
    loading: false,
  },
  reducers: {
    setAskQuestion: (state, action) => {
      state.question = action.payload
    },
    setAskContacts: (state, action) => {
      state.contacts = action.payload
    },
  },
  extraReducers: {
    [askQuestion.pending]: (state) => {
      state.loading = true
    },
    [askQuestion.fulfilled]: (state) => {
      state.question = null
      state.contacts = []
      state.loading = false
    },
  },
})

export const {
  reducer: questionReducer,
  actions: { setAskQuestion, setAskContacts },
} = questionSlice
