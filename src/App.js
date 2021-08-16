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
import { PersistGate } from 'redux-persist/integration/react'

import AppNavigator from 'components/AppNavigator'
import store, { persistor } from './state/store'

import RNUxcam from 'react-native-ux-cam'
RNUxcam.optIntoSchematicRecordings()
RNUxcam.startWithKey(process.env.UXCAM_APP_KEY)

enableScreens()

const App = () => {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <AppNavigator />
      </PersistGate>
    </Provider>
  )
}

export default App
