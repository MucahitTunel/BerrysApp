import { Alert } from 'react-native'
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import * as NavigationService from 'services/navigation'
import request from 'services/api'
import { Screens } from 'constants'

export const getGroups = createAsyncThunk(
  'groups/get',
  async (_, { getState }) => {
    const state = getState()
    const { user } = state.auth
    const { data } = await request({
      method: 'GET',
      url: 'groups',
      params: {
        userPhoneNumber: user.phoneNumber,
      },
    })
    const { groups } = data
    return groups
  },
)

export const createGroup = createAsyncThunk(
  'group/create',
  async (_, { getState, dispatch }) => {
    const state = getState()
    const user = state.auth.user
    const { name, template, members } = state.group.new
    const membersData = members.map((m) => ({
      phoneNumber: m.phoneNumber,
      memberId: m.isAppUser ? m._id : null,
      email: m.email,
      role: m.role,
    }))
    await request({
      method: 'POST',
      url: 'group/create',
      data: {
        userPhoneNumber: user.phoneNumber,
        name,
        template,
        members: membersData,
      },
    })
    dispatch(resetNewGroup())
    dispatch(getGroups())
    Alert.alert('Success', 'Your group has been created!')
    NavigationService.navigate(Screens.GroupList)
  },
)

export const getGroup = createAsyncThunk(
  'group/get',
  async (groupId, { getState }) => {
    const state = getState()
    const user = state.auth.user
    const { data } = await request({
      method: 'GET',
      url: 'group',
      params: {
        groupId,
        userPhoneNumber: user.phoneNumber,
      },
    })
    const { group } = data
    return group
  },
)

const groupSlice = createSlice({
  name: 'group',
  initialState: {
    new: {
      name: null,
      template: null,
      members: [],
    },
    current: {},
    groups: [],
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
    resetNewGroup: (state) => {
      state.new = {
        name: null,
        template: null,
        members: [],
      }
    },
    removeNewGroupMembers: (state, action) => {
      const member = action.payload
      state.new.members = state.new.members.filter((m) => m._id !== member._id)
    },
  },
  extraReducers: {
    [getGroup.pending]: (state) => {
      state.loading = true
    },
    [getGroup.fulfilled]: (state, action) => {
      state.current = action.payload
      state.loading = false
    },
    [getGroups.pending]: (state) => {
      state.loading = true
    },
    [getGroups.fulfilled]: (state, action) => {
      state.groups = action.payload
      state.loading = false
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
    resetNewGroup,
  },
} = groupSlice
