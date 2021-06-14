import React from 'react'
import { Image, View } from 'react-native'
import { useSelector } from 'react-redux'
import { createStackNavigator } from '@react-navigation/stack'
import { createDrawerNavigator } from '@react-navigation/drawer'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { Colors } from 'constants'
import { Header, SideBarMenu, SimpleHeader } from 'components'
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
import AppOnboarding from 'features/auth/AppOnboarding'
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
import GroupList from 'features/groups/GroupList'
import GroupCreate from 'features/groups/GroupCreate'
import GroupUpsert from 'features/groups/GroupUpsert'
import GroupAddMembers from 'features/groups/GroupAddMembers'
import JoinGroupByLink from 'features/groups/JoinGroupByLink'
import CreatePoll from 'features/questions/Polls/CreatePoll'
import PollDetails from 'features/questions/Polls/Detail'
import CreateCompare from 'features/questions/Compare/Create'
import CompareDetails from 'features/questions/Compare/Detail'
import QuestionWithImage from 'features/questions/QuestionWithImage'
import PostQuestion from 'features/questions/PostQuestion'
import VoiceCall from 'features/contacts/VoiceCall'
import Account from 'features/contacts/Account'
import FacebookIntegration from 'features/auth/FacebookIntegration'
import Interests from 'features/auth/Interests'

import MainStack from './MainNavigator'

const Stack = createStackNavigator()
const Drawer = createDrawerNavigator()
const Tab = createBottomTabNavigator()

const SurveyStack = () => (
  <Stack.Navigator>
    <Stack.Screen name={Screens.Survey} component={Survey} />
    <Stack.Screen name={Screens.Interests} component={Interests} />
  </Stack.Navigator>
)

const MainnStack = () => {
  const auth = useSelector((state) => state.auth) || {}
  const { onboarding } = auth
  return (
    <Stack.Navigator>
      {onboarding && (
        <Stack.Screen
          name={Screens.AppOnboarding}
          component={AppOnboarding}
          options={{ headerShown: false }}
        />
      )}
      <Stack.Screen
        name={Screens.Main}
        component={Main}
        options={({ navigation }) => ({
          header: () => (
            <Header
              title="Berrys"
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
              title={onboarding ? 'Send Invite' : 'Post Queestion'}
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
      <Stack.Screen
        name={Screens.CreatePoll}
        component={CreatePoll}
        options={({ navigation }) => ({
          header: () => (
            <Header
              title="Create Poll"
              headerLeft={<MainBackButton navigation={navigation} />}
            />
          ),
        })}
      />
      <Stack.Screen
        name={Screens.PollDetails}
        component={PollDetails}
        options={({ navigation }) => ({
          header: () => (
            <Header
              title="Poll Results"
              headerLeft={<MainBackButton navigation={navigation} />}
            />
          ),
        })}
      />
      <Stack.Screen
        name={Screens.CreateCompare}
        component={CreateCompare}
        options={({ navigation }) => ({
          header: () => (
            <Header
              title="Create Compare"
              headerLeft={<MainBackButton navigation={navigation} />}
            />
          ),
        })}
      />
      <Stack.Screen
        name={Screens.CompareDetails}
        component={CompareDetails}
        options={({ navigation }) => ({
          header: () => (
            <Header
              title="Compare Results"
              headerLeft={<MainBackButton navigation={navigation} />}
            />
          ),
        })}
      />
      <Stack.Screen
        name={Screens.QuestionWithImage}
        component={QuestionWithImage}
        options={({ navigation }) => ({
          header: () => (
            <Header
              title="Post Image"
              headerLeft={<MainBackButton navigation={navigation} />}
            />
          ),
        })}
      />
      <Stack.Screen name={Screens.PostQuestion} component={PostQuestion} />
      <Stack.Screen
        name={Screens.VoiceCall}
        component={VoiceCall}
        options={({ navigation }) => ({
          header: () => <Header title="Voice Call" />,
        })}
      />
    </Stack.Navigator>
  )
}

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

const GroupStack = () => (
  <Stack.Navigator>
    <Stack.Screen
      name={Screens.GroupList}
      component={GroupList}
      options={({ navigation }) => ({
        header: () => (
          <Header
            title="My Groups"
            headerLeft={<MenuButton navigation={navigation} />}
          />
        ),
      })}
    />
    <Stack.Screen
      name={Screens.GroupCreate}
      component={GroupCreate}
      options={({ navigation }) => ({
        header: () => (
          <Header
            title="Create a Group"
            headerLeft={<BackButton navigation={navigation} />}
          />
        ),
      })}
    />
    <Stack.Screen name={Screens.GroupUpsert} component={GroupUpsert} />
    <Stack.Screen name={Screens.GroupAddMembers} component={GroupAddMembers} />
    <Stack.Screen
      name={Screens.JoinGroupByLink}
      component={JoinGroupByLink}
      options={{ headerShown: false }}
    />
  </Stack.Navigator>
)

const AuthStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name={Screens.Onboarding} component={Onboarding} />
    <Stack.Screen
      name={Screens.PhoneVerification}
      component={PhoneVerification}
    />
    <Stack.Screen
      name={Screens.FacebookIntegration}
      component={FacebookIntegration}
    />
  </Stack.Navigator>
)

const AccountStack = () => (
  <Stack.Navigator>
    <Stack.Screen
      name={Screens.Account}
      component={Account}
      options={({ navigation }) => ({
        header: () => (
          <Header
            title="Account"
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
  if (!user || (user && user.isVerifying)) {
    return <AuthStack />
  }
  if (user && !user.survey) {
    return <SurveyStack />
  }
  if (user && !user.isVerifying) {
    return (
      <Stack.Navigator headerMode="none">
        <Stack.Screen name={'main'} component={MainStack} />
        <Tab.Screen name={Screens.GroupStack} component={GroupStack} />
      </Stack.Navigator>
    )
  }
  return <Splash />
}

export default RootNavigator
