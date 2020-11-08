import React from 'react'
import PropTypes from 'prop-types'
import { Text as RNText, StyleSheet } from 'react-native'
import { Styles } from 'constants'
import Fonts from 'assets/fonts'

const styles = StyleSheet.create({
  text: {
    lineHeight: 24,
  },
})

const AppText = ({ color, fontSize, fontFamily, children, style }) => (
  <RNText style={[styles.text, { color, fontSize, fontFamily }, style]}>
    {children}
  </RNText>
)

export default AppText

AppText.propTypes = {
  color: PropTypes.string,
  fontSize: PropTypes.number,
  fontFamily: PropTypes.string,
  style: PropTypes.oneOfType([
    PropTypes.objectOf(PropTypes.any),
    PropTypes.arrayOf(PropTypes.object),
  ]),
  children: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
    .isRequired,
}

AppText.defaultProps = {
  fontSize: Styles.FontSize.large,
  fontFamily: Fonts.euclidCircularARegular,
  style: {},
}
