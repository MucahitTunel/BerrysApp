import React from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { navigationRef } from 'services/navigation'
import RootNavigator from './RootNavigator'

const AppNavigator = () => (
  <NavigationContainer ref={navigationRef}>
    <RootNavigator />
  </NavigationContainer>
)

export default AppNavigator
