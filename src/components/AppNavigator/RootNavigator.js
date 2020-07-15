import React from 'react'
import { useSelector } from 'react-redux'
import { createStackNavigator } from '@react-navigation/stack'
import { createDrawerNavigator } from '@react-navigation/drawer'
import { Header, SideBarMenu } from 'components'
import { MenuButton, MessagesButton } from 'components/NavButton'
import Constants from 'constants'
import Onboarding from 'features/auth/Onboarding'
import Splash from 'features/auth/Splash'
import Main from 'features/questions/Main'
import FollowContacts from 'features/contacts/FollowContacts'
import Report from 'features/report/Report'

const Stack = createStackNavigator()
const Drawer = createDrawerNavigator()

const MainStack = () => (
  <Stack.Navigator>
    <Stack.Screen
      name={Constants.Screens.Main}
      component={Main}
      options={({ navigation }) => ({
        header: () => (
          <Header
            title="points"
            headerLeft={<MenuButton navigation={navigation} />}
            headerRight={<MessagesButton navigation={navigation} />}
          />
        ),
      })}
    />
  </Stack.Navigator>
)

const FollowContactsStack = () => (
  <Stack.Navigator>
    <Stack.Screen
      name={Constants.Screens.FollowContacts}
      component={FollowContacts}
      options={({ navigation }) => ({
        header: () => (
          <Header
            title="Unfollow users and dont see their questions"
            headerLeft={<MenuButton navigation={navigation} />}
          />
        ),
      })}
    />
  </Stack.Navigator>
)

const ReportStack = () => (
  <Stack.Navigator>
    <Stack.Screen
      name={Constants.Screens.Report}
      component={Report}
      options={({ navigation }) => ({
        header: () => (
          <Header
            title="Report & Feedback"
            headerLeft={<MenuButton navigation={navigation} />}
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
      <Drawer.Screen
        name={Constants.Screens.FollowContactsStack}
        component={FollowContactsStack}
      />
      <Drawer.Screen
        name={Constants.Screens.ReportStack}
        component={ReportStack}
      />
    </Drawer.Navigator>
  ) : (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen
        name={Constants.Screens.Onboarding}
        component={Onboarding}
      />
    </Stack.Navigator>
  )
}

export default RootNavigator
