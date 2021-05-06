import React from 'react'
import { View } from 'react-native'
import PropTypes from 'prop-types'
import { Colors } from 'constants'
import { createIconSetFromIcoMoon } from 'react-native-vector-icons'
import icoMoonConfig from 'assets/fonts/selection.json'

const Icon = createIconSetFromIcoMoon(icoMoonConfig)

const AppIcon = ({ name, color, size, style, background }) => {
  if (background)
    return (
      <View
        style={{
          height: size + 3,
          width: size + 3,
          backgroundColor: style.backgroundColor,
          borderRadius: 100,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <Icon name={name} color={color} size={size} />
      </View>
    )
  return <Icon name={name} color={color} size={size} />
}

AppIcon.propTypes = {
  name: PropTypes.string.isRequired,
  color: PropTypes.string,
  size: PropTypes.number,
  style: PropTypes.object,
  background: PropTypes.bool,
}

AppIcon.defaultProps = {
  color: Colors.grayLight,
  size: 24,
}

export default AppIcon
