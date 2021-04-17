/* eslint-disable react/prop-types */
import React from 'react'
import { useSelector } from 'react-redux'
import { View, StyleSheet } from 'react-native'
import { AppIcon } from 'components'
import { Colors, Screens } from 'constants'
import { ScaleTouchable, AppImage } from 'components'
import Images from 'assets/images'

const styles = StyleSheet.create({
  dotMessage: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: Colors.yellow,
    position: 'absolute',
    top: -5,
    right: 0,
    borderWidth: 1,
    borderColor: Colors.primary,
  },
})

export const BackButton = ({ navigation, onPress }) => (
  <ScaleTouchable
    onPress={() => {
      if (onPress) onPress()
      navigation.goBack()
    }}>
    <AppIcon name="arrow-backward" color={Colors.white} size={14} />
  </ScaleTouchable>
)

export const MainBackButton = ({ navigation }) => (
  <ScaleTouchable onPress={() => navigation.navigate(Screens.Main)}>
    <AppIcon name="arrow-backward" color={Colors.white} size={14} />
  </ScaleTouchable>
)

export const MessagesBackButton = ({ navigation }) => (
  <ScaleTouchable onPress={() => navigation.navigate(Screens.Messages)}>
    <AppIcon name="arrow-backward" color={Colors.white} size={14} />
  </ScaleTouchable>
)

export const MessagesButton = ({ navigation }) => {
  const roomsWithNewMessages =
    useSelector((state) => state.messages.roomsWithNewMessages) || []
  const questions = useSelector((state) => state.questions)
  const user = useSelector((state) => state.auth.user)
  const isNewUser = !(
    questions.data.find((q) => user.phoneNumber === q.userPhoneNumber) ||
    questions.compares.find((q) => user.phoneNumber === q.userPhoneNumber) ||
    questions.polls.find((q) => user.phoneNumber === q.userPhoneNumber)
  )
  return (
    <ScaleTouchable
      onPress={() =>
        navigation.navigate(Screens.Messages, {
          fromMain: true,
        })
      }>
      <AppIcon name="chat" color={Colors.white} />
      {(roomsWithNewMessages.length > 0 ||
        questions.requestsToAsk.length > 0 ||
        isNewUser) && <View style={styles.dotMessage} />}
    </ScaleTouchable>
  )
}

export const MenuButton = ({ navigation }) => (
  <ScaleTouchable onPress={() => navigation.toggleDrawer()}>
    <AppImage source={Images.menu} width={28} height={14} />
  </ScaleTouchable>
)

// the 3 dots button
export const AnswerRightButton = ({ onPressDots }) => {
  return (
    <ScaleTouchable style={{ padding: 10 }} onPress={onPressDots}>
      <AppIcon name="more-vertical" size={24} color={Colors.white} />
    </ScaleTouchable>
  )
}

// the Messages's Compose button
export const ComposeButton = ({ navigation }) => {
  return (
    <ScaleTouchable
      style={{ padding: 10 }}
      onPress={() => navigation.navigate(Screens.MessageContacts)}>
      <AppIcon name="plus" size={24} color={Colors.white} />
    </ScaleTouchable>
  )
}
