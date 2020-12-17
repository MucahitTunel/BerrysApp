import { createSlice } from '@reduxjs/toolkit'

const groupSlice = createSlice({
  name: 'group',
  initialState: {
    new: {
      name: null,
      template: null,
      members: [],
    },
    current: {},
    loading: false,
  },
  reducers: {
    setNewGroupName: (state, action) => {
      state.new.name = action.payload
    },
    setNewGroupTemplate: (state, action) => {
      state.new.template = action.payload
    },
    setNewGroupMembers: (state, action) => {
      const newMembers = action.payload.map((m) => ({ ...m, role: 'member' }))
      state.new.members = state.new.members
        .filter((m) => m.role !== 'member')
        .concat(newMembers)
    },
    setNewGroupAdmins: (state, action) => {
      const newAdmins = action.payload.map((m) => ({ ...m, role: 'admin' }))
      state.new.members = state.new.members
        .filter((m) => m.role !== 'admin')
        .concat(newAdmins)
    },
    removeNewGroupMembers: (state, action) => {
      const member = action.payload
      state.new.members = state.new.members.filter((m) => m._id !== member._id)
    },
  },
})

export const {
  reducer: groupReducer,
  actions: {
    setNewGroupName,
    setNewGroupTemplate,
    setNewGroupMembers,
    setNewGroupAdmins,
    removeNewGroupMembers,
  },
} = groupSlice
