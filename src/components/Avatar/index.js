import React from 'react'
import PropTypes from 'prop-types'
import { View } from 'react-native'
import Images from 'assets/images'
import AppImage from '../AppImage'

const Avatar = ({ source, size }) => (
  <View
    style={{
      width: size,
      height: size,
      borderRadius: size / 2,
      overflow: 'hidden',
    }}>
    <AppImage source={source} resizeMode="cover" width={size} height={size} />
  </View>
)

export default Avatar

Avatar.propTypes = {
  source: PropTypes.number,
  size: PropTypes.number,
}

// Default values for props
Avatar.defaultProps = {
  source: Images.defaultAvatar,
  size: PropTypes.number,
}
