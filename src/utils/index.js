import random from 'lodash/random'
import store from 'state/store'

export const generateVerificationCode = () => String(random(100000, 999999))

export const getConversationName = (room) => {
  const { data: customData, createdBy, members, createdAt } = room
  const state = store.getState()
  const {
    app: {
      contacts: { data = [] },
    },
    auth: { user },
  } = state
  const { phoneNumber } = user
  const otherUserPhoneNumber = members.find((m) => m !== user.phoneNumber)
  const isRoomCreator = phoneNumber === createdBy
  const isFromQuestionPage = customData && customData.isFromQuestionPage
  const shouldShowAnonymous = !isRoomCreator || isFromQuestionPage
  if (shouldShowAnonymous) {
    const milli = String(new Date(createdAt).getTime())
    const number = milli.substr(phoneNumber.length - 3)
    return `Anonymous ${number}`
  }
  if (data && data.length) {
    const contact = data.find((c) => c.phoneNumber === otherUserPhoneNumber)
    if (contact && contact.name) {
      return contact.name
    }
  }
  return otherUserPhoneNumber
}
