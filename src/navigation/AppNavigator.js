import { createAppContainer } from 'react-navigation'
import { createStackNavigator } from 'react-navigation-stack'
import Dummy from 'screens/Dummy'

const AppNavigator = createStackNavigator({
  Dummy: Dummy,
})

export default createAppContainer(AppNavigator)
