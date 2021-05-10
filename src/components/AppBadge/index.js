import React from 'react'
import { Colors } from 'constants'
import AppText from '../AppText'
import PropTypes from 'prop-types'

const AppBadge = ({
  text,
  background = Colors.purple,
  color = Colors.white,
}) => (
  <AppText
    style={{
      padding: 2,
      paddingHorizontal: 5,
      backgroundColor: background,
      alignSelf: 'flex-start',
      textAlign: 'center',
      textAlignVertical: 'center',
      borderRadius: 4,
      overflow: 'hidden',
      fontSize: 14,
    }}
    color={color}>
    {text}
  </AppText>
)

AppBadge.propTypes = {
  text: PropTypes.string,
  background: PropTypes.string,
  color: PropTypes.string,
}

export default AppBadge
