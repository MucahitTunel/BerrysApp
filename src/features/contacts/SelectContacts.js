import React from 'react'
import { Alert, SafeAreaView } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
import { ContactsList } from 'components'
import {
  askQuestion,
  setAskContacts,
  setAskGroups,
} from 'features/questions/askSlice'
import { Colors } from 'constants'

const SelectContacts = (props) => {
  const dispatch = useDispatch()
  const ask = useSelector((state) => state.ask)
  const onPressSubmit = (contacts, groups = [], request) => {
    const MIN_NUM_CONTACTS = 1
    if (contacts.length < MIN_NUM_CONTACTS) {
      return Alert.alert(
        'Warning',
        `You have to select at least ${MIN_NUM_CONTACTS} contacts in order to proceed`,
      )
    }
    dispatch(setAskContacts(contacts))
    dispatch(setAskGroups(groups))
    dispatch(askQuestion(request))
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.white }}>
      <ContactsList
        isPostQuestion
        isGroup
        onPressSubmit={onPressSubmit}
        checkCondition="isSelected"
        subTitle="Select contacts:"
        isLoading={ask.loading}
        {...props}
      />
    </SafeAreaView>
  )
}

export default SelectContacts
