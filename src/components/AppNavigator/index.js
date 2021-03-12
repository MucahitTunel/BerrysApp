import React from 'react'
import { Linking, Text } from 'react-native'
import { NavigationContainer } from '@react-navigation/native'
import { navigationRef } from 'services/navigation'
import { Screens } from 'constants'
import RootNavigator from './RootNavigator'

const AppNavigator = () => {
  const linking = {
    prefixes: ['https://api.berrysapp.com', 'berrysapp://'],
    // Custom function to get the URL which was used to open the app
    async getInitialURL() {
      // First, you may want to do the default deep link handling
      // Check if app was opened from a deep link
      const url = await Linking.getInitialURL()
      console.log('getInitialURL', url)
      if (url != null) {
        return url
      }
    },
    // Custom function to subscribe to incoming links
    subscribe(listener) {
      // First, you may want to do the default deep link handling
      const onReceiveURL = ({ url }) => {
        console.log('onReceiveURL', url)
        listener(url)
      }

      // Listen to incoming links from deep linking
      Linking.addEventListener('url', onReceiveURL)

      return () => {
        // Clean up the event listeners
        Linking.removeEventListener('url', onReceiveURL)
      }
    },
    config: {
      // Deep link configuration
      screens: {
        [Screens.MainStack]: {
          screens: {
            [Screens.DirectMessage]: 'app/chat/:userId',
          },
        },
        [Screens.GroupStack]: {
          screens: {
            [Screens.JoinGroupByLink]: 'app/group/:groupId',
          },
        },
      },
    },
  }
  return (
    <NavigationContainer
      ref={navigationRef}
      linking={linking}
      fallback={<Text>Loading...</Text>}>
      <RootNavigator />
    </NavigationContainer>
  )
}

export default AppNavigator
