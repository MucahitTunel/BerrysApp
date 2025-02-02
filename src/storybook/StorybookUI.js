import { getStorybookUI, configure } from '@storybook/react-native'
import AsyncStorage from '@react-native-community/async-storage'
import './rn-addons'

// import stories
configure(() => {
  require('../components/CenteredView/CenteredView.stories')
  require('../components/AppButton/AppButton.stories')
}, module)

// Refer to https://github.com/storybookjs/storybook/tree/master/app/react-native#start-command-parameters
// To find allowed options for getStorybookUI
const StorybookUIRoot = getStorybookUI({
  asyncStorage: AsyncStorage,
})

export default StorybookUIRoot
