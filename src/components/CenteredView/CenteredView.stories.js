import React from 'react'
import { Text } from 'react-native'
import { storiesOf } from '@storybook/react-native'
import CenteredView from './index'

storiesOf('CenteredView', module).add(
  'default',
  () => (
    <CenteredView>
      <Text>This is a centered view</Text>
    </CenteredView>
  ),
  {
    notes: 'Example of storybook',
  },
)
