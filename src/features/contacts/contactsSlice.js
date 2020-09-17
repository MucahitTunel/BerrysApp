import { Alert } from 'react-native'
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import Constants from 'constants'
import request from 'services/api'
import * as NavigationService from 'services/navigation'
import { getQuestions } from 'features/questions/questionsSlice'
import { getPhoneBookContacts, formatContacts } from './helpers'
import uniqueId from 'lodash/uniqueId'

const getConnections = async (accessToken, pageToken) => {
  const { data } = await request({
    method: 'GET',
    url: 'https://people.googleapis.com/v1/people/me/connections',
    params: {
      personFields: 'names,emailAddresses,phoneNumbers',
      pageSize: 1000,
      pageToken,
    },
    headers: { Authorization: `Bearer ${accessToken}` },
  })
  const { connections, nextPageToken, totalItems } = data
  return { connections, nextPageToken, totalItems }
}

export const fetchContactsFromGoogle = createAsyncThunk(
  'contacts/fetchFromGoogle',
  async (accessToken, { getState, dispatch }) => {
    const state = getState()
    const contacts = state.contacts.data
    const allConnections = []
    let connections = []
    let nextPageToken = null
    let totalItems = 0
    do {
      // eslint-disable-next-line no-await-in-loop
      const data = await getConnections(accessToken, nextPageToken)
      connections = data.connections
      nextPageToken = data.nextPageToken
      totalItems = data.totalItems
      allConnections.push(...connections)
    } while (nextPageToken && allConnections.length < totalItems)
    const gmailContacts = allConnections.map((c) => {
      const { names, phoneNumbers, emailAddresses } = c
      const name = names?.[0]?.displayName
      const phoneNumber = phoneNumbers?.[0]?.canonicalForm
      const email = emailAddresses?.[0]?.value
      return {
        name,
        phoneNumber,
        email,
      }
    })
    const newContactsPhoneNumber = gmailContacts.filter((gc) => {
      const found = contacts.find((c) => c.phoneNumber === gc.phoneNumber)
      return !found
    })
    const newContactsEmail = gmailContacts.filter((gc) => {
      if (gc.email) {
        const found = contacts.find((c) => c.email === gc.email)
        return !found
      }
      return false
    })
    const newContacts = [...newContactsPhoneNumber, ...newContactsEmail].map(
      (c) => ({
        _id: uniqueId('temp_'),
        ...c,
      }),
    )
    if (newContacts.length === 0) {
      Alert.alert('Warning', 'No new contacts found from Google')
    } else {
      Alert.alert(
        'Success',
        `Successfully updated ${newContacts.length} new contacts from Google`,
      )
    }
    dispatch(saveContacts(newContacts))
    return newContacts
  },
)

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
    [fetchContactsFromGoogle.pending]: (state) => {
      state.loading = true
    },
    [fetchContactsFromGoogle.fulfilled]: (state, action) => {
      state.loading = false
    },
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
