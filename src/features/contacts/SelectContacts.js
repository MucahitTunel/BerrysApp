/* eslint-disable react/prop-types */
import React from 'react'
import { Alert, SafeAreaView, Keyboard } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
import { ContactsList } from 'components'
import {
  askQuestion,
  setAskContacts,
  setAskGroups,
} from 'features/questions/askSlice'
import { Colors } from 'constants'
import { createPoll, createCompare } from '../questions/questionSlice'

const SelectContacts = (props) => {
  const dispatch = useDispatch()
  const ask = useSelector((state) => state.ask)
  const question = useSelector((state) => state.question)
  const onPressSubmit = (contacts, groups = [], request) => {
    Keyboard.dismiss()
    const MIN_NUM_RECEIVERS = 1
    if (contacts.length + groups.length < MIN_NUM_RECEIVERS) {
      return Alert.alert(
        'Warning',
        `You have to select at least ${MIN_NUM_RECEIVERS} contacts/groups in order to proceed`,
      )
    }
    dispatch(setAskContacts(contacts))
    dispatch(setAskGroups(groups))

    if (props.route.params?.poll) return dispatch(createPoll())
    if (props.route.params?.compare) return dispatch(createCompare())
    if (props.route.params?.postQuestion) return props.navigation.goBack()
    dispatch(askQuestion(request))
  }
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.white }}>
      <ContactsList
        showGroups
        onPressSubmit={onPressSubmit}
        checkCondition="isSelected"
        subTitle="Select contacts/groups:"
        isLoading={ask.loading || question.loading}
        submitText={props.route.params?.submitText}
        selectedItems={props.route.params?.selectedItems}
        selectedGroups={props.route.params?.selectedGroups}
        {...props}
      />
    </SafeAreaView>
  )
}

export default SelectContacts
