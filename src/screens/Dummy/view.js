import React, { useCallback } from 'react'
import { View, Text, TouchableOpacity } from 'react-native'
import styles from './styles'

const Dummy = ({ navigation: { navigate } }) => {
  const goToStorybook = useCallback(() => {
    navigate('StorybookUI')
  }, [navigate])

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={goToStorybook}>
        <Text>Storybook</Text>
      </TouchableOpacity>
    </View>
  )
}

export default Dummy
