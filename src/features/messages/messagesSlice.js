import { Alert } from 'react-native'
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import * as NavigationService from 'services/navigation'
import request from 'services/api'
import { pusher } from 'features/auth/authSlice'
import { Screens } from 'constants'

const roomSortFunction = (room1, room2) => {
  const { lastMessage: lastMessage1, createdAt: createdAt1 } = room1
  const { lastMessage: lastMessage2, createdAt: createdAt2 } = room2
  if (
    lastMessage1 &&
    lastMessage2 &&
    lastMessage1.createdAt &&
    lastMessage2.createdAt
  ) {
    return lastMessage2.createdAt - lastMessage1.createdAt
  } else {
    return createdAt2 - createdAt1
  }
}

export const directMessage = createAsyncThunk(
  'messages/directMessage',
  async ({ userId }, { dispatch }) => {
    const { data } = await request({
      method: 'GET',
      url: '/account/get-user-by-id',
      params: {
        userId,
      },
    })
    const { user } = data
    if (user && user.phoneNumber) {
      dispatch(
        joinRoom({
          phoneNumber: user.phoneNumber,
          isFromAskMeAnything: true,
          linkOwnerName: user.name,
        }),
      )
    } else {
      Alert.alert('Error', `Cannot get phone number for user with ID ${userId}`)
    }
    return true
  },
)

export const joinRoom = createAsyncThunk(
  'messages/joinRoom',
  async (
    {
      phoneNumber,
      questionId,
      isFromQuestionPage = false,
      linkOwnerName,
      isFromAskMeAnything = false,
      isFromContactsList = false,
    },
    { getState },
  ) => {
    const state = getState()
    const user = state.auth.user
    if (user.phoneNumber === phoneNumber) {
      return Alert.alert('Error', 'Cannot create/join a room with yourself')
    }
    // find or create the room
    const { data } = await request({
      method: 'POST',
      url: 'chat/room',
      data: {
        phoneNumber,
        userPhoneNumber: user.phoneNumber,
        questionId,
        isFromQuestionPage,
        linkOwnerName,
        isFromAskMeAnything,
        isFromContactsList,
      },
    })
    const { room } = data
    NavigationService.navigate(Screens.Conversation)
    return room
  },
)

export const getRoom = createAsyncThunk(
  'messages/getRoom',
  async ({ roomId }) => {
    const { data } = await request({
      method: 'GET',
      url: 'chat/room',
      params: {
        roomId,
      },
    })
    const { room } = data
    NavigationService.navigate(Screens.Conversation)
    return room
  },
)

export const getRooms = createAsyncThunk(
  'messages/getRooms',
  async (_, { getState, dispatch }) => {
    const state = getState()
    const user = state.auth.user
    const currentRooms = state.messages.rooms
    currentRooms.forEach((room) => pusher.unsubscribe(room._id))
    const { data } = await request({
      method: 'GET',
      url: 'chat/rooms',
      params: {
        userPhoneNumber: user.phoneNumber,
      },
    })
    const { rooms = [] } = data
    rooms.forEach((room) => {
      const channel = pusher.subscribe(room._id)
      channel.bind('MESSAGE_RECEIVED', (d) => {
        const roomsUpdated = rooms
          .map((r) => {
            if (r._id === room._id) {
              return {
                ...r,
                lastMessage: d.message,
              }
            } else {
              return r
            }
          })
          .sort(roomSortFunction)
        dispatch(setRooms(roomsUpdated))
      })
    })
    return rooms.sort(roomSortFunction)
  },
)

export const getMessages = createAsyncThunk(
  'messages/getMessages',
  async (callback, { getState, dispatch }) => {
    const state = getState()
    const user = state.auth.user
    const room = state.messages.room
    if (room && room._id) {
      const { data } = await request({
        method: 'GET',
        url: 'chat/messages',
        params: {
          roomId: room._id,
          userPhoneNumber: user.phoneNumber,
        },
      })
      const { messages = [] } = data
      const channel = pusher.subscribe(room._id)
      channel.bind('MESSAGE_RECEIVED', (data) => {
        const currentState = getState()
        const currentMessages = currentState.messages.messages
        const updated = [data.message, ...currentMessages]
        dispatch(setMessages(updated))
        callback()
      })
      return messages
    }
  },
)

export const sendPushNotification = createAsyncThunk(
  'messages/send-push-notification',
  async ({ phoneNumber, message, payload }) => {
    await request({
      method: 'POST',
      url: 'push-notification',
      data: {
        phoneNumber,
        message,
        payload,
      },
    })
  },
)

export const sendMessage = createAsyncThunk(
  'messages/send-message',
  async ({ content, roomId, userPhoneNumber }) => {
    await request({
      method: 'POST',
      url: 'chat/message',
      data: {
        content,
        roomId,
        userPhoneNumber,
      },
    })
  },
)

const messagesSlice = createSlice({
  name: 'messages',
  initialState: {
    messages: [],
    rooms: [],
    room: {},
    loading: false,
  },
  reducers: {
    setMessages: (state, action) => {
      state.messages = action.payload
    },
    setRooms: (state, action) => {
      state.rooms = action.payload
    },
    setRoom: (state, action) => {
      state.room = action.payload
    },
  },
  extraReducers: {
    [joinRoom.fulfilled]: (state, action) => {
      state.room = action.payload
    },
    [getRoom.fulfilled]: (state, action) => {
      state.room = action.payload
    },
    [getMessages.pending]: (state) => {
      state.loading = true
    },
    [getMessages.fulfilled]: (state, action) => {
      state.loading = false
      state.messages = action.payload
    },
    [getRooms.pending]: (state) => {
      state.loading = true
    },
    [getRooms.fulfilled]: (state, action) => {
      state.loading = false
      state.rooms = action.payload
    },
  },
})

export const {
  reducer: messagesReducer,
  actions: { setMessages, setRooms, setRoom },
} = messagesSlice
