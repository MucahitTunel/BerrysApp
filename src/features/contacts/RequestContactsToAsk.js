import React from 'react'
import { Alert } from 'react-native'
import { useDispatch } from 'react-redux'
import { ContactsList } from 'components'
import { requestToAsk } from 'features/auth/authSlice'

const RequestContactsToAsk = (props) => {
  const dispatch = useDispatch()
  const onPressSubmit = (contacts) => {
    const MIN_NUM_CONTACTS = 3
    if (contacts.length < MIN_NUM_CONTACTS) {
      return Alert.alert(
        'Warning',
        `You have to select at least ${MIN_NUM_CONTACTS} contacts in order to proceed`,
      )
    }
    dispatch(requestToAsk(contacts))
  }

  return (
    <ContactsList
      onPressSubmit={onPressSubmit}
      checkCondition="isSelected"
      {...props}
    />
  )
}

export default RequestContactsToAsk
