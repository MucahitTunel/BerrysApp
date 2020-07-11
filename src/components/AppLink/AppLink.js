import React from 'react'
import PropTypes from 'prop-types'
import { Text, TouchableOpacity } from 'react-native'
import Constants from 'constants'
import Fonts from 'assets/fonts'

const AppLink = ({ text, color, fontSize, style, fontFamily, onPress }) => (
  <TouchableOpacity onPress={onPress} style={style}>
    <Text style={{ color, fontSize, fontFamily }}>{text}</Text>
  </TouchableOpacity>
)

export default AppLink

AppLink.propTypes = {
  text: PropTypes.string,
  color: PropTypes.string,
  fontFamily: PropTypes.string,
  fontSize: PropTypes.number,
  onPress: PropTypes.func,
  style: PropTypes.objectOf(PropTypes.any),
}

// Default values for props
AppLink.defaultProps = {
  text: 'AppLink',
  color: Constants.Colors.text,
  fontFamily: Fonts.latoBold,
  fontSize: Constants.Styles.FontSize.normal,
  onPress: () => {},
  style: {},
}
