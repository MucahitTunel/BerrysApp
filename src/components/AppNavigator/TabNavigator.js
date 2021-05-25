/* eslint-disable */
import React from 'react'
import { Image, View, StyleSheet } from 'react-native'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Screens, Colors } from 'constants'
import { AppIcon } from 'components'
import Images from 'assets/images'
import { useSelector } from 'react-redux'

import Account from 'features/contacts/Account'
import Messages from 'features/messages/Messages'
import GroupList from 'features/groups/GroupList'
import Main from 'features/questions/Main'

const styles = StyleSheet.create({
  dotMessage: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: Colors.primary,
    position: 'absolute',
    top: 10,
    right: 20,
    borderWidth: 1,
    borderColor: Colors.primary,
  },
})

const TabStack = createBottomTabNavigator()
export default TabStackScreen = ({ navigation }) => {

    const renderNull = () => null

    const roomsWithNewMessages =
      useSelector((state) => state.messages.roomsWithNewMessages) || []
    const questions = useSelector((state) => state.questions)
    const user = useSelector((state) => state.auth.user)
    const isNewUser = !(
      questions.data.find((q) => user.phoneNumber === q.userPhoneNumber) ||
      questions.compares.find((q) => user.phoneNumber === q.userPhoneNumber) ||
      questions.polls.find((q) => user.phoneNumber === q.userPhoneNumber)
    )

    return (
        <TabStack.Navigator
            screenOptions={({ route }) => ({
                tabBarIcon: ({ focused, color, size }) => {
                const getImage = (icon) => <Image source={icon} style={{ height: 24, width: 24, resizeMode: 'contain' }}/>
                switch(route.name) {
                    case Screens.Main: return getImage(focused ? Images.homeFilled : Images.homeEmpty)
                    case Screens.GroupList: return getImage(focused ? Images.groupFilled : Images.groupEmpty)
                    case Screens.Messages:
                      return (
                        <>
                          <Image source={focused ? Images.messageFilled : Images.messageEmpty} style={{ height: 24, width: 24, resizeMode: 'contain' }}/>
                          {(roomsWithNewMessages.length > 0 ||
                            questions.requestsToAsk.length > 0 ||
                            isNewUser) && <View style={styles.dotMessage} />}
                        </>
                      )
                    case Screens.Account: return getImage(focused ? Images.newProfileFilled : Images.newProfile)
                    default: return (
                      <View style={{ backgroundColor: Colors.background, height: 70, width: 70, borderRadius: 35, top: -20, justifyContent: 'center', alignItems: 'center' }}>
                        <View style={{ backgroundColor: Colors.purple, height: 50, width: 50, borderRadius: 25, justifyContent: 'center', alignItems: 'center'}}>
                          <AppIcon
                            name="plus"
                            size={30}
                            color="white"
                          />
                      </View>
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