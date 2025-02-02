import { Alert } from 'react-native'
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import request from 'services/api'
import {
  getQuestions,
  setQuestions,
  setPopularQuestions,
} from './questionsSlice'
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
  async (
    { value, commentId, questionId, isPopular = false },
    { getState, dispatch },
  ) => {
    const state = getState()
    const user = state.auth.user
    const question = state.question.data
    await request({
      method: 'POST',
      url: 'comment/vote',
      data: {
        userPhoneNumber: user.phoneNumber,
        value,
        commentId,
      },
    })
    if (!isPopular) dispatch(getQuestion(questionId))
    else
      dispatch(
        setQuestion({
          ...question,
          comments: question.comments.map((c) => {
            return c._id === commentId
              ? { ...c, totalVotes: c.totalVotes + 1 }
              : c
          }),
        }),
      )
  },
)

export const voteQuestion = createAsyncThunk(
  'question/vote',
  async ({ value, questionId, isPopular = false }, { getState, dispatch }) => {
    const state = getState()
    const user = state.auth.user
    const questions = state.questions.data
    await request({
      method: 'POST',
      url: 'question/vote',
      data: {
        userPhoneNumber: user.phoneNumber,
        value,
        questionId,
      },
    })
    dispatch(
      setQuestions(
        questions.map((q) => {
          if (q._id === questionId)
            return {
              ...q,
              votes: [...q.votes, { userPhoneNumber: user.phoneNumber, value }],
            }
          else return q
        }),
      ),
    )
    // dispatch(getQuestion(questionId))
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
    {
      comment,
      questionId,
      isAnonymous,
      image = null,
      isPopular = false,
      showInPopular = false,
    },
    { getState, dispatch },
  ) => {
    const state = getState()
    const user = state.auth.user
    const question = state.question.data
    const questions = state.questions.data
    const { popularQuestions } = state.questions
    const { data } = await request({
      method: 'POST',
      url:
        isPopular && !showInPopular ? 'popular-questions/comment' : 'comment',
      data: {
        userPhoneNumber: user.phoneNumber,
        comment,
        questionId,
        isAnonymous,
        image,
        showInPopular,
      },
    })
    if (!isPopular) {
      dispatch(getQuestion(questionId))
      dispatch(
        setQuestions(
          questions.map((q) => {
            if (q._id === questionId)
              return {
                ...q,
                comments: q.comments + 1,
              }
            else return q
          }),
        ),
      )
    } else {
      dispatch(
        setQuestion({
          ...question,
          comments: [...question.comments, data.cmt],
        }),
      )
      dispatch(
        setPopularQuestions(
          popularQuestions.map((q) => {
            if (q._id === questionId)
              return {
                ...q,
                comments: q.comments + 1,
                commentData: [...q.commentData, data.cmt],
              }
            else return q
          }),
        ),
      )
    }
  },
)

export const createPoll = createAsyncThunk(
  'poll/create',
  async ({ showOnboarding }, { getState, dispatch }) => {
    const state = getState()
    const user = state.auth.user
    const {
      contacts,
      groups,
      facebookGroups,
      question,
      isLikeMinded,
      isFollowedInterests,
      targetedInterests,
      targetedCountries,
    } = state.ask

    const { pollOptions } = state.question
    await request({
      method: 'POST',
      url: 'poll',
      data: {
        question,
        options: pollOptions,
        userPhoneNumber: user.phoneNumber,
        contacts,
        groups: groups.map((g) => g._id),
        facebookGroups: facebookGroups.map((g) => g._id),
        isLikeMinded,
        isFollowedInterests,
        targetedInterests: targetedInterests.map((i) => i.name),
        targetedCountries: targetedCountries.map((c) => c.name.toLowerCase()),
      },
    })
    dispatch(getQuestions())
    NavigationService.navigate(Screens.Main, {
      showSuccessModal: true,
      showOnboarding,
    })
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
  async ({ option, pollId, showInPopular }, { getState }) => {
    const state = getState()
    const user = state.auth.user
    await request({
      method: 'POST',
      url: 'poll/vote',
      data: {
        pollId,
        userPhoneNumber: user.phoneNumber,
        option,
        showInPopular,
      },
    })
    return
  },
)

export const createCompare = createAsyncThunk(
  'compare/create',
  async ({ disableUpload = false, showOnboarding }, { getState, dispatch }) => {
    const state = getState()
    const user = state.auth.user
    const {
      contacts,
      groups,
      facebookGroups,
      question,
      isLikeMinded,
      isFollowedInterests,
      targetedInterests,
      targetedCountries,
    } = state.ask
    const { compareImages } = state.question

    setTimeout(() => {
      NavigationService.navigate(Screens.Main, {
        showSuccessModal: true,
        showOnboarding,
      })
    }, 2000)

    let uploadedImages = []

    if (!disableUpload) {
      await Promise.all(
        compareImages.map(async (image) => {
          const url = await firebase.upload.uploadCompareImage(
            image,
            user.phoneNumber,
          )
          uploadedImages.push(url)
        }),
      )
    } else uploadedImages = compareImages

    await request({
      method: 'POST',
      url: 'compare',
      data: {
        question,
        images: uploadedImages,
        userPhoneNumber: user.phoneNumber,
        contacts,
        groups: groups.map((g) => g._id),
        facebookGroups: facebookGroups.map((g) => g._id),
        isLikeMinded,
        isFollowedInterests,
        targetedInterests: targetedInterests.map((i) => i.name),
        targetedCountries: targetedCountries.map((c) => c.name.toLowerCase()),
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
  async ({ image, compareId, showInPopular }, { getState }) => {
    const state = getState()
    const user = state.auth.user
    const { data } = await request({
      method: 'POST',
      url: 'compare/vote',
      data: {
        compareId,
        userPhoneNumber: user.phoneNumber,
        image,
        showInPopular,
      },
    })
    return data.compare
  },
)

export const votePopularQuestion = createAsyncThunk(
  'popular-questions/vote',
  async ({ vote, popularId, isQuestion }, { getState, dispatch }) => {
    const state = getState()
    const user = state.auth.user
    const question = state.question.data
    await request({
      method: 'POST',
      url: 'popular-questions/vote',
      data: {
        popularId,
        userPhoneNumber: user.phoneNumber,
        vote,
      },
    })
    if (isQuestion)
      dispatch(
        setQuestion({ ...question, totalVotes: question.totalVotes + 1 }),
      )
  },
)

export const shareQuestion = createAsyncThunk(
  'questions/share',
  async ({ id }, { getState }) => {
    const state = getState()
    const user = state.auth.user
    const { contacts, groups, facebookGroups } = state.ask
    await request({
      method: 'POST',
      url: 'question/share',
      data: {
        questionId: id,
        contacts,
        groups: groups.map((g) => g._id),
        facebookGroups: facebookGroups.map((g) => g._id),
        userPhoneNumber: user.phoneNumber,
      },
    })
  },
)

export const shareCompare = createAsyncThunk(
  'compares/share',
  async ({ id }, { getState }) => {
    const state = getState()
    const user = state.auth.user
    const { contacts, groups, facebookGroups } = state.ask
    await request({
      method: 'POST',
      url: 'compares/share',
      data: {
        compareId: id,
        contacts,
        groups: groups.map((g) => g._id),
        facebookGroups: facebookGroups.map((g) => g._id),
        userPhoneNumber: user.phoneNumber,
      },
    })
  },
)

export const sharePoll = createAsyncThunk(
  'polls/share',
  async ({ id }, { getState }) => {
    const state = getState()
    const user = state.auth.user
    const { contacts, groups, facebookGroups } = state.ask
    await request({
      method: 'POST',
      url: 'polls/share',
      data: {
        pollId: id,
        contacts,
        groups: groups.map((g) => g._id),
        facebookGroups: facebookGroups.map((g) => g._id),
        userPhoneNumber: user.phoneNumber,
      },
    })
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
    questionCommented: false,
  },
  reducers: {
    setPollOptions: (state, action) => {
      state.pollOptions = action.payload
    },
    setCompareImages: (state, action) => {
      state.compareImages = action.payload
    },
    setPoll: (state, action) => {
      state.poll = action.payload
    },
    setQuestion: (state, action) => {
      state.data = action.payload
    },
    setQuestionCommented: (state, action) => {
      state.questionCommented = action.payload
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
    [submitComment.fulfilled]: (state) => {
      state.questionCommented = true
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
  actions: {
    setPollOptions,
    setCompareImages,
    setPoll,
    setQuestion,
    setQuestionCommented,
  },
} = questionSlice
