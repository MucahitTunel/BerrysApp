import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { StatusBar, StyleSheet, SafeAreaView } from 'react-native'
import {
  GoogleSignin,
  GoogleSigninButton,
  statusCodes,
} from '@react-native-community/google-signin'
import Config from 'react-native-config'
import { Dimensions, Colors } from 'constants'
import { fetchContactsFromGoogle } from 'features/contacts/contactsSlice'

const styles = StyleSheet.create({
  container: {
    height: Dimensions.Height,
    width: Dimensions.Width,
    backgroundColor: Colors.white,
    alignItems: 'center',
    justifyContent: 'center',
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
      const userInfo = await GoogleSignin.signIn()
      const {
        user: { email },
      } = userInfo
      const tokens = await GoogleSignin.getTokens()
      const { accessToken } = tokens
      dispatch(fetchContactsFromGoogle({ accessToken, email }))
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
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <GoogleSigninButton onPress={onPressLoginWithGoogle} />
    </SafeAreaView>
  )
}

export default ImportGmailContacts
