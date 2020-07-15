import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import request from 'services/api'

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
  },
  extraReducers: {},
})

export const {
  reducer: questionReducer,
  actions: { setAskQuestion },
} = questionSlice
