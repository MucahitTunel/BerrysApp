/* eslint-disable */
import React from 'react'
import { createStackNavigator } from '@react-navigation/stack'
import { Screens } from 'constants'
import { Header } from 'components'
import { BackButton, ComposeButton, AskMeButton } from 'components/NavButton'

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
        </MainStack.Navigator>
    )
}