import React from 'react'
import { Image, TouchableOpacity } from 'react-native'
import styled from 'styled-components'
import Config from 'react-native-config'
import * as navigationService from 'services/navigation'

const StorybookButton = () =>
  ['dev', 'staging'].includes(Config.ENV) ? (
    <Button onPress={() => navigationService.navigate('Storybook', {})}>
      <ButtonImage
        source={{ uri: 'https://img.stackshare.io/service/4906/22632046.png' }}
      />
    </Button>
  ) : null

const Button = styled(TouchableOpacity)`
  height: 50px;
  width: 50px;
  border-radius: 25px;
  position: absolute;
  top: 20px;
  right: 20px;
`

const ButtonImage = styled(Image)`
  padding: 5px;
  height: 50px;
  width: 50px;
  resize-mode: stretch;
`
export default StorybookButton
