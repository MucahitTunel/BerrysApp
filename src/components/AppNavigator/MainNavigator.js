/* eslint-disable */
import React from 'react'
import { createStackNavigator } from '@react-navigation/stack'
import { Screens } from 'constants'
import { Header, Layout } from 'components'
import { BackButton } from 'components/NavButton'

import TabStack from './TabNavigator'
import QuestionTypeSelection from 'features/questions/QuestionTypeSelection'
import PostQuestion from 'features/questions/PostQuestion'
import PollDetails from 'features/questions/Polls/Detail'
import SelectContacts from 'features/contacts/SelectContacts'

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
                        // headerLeft={<BackButton navigation={navigation} />}
                    />
                )
            case 'MessagesScreen':
                return (
                    <Header
                        title="Messages"
                        // headerLeft={<BackButton navigation={navigation} />}
                    />
                )
            case 'GroupListScreen':
                return (
                    <Header
                        title="My Groups"
                        // headerLeft={<BackButton navigation={navigation} />}
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
        </MainStack.Navigator>
    )
}