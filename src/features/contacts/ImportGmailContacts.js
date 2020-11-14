import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { StatusBar, StyleSheet, SafeAreaView } from 'react-native'
import {
  GoogleSignin,
  statusCodes,
} from '@react-native-community/google-signin'
import Config from 'react-native-config'
import { Dimensions, Colors, Styles } from 'constants'
import { fetchContactsFromGoogle } from 'features/contacts/contactsSlice'
import ScaleTouchable from '../../components/ScaleTouchable'
import { AppImage, AppText } from 'components'
import Images from 'assets/images'

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
      <ScaleTouchable
        style={{
          backgroundColor: Colors.white,
          borderWidth: 1,
          borderColor: Colors.primary,
          height: 56,
          borderRadius: 8,
          flexDirection: 'row',
          alignItems: 'center',
          paddingHorizontal: 24,
        }}
        onPress={onPressLoginWithGoogle}>
        <AppImage source={Images.googleIcon} />
        <AppText
          style={{ marginLeft: 12 }}
          weight="medium"
          fontSize={Styles.FontSize.large}
          color={Colors.primary}>
          Sign in with Google
        </AppText>
      </ScaleTouchable>
    </SafeAreaView>
  )
}

export default ImportGmailContacts
