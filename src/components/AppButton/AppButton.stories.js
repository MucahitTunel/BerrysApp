import React from 'react'
import { storiesOf } from '@storybook/react-native'
import Colors from 'constants/colors'

import CenteredView from '../CenteredView'
import AppButton from './index'

storiesOf('AppButton', module)
  .addDecorator(storyFn => <CenteredView>{storyFn()}</CenteredView>)
  .add('default', () => <AppButton />)
  .add('purple button', () => (
    <AppButton
      backgroundColor={Colors.PURPLE}
      textColor={Colors.WHITE}
      text="Click Me"
    />
  ))
