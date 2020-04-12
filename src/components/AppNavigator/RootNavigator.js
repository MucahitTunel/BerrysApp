import React from 'react'
import Config from 'react-native-config'
import { createStackNavigator } from '@react-navigation/stack'
import StorybookButton from 'components/AppButton/StorybookButton'
import Dummy from 'features/dummy/Dummy'
import Counter from 'features/counter/Counter'
import StorybookUI from 'storybook/StorybookUI'

const Stack = createStackNavigator()

const storyBookNavigator = ['dev', 'staging'].includes(Config.ENV)
  ? {
      headerTransparent: true,
      headerTitle: null,
      headerRight: () => <StorybookButton />,
    }
  : { header: () => null }

const RootNavigator = () => {
  return (
    <Stack.Navigator screenOptions={storyBookNavigator}>
      <Stack.Screen name="Dummy" component={Dummy} />
      <Stack.Screen name="Counter" component={Counter} />
      <Stack.Screen name="Storybook" component={StorybookUI} />
    </Stack.Navigator>
  )
}

export default RootNavigator
