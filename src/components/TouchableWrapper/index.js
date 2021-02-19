import React from 'react'
import { TouchableOpacity } from 'react-native'
import PropTypes from 'prop-types'

const TouchableWrapper = ({
  children,
  style,
  disabled,
  onPress,
  onPressItem,
}) => {
  const handleOnPress = () => {
    if (onPressItem) onPress(onPressItem)
    else onPress()
  }

  return (
    <TouchableOpacity style={style} onPress={handleOnPress} disabled={disabled}>
      {children}
    </TouchableOpacity>
  )
}

export default TouchableWrapper

TouchableWrapper.propTypes = {
  onPress: PropTypes.func,
  onPressItem: PropTypes.any,
  disabled: PropTypes.bool,
  style: PropTypes.oneOfType([
    PropTypes.objectOf(PropTypes.any),
    PropTypes.arrayOf(PropTypes.any),
  ]),
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]).isRequired,
}
