import React from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import Dummy from 'features/dummy/Dummy'
import Counter from 'features/counter/Counter'
import StorybookUI from 'storybook/StorybookUI'

const Stack = createStackNavigator()

const AppNavigator = () => (
  <NavigationContainer>
    <Stack.Navigator>
      <Stack.Screen name="Dummy" component={Dummy} />
      <Stack.Screen name="Counter" component={Counter} />
      <Stack.Screen name="StorybookUI" component={StorybookUI} />
    </Stack.Navigator>
  </NavigationContainer>
)

export default AppNavigator
