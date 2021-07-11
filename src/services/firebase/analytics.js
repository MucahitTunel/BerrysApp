import analytics from '@react-native-firebase/analytics'

const events = {
  SCREEN_NAVIGATION: 'screen_navigation',
}

const logEvent = (event, data) => {
  return analytics().logEvent(event, data)
}

export default {
  events,
  logEvent,
}
