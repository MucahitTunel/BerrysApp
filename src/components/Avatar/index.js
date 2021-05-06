import React from 'react'
import PropTypes from 'prop-types'
import { View } from 'react-native'
import Images from 'assets/images'
import AppImage from '../AppImage'

const Avatar = ({ source, size, style, overflow = 'hidden' }) => (
  <View
    style={[
      {
        width: size,
        height: size,
        borderRadius: size / 2,
        overflow,
      },
      { ...style },
    ]}>
    <AppImage source={source} resizeMode="cover" width={size} height={size} />
  </View>
)

export default Avatar

Avatar.propTypes = {
  source: PropTypes.number,
  size: PropTypes.number,
  style: PropTypes.object,
  overflow: PropTypes.string,
}

// Default values for props
Avatar.defaultProps = {
  source: Images.defaultAvatar,
  size: PropTypes.number,
}
