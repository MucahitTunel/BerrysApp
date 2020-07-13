import React from 'react'
import { StyleSheet, View } from 'react-native'
import PropTypes from 'prop-types'
import LinearGradient from 'react-native-linear-gradient'
import { AppText } from 'components'
import Constants from 'constants'
import Fonts from 'assets/fonts'
import { useSelector } from 'react-redux'

const linearGradient = [Constants.Colors.primary, Constants.Colors.primaryLight]

const styles = StyleSheet.create({
  header: {
    height: 90,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  headerText: {
    fontSize: Constants.Styles.FontSize.large,
    color: Constants.Colors.white,
    fontFamily: Fonts.latoBold,
  },
})

const Header = ({ title, headerRight, headerLeft }) => {
  const user = useSelector((state) => state.auth.user)
  const points = user && !!user.points ? user.points : 0
  const titleText = title === 'points' ? `${points} points` : title
  return (
    <LinearGradient
      style={[styles.header]}
      colors={linearGradient}
      start={{ x: 0.25, y: 0.5 }}
      end={{ x: 0.75, y: 0.5 }}>
      {headerLeft}
      <AppText text={titleText} style={styles.headerText} />
      {headerRight}
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
