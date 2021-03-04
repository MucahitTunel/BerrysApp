import React from 'react'
import { Image, View, StyleSheet, TouchableOpacity } from 'react-native'
import PropTypes from 'prop-types'
import { Dimensions, Colors } from 'constants'

import AppIcon from '../AppIcon'
import AppText from '../AppText'

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.grayLight,
    height: Dimensions.Height / 2,
    width: Dimensions.Width / 2.3,
  },
  image: {
    resizeMode: 'cover',
    height: Dimensions.Height / 2,
    width: Dimensions.Width / 2.3,
  },
  addContainer: {
    height: 40,
    width: 40,
    borderRadius: 100,
    backgroundColor: Colors.primaryDimmed,
    position: 'absolute',
    left: Dimensions.Width / 6,
    top: Dimensions.Height / 4.7,
    justifyContent: 'center',
    alignItems: 'center',
  },
  selected: {
    height: 55,
    width: Dimensions.Width / 2.3,
    position: 'absolute',
    top: Dimensions.Height / 2.35,
    justifyContent: 'center',
    alignItems: 'center',
  },
})

const CompareItem = ({
  image,
  onPress,
  selected,
  voteNumber,
  isVoted,
  isResult,
}) => {
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      disabled={selected || isVoted}>
      <Image source={{ uri: image }} style={styles.image} />
      {!image && (
        <View style={styles.addContainer}>
          <AppIcon name="plus" size={26} color={Colors.primary} />
        </View>
      )}
      {isResult && (
        <View
          style={[
            styles.selected,
            { backgroundColor: selected ? Colors.primary : Colors.gray },
          ]}>
          <AppText color="white">{isVoted ? voteNumber + '%' : ''}</AppText>
        </View>
      )}
    </TouchableOpacity>
  )
}

CompareItem.propTypes = {
  image: PropTypes.string,
  onPress: PropTypes.func,
  selected: PropTypes.bool,
  voteNumber: PropTypes.number,
  isVoted: PropTypes.bool,
  isResult: PropTypes.bool,
}

export default CompareItem
