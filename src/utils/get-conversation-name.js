import store from 'state/store'

const getNumberFromCreatedAt = (phoneNumber, createdAt) => {
  const milli = String(new Date(createdAt).getTime())
  return milli.substr(phoneNumber.length - 3)
}

export const getConversationName = (room) => {
  const NOT_ANONYMOUS =
    "You're not anonymous. Your friend wants to talk specifically with you"
  const ANONYMOUS = "You're anonymous and your identity won't be revealed"
  const { data: customData, createdBy, members, createdAt } = room
  const state = store.getState()
  const {
    contacts: { data = [] },
    auth: { user },
  } = state
  const { phoneNumber } = user
  const otherUserPhoneNumber = members.find((m) => m !== user.phoneNumber)
  const isRoomCreator = phoneNumber === createdBy
  const isFromQuestionPage = customData && customData.isFromQuestionPage
  const isFromContactsList = customData && customData.isFromContactsList
  const linkOwnerName = customData && customData.linkOwnerName
  const isFromAskMeAnything = customData && customData.isFromAskMeAnything
  const number = getNumberFromCreatedAt(phoneNumber, createdAt)
  if (isFromQuestionPage) {
    // conversation starts from Question page
    return {
      title: `Anonymous ${number}`,
      description: ANONYMOUS,
    }
  }
  if (isFromContactsList) {
    // conversation starts by 1 user (roomCreator)
    if (isRoomCreator) {
      // this is the room creator
      if (data && data.length) {
        const contact = data.find((c) => c.phoneNumber === otherUserPhoneNumber)
        if (contact && contact.name) {
          return {
            title: contact.name,
            description: ANONYMOUS,
          }
        }
      }
    } else {
      // not a room creator
      return {
        title: `Anonymous ${number}`,
        description: NOT_ANONYMOUS,
      }
    }
  }
  if (isFromAskMeAnything) {
    // conversation starts by 1 user (roomCreator)
    if (isRoomCreator) {
      // this is the room creator or the asker
      if (linkOwnerName) {
        return {
          title: linkOwnerName,
          description: ANONYMOUS,
        }
      } else if (data && data.length) {
        const contact = data.find((c) => c.phoneNumber === otherUserPhoneNumber)
        if (contact && contact.name) {
          return {
            title: contact.name,
            description: ANONYMOUS,
          }
        }
      } else {
        return {
          title: 'UNKNOWN',
          description: ANONYMOUS,
        }
      }
    } else {
      // this is the ask me anything link owner
      return {
        title: `Anonymous ${number}`,
        description: NOT_ANONYMOUS,
      }
    }
  }
  return {
    title: otherUserPhoneNumber,
    description: '',
  }
}

export default getConversationName
