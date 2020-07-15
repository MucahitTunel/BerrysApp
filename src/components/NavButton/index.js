/* eslint-disable react/prop-types */
import React from 'react'
import { TouchableOpacity } from 'react-native'
import { AppIcon } from 'components'
import Constants from 'constants'

export const BackButton = ({ navigation }) => (
  <TouchableOpacity onPress={() => navigation.goBack()}>
    <AppIcon name="chevron-left" color={Constants.Colors.white} />
  </TouchableOpacity>
)

export const MainBackButton = ({ navigation }) => (
  <TouchableOpacity onPress={() => navigation.navigate(Constants.Screens.Main)}>
    <AppIcon name="chevron-left" color={Constants.Colors.white} />
  </TouchableOpacity>
)

export const MessagesBackButton = ({ navigation }) => (
  <TouchableOpacity
    onPress={() => navigation.navigate(Constants.Screens.Messages)}>
    <AppIcon name="chevron-left" color={Constants.Colors.white} />
  </TouchableOpacity>
)

export const MessagesButton = ({ navigation }) => (
  <TouchableOpacity
    onPress={() => navigation.navigate(Constants.Screens.Messages)}>
    <AppIcon name="chat" color={Constants.Colors.white} />
  </TouchableOpacity>
)

export const MenuButton = ({ navigation }) => (
  <TouchableOpacity onPress={() => navigation.toggleDrawer()}>
    <AppIcon name="menu" color={Constants.Colors.white} />
  </TouchableOpacity>
)

// the 3 dots button
export const AnswerRightButton = ({ navigation }) => {
  return (
    <TouchableOpacity
      style={{ padding: 10 }}
      onPress={() => navigation.state.params.handleSave()}>
      <AppIcon name="more-vertical" size={22} color={Constants.Colors.white} />
    </TouchableOpacity>
  )
}

// the Messages's Compose button
export const ComposeButton = ({ navigation }) => {
  return (
    <TouchableOpacity
      style={{ padding: 10 }}
      onPress={() => navigation.navigate(Constants.Screens.MessageContacts)}>
      <AppIcon name="plus" size={22} color={Constants.Colors.white} />
    </TouchableOpacity>
  )
}
