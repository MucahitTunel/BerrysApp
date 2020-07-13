import React from 'react'
import { useSelector } from 'react-redux'
import Config from 'react-native-config'
import { createStackNavigator } from '@react-navigation/stack'
import { Header } from 'components'
import { MenuButton, MessagesButton } from 'components/NavButton'
import StorybookButton from 'components/AppButton/StorybookButton'
import Constants from 'constants'
import Onboarding from 'features/auth/Onboarding'
import Splash from 'features/auth/Splash'
import Main from 'features/questions/Main'

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
          <Stack.Screen
            name={Constants.Screens.Onboarding}
            component={Main}
            options={({ navigation, route }) => ({
              header: () => (
                <Header
                  title="points"
                  headerLeft={<MenuButton />}
                  headerRight={<MessagesButton />}
                />
              ),
            })}
          />
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
