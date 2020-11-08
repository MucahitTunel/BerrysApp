import React from 'react'
import { StyleSheet } from 'react-native'
import PropTypes from 'prop-types'
import { ScaleTouchable } from 'components'
import { Colors, Styles } from 'constants'
import Fonts from 'assets/fonts'
import AppText from '../AppText'

const styles = StyleSheet.create({
  text: {
    fontFamily: Fonts.euclidCircularAMedium,
    fontSize: Styles.FontSize.xLarge,
  },
})

const AppLink = ({ text, color, onPress, style }) => (
  <ScaleTouchable style={style} onPress={onPress}>
    <AppText text={text} color={color} style={styles.text} />
  </ScaleTouchable>
)

export default AppLink

AppLink.propTypes = {
  text: PropTypes.string,
  color: PropTypes.string,
  onPress: PropTypes.func,
  style: PropTypes.objectOf(PropTypes.any),
}

// Default values for props
AppLink.defaultProps = {
  text: 'AppLink',
  color: Colors.text,
  onPress: () => {},
  style: {},
}
