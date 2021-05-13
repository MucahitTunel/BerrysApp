import React from 'react'
import { View } from 'react-native'
import { Colors } from 'constants'
import PropTypes from 'prop-types'

const Layout = ({ children, style, innerStyle }) => {
  return (
    <View
      style={[
        {
          flex: 1,
          backgroundColor: Colors.purple,
        },
        { ...style },
      ]}>
      <View
        style={[
          {
            flex: 1,
            borderTopLeftRadius: 30,
            borderTopRightRadius: 30,
            backgroundColor: Colors.background,
            paddingTop: 30,
          },
          { ...innerStyle },
        ]}>
        {children}
      </View>
    </View>
  )
}

Layout.propTypes = {
  children: PropTypes.any,
  style: PropTypes.object,
  innerStyle: PropTypes.object,
}

export default Layout
