/* eslint-disable react/prop-types */
import React from 'react'
import { useSelector } from 'react-redux'
import { View, StyleSheet, Keyboard } from 'react-native'
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
    borderColor: Colors.purple,
  },
  notificationDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: Colors.primary,
    position: 'absolute',
    top: 0,
    left: 16,
    borderWidth: 1,
    borderColor: Colors.primary,
  },
})

export const BackButton = ({ navigation, onPress, color = Colors.white }) => (
  <ScaleTouchable
    onPress={() => {
      Keyboard.dismiss()
      if (onPress) onPress()
      else navigation.goBack()
    }}>
    <AppIcon name="chevron-left" color={color} size={30} />
  </ScaleTouchable>
)

export const CloseButton = ({ navigation, onPress, color = Colors.white }) => (
  <ScaleTouchable
    onPress={() => {
      Keyboard.dismiss()
      if (onPress) onPress()
      navigation.goBack()
    }}>
    <AppIcon name="close" color={color} size={14} />
  </ScaleTouchable>
)

export const MainBackButton = ({ navigation }) => (
  <ScaleTouchable
    onPress={() => {
      Keyboard.dismiss()
      navigation.navigate(Screens.Main)
    }}>
    <AppIcon name="chevron-left" color={Colors.white} size={30} />
  </ScaleTouchable>
)

export const MessagesBackButton = ({ navigation }) => (
  <ScaleTouchable
    onPress={() => {
      Keyboard.dismiss()
      navigation.navigate(Screens.Messages)
    }}>
    <AppIcon name="chevron-left" color={Colors.white} size={30} />
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
      onPress={() => {
        Keyboard.dismiss()
        navigation.navigate(Screens.Messages, {
          fromMain: true,
        })
      }}>
      <AppIcon name="chat" color={Colors.white} />
      {(roomsWithNewMessages.length > 0 ||
        questions.requestsToAsk.length > 0 ||
        isNewUser) && <View style={styles.dotMessage} />}
    </ScaleTouchable>
  )
}

export const AskMeButton = ({ navigation }) => (
  <ScaleTouchable
    onPress={() => {
      Keyboard.dismiss()
      navigation.navigate(Screens.AskMe)
    }}>
    <AppIcon name="message-dot" color={Colors.white} />
  </ScaleTouchable>
)

export const MenuButton = ({ navigation }) => (
  <ScaleTouchable
    onPress={() => {
      Keyboard.dismiss()
      navigation.toggleDrawer()
    }}>
    <AppImage source={Images.menu} width={25} height={10} />
  </ScaleTouchable>
)

// the 3 dots button
export const AnswerRightButton = ({ onPressDots, color = Colors.white }) => {
  return (
    <ScaleTouchable style={{ padding: 3 }} onPress={onPressDots}>
      <AppIcon name="more-vertical" size={24} color={color} />
    </ScaleTouchable>
  )
}

export const NotificationButton = ({ navigation }) => {
  const hasNotifications = useSelector((state) => state.auth.hasNotifications)
  const size = 30
  return (
    <ScaleTouchable
      style={{ marginLeft: 10 }}
      onPress={() => navigation.navigate(Screens.Notifications)}>
      <AppImage source={Images.bell} width={size} height={size} />
      {hasNotifications && <View style={styles.notificationDot} />}
    </ScaleTouchable>
  )
}

// the Messages's Compose button
export const ComposeButton = ({ navigation, onPress }) => {
  return (
    <ScaleTouchable
      style={{ padding: 3, backgroundColor: 'white', borderRadius: 100 }}
      onPress={() => {
        Keyboard.dismiss()
        if (onPress) onPress()
        else navigation.navigate(Screens.MessageContacts)
      }}>
      <AppIcon name="plus" size={24} color={Colors.purple} />
    </ScaleTouchable>
  )
}
