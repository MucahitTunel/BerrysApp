import React from 'react'
import { useDispatch } from 'react-redux'
import { Alert } from 'react-native'
import { ContactsList } from 'components'
import { joinRoom } from 'features/messages/messagesSlice'

const MessageContacts = (props) => {
  const dispatch = useDispatch()
  const onPressSubmit = (contacts) => {
    if (contacts.length < 1) {
      return Alert.alert(
        'Warning',
        'You have to select a contact to send messages to',
      )
    }
    const contact = contacts[0]
    dispatch(
      joinRoom({
        phoneNumber: contact.phoneNumber,
        isFromContactsList: true,
      }),
    )
  }
  return (
    <ContactsList
      checkCondition="isSelected"
      submitText="Message"
      singleSelect
      showRightText={false}
      onPressSubmit={onPressSubmit}
      {...props}
    />
  )
}

export default MessageContacts
