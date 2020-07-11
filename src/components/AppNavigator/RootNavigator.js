import React from 'react'
import Config from 'react-native-config'
import { createStackNavigator } from '@react-navigation/stack'
import StorybookButton from 'components/AppButton/StorybookButton'
import Constants from 'constants'
import Onboarding from 'features/auth/Onboarding'

const Stack = createStackNavigator()

const storyBookNavigator = ['dev', 'staging'].includes(Config.ENV)
  ? {
      headerTransparent: true,
      headerTitle: null,
      headerRight: () => <StorybookButton isHidden={true} />,
    }
  : { header: () => null }

const RootNavigator = () => {
  return (
    <Stack.Navigator screenOptions={storyBookNavigator}>
      <Stack.Screen
        name={Constants.Screens.Onboarding}
        component={Onboarding}
      />
    </Stack.Navigator>
  )
}

export default RootNavigator
