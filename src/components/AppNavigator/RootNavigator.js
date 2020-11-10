import React from 'react'
import { useSelector } from 'react-redux'
import { createStackNavigator } from '@react-navigation/stack'
import { createDrawerNavigator } from '@react-navigation/drawer'
import { Header, SideBarMenu } from 'components'
import {
  BackButton,
  ComposeButton,
  MainBackButton,
  MenuButton,
  MessagesBackButton,
  MessagesButton,
} from 'components/NavButton'
import { Screens } from 'constants'
import Onboarding from 'features/auth/Onboarding'
import Splash from 'features/auth/Splash'
import PhoneVerification from 'features/auth/PhoneVerification'
import Main from 'features/questions/Main'
import FollowContacts from 'features/contacts/FollowContacts'
import ImportGmailContacts from 'features/contacts/ImportGmailContacts'
import Report from 'features/report/Report'
import SelectContacts from 'features/contacts/SelectContacts'
import AskMe from 'features/contacts/AskMe'
import Preview from 'features/questions/Preview'
import Answers from 'features/questions/Answers'
import Messages from 'features/messages/Messages'
import Conversation from 'features/messages/Conversation'
import MessageContacts from 'features/messages/MessageContacts'
import Survey from 'features/auth/Survey'
import RequestToAsk from 'features/questions/RequestToAsk'
import DirectMessage from 'features/messages/DirectMessage'
import ContactsToAskMe from 'features/contacts/ContactsToAskMe'

const Stack = createStackNavigator()
const Drawer = createDrawerNavigator()

const SurveyStack = () => (
  <Stack.Navigator>
    <Stack.Screen
      name={Screens.Survey}
      component={Survey}
      options={({ navigation }) => ({
        header: () => (
          <Header headerRight={<MessagesButton navigation={navigation} />} />
        ),
      })}
    />
  </Stack.Navigator>
)

const MainStack = () => (
  <Stack.Navigator>
    <Stack.Screen
      name={Screens.Main}
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
    <Stack.Screen name={Screens.Answers} component={Answers} />
    <Stack.Screen name={Screens.RequestToAsk} component={RequestToAsk} />
    <Stack.Screen
      name={Screens.SelectContacts}
      component={SelectContacts}
      options={({ navigation }) => ({
        header: () => (
          <Header
            title="Post Question"
            headerLeft={<BackButton navigation={navigation} />}
          />
        ),
      })}
    />
    <Stack.Screen
      name={Screens.Preview}
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
      name={Screens.AskMe}
      component={AskMe}
      options={({ navigation }) => ({
        header: () => (
          <Header
            title="Ask me"
            headerLeft={<BackButton navigation={navigation} />}
          />
        ),
      })}
    />
    <Stack.Screen
      name={Screens.ContactsToAskMe}
      component={ContactsToAskMe}
      options={({ navigation }) => ({
        header: () => (
          <Header
            title="Select Contacts To Ask Me"
            headerLeft={<BackButton navigation={navigation} />}
          />
        ),
      })}
    />
    <Stack.Screen
      name={Screens.Messages}
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
    <Stack.Screen name={Screens.Conversation} component={Conversation} />
    <Stack.Screen
      name={Screens.MessageContacts}
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
    <Stack.Screen
      name={Screens.DirectMessage}
      component={DirectMessage}
      options={{ headerShown: false }}
    />
  </Stack.Navigator>
)

const ImportGmailContactsStack = () => (
  <Stack.Navigator>
    <Stack.Screen
      name={Screens.ImportGmailContacts}
      component={ImportGmailContacts}
      options={({ navigation }) => ({
        header: () => (
          <Header
            title="Import Gmail Contacts"
            headerLeft={<MenuButton navigation={navigation} />}
          />
        ),
      })}
    />
  </Stack.Navigator>
)

const FollowContactsStack = () => (
  <Stack.Navigator>
    <Stack.Screen
      name={Screens.FollowContacts}
      component={FollowContacts}
      options={({ navigation }) => ({
        header: () => (
          <Header
            title="Unfollow Contacts"
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
      name={Screens.Report}
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
  if (user && user.isNew && !user.survey) {
    return <SurveyStack />
  }
  if (user && !user.isVerifying) {
    return (
      <Drawer.Navigator
        initialRouteName={Screens.MainStack}
        drawerContent={(props) => <SideBarMenu {...props} />}>
        <Drawer.Screen name={Screens.MainStack} component={MainStack} />
        <Drawer.Screen
          name={Screens.ImportGmailContactsStack}
          component={ImportGmailContactsStack}
        />
        <Drawer.Screen
          name={Screens.FollowContactsStack}
          component={FollowContactsStack}
        />
        <Drawer.Screen name={Screens.ReportStack} component={ReportStack} />
      </Drawer.Navigator>
    )
  } else {
    return (
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name={Screens.Onboarding} component={Onboarding} />
        <Stack.Screen
          name={Screens.PhoneVerification}
          component={PhoneVerification}
        />
      </Stack.Navigator>
    )
  }
}

export default RootNavigator
