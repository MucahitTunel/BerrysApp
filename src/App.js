/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React from 'react'

import { useScreens } from 'react-native-screens'
useScreens()

import AppNavigator from 'navigation/AppNavigator'

const App = () => {
  return <AppNavigator />
}

export default App
