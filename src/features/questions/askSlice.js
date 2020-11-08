import { Alert } from 'react-native'
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import request from 'services/api'
import { Screens } from 'constants'
import * as NavigationService from 'services/navigation'
import { getQuestions } from './questionsSlice'

export const askQuestion = createAsyncThunk(
  'ask/submit',
  async (requestToAsk, { getState, dispatch }) => {
    const state = getState()
    const user = state.auth.user
    const { question, contacts, isAnonymous } = state.ask
    await request({
      method: 'POST',
      url: 'question/add',
      data: {
        content: question,
        contacts,
        userPhoneNumber: user.phoneNumber,
        isAnonymous,
        requestToAsk,
      },
    })
    dispatch(getQuestions())
    Alert.alert('Success', 'Your question has been submitted!')
    NavigationService.navigate(Screens.Main)
  },
)
const askSlice = createSlice({
  name: 'ask',
  initialState: {
    question: null,
    contacts: [],
    loading: false,
    isAnonymous: true,
  },
  reducers: {
    setAskQuestion: (state, action) => {
      state.question = action.payload
    },
    setAskContacts: (state, action) => {
      state.contacts = action.payload
    },
    setAskAnonymously: (state, action) => {
      state.isAnonymous = action.payload
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
  reducer: askReducer,
  actions: { setAskQuestion, setAskContacts, setAskAnonymously },
} = askSlice
