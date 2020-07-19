import { Alert } from 'react-native'
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import Constants from 'constants'
import request from 'services/api'
import * as NavigationService from 'services/navigation'
import { getQuestions } from 'features/questions/questionsSlice'
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

export const blacklistContacts = createAsyncThunk(
  'contacts/blacklist',
  async (blacklistedContacts, { getState, dispatch }) => {
    const state = getState()
    const user = state.auth.user
    const contacts = state.contacts.data
    const filtered = blacklistedContacts.filter((contact) => {
      // if an item in blacklisted contacts is not changed
      // remove it from the request data
      const existed = contacts.find(
        (c) =>
          c.phoneNumber === contact.phoneNumber &&
          c.isBlacklisted === contact.isBlacklisted,
      )
      return !existed
    })
    // trip out unnecessary data
    const data = filtered.map((c) => ({
      phoneNumber: c.phoneNumber,
      isBlacklisted: c.isBlacklisted,
    }))
    await request({
      method: 'POST',
      url: 'contacts/blacklist',
      data: {
        userPhoneNumber: user.phoneNumber,
        contacts: data,
      },
    })
    // refresh the Main screen
    dispatch(getQuestions())
    Alert.alert(
      'Success',
      "You won't see questions from the selected contacts anymore",
    )
    NavigationService.navigate(Constants.Screens.Main)
    return data
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
    [saveContacts.fulfilled]: (state, action) => {
      state.loading = false
      state.data = action.payload
    },
    [blacklistContacts.fulfilled]: (state, action) => {
      const updated = action.payload
      const updatedContacts = state.data.map((c) => {
        const updatedContact = updated.find(
          (u) => u.phoneNumber === c.phoneNumber,
        )
        if (updatedContact) {
          return {
            ...c,
            isBlocked: updatedContact.isBlocked,
            isBlacklisted: updatedContact.isBlacklisted,
          }
        }
        return c
      })
      state.data = updatedContacts
    },
  },
})

export const {
  reducer: contactsReducer,
  actions: {},
} = contactsSlice
