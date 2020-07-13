import React from 'react'
import { useSelector } from 'react-redux'
import Config from 'react-native-config'
import { createStackNavigator } from '@react-navigation/stack'
import StorybookButton from 'components/AppButton/StorybookButton'
import Constants from 'constants'
import Onboarding from 'features/auth/Onboarding'
import Splash from 'features/auth/Splash'
import Dummy from '../../features/dummy/Dummy'

const Stack = createStackNavigator()

const storyBookNavigator = ['dev', 'staging'].includes(Config.ENV)
  ? {
      headerTransparent: true,
      headerTitle: null,
      headerRight: () => <StorybookButton isHidden={true} />,
    }
  : { header: () => null }

const RootNavigator = () => {
  const auth = useSelector((state) => state.auth)
  const { user, booting } = auth
  if (booting) {
    return <Splash />
  }
  return (
    <Stack.Navigator screenOptions={storyBookNavigator}>
      {user ? (
        <>
          <Stack.Screen name="Dummy" component={Dummy} />
        </>
      ) : (
        <>
          <Stack.Screen
            name={Constants.Screens.Onboarding}
            component={Onboarding}
          />
        </>
      )}
    </Stack.Navigator>
  )
}

export default RootNavigator
