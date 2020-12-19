import React from 'react'
import { Alert, SafeAreaView } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
import { ContactsList } from 'components'
import { askQuestion, setAskContacts } from 'features/questions/askSlice'
import { Colors } from 'constants'

const SelectContacts = (props) => {
  const dispatch = useDispatch()
  const ask = useSelector((state) => state.ask)
  const onPressSubmit = (contacts, request) => {
    const MIN_NUM_CONTACTS = 1
    if (contacts.length < MIN_NUM_CONTACTS) {
      return Alert.alert(
        'Warning',
        `You have to select at least ${MIN_NUM_CONTACTS} contacts in order to proceed`,
      )
    }
    dispatch(setAskContacts(contacts))
    dispatch(askQuestion(request))
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.white }}>
      <ContactsList
        isPostQuestion
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
