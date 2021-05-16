import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import request from 'services/api'
import { setAskQuestion } from './askSlice'
import { loadContacts } from '../contacts/contactsSlice'

export const getQuestions = createAsyncThunk(
  'questions/get',
  async (phoneNumber, { getState, dispatch }) => {
    return new Promise(async (resolve) => {
      dispatch(loadContacts())
      const state = getState()
      const { user } = state.auth
      const contacts = state.contacts.data
      const { data } = await request({
        method: 'GET',
        url: 'questions',
        params: {
          userPhoneNumber: phoneNumber ? phoneNumber : user.phoneNumber,
        },
      })
      dispatch(setAskQuestion(null))
      let { questions, requestsToAsk, polls, compares } = data
      ;(questions = questions.map((q) => {
        const anonName = `Anonymous ${Math.floor(Math.random() * 900) + 100}`
        const contact = contacts.find(
          (c) => c.phoneNumber === q.userPhoneNumber,
        )
        const contactName = q.isAnonymous
          ? anonName
          : contact
          ? contact.name
          : anonName
        return { ...q, contactName, myContact: !!contact }
      })),
        (polls = polls.map((p) => {
          const anonName = `Anonymous ${Math.floor(Math.random() * 900) + 100}`
          const contact = contacts.find(
            (c) => c.phoneNumber === p.userPhoneNumber,
          )
          const contactName = p.isAnonymous
            ? anonName
            : contact
            ? contact.name
            : anonName
          return { ...p, contactName, myContact: !!contact }
        })),
        (compares = compares.map((c) => {
          const anonName = `Anonymous ${Math.floor(Math.random() * 900) + 100}`
          const contact = contacts.find(
            (c) => c.phoneNumber === c.userPhoneNumber,
          )
          const contactName = c.isAnonymous
            ? anonName
            : contact
            ? contact.name
            : anonName
          return { ...c, contactName, myContact: !!contact }
        })),
        resolve({ questions, requestsToAsk, polls, compares })
    })
  },
)

export const getMyPosts = createAsyncThunk(
  'my-posts',
  async (_, { dispatch }) => {
    dispatch(getMyQuestions())
    dispatch(getMyPolls())
    dispatch(getMyCompares())
    return
  },
)

export const getMyQuestions = createAsyncThunk(
  'questions/my-posts',
  async (_, { getState }) => {
    const state = getState()
    const { user } = state.auth
    const { data } = await request({
      method: 'GET',
      url: 'questions/my-posts',
      params: {
        userPhoneNumber: user.phoneNumber,
      },
    })
    return data.questions.map((q) => {
      return { ...q, type: 'question' }
    })
  },
)

export const getMyPolls = createAsyncThunk(
  'polls/my-posts',
  async (_, { getState }) => {
    const state = getState()
    const { user } = state.auth
    const { data } = await request({
      method: 'GET',
      url: 'polls/my-posts',
      params: {
        userPhoneNumber: user.phoneNumber,
      },
    })
    return data.polls.map((p) => {
      return { ...p, type: 'poll' }
    })
  },
)

export const getMyCompares = createAsyncThunk(
  'compares/my-posts',
  async (_, { getState }) => {
    const state = getState()
    const { user } = state.auth
    const { data } = await request({
      method: 'GET',
      url: 'compares/my-posts',
      params: {
        userPhoneNumber: user.phoneNumber,
      },
    })
    return data.compares.map((c) => {
      return { ...c, type: 'compare' }
    })
  },
)

export const getPopularQuestions = createAsyncThunk(
  'popular-questions/get',
  async (_, { getState }) => {
    const state = getState()
    const { user } = state.auth
    const { data } = await request({
      method: 'GET',
      url: 'popular-questions/v2',
      params: {
        userPhoneNumber: user.phoneNumber,
      },
    })
    return data
  },
)

export const skipPopularQuestions = createAsyncThunk(
  'popular-questions/skip',
  async (popularId, { getState }) => {
    const state = getState()
    const { user } = state.auth
    await request({
      method: 'POST',
      url: 'popular-questions/skip',
      data: {
        userPhoneNumber: user.phoneNumber,
        popularId,
      },
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
    popularPolls: [],
    popularCompares: [],
    popularQuestions: [],
    myQuestions: [],
    myPolls: [],
    myCompares: [],
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
    setPolls: (state, action) => {
      state.polls = action.payload
    },
    setCompares: (state, action) => {
      state.compares = action.payload
    },
    setPopularPolls: (state, action) => {
      state.popularPolls = action.payload
    },
    setPopularCompares: (state, action) => {
      state.popularCompares = action.payload
    },
    setPopularQuestions: (state, action) => {
      state.popularQuestions = action.payload
    },
    setQuestions: (state, action) => {
      state.data = action.payload
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
    [getPopularQuestions.fulfilled]: (state, action) => {
      state.popularCompares = action.payload.compares
      state.popularPolls = action.payload.polls
      state.popularQuestions = action.payload.questions
    },
    [getMyQuestions.fulfilled]: (state, action) => {
      state.myQuestions = action.payload
    },
    [getMyPolls.fulfilled]: (state, action) => {
      state.myPolls = action.payload
    },
    [getMyCompares.fulfilled]: (state, action) => {
      state.myCompares = action.payload
    },
  },
})

export const {
  reducer: questionsReducer,
  actions: {
    readQuestion,
    readCompare,
    readPoll,
    setCompares,
    setPopularPolls,
    setPopularCompares,
    setPopularQuestions,
    setPolls,
    setQuestions,
  },
} = questionsSlice
