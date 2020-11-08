import React from 'react'
import { StyleSheet } from 'react-native'
import PropTypes from 'prop-types'
import { ScaleTouchable, AppText } from 'components'
import { Styles } from 'constants'
import Fonts from 'assets/fonts'

const styles = StyleSheet.create({
  text: {
    fontFamily: Fonts.euclidCircularAMedium,
    fontSize: Styles.FontSize.xLarge,
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
  text: PropTypes.string,
  color: PropTypes.string,
  onPress: PropTypes.func,
  style: PropTypes.objectOf(PropTypes.any),
  textStyle: PropTypes.objectOf(PropTypes.any),
}

// Default values for props
AppLink.defaultProps = {
  text: 'AppLink',
  onPress: () => {},
  style: {},
  textStyle: {},
}
