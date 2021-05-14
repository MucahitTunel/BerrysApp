/* eslint-disable */
import React from 'react'
import { Image, View } from 'react-native'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Screens, Colors } from 'constants'
import { AppIcon } from 'components'
import Images from 'assets/images'

import Account from 'features/contacts/Account'
import Messages from 'features/messages/Messages'
import GroupList from 'features/groups/GroupList'
import Main from 'features/questions/Main'

const TabStack = createBottomTabNavigator()
export default TabStackScreen = ({ navigation }) => {

    const renderNull = () => null

    return (
        <TabStack.Navigator
            screenOptions={({ route }) => ({
                tabBarIcon: ({ focused, color, size }) => {
                const getImage = (icon) => <Image source={icon} style={{ height: 24, width: 24, resizeMode: 'contain' }}/>
                switch(route.name) {
                    case Screens.Main: return getImage(focused ? Images.homeFilled : Images.homeEmpty)
                    case Screens.GroupList: return getImage(focused ? Images.groupFilled : Images.groupEmpty)
                    case Screens.Messages: return getImage(focused ? Images.messageFilled : Images.messageEmpty)
                    case Screens.Account: return getImage(focused ? Images.newProfileFilled : Images.newProfile)
                    default: return (
                      <View style={{ backgroundColor: Colors.purple, height: 50, width: 50, borderRadius: 25, top: -20, justifyContent: 'center', alignItems: 'center'}}>
                          <AppIcon
                            name="plus"
                            size={30}
                            color="white"
                          />
                      </View>
                    )
                }
                },
            })}
            tabBarOptions={{
                showLabel: false,
            }}
        >
        <TabStack.Screen name={Screens.Main} component={Main} />
        <TabStack.Screen name={Screens.GroupList} component={GroupList} />
        <TabStack.Screen name={'post-question'} component={renderNull} 
          listeners={({ navigation, route }) => ({
            tabPress: (e) => {
              e.preventDefault()
              navigation.navigate(Screens.QuestionTypeSelection)
            }
          })}
        />
        <TabStack.Screen name={Screens.Messages} component={Messages} />
        <TabStack.Screen name={Screens.Account} component={Account} />
        </TabStack.Navigator>
    )
}