import React from 'react'
import { Alert, StyleSheet, SafeAreaView } from 'react-native'
import { useDispatch } from 'react-redux'
import { ContactsList } from 'components'
import { requestToAsk } from 'features/auth/authSlice'
import { Dimensions, Colors } from 'constants'

const styles = StyleSheet.create({
  container: {
    height: Dimensions.Height,
    width: Dimensions.Width,
    backgroundColor: Colors.white,
    flex: 1,
  },
})

const ContactsToAskMe = (props) => {
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
    <SafeAreaView style={styles.container}>
      <ContactsList
        onPressSubmit={onPressSubmit}
        checkCondition="isSelected"
        submitText="Confirm"
        subTitle="Select contacts to ask you:"
        {...props}
      />
    </SafeAreaView>
  )
}

export default ContactsToAskMe
