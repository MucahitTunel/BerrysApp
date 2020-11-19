import { Animated } from 'react-native'

export const showKeyboard = (event, keyboardHeight) => {
  console.log('showKeyboard', event.endCoordinates.height)
  Animated.parallel([
    Animated.timing(keyboardHeight, {
      duration: event.duration,
      toValue: event.endCoordinates.height,
    }),
  ]).start()
}

export const hideKeyBoard = (event, keyboardHeight) => {
  console.log('hideKeyBoard', event.endCoordinates.height)
  Animated.parallel([
    Animated.timing(keyboardHeight, {
      duration: event.duration,
      toValue: 0,
    }),
  ]).start()
}

export const checkURL = (str) => {
  const pattern = new RegExp(
    '(https?:\\/\\/)?' + // protocol
      '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
      '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
      '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
      '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
      '(\\#[-a-z\\d_]*)?',
    'i',
  ) // fragment locator
  const isMatch = pattern.test(str)
  if (isMatch) {
    const res = str.match(pattern)
    const url = res && res.length && res[0]
    return url
  }
  return null
}
