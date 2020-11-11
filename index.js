/**
 * @format
 */

import { AppRegistry } from 'react-native'
import App from './src/App'
import { name as appName } from './app.json'
import { LogBox } from 'react-native'

AppRegistry.registerComponent(appName, () => App)
LogBox.ignoreLogs([
  'Animated: `useNativeDriver` was not specified',
  'Warning: componentWillMount has been renamed',
  'Deprecation warning: use moment.updateLocale',
  'Warning: componentWillReceiveProps',
])
