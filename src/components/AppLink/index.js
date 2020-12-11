import React from 'react'
import { StyleSheet } from 'react-native'
import PropTypes from 'prop-types'
import { ScaleTouchable, AppText } from 'components'
import { FontSize } from 'constants'
import Fonts from 'assets/fonts'

const styles = StyleSheet.create({
  text: {
    fontFamily: Fonts.euclidCircularAMedium,
    fontSize: FontSize.xLarge,
  },
})

const AppLink = ({ text, textStyle, color, onPress, style }) => (
  <ScaleTouchable style={style} onPress={onPress}>
    <AppText color={color} style={[styles.text, textStyle]}>
      {text}
    </AppText>
  </ScaleTouchable>
)

export default AppLink

AppLink.propTypes = {
  text: PropTypes.string.isRequired,
  color: PropTypes.string,
  style: PropTypes.oneOfType([
    PropTypes.objectOf(PropTypes.any),
    PropTypes.arrayOf(PropTypes.any),
  ]),
  textStyle: PropTypes.oneOfType([
    PropTypes.objectOf(PropTypes.any),
    PropTypes.arrayOf(PropTypes.any),
  ]),
  onPress: PropTypes.func,
}

// Default values for props
AppLink.defaultProps = {
  style: {},
  textStyle: {},
  onPress: () => {},
}
