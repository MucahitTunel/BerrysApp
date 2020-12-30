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
      padding: 4,
      backgroundColor: background,
      alignSelf: 'flex-start',
      textAlign: 'center',
      textAlignVertical: 'center',
      paddingHorizontal: 4,
      borderRadius: 4,
      overflow: 'hidden',
    }}
    color={color}>
    {text}
  </AppText>
)

export default AppBadge
