import React from 'react'
import PropTypes from 'prop-types'
import { Text } from 'react-native'
import Constants from 'constants'
import Fonts from 'assets/fonts'

const AppText = ({ text, color, fontSize, fontFamily, style }) => (
  <Text style={[{ color, fontSize, fontFamily }, style]}>{text}</Text>
)

export default AppText

AppText.propTypes = {
  text: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  color: PropTypes.string,
  fontSize: PropTypes.number,
  fontFamily: PropTypes.string,
  style: PropTypes.oneOfType([
    PropTypes.objectOf(PropTypes.any),
    PropTypes.arrayOf(PropTypes.object),
  ]),
}

AppText.defaultProps = {
  text: '',
  color: Constants.Colors.text,
  fontSize: Constants.Styles.FontSize.normal,
  fontFamily: Fonts.latoRegular,
  style: {},
}
