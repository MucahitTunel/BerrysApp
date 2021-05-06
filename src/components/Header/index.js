import React from 'react'
import { StyleSheet, View } from 'react-native'
import PropTypes from 'prop-types'
import LinearGradient from 'react-native-linear-gradient'
import { FontSize, Colors } from 'constants'
import Fonts from 'assets/fonts'
import { useSelector } from 'react-redux'
import AppText from '../AppText'

const linearGradient = [Colors.purple, Colors.purple]

const styles = StyleSheet.create({
  header: {
    // height: 94,
    paddingVertical: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 50,
  },
  headerText: {
    fontSize: FontSize.xLarge,
    fontFamily: Fonts.euclidCircularAMedium,
    color: Colors.white,
  },
})

const Header = ({ title, headerRight, headerLeft }) => {
  const user = useSelector((state) => state.auth.user)
  const points = user && !!user.points ? user.points : 0
  const titleText = title === 'points' ? `${points} Points` : title
  return (
    <LinearGradient
      style={[styles.header]}
      colors={linearGradient}
      start={{ x: 0.25, y: 0.5 }}
      end={{ x: 0.75, y: 0.5 }}>
      <View style={{ flex: 1 }}>{headerLeft}</View>
      <AppText style={styles.headerText}>{titleText}</AppText>
      <View style={{ flex: 1, alignItems: 'flex-end' }}>{headerRight}</View>
    </LinearGradient>
  )
}

export default Header

Header.propTypes = {
  headerRight: PropTypes.node,
  headerLeft: PropTypes.node.isRequired,
  title: PropTypes.string,
}

Header.defaultProps = {
  headerRight: <View />,
  headerLeft: <View />,
  title: '',
}
