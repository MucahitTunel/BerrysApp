import { createSlice } from '@reduxjs/toolkit'

const groupSlice = createSlice({
  name: 'group',
  initialState: {
    groupName: null,
    admins: [],
    members: [],
    loading: false,
  },
  reducers: {
    setGroupName: (state, action) => {
      state.groupName = action.payload
    },
    setAdminsGroup: (state, action) => {
      state.admins = action.payload
    },
    setMembersGroup: (state, action) => {
      state.members = action.payload
    },
  },
})

export const {
  reducer: groupReducer,
  actions: { setGroupName, setAdminsGroup, setMembersGroup },
} = groupSlice
