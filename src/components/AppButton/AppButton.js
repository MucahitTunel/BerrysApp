import React from 'react'
import PropTypes from 'prop-types'
import {
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native'
import Constants from 'constants'
import Fonts from 'assets/fonts'

const styles = StyleSheet.create({
  btn: {
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnText: {
    fontFamily: Fonts.latoBold,
    fontSize: Constants.Styles.FontSize.normal,
  },
})

const AppButton = ({
  text,
  color,
  backgroundColor,
  borderRadius,
  isLoading,
  onPress,
  error,
  ...rest
}) => (
  <TouchableOpacity
    style={[styles.btn, { backgroundColor, borderRadius }]}
    onPress={!isLoading && !error && onPress}
    activeOpacity={isLoading || error ? 1 : 0.7}
    {...rest}>
    {isLoading ? (
      <ActivityIndicator />
    ) : (
      <Text style={[styles.btnText, { color }]}>{text}</Text>
    )}
  </TouchableOpacity>
)

export default AppButton

AppButton.propTypes = {
  text: PropTypes.string,
  color: PropTypes.string,
  backgroundColor: PropTypes.string,
  borderRadius: PropTypes.number,
  isLoading: PropTypes.bool,
  onPress: PropTypes.func.isRequired,
  error: PropTypes.string,
}

AppButton.defaultProps = {
  text: 'AppButton',
  color: Constants.Colors.primary,
  backgroundColor: Constants.Colors.WHITE,
  borderRadius: Constants.Styles.BorderRadius.default,
  isLoading: false,
  error: '',
}
