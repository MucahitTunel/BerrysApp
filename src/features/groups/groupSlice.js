import { Alert } from 'react-native'
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import * as NavigationService from 'services/navigation'
import request from 'services/api'
import { Screens } from 'constants'
import differenceBy from 'lodash/differenceBy'

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
      role: m.role,
      name: m.name,
      isAppUser: m.isAppUser,
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
    return new Promise(async (resolve) => {
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
      resolve(group)
    })
  },
)

export const updateGroup = createAsyncThunk(
  'group/update',
  async (_, { getState, dispatch }) => {
    const state = getState()
    const user = state.auth.user
    const newGroupData = state.group.current
    await request({
      method: 'POST',
      url: 'group/update',
      data: {
        group: newGroupData,
        userPhoneNumber: user.phoneNumber,
      },
    })
    Alert.alert('Success', 'Your group has been updated!')
    dispatch(getGroups())
    return
  },
)

export const deleteGroup = createAsyncThunk(
  'group/delete',
  async (_, { getState, dispatch }) => {
    const state = getState()
    const user = state.auth.user
    await request({
      method: 'POST',
      url: 'group/delete',
      data: {
        groupId: state.group.current._id,
        userPhoneNumber: user.phoneNumber,
      },
    })
    Alert.alert('Success', 'Your group has been deleted!')
    dispatch(getGroups())
    return
  },
)

export const leaveGroup = createAsyncThunk(
  'group/leave',
  async (_, { getState, dispatch }) => {
    const state = getState()
    const user = state.auth.user
    await request({
      method: 'POST',
      url: 'group/leave',
      data: {
        groupId: state.group.current._id,
        userPhoneNumber: user.phoneNumber,
      },
    })
    Alert.alert('Success', `You have left ${state.group.current.name} group!`)
    dispatch(getGroups())
    return
  },
)

export const activateJoinLink = createAsyncThunk(
  'group/activate-join-link',
  async (_, { getState }) => {
    const state = getState()
    const group = state.group.current
    await request({
      method: 'POST',
      url: 'group/join-link/activate',
      data: {
        groupId: group._id,
      },
    })
    Alert.alert('Success', `You have activated the join link!`)
    return {
      ...group,
      joinableByLink: true,
    }
  },
)

export const deactivateJoinLink = createAsyncThunk(
  'group/deactivate-join-link',
  async (_, { getState }) => {
    const state = getState()
    const group = state.group.current
    await request({
      method: 'POST',
      url: 'group/join-link/deactivate',
      data: {
        groupId: group._id,
      },
    })
    Alert.alert('Success', `You have deactivated the join link!`)
    return {
      ...group,
      joinableByLink: false,
    }
  },
)

export const joinGroupByLink = createAsyncThunk(
  'group/deactivate-join-link',
  async ({ groupId }, { getState, dispatch }) => {
    const state = getState()
    const user = state.auth.user
    const { data } = await request({
      method: 'POST',
      url: 'group/join',
      data: {
        groupId,
        userPhoneNumber: user.phoneNumber,
        userName: user.name,
      },
    })
    Alert.alert('Success', `You have joined the "${data.group.name}" group!`)
    NavigationService.navigate(Screens.GroupList)
    dispatch(getGroups())
  },
)

// TODO Change here
export const getFacebookGroups = createAsyncThunk(
  'group/get-facebook-groups',
  async ({ userId, token }) => {
    const { data } = await request({
      method: 'GET',
      url: `https://graph.facebook.com/v10.0/${userId}/groups?access_token=${token}`,
    })
    console.log(data)
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
      const originalMembers = state.new.members
      const removedMembers = differenceBy(
        originalMembers,
        newMembers,
        'phoneNumber',
      )
      const addedMembers = differenceBy(
        newMembers,
        originalMembers,
        'phoneNumber',
      )
      state.new.members = state.new.members
        .filter(
          (m) =>
            !removedMembers.find(
              (member) => member.phoneNumber === m.phoneNumber,
            ),
        )
        .concat(addedMembers)
    },
    setNewGroupAdmins: (state, action) => {
      const newAdmins = action.payload.map((a) => ({ ...a, role: 'admin' }))
      const oldMembers = state.new.members.filter((m) => m.role === 'member')
      const members = oldMembers.filter(
        (m) => !newAdmins.find((admin) => admin.phoneNumber === m.phoneNumber),
      )
      state.new.members = members.concat(newAdmins)
    },
    setCurrentGroupMembers: (state, action) => {
      const newMembers = action.payload.map((m) => ({ ...m, role: 'member' }))
      const originalMembers = state.current.members
      const removedMembers = differenceBy(
        originalMembers,
        newMembers,
        'phoneNumber',
      )
      const addedMembers = differenceBy(
        newMembers,
        originalMembers,
        'phoneNumber',
      )
      state.current.members = state.current.members
        .filter(
          (m) =>
            !removedMembers.find(
              (member) => member.phoneNumber === m.phoneNumber,
            ),
        )
        .concat(addedMembers)
    },
    setCurrentGroupAdmins: (state, action) => {
      const newAdmins = action.payload.map((a) => ({ ...a, role: 'admin' }))
      const oldMembers = state.current.members.filter(
        (m) => m.role === 'member',
      )
      const members = oldMembers.filter(
        (m) => !newAdmins.find((admin) => admin.phoneNumber === m.phoneNumber),
      )
      state.current.members = members.concat(newAdmins)
    },
    setCurrentGroupName: (state, action) => {
      state.current.name = action.payload
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
      state.new.members = state.new.members.filter(
        (m) => m.phoneNumber !== member.phoneNumber,
      )
    },
    removeCurrentGroupMembers: (state, action) => {
      const member = action.payload
      state.current.members = state.current.members.filter(
        (m) => m.phoneNumber !== member.phoneNumber,
      )
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
    [createGroup.pending]: (state) => {
      state.loading = true
    },
    [createGroup.fulfilled]: (state) => {
      state.loading = false
    },
    [updateGroup.pending]: (state) => {
      state.loading = true
    },
    [updateGroup.fulfilled]: (state) => {
      state.loading = false
    },
    [activateJoinLink.fulfilled]: (state, action) => {
      state.current = action.payload
    },
    [deactivateJoinLink.fulfilled]: (state, action) => {
      state.current = action.payload
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
    removeCurrentGroupMembers,
    setCurrentGroupMembers,
    setCurrentGroupAdmins,
    setCurrentGroupName,
  },
} = groupSlice
