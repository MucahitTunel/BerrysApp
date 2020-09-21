import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { StatusBar, StyleSheet, View } from 'react-native'
import {
  GoogleSignin,
  GoogleSigninButton,
  statusCodes,
} from '@react-native-community/google-signin'
import Config from 'react-native-config'
import Constants from 'constants'
import { fetchContactsFromGoogle } from 'features/contacts/contactsSlice'

const styles = StyleSheet.create({
  container: {
    height: Constants.Dimensions.Height,
    width: Constants.Dimensions.Width,
    backgroundColor: Constants.Colors.grayLight,
    alignItems: 'center',
    flex: 1,
  },
})

const ImportGmailContacts = () => {
  const dispatch = useDispatch()
  useEffect(() => {
    GoogleSignin.configure({
      scopes: [
        'https://www.googleapis.com/auth/contacts.readonly',
        'https://www.googleapis.com/auth/contacts.other.readonly',
      ],
      webClientId: Config.GOOGLE_WEB_CLIENT_ID,
    })
  })

  const onPressLoginWithGoogle = async () => {
    try {
      await GoogleSignin.hasPlayServices()
      await GoogleSignin.signIn()
      const tokens = await GoogleSignin.getTokens()
      const { accessToken } = tokens
      dispatch(fetchContactsFromGoogle(accessToken))
    } catch (error) {
      console.log('ERROR - onPressLoginWithGoogle')
      console.log(error)
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        // user cancelled the login flow
      } else if (error.code === statusCodes.IN_PROGRESS) {
        // operation (e.g. sign in) is in progress already
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        // play services not available or outdated
      } else {
        // some other errors happened
      }
    }
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <GoogleSigninButton onPress={onPressLoginWithGoogle} />
    </View>
  )
}

export default ImportGmailContacts
