/* eslint-disable react/prop-types */
import React from 'react'
import { TouchableOpacity } from 'react-native'
import { AppIcon } from 'components'
import { Colors, Screens } from 'constants'

export const BackButton = ({ navigation }) => (
  <TouchableOpacity onPress={() => navigation.goBack()}>
    <AppIcon name="chevron-left" color={Colors.white} />
  </TouchableOpacity>
)

export const MainBackButton = ({ navigation }) => (
  <TouchableOpacity onPress={() => navigation.navigate(Screens.Main)}>
    <AppIcon name="chevron-left" color={Colors.white} />
  </TouchableOpacity>
)

export const MessagesBackButton = ({ navigation }) => (
  <TouchableOpacity onPress={() => navigation.navigate(Screens.Messages)}>
    <AppIcon name="chevron-left" color={Colors.white} />
  </TouchableOpacity>
)

export const MessagesButton = ({ navigation }) => (
  <TouchableOpacity onPress={() => navigation.navigate(Screens.Messages)}>
    <AppIcon name="chat" color={Colors.white} />
  </TouchableOpacity>
)

export const MenuButton = ({ navigation }) => (
  <TouchableOpacity onPress={() => navigation.toggleDrawer()}>
    <AppIcon name="menu" color={Colors.white} />
  </TouchableOpacity>
)

// the 3 dots button
export const AnswerRightButton = ({ onPressDots }) => {
  return (
    <TouchableOpacity style={{ padding: 10 }} onPress={onPressDots}>
      <AppIcon name="more-vertical" size={22} color={Colors.white} />
    </TouchableOpacity>
  )
}

// the Messages's Compose button
export const ComposeButton = ({ navigation }) => {
  return (
    <TouchableOpacity
      style={{ padding: 10 }}
      onPress={() => navigation.navigate(Screens.MessageContacts)}>
      <AppIcon name="plus" size={22} color={Colors.white} />
    </TouchableOpacity>
  )
}
