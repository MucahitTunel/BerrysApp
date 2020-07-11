import React from 'react'
import PropTypes from 'prop-types'
import Constants from 'constants'
import { createIconSetFromIcoMoon } from 'react-native-vector-icons'
import icoMoonConfig from 'assets/fonts/selection.json'

const Icon = createIconSetFromIcoMoon(icoMoonConfig)

const AppIcon = ({ name, color, size }) => (
  <Icon name={name} color={color} size={size} />
)

AppIcon.propTypes = {
  name: PropTypes.string.isRequired,
  color: PropTypes.string,
  size: PropTypes.number,
}

AppIcon.defaultProps = {
  color: Constants.Colors.grayLight,
  size: 24,
}

export default AppIcon
