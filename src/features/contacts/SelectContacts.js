import React from 'react'
import { Alert } from 'react-native'
import { useDispatch } from 'react-redux'
import * as NavigationService from 'services/navigation'
import { ContactsList } from 'components'
import Constants from 'constants'
import { setAskContacts } from 'features/questions/askSlice'

const SelectContacts = (props) => {
  const dispatch = useDispatch()
  const onPressSubmit = (contacts) => {
    const MIN_NUM_CONTACTS = 3
    if (contacts.length < MIN_NUM_CONTACTS) {
      return Alert.alert(
        'Warning',
        `You have to select at least ${MIN_NUM_CONTACTS} contacts in order to proceed`,
      )
    }
    dispatch(setAskContacts(contacts))
    return NavigationService.navigate(Constants.Screens.Preview)
  }

  return (
    <ContactsList
      onPressSubmit={onPressSubmit}
      checkCondition="isSelected"
      {...props}
    />
  )
}

export default SelectContacts
