import React from 'react'
import { storiesOf } from '@storybook/react-native'
import { withKnobs, object } from '@storybook/addon-knobs'
import { action } from '@storybook/addon-actions'
import Colors from 'constants/colors'
import CenteredView from '../CenteredView'
import AppButton from './index'

const buttonProps = {
  backgroundColor: Colors.ERROR,
  textColor: Colors.WHITE,
  text: 'knobs',
}

storiesOf('AppButton', module)
  .addDecorator((storyFn) => <CenteredView>{storyFn()}</CenteredView>)
  .addDecorator(withKnobs)
  .add('default', () => <AppButton />)
  .add('purple', () => (
    <AppButton
      backgroundColor={Colors.PURPLE}
      textColor={Colors.WHITE}
      text="purple"
    />
  ))
  .add('with knobs', () => (
    <AppButton {...object('buttonProps', buttonProps)} />
  ))
  .add('with actions', () => <AppButton onPress={action('button pressed')} />)
