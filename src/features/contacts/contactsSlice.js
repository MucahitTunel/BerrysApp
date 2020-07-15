import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import request from 'services/api'
import { getPhoneBookContacts, formatContacts } from './helpers'

export const loadContacts = createAsyncThunk(
  'contacts/load',
  async (_, { dispatch }) => {
    const phoneBookContacts = await getPhoneBookContacts()
    const contactsFormatted = formatContacts(phoneBookContacts)
    dispatch(saveContacts(contactsFormatted))
    return contactsFormatted
  },
)

export const saveContacts = createAsyncThunk(
  'contacts/save',
  async (contacts, { getState }) => {
    const state = getState()
    const user = state.auth.user
    const { data } = await request({
      method: 'POST',
      url: 'contacts',
      data: {
        userPhoneNumber: user.phoneNumber,
        contacts,
      },
    })
    const { updatedContacts } = data
    return updatedContacts
  },
)

const contactsSlice = createSlice({
  name: 'contacts',
  initialState: {
    data: [],
    loading: false,
  },
  reducers: {},
  extraReducers: {
    [loadContacts.pending]: (state) => {
      state.loading = true
    },
    [loadContacts.fulfilled]: (state, action) => {
      state.loading = false
      state.data = action.payload
    },
  },
})

export const {
  reducer: contactsReducer,
  actions: {},
} = contactsSlice
