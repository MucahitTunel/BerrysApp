import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import request from 'services/api'
import { getQuestions } from './questionsSlice'
import { setRoom } from '../messages/messagesSlice'
import * as NavigationService from 'services/navigation'
import { Screens } from 'constants'
import firebase from '../../services/firebase'

export const askQuestion = createAsyncThunk(
  'ask/submit',
  async (requestToAsk, { getState, dispatch }) => {
    const state = getState()
    const user = state.auth.user
    const {
      question,
      contacts,
      groups,
      facebookGroups,
      isAnonymous,
      questionImage,
      isAskExperts,
      isLikeMinded,
      isFollowedInterests,
      targetedInterests,
      targetedCountries,
    } = state.ask

    if (questionImage) {
      setTimeout(() => {
        NavigationService.navigate(Screens.Main, { showSuccessModal: true })
      }, 1200)
    }

    let image = null
    if (questionImage) {
      image = await firebase.upload.uploadQuestionImage(
        questionImage,
        user.phoneNumber,
      )
    }

    await request({
      method: 'POST',
      url: 'question/add',
      data: {
        content:
          question !== '' && question
            ? question
            : 'What do you think about this?',
        contacts,
        groups: groups.map((g) => g._id),
        facebookGroups: facebookGroups.map((g) => g._id),
        userPhoneNumber: user.phoneNumber,
        isAnonymous,
        requestToAsk,
        image,
        isAskExperts,
        isLikeMinded,
        isFollowedInterests,
        targetedInterests,
        targetedCountries,
      },
    })
    dispatch(setQuestionImage(null))
    dispatch(getQuestions())
    if (!questionImage)
      NavigationService.navigate(Screens.Main, { showSuccessModal: true })
  },
)

export const finishAskingAskRequest = createAsyncThunk(
  'ask/finish',
  async (callback, { getState, dispatch }) => {
    const state = getState()
    const user = state.auth.user
    const room = state.messages.room
    const { data } = await request({
      method: 'POST',
      url: 'question/finish-ask-request',
      data: {
        userPhoneNumber: user.phoneNumber,
        requesterNumber: room.members.filter((m) => m !== user.phoneNumber)[0],
        roomId: room._id,
      },
    })
    dispatch(setRoom(data.room))
    callback()
    return
  },
)

export const renewAskRequest = createAsyncThunk(
  'ask/renew',
  async (_, { getState, dispatch }) => {
    const state = getState()
    const user = state.auth.user
    const room = state.messages.room
    const { data } = await request({
      method: 'POST',
      url: 'question/renew-ask-request',
      data: {
        userPhoneNumber: user.phoneNumber,
        requesterNumber: room.members.filter((m) => m !== user.phoneNumber)[0],
        roomId: room._id,
      },
    })
    dispatch(setRoom(data.room))
    return
  },
)

export const requestAskRequestPoints = createAsyncThunk(
  'ask/request-points',
  async (_, { getState, dispatch }) => {
    const state = getState()
    const user = state.auth.user
    const room = state.messages.room
    const { data } = await request({
      method: 'POST',
      url: 'question/request-ask-request-points',
      data: {
        requesterNumber: room.members.filter((m) => m !== user.phoneNumber)[0],
        roomId: room._id,
      },
    })
    dispatch(setRoom(data.room))
    return
  },
)

export const approveAskRequest = createAsyncThunk(
  'ask/approve-new',
  async (_, { getState, dispatch }) => {
    const state = getState()
    const user = state.auth.user
    const room = state.messages.room
    const { data } = await request({
      method: 'POST',
      url: 'question/approve-ask-request',
      data: {
        askingUserPhoneNumber: room.members.filter(
          (m) => m !== user.phoneNumber,
        )[0],
        roomId: room._id,
      },
    })
    dispatch(setRoom(data.room))
    return
  },
)

const askSlice = createSlice({
  name: 'ask',
  initialState: {
    question: null,
    questionImage: null,
    contacts: [],
    groups: [],
    facebookGroups: [],
    loading: false,
    isAnonymous: true,
    isAskExperts: false,
    isLikeMinded: false,
    isFollowedInterests: false,
    targetedInterests: [],
    targetedCountries: [],
  },
  reducers: {
    setAskQuestion: (state, action) => {
      state.question = action.payload
    },
    setAskContacts: (state, action) => {
      state.contacts = action.payload
    },
    setAskGroups: (state, action) => {
      state.groups = action.payload
    },
    setAskFacebookGroups: (state, action) => {
      state.facebookGroups = action.payload
    },
    setAskAnonymously: (state, action) => {
      state.isAnonymous = action.payload
    },
    setQuestionImage: (state, action) => {
      state.questionImage = action.payload
    },
    setIsAskExperts: (state, action) => {
      state.isAskExperts = action.payload
    },
    setLikeMinded: (state, action) => {
      state.isLikeMinded = action.payload
    },
    setIsFollowedInterests: (state, action) => {
      state.isFollowedInterests = action.payload
    },
    setTargetedInterests: (state, action) => {
      state.targetedInterests = action.payload
    },
    setTargetedCountries: (state, action) => {
      state.targetedCountries = action.payload
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
  actions: {
    setAskQuestion,
    setAskContacts,
    setAskGroups,
    setAskFacebookGroups,
    setAskAnonymously,
    setQuestionImage,
    setIsAskExperts,
    setLikeMinded,
    setIsFollowedInterests,
    setTargetedCountries,
    setTargetedInterests,
  },
} = askSlice
