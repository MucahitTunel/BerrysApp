import React from 'react'
import { View, StyleSheet } from 'react-native'
import PropTypes from 'prop-types'
import { Colors, Dimensions } from 'constants'

import AppInput from '../AppInput'

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    height: 60,
    color: 'black',
    backgroundColor: 'white',
    borderRadius: 15,
    flex: 1,
  },
})

const PollInput = ({ text = null, itemIndex, onChange, style }) => {
  return (
    <View style={[styles.container, style]}>
      <AppInput
        style={styles.input}
        placeholder={`Option ${itemIndex}`}
        placeholderTextColor={Colors.gray}
        value={text}
        onChange={onChange}
      />
    </View>
  )
}

export default PollInput

PollInput.propTypes = {
  text: PropTypes.string,
  itemIndex: PropTypes.number,
  onChange: PropTypes.func,
  style: PropTypes.object,
}
