import React, { useCallback } from 'react'
import { View, Text, TouchableOpacity } from 'react-native'
import PropTypes from 'prop-types'
import styles from './styles'

const Dummy = ({ navigation: { navigate } }) => {
  const goToScreen = useCallback(
    screen => {
      navigate(screen)
    },
    [navigate],
  )

  return (
    <View style={styles.container}>
      <View>
        <TouchableOpacity onPress={() => goToScreen('StorybookUI')}>
          <Text>Storybook</Text>
        </TouchableOpacity>
      </View>

      <View>
        <TouchableOpacity onPress={() => goToScreen('Counter')}>
          <Text>Counter</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

Dummy.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func,
  }),
}

export default Dummy
