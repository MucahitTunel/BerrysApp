/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import 'react-native-gesture-handler'
import React from 'react'
import { Provider } from 'react-redux'
import { enableScreens } from 'react-native-screens'

import AppNavigator from 'components/AppNavigator'
import store from './state/store'

enableScreens()

const App = () => {
  return (
    <Provider store={store}>
      <AppNavigator />
    </Provider>
  )
}

export default App
