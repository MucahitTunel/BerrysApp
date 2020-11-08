import React from 'react'
import { Alert, StyleSheet, View } from 'react-native'
import Clipboard from '@react-native-community/clipboard'
import { useDispatch, useSelector } from 'react-redux'
import { ContactsList, AppButton } from 'components'
import { requestToAsk } from 'features/auth/authSlice'
import { Dimensions, Colors, Styles } from 'constants'

const styles = StyleSheet.create({
  container: {
    height: Dimensions.Height,
    width: Dimensions.Width,
    backgroundColor: Colors.grayLight,
    flex: 1,
  },
  footer: {
    paddingLeft: 10,
    paddingRight: 10,
    paddingBottom: 10,
    backgroundColor: Colors.white,
  },
})

const RequestContactsToAsk = (props) => {
  const user = useSelector((state) => state.auth.user)
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
  const onPressCopyURL = () => {
    const url = `https://api.berrysapp.com/app/chat/${user._id}`
    Clipboard.setString(url)
    Alert.alert('Success', 'The URL has been copied to clipboard')
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
          onPress={onPressCopyURL}
          text="Copy URL"
          backgroundColor={Colors.primary}
          color={Colors.white}
          borderRadius={Styles.BorderRadius.small}
        />
      </View>
    </View>
  )
}

export default RequestContactsToAsk
