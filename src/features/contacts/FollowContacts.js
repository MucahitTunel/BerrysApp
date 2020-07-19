import React from 'react'
import { useDispatch } from 'react-redux'
import { ContactsList } from 'components'
import { blacklistContacts } from 'features/contacts/contactsSlice'

const FollowContacts = (props) => {
  const dispatch = useDispatch()
  const onPressSubmit = (contacts) => dispatch(blacklistContacts(contacts))
  return (
    <ContactsList
      onPressSubmit={onPressSubmit}
      checkCondition="isBlacklisted"
      {...props}
    />
  )
}

export default FollowContacts
