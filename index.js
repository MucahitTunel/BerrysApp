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
  'RCTBridge required dispatch_sync to load RCTDevLoadingView',
  'Warning: Cannot update a component from inside the function body of a different component',
  'VirtualizedLists should never be nested inside plain ScrollViews',
  'ImmutableStateInvariantMiddleware',
  'VirtualizedLists should never be nested',
  'Sending `didReceiveNetworkIncrementalData` with no listeners registered',
])
