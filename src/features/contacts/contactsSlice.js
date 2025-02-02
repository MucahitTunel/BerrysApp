import { Alert } from 'react-native'
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { Screens } from 'constants'
import request from 'services/api'
import * as NavigationService from 'services/navigation'
import { getQuestions } from 'features/questions/questionsSlice'
import { getPhoneBookContacts, formatContacts } from './helpers'
import uniqueId from 'lodash/uniqueId'

const getOtherContacts = async (accessToken, pageToken) => {
  const { data } = await request({
    method: 'GET',
    url: 'https://people.googleapis.com/v1/otherContacts',
    params: {
      readMask: 'names,emailAddresses,phoneNumbers',
      pageSize: 1000,
      pageToken,
    },
    headers: { Authorization: `Bearer ${accessToken}` },
  })
  const { otherContacts, nextPageToken } = data
  return { otherContacts, nextPageToken }
}

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
  async ({ accessToken, email: userEmail }, { getState, dispatch }) => {
    const state = getState()
    const contacts = state.contacts.data
    // fetch connections
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
    // fetch other contacts
    const allOtherContacts = []
    nextPageToken = null
    let otherContacts = []
    do {
      // eslint-disable-next-line no-await-in-loop
      const data = await getOtherContacts(accessToken, nextPageToken)
      otherContacts = data.otherContacts
      nextPageToken = data.nextPageToken
      allOtherContacts.push(...otherContacts)
    } while (nextPageToken)
    const allContacts = [...allConnections, ...allOtherContacts]
    const gmailContacts = allContacts.map((c) => {
      const { names, phoneNumbers, emailAddresses } = c
      const phoneNumber = phoneNumbers?.[0]?.canonicalForm
      const email = emailAddresses?.[0]?.value
      const name = names?.[0]?.displayName || email
      return {
        name,
        phoneNumber,
        email,
        data: {
          userEmail,
          isGmailContact: true,
        },
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
      Alert.alert('Warning', 'No contacts found from Google')
    } else {
      Alert.alert(
        'Success',
        `Successfully updated ${newContacts.length} contacts from Google`,
      )
    }
    dispatch(saveContacts(newContacts))
    return newContacts
  },
)

export const loadContacts = createAsyncThunk(
  'contacts/load',
  async (_, { dispatch, getState }) => {
    const state = getState()
    const user = state.auth.user
    const phoneBookContacts = await getPhoneBookContacts()
    const contactsFormatted = formatContacts({ phoneBookContacts, user })
    dispatch(saveContacts(contactsFormatted))
    return contactsFormatted
  },
)

export const reportUser = createAsyncThunk(
  'user/report',
  async ({ message, reportedUserPhoneNumber }, { getState }) => {
    const state = getState()
    const user = state.auth.user
    await request({
      method: 'POST',
      url: 'user/report',
      data: {
        reportingUserPhoneNumber: user.phoneNumber,
        reportedUserPhoneNumber,
        message,
      },
    })
  },
)

export const saveContacts = createAsyncThunk(
  'contacts/save',
  async (contacts, { getState, dispatch }) => {
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
    dispatch(setAppUserCount(updatedContacts.filter((c) => c.isAppUser).length))
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
    setTimeout(
      () =>
        Alert.alert(
          'Success',
          "You won't see questions from these contacts anymore",
        ),
      500,
    )
    return data
  },
)

export const createVoiceCall = createAsyncThunk(
  'call/voice/create',
  async ({ roomId, invitedUser }, {}) => {
    return new Promise(async (resolve) => {
      const { data } = await request({
        method: 'POST',
        url: 'call/voice/create',
        data: {
          channelName: roomId,
          invitedUser,
        },
      })
      const { token } = data
      resolve(token)
    })
  },
)

export const getLeaderboard = createAsyncThunk(
  'contacts/leaderboard',
  async (_, { getState }) => {
    const state = getState()
    const user = state.auth.user
    const { data } = await request({
      method: 'GET',
      url: 'leaderboard/points',
      params: {
        userPhoneNumber: user.phoneNumber,
      },
    })
    const { users } = data
    return users
      .map((u) => {
        if (!u.name)
          return {
            ...u,
            name: `Anonymous ${Math.floor(Math.random() * 900) + 100}`,
          }
        return u
      })
      .sort((a, b) => a.position - b.position)
  },
)

export const getCommonAccountCounts = createAsyncThunk(
  'account/ask-common',
  async (_, { getState }) => {
    const state = getState()
    const user = state.auth.user
    const { data } = await request({
      method: 'GET',
      url: 'account/ask-common',
      params: {
        userPhoneNumber: user.phoneNumber,
      },
    })
    return data
  },
)

const contactsSlice = createSlice({
  name: 'contacts',
  initialState: {
    data: [],
    loading: false,
    contactPermission: false,
    leaderboard: [],
    appUserCount: 0,
    commonAccountCounts: {},
  },
  reducers: {
    setAppUserCount: (state, action) => {
      state.appUserCount = action.payload
    },
  },
  extraReducers: {
    [fetchContactsFromGoogle.pending]: (state) => {
      state.loading = true
    },
    [fetchContactsFromGoogle.fulfilled]: (state, action) => {
      state.loading = false
    },
    [getLeaderboard.fulfilled]: (state, action) => {
      state.leaderboard = action.payload
    },
    [loadContacts.pending]: (state) => {
      state.loading = true
    },
    [loadContacts.fulfilled]: (state, action) => {
      state.loading = false
      state.data = action.payload
      state.contactPermission = true
    },
    [saveContacts.fulfilled]: (state, action) => {
      state.loading = false
      state.data = action.payload
    },
    [blacklistContacts.pending]: (state) => {
      state.loading = true
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
      state.loading = false
    },
    [getCommonAccountCounts.fulfilled]: (state, action) => {
      state.commonAccountCounts = action.payload
    },
  },
})

export const {
  reducer: contactsReducer,
  actions: { setAppUserCount },
} = contactsSlice
