import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { ContactsList } from 'components'
import { blacklistContacts } from 'features/contacts/contactsSlice'

const FollowContacts = (props) => {
  const dispatch = useDispatch()
  const contacts = useSelector((state) => state.contacts)
  const onPressSubmit = (contacts) => dispatch(blacklistContacts(contacts))
  return (
    <ContactsList
      onPressSubmit={onPressSubmit}
      checkCondition="isBlacklisted"
      subTitle="Select contacts to unfollow:"
      isLoading={contacts.loading}
      {...props}
    />
  )
}

export default FollowContacts
