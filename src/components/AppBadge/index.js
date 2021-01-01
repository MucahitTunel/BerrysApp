import React from 'react'
import { Colors } from 'constants'
import AppText from '../AppText'

const AppBadge = ({
  text,
  background = Colors.primary,
  color = Colors.white,
}) => (
  <AppText
    style={{
      padding: 2,
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

export default AppBadge
