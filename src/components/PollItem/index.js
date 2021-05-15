import React from 'react'
import { View, StyleSheet, TouchableOpacity } from 'react-native'
import PropTypes from 'prop-types'
import { Colors, Dimensions, FontSize } from 'constants'

import AppText from '../AppText'

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    minHeight: 70,
    alignItems: 'center',
    borderWidth: 2,
    borderRadius: 10,
    borderColor: Colors.grayLight,
  },
  percentage: {
    height: '100%',
    borderRadius: 7,
    borderTopLeftRadius: 7,
    borderBottomLeftRadius: 7,
    position: 'absolute',
    zIndex: 0,
  },
})

const PollItem = ({
  text,
  style,
  onPress,
  showVotes,
  voteNumber,
  selectedOption,
  widthOffset,
}) => {
  return (
    <TouchableOpacity style={[styles.container, style]} onPress={onPress}>
      <View
        style={[
          styles.percentage,
          {
            backgroundColor: showVotes
              ? selectedOption
                ? '#A9ABF2'
                : Colors.grayLight
              : 'transparent',
            width:
              voteNumber === 0
                ? 0
                : ((Dimensions.Width - widthOffset) / 100) * voteNumber,
          },
        ]}
      />
      <AppText
        color={Colors.purpleText}
        style={{ position: 'absolute', marginLeft: 10, width: '80%' }}
        numberOfLines={5}>
        {text}
      </AppText>
      {showVotes && (
        <View
          style={{
            position: 'absolute',
            height: '100%',
            justifyContent: 'center',
            right: 10,
          }}>
          <AppText color={Colors.purpleText} fontSize={FontSize.normal}>
            {voteNumber}%
          </AppText>
        </View>
      )}
    </TouchableOpacity>
  )
}

export default PollItem

PollItem.propTypes = {
  text: PropTypes.string,
  onPress: PropTypes.func,
  showVotes: PropTypes.bool,
  style: PropTypes.object,
  voteNumber: PropTypes.number,
  selectedOption: PropTypes.bool,
  widthOffset: PropTypes.number,
}
