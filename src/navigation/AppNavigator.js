import { createAppContainer, createSwitchNavigator } from 'react-navigation'
import Dummy from 'screens/Dummy'
import StorybookUI from 'storybook/StorybookUI'

const AppNavigator = createSwitchNavigator({
  Dummy: Dummy,
  StorybookUI: StorybookUI,
})

export default createAppContainer(AppNavigator)
