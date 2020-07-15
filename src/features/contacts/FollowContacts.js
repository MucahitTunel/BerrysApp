import React from 'react'
import { ContactsList } from 'components'

const FollowContacts = (props) => {
  const onPressSubmit = (contacts) => {
    // TODO XIN updateBlacklistedContacts
  }
  return (
    <ContactsList
      onPressSubmit={onPressSubmit}
      checkCondition="isBlacklisted"
      {...props}
    />
  )
}

export default FollowContacts
