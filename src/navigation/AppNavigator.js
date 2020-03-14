import React from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import Dummy from 'screens/Dummy'
import StorybookUI from 'storybook/StorybookUI'

const Stack = createStackNavigator()

const AppNavigator = () => (
  <NavigationContainer>
    <Stack.Navigator>
      <Stack.Screen name="Dummy" component={Dummy} />
      <Stack.Screen name="StorybookUI" component={StorybookUI} />
    </Stack.Navigator>
  </NavigationContainer>
)

export default AppNavigator
