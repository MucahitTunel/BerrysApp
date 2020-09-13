import React from 'react'
import { StatusBar, StyleSheet, View, Text } from 'react-native'
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
  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <Text>Import Gmail Contacts</Text>
    </View>
  )
}

export default ImportGmailContacts
