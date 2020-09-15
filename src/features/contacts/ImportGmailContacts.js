import React, { useEffect } from 'react'
import { StatusBar, StyleSheet, View } from 'react-native'
import {
  GoogleSignin,
  GoogleSigninButton,
  statusCodes,
} from '@react-native-community/google-signin'
import Config from 'react-native-config'
import Constants from 'constants'

const styles = StyleSheet.create({
  container: {
    height: Constants.Dimensions.Height,
    width: Constants.Dimensions.Width,
    backgroundColor: Constants.Colors.grayLight,
    flex: 1,
  },
})

const ImportGmailContacts = () => {
  useEffect(() => {
    GoogleSignin.configure({
      scopes: ['https://www.googleapis.com/auth/contacts.readonly'],
      webClientId: Config.GOOGLE_WEB_CLIENT_ID,
    })
  })
  const onPressLoginWithGoogle = async () => {
    try {
      await GoogleSignin.hasPlayServices()
      const userInfo = await GoogleSignin.signIn()
      console.log('userInfo')
      console.log(userInfo)
    } catch (error) {
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
