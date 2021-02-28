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
  selected: {
    width: 10,
    backgroundColor: Colors.primary,
  },
  input: {
    height: 60,
    width: Dimensions.Width - 20,
    borderWidth: 1,
    borderColor: Colors.grayLight,
    color: 'black',
  },
})

const PollItem = ({ text = null, selected, itemIndex, onChange, style }) => {
  return (
    <View style={[styles.container, style]}>
      {selected && <View style={styles.selected} />}
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

export default PollItem

PollItem.propTypes = {
  text: PropTypes.string,
  selected: PropTypes.bool,
  itemIndex: PropTypes.number,
  onChange: PropTypes.func,
  style: PropTypes.object,
}
