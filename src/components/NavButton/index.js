/* eslint-disable react/prop-types */
import React from 'react'
import { AppIcon } from 'components'
import { Colors, Screens } from 'constants'
import { ScaleTouchable, AppImage } from 'components'
import Images from 'assets/images'

export const BackButton = ({ navigation }) => (
  <ScaleTouchable onPress={() => navigation.goBack()}>
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

export const MessagesButton = ({ navigation }) => (
  <ScaleTouchable onPress={() => navigation.navigate(Screens.Messages)}>
    <AppIcon name="chat" color={Colors.white} />
  </ScaleTouchable>
)

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
