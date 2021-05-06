import React from 'react'
import { View } from 'react-native'
import { Colors } from 'constants'
import PropTypes from 'prop-types'

const Layout = ({ children }) => {
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: Colors.purple,
      }}>
      <View
        style={{
          flex: 1,
          borderTopLeftRadius: 30,
          borderTopRightRadius: 30,
          backgroundColor: Colors.background,
          paddingTop: 30,
        }}>
        {children}
      </View>
    </View>
  )
}

Layout.propTypes = {
  children: PropTypes.any,
}

export default Layout
