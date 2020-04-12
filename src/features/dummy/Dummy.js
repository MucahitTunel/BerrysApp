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
        <TouchableOpacity
          style={styles.item}
          onPress={() => goToScreen('Counter')}>
          <Text>Counter Example</Text>
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
