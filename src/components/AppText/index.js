import React from 'react'
import PropTypes from 'prop-types'
import { Text } from 'react-native'
import { Colors, Styles } from 'constants'
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
  color: Colors.text,
  fontSize: Styles.FontSize.large,
  fontFamily: Fonts.euclidCircularARegular,
  style: {},
}
