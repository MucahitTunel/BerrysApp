import React from 'react'
import { Image, View, StyleSheet, TouchableOpacity } from 'react-native'
import PropTypes from 'prop-types'
import { Dimensions, Colors, FontSize } from 'constants'

import AppIcon from '../AppIcon'
import AppText from '../AppText'

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    height: Dimensions.Height / 3,
    width: Dimensions.Width / 2.4,
  },
  image: {
    resizeMode: 'cover',
    height: Dimensions.Height / 3,
    width: Dimensions.Width / 2.4,
  },
  addContainer: {
    height: 45,
    width: 45,
    borderRadius: 100,
    borderWidth: 1,
    borderColor: Colors.purpleDimmed,
    position: 'absolute',
    alignSelf: 'center',
    top: '30%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  selected: {
    width: Dimensions.Width / 3.5,
    position: 'absolute',
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    bottom: '10%',
    backgroundColor: Colors.purpleLight,
    height: 40,
    paddingHorizontal: 10,
  },
})

const CompareItem = ({
  image,
  onPress,
  selected,
  voteNumber,
  isVoted,
  isResult,
  isCreator,
  style,
  imageStyle,
  left,
}) => {
  return (
    <TouchableOpacity
      style={[
        styles.container,
        {
          ...style,
          borderTopLeftRadius: left ? 25 : 0,
          borderBottomLeftRadius: left ? 25 : 0,
          borderTopRightRadius: !left ? 25 : 0,
          borderBottomRightRadius: !left ? 25 : 0,
        },
      ]}
      onPress={onPress}
      disabled={selected || isVoted}>
      <Image
        source={{ uri: image }}
        style={[
          styles.image,
          {
            ...imageStyle,
            borderTopLeftRadius: left ? 25 : 0,
            borderBottomLeftRadius: left ? 25 : 0,
            borderTopRightRadius: !left ? 25 : 0,
            borderBottomRightRadius: !left ? 25 : 0,
          },
        ]}
      />
      {!image && (
        <View style={styles.addContainer}>
          <AppIcon name="camera-outline" size={24} color={Colors.purple} />
        </View>
      )}
      {!image && (
        <View style={[styles.selected]}>
          <AppText
            color={Colors.purple}
            fontSize={FontSize.medium}
            weight="bold">
            Add Image
          </AppText>
        </View>
      )}
      {(isResult && isVoted) ||
        (isCreator && (
          <View style={[styles.selected]}>
            <AppText color={Colors.purple}>
              {isVoted || isCreator ? voteNumber + '%' : ''}
            </AppText>
          </View>
        ))}
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
  isCreator: PropTypes.bool,
  style: PropTypes.bool,
  imageStyle: PropTypes.bool,
  selectedStyle: PropTypes.bool,
  left: PropTypes.bool,
}

export default CompareItem
