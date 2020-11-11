import React from 'react'
import PropTypes from 'prop-types'
import { Text as RNText } from 'react-native'
import { Styles } from 'constants'
import Fonts from 'assets/fonts'

const FONT_WEIGHT = {
  italic: Fonts.euclidCircularAItalic,
  regular: Fonts.euclidCircularARegular,
  medium: Fonts.euclidCircularAMedium,
  bold: Fonts.euclidCircularASemiBold,
}

const AppText = ({ color, fontSize, weight, children, style, ...props }) => (
  <RNText
    style={[{ color, fontSize, fontFamily: FONT_WEIGHT[weight] }, style]}
    {...props}>
    {children}
  </RNText>
)

export default AppText

AppText.propTypes = {
  color: PropTypes.string,
  fontSize: PropTypes.number,
  weight: PropTypes.string,
  style: PropTypes.oneOfType([
    PropTypes.objectOf(PropTypes.any),
    PropTypes.arrayOf(PropTypes.any),
  ]),
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]).isRequired,
}

AppText.defaultProps = {
  fontSize: Styles.FontSize.large,
  weight: 'regular',
  style: {},
}
