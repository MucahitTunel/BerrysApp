import React from 'react'
import { useSelector } from 'react-redux'
import { createStackNavigator } from '@react-navigation/stack'
import { createDrawerNavigator } from '@react-navigation/drawer'
import { Header, SideBarMenu } from 'components'
import {
  MenuButton,
  MessagesButton,
  BackButton,
  MainBackButton,
  ComposeButton,
  MessagesBackButton,
} from 'components/NavButton'
import Constants from 'constants'
import Onboarding from 'features/auth/Onboarding'
import Splash from 'features/auth/Splash'
import PhoneVerification from 'features/auth/PhoneVerification'
import Main from 'features/questions/Main'
import FollowContacts from 'features/contacts/FollowContacts'
import Report from 'features/report/Report'
import SelectContacts from 'features/contacts/SelectContacts'
import Preview from 'features/questions/Preview'
import Answers from 'features/questions/Answers'
import Messages from 'features/messages/Messages'
import Conversation from 'features/messages/Conversation'
import MessageContacts from 'features/messages/MessageContacts'

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
    <Stack.Screen name={Constants.Screens.Answers} component={Answers} />
    <Stack.Screen
      name={Constants.Screens.SelectContacts}
      component={SelectContacts}
      options={({ navigation }) => ({
        header: () => (
          <Header
            title="People who'll get SMS about this question"
            headerLeft={<BackButton navigation={navigation} />}
          />
        ),
      })}
    />
    <Stack.Screen
      name={Constants.Screens.Preview}
      component={Preview}
      options={({ navigation }) => ({
        header: () => (
          <Header
            title="Preview"
            headerLeft={<BackButton navigation={navigation} />}
          />
        ),
      })}
    />
    <Stack.Screen
      name={Constants.Screens.Messages}
      component={Messages}
      options={({ navigation }) => ({
        header: () => (
          <Header
            title="Messages"
            headerLeft={<MainBackButton navigation={navigation} />}
            headerRight={<ComposeButton navigation={navigation} />}
          />
        ),
      })}
    />
    <Stack.Screen
      name={Constants.Screens.Conversation}
      component={Conversation}
    />
    <Stack.Screen
      name={Constants.Screens.MessageContacts}
      component={MessageContacts}
      options={({ navigation }) => ({
        header: () => (
          <Header
            title="Select a contact to send messages"
            headerLeft={<MessagesBackButton navigation={navigation} />}
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
  const auth = useSelector((state) => state.auth) || {}
  const { user, booting = true } = auth
  if (booting) {
    return <Splash />
  }
  return user && !user.isVerifying ? (
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
      <Stack.Screen
        name={Constants.Screens.PhoneVerification}
        component={PhoneVerification}
      />
    </Stack.Navigator>
  )
}

export default RootNavigator
