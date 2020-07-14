import React from 'react'
import { useSelector } from 'react-redux'
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import { createDrawerNavigator } from '@react-navigation/drawer'
import { Header, SideBarMenu } from 'components'
import { MenuButton, MessagesButton } from 'components/NavButton'
import Constants from 'constants'
import Onboarding from 'features/auth/Onboarding'
import Splash from 'features/auth/Splash'
import Main from 'features/questions/Main'

const Stack = createStackNavigator()
const Drawer = createDrawerNavigator()

const MainStack = () => (
  <Stack.Navigator>
    <Stack.Screen
      name={Constants.Screens.Main}
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
  </Stack.Navigator>
)

const RootNavigator = () => {
  const auth = useSelector((state) => state.auth)
  const { user, booting } = auth
  if (booting) {
    return <Splash />
  }
  return user ? (
    <Drawer.Navigator
      initialRouteName={Constants.Screens.Main}
      drawerContent={(props) => <SideBarMenu {...props} />}>
      <Drawer.Screen name={Constants.Screens.MainStack} component={MainStack} />
    </Drawer.Navigator>
  ) : (
    <Stack.Navigator>
      <Stack.Screen
        name={Constants.Screens.Onboarding}
        component={Onboarding}
      />
    </Stack.Navigator>
  )
}

export default RootNavigator
