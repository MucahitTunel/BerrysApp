import React from 'react'
import PropTypes from 'prop-types'
import { StyleSheet, ActivityIndicator } from 'react-native'
import { Colors, FontSize } from 'constants'
import Fonts from 'assets/fonts'
import AppIcon from '../AppIcon'
import AppText from '../AppText'
import ScaleTouchable from '../ScaleTouchable'
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
    fontSize: FontSize.xLarge,
    color: Colors.white,
  },
  btnSecondary: {
    height: 50,
    borderRadius: 25,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnIcon: {
    width: 54,
    height: 54,
    borderRadius: 27,
  },
  btnDisabled: {
    shadowOpacity: 0,
    backgroundColor: Colors.grayLight,
  },
})

const AppButton = ({
  text,
  textStyle,
  icon,
  iconSize,
  iconColor,
  onPress,
  disabled,
  style,
  isLoading,
  shadow = true,
}) => {
  let btnIcon = styles.btnIcon
  let btnSecondary = styles.btnSecondary
  if (shadow) {
    btnIcon = { ...btnIcon, ...Theme.shadow }
    btnSecondary = {
      ...btnSecondary,
      ...Theme.shadow,
      shadowColor: 'rgba(235, 86, 81, 0.3)',
    }
  }
  const s = [
    styles.btn,
    icon && styles.btnSecondary,
    icon && !text && btnIcon,
    disabled && styles.btnDisabled,
    style,
  ]

  return (
    <ScaleTouchable disabled={disabled} onPress={onPress} style={s}>
      {isLoading ? <ActivityIndicator /> : null}
      {!isLoading && icon ? (
        <AppIcon
          name={icon}
          color={iconColor ? iconColor : Colors.white}
          size={iconSize}
        />
      ) : null}
      {!isLoading && text ? (
        <AppText style={[styles.btnText, textStyle]}>{text}</AppText>
      ) : null}
    </ScaleTouchable>
  )
}

export default AppButton

AppButton.propTypes = {
  onPress: PropTypes.func.isRequired,
  icon: PropTypes.string,
  iconSize: PropTypes.number,
  iconColor: PropTypes.string,
  text: PropTypes.string,
  color: PropTypes.string,
  error: PropTypes.string,
  style: PropTypes.oneOfType([
    PropTypes.objectOf(PropTypes.any),
    PropTypes.arrayOf(PropTypes.any),
  ]),
  textStyle: PropTypes.oneOfType([
    PropTypes.objectOf(PropTypes.any),
    PropTypes.arrayOf(PropTypes.any),
  ]),
  disabled: PropTypes.bool,
  isLoading: PropTypes.bool,
  shadow: PropTypes.bool,
}

AppButton.defaultProps = {
  disabled: false,
  isLoading: false,
}
