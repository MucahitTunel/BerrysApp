import React from 'react'
import { Alert, StyleSheet, View } from 'react-native'
import { useDispatch } from 'react-redux'
import { ContactsList, AppButton } from 'components'
import { requestToAsk } from 'features/auth/authSlice'
import Constants from 'constants'

const styles = StyleSheet.create({
  container: {
    height: Constants.Dimensions.Height,
    width: Constants.Dimensions.Width,
    backgroundColor: Constants.Colors.grayLight,
    flex: 1,
  },
  footer: {
    paddingLeft: 10,
    paddingRight: 10,
    paddingBottom: 10,
    backgroundColor: Constants.Colors.white,
  },
})

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
    <View style={styles.container}>
      <ContactsList
        onPressSubmit={onPressSubmit}
        checkCondition="isSelected"
        {...props}
      />
      <View style={styles.footer}>
        <AppButton
          onPress={() => {}}
          text="Copy URL"
          backgroundColor={Constants.Colors.primary}
          color={Constants.Colors.white}
          borderRadius={Constants.Styles.BorderRadius.small}
        />
      </View>
    </View>
  )
}

export default RequestContactsToAsk
