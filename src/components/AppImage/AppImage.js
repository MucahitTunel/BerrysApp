import React from 'react'
import PropTypes from 'prop-types'
import { Image } from 'react-native'

const AppImage = ({ source, width, height, resizeMode }) => (
  <Image style={{ width, height }} source={source} resizeMode={resizeMode} />
)

export default AppImage

AppImage.propTypes = {
  source: PropTypes.number.isRequired,
  width: PropTypes.number,
  height: PropTypes.number,
  resizeMode: PropTypes.string,
}

AppImage.defaultProps = {
  width: 24,
  height: 24,
  resizeMode: 'contain',
}
