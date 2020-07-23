import { Animated } from 'react-native'

export const showKeyboard = (event, keyboardHeight) => {
  console.log('keyboardHeight', event.endCoordinates.height)
  Animated.parallel([
    Animated.timing(keyboardHeight, {
      duration: event.duration,
      toValue: event.endCoordinates.height,
    }),
  ]).start()
}

export const hideKeyBoard = (event, keyboardHeight) => {
  console.log('keyboardHeight', event.endCoordinates.height)
  Animated.parallel([
    Animated.timing(keyboardHeight, {
      duration: event.duration,
      toValue: 0,
    }),
  ]).start()
}
