/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React from 'react'
import { Provider } from 'react-redux'

import { useScreens } from 'react-native-screens'
useScreens()

import AppNavigator from 'navigation/AppNavigator'
import store from './store'

const App = () => {
  return (
    <Provider store={store}>
      <AppNavigator />
    </Provider>
  )
}

export default App
