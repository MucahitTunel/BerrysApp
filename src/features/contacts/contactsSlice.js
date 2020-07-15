import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { getPhoneBookContacts, formatContacts } from './helpers'

export const loadContacts = createAsyncThunk('contacts/load', async () => {
  const phoneBookContacts = await getPhoneBookContacts()
  const contactsFormatted = formatContacts(phoneBookContacts)
  return contactsFormatted
  // yield put({ type: LOAD_CONTACTS_SUCCESS, payload: contactsFormatted })
  // yield put({
  //   type: SAVE_CONTACTS_REQUEST,
  //   payload: { contacts: contactsFormatted },
  // })
})

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
