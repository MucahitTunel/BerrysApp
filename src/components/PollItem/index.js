import React from 'react'
import { View, StyleSheet } from 'react-native'
import PropTypes from 'prop-types'
import { Colors, Dimensions } from 'constants'

import AppButton from '../AppButton'

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
  },
  selected: {
    height: 70,
    width: 5,
    left: 10,
    borderTopLeftRadius: 15,
    borderBottomLeftRadius: 15,
  },
  percentage: {
    height: 70,
    left: 10,
    borderTopLeftRadius: 5,
    borderBottomLeftRadius: 5,
    position: 'absolute',
  },
  option: {
    width: Dimensions.Width - 20,
    paddingLeft: 10,
    marginLeft: 5,
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: Colors.grayLight,
    height: 70,
  },
})

const PollItem = ({ text, selected, style, onPress, isVoted, voteNumber }) => {
  return (
    <View style={[styles.container, style]}>
      <View
        style={[
          styles.selected,
          { backgroundColor: selected ? Colors.primary : 'transparent' },
        ]}
      />
      <AppButton
        style={styles.option}
        leftAlign
        onPress={onPress}
        text={text}
        textStyle={{ color: 'black' }}
        disabled={isVoted || selected}
      />
      {isVoted && (
        <View
          style={[
            styles.percentage,
            {
              backgroundColor: Colors.primaryDimmed,
              width: (Dimensions.Width / 100) * voteNumber - 20,
            },
          ]}
        />
      )}
    </View>
  )
}

export default PollItem

PollItem.propTypes = {
  text: PropTypes.string,
  selected: PropTypes.bool,
  onPress: PropTypes.func,
  style: PropTypes.object,
  isVoted: PropTypes.bool,
  voteNumber: PropTypes.number,
}
