/* eslint-disable */
import React from 'react'
import { createStackNavigator } from '@react-navigation/stack'
import { Screens } from 'constants'
import { Header } from 'components'
import { BackButton, ComposeButton, AskMeButton, NotificationButton, MessagesBackButton } from 'components/NavButton'

import TabStack from './TabNavigator'
import QuestionTypeSelection from 'features/questions/QuestionTypeSelection'
import PostQuestion from 'features/questions/PostQuestion'
import PollDetails from 'features/questions/Polls/Detail'
import SelectContacts from 'features/contacts/SelectContacts'
import Conversation from 'features/messages/Conversation'
import AskMe from 'features/contacts/AskMe'
import ContactsToAskMe from 'features/contacts/ContactsToAskMe'
import RequestToAsk from 'features/questions/RequestToAsk'
import DirectMessage from 'features/messages/DirectMessage'
import VoiceCall from 'features/contacts/VoiceCall'
import PointsInput from 'features/contacts/PointsInput'
import Answers from 'features/questions/Answers'
import GroupCreate from 'features/groups/GroupCreate'
import GroupUpsert from 'features/groups/GroupUpsert'
import FollowContacts from 'features/contacts/FollowContacts'
import MyPosts from 'features/contacts/MyPosts'
import MyEngaged from 'features/contacts/MyEngaged'
import MySkipped from 'features/contacts/MySkipped'
import MessageContacts from 'features/messages/MessageContacts'
import GroupAddMembers from 'features/groups/GroupAddMembers'
import Report from 'features/report/Report'
import Notifications from 'features/contacts/Notifications'
import SeeWhoVoted from 'features/questions/SeeWhoVoted'

const MainStack = createStackNavigator()
export default MainStackScreen = ({ navigation }) => {

    const getHeader = (route) => {
        const routeName = route.state
        ? route.state.routes[route.state.index].name
        : route.params?.screen || 'MainScreen'
    
        switch (routeName) {
            case 'MainScreen':
                return (
                    <Header
                        title="Berrys"
                        headerLeft={<NotificationButton navigation={navigation} />}
                        headerRight={<AskMeButton navigation={navigation} />}
                    />
                )
            case 'MessagesScreen':
                return (
                    <Header
                        title="Messages"
                        headerRight={<ComposeButton navigation={navigation} />}
                    />
                )
            case 'GroupListScreen':
                return (
                    <Header
                        title="My Groups"
                        headerRight={<ComposeButton navigation={navigation} onPress={() => navigation.navigate(Screens.GroupCreate)}/>}
                    />
                )
            }
    }

    return (
        <MainStack.Navigator mode="modal">
            <MainStack.Screen
                name={'tab-stack'}
                component={TabStack}
                options={({ route }) => ({
                    header: () => getHeader(route)
                })}
            />
            <MainStack.Screen
                name={Screens.SelectContacts}
                component={SelectContacts}
                options={({ navigation }) => ({
                header: () => (
                    <Header
                        title="Select Contacts"
                        headerLeft={<BackButton navigation={navigation} />}
                    />
                ),
                })}
            />
            <MainStack.Screen
                name={Screens.QuestionTypeSelection}
                component={QuestionTypeSelection}
            />
            <MainStack.Screen
                name={Screens.PostQuestion}
                component={PostQuestion}
                options={({ navigation }) => ({
                    header: () => (
                        <Header
                            title="Post Question"
                            headerLeft={<BackButton navigation={navigation} />}
                        />
                    ),
                    })}
            />
            <MainStack.Screen name={Screens.Conversation} component={Conversation} />
            <MainStack.Screen
                name={Screens.PollDetails}
                component={PollDetails}
                options={({ navigation }) => ({
                    header: () => (
                        <Header
                            title="Poll Details"
                            headerLeft={<BackButton navigation={navigation} />}
                        />
                    ),
                    })}
            />
            <MainStack.Screen
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
            <MainStack.Screen
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
            <MainStack.Screen name={Screens.RequestToAsk} component={RequestToAsk} />
            <MainStack.Screen
                name={Screens.DirectMessage}
                component={DirectMessage}
                options={{ headerShown: false }}
            />
            <MainStack.Screen
                name={Screens.VoiceCall}
                component={VoiceCall}
                options={() => ({
                header: () => <Header title="Voice Call" />
                })}
            />
            <MainStack.Screen
                name={Screens.PointsInput}
                component={PointsInput}
                options={({ navigation }) => ({
                    header: () => (
                        <Header
                            title="Points per Answer"
                            headerLeft={<BackButton navigation={navigation} />}
                        />
                    ),
                })}
            />
            <MainStack.Screen name={Screens.Answers} component={Answers} />
            <MainStack.Screen
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
            <MainStack.Screen name={Screens.GroupUpsert} component={GroupUpsert} />
            <MainStack.Screen
                name={Screens.FollowContacts}
                component={FollowContacts}
                options={({ navigation }) => ({
                    header: () => (
                    <Header
                        title="Unfollow Contacts"
                        headerLeft={<BackButton navigation={navigation} />}
                    />
                    ),
                })}
            />
            <MainStack.Screen
                name={Screens.MyPosts}
                component={MyPosts}
                options={({ navigation }) => ({
                    header: () => (
                    <Header
                        title="My Posts"
                        headerLeft={<BackButton navigation={navigation} />}
                    />
                    ),
                })}
            />
            <MainStack.Screen
                name={Screens.MyEngaged}
                component={MyEngaged}
                options={({ navigation }) => ({
                    header: () => (
                    <Header
                        title="My Engaged Posts"
                        headerLeft={<BackButton navigation={navigation} />}
                    />
                    ),
                })}
            />
            <MainStack.Screen
                name={Screens.MySkipped}
                component={MySkipped}
                options={({ navigation }) => ({
                    header: () => (
                    <Header
                        title="My Skipped Posts"
                        headerLeft={<BackButton navigation={navigation} />}
                    />
                    ),
                })}
            />
            <MainStack.Screen
                name={Screens.MessageContacts}
                component={MessageContacts}
                options={({ navigation }) => ({
                header: () => (
                    <Header
                    title="Select a contact"
                    headerLeft={<MessagesBackButton navigation={navigation} />}
                    />
                ),
                })}
            />
            <MainStack.Screen name={Screens.GroupAddMembers} component={GroupAddMembers} />
            <MainStack.Screen
                name={Screens.Report}
                component={Report}
                options={({ navigation }) => ({
                    header: () => (
                    <Header
                        title="Report & Feedback"
                        headerLeft={<BackButton navigation={navigation} />}
                    />
                    ),
                })}
                />
            <MainStack.Screen
                name={Screens.Notifications}
                component={Notifications}
                options={({ navigation }) => ({
                    header: () => (
                    <Header
                        title="Notifications"
                        headerLeft={<BackButton navigation={navigation} />}
                    />
                    ),
                })}
                />
            <MainStack.Screen
                name={Screens.SeeWhoVoted}
                component={SeeWhoVoted}
                options={({ navigation }) => ({
                    header: () => (
                    <Header
                        title="See Who Voted"
                        headerLeft={<BackButton navigation={navigation} />}
                    />
                    ),
                })}
                />
        </MainStack.Navigator>
    )
}