import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { Dimensions, Colors, FontSize } from 'constants'

const styles = StyleSheet.create({
  container: {
    height: Dimensions.Height - 145,
    width: Dimensions.Width,
    // flex: 1,
    backgroundColor: Colors.purple,
  },
})

const Extension = () => {
  return <View style={styles.container} />
}

export default Extension
