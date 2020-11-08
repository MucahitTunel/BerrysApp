import React from 'react'
import PropTypes from 'prop-types'
import { StyleSheet } from 'react-native'
import { Colors, Styles } from 'constants'
import Fonts from 'assets/fonts'
import { ScaleTouchable } from 'components'
import AppIcon from '../AppIcon'
import AppText from '../AppText'
import Theme from 'theme'

const styles = StyleSheet.create({
  btn: {
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 6,
    backgroundColor: Colors.primary,
  },
  btnText: {
    fontFamily: Fonts.euclidCircularAMedium,
    fontSize: Styles.FontSize.xLarge,
    color: Colors.white,
  },
  btnSecondary: {
    width: 50,
    borderRadius: 25,
    ...Theme.shadow,
  },
  btnIcon: {
    width: 54,
    height: 54,
    borderRadius: 27,
    ...Theme.shadow,
  },
})

const AppButton = ({ text, textStyle, icon, onPress, style, disabled }) => (
  <ScaleTouchable
    disabled={disabled}
    onPress={onPress}
    style={[
      styles.btn,
      icon && styles.btnSecondary,
      icon && !text && styles.btnIcon,
      style,
    ]}>
    {icon ? <AppIcon name={icon} color={Colors.white} /> : null}
    {text ? <AppText text={text} style={[styles.btnText, textStyle]} /> : null}
  </ScaleTouchable>
)

export default AppButton

AppButton.propTypes = {
  onPress: PropTypes.func.isRequired,
  icon: PropTypes.string,
  text: PropTypes.string,
  color: PropTypes.string,
  error: PropTypes.string,
  style: PropTypes.objectOf(PropTypes.any),
  textStyle: PropTypes.objectOf(PropTypes.any),
  disabled: PropTypes.bool,
}

AppButton.defaultProps = {
  disabled: false,
}
