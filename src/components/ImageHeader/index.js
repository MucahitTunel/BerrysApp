import React from 'react'
import {
  StyleSheet,
  View,
  ImageBackground,
  TouchableOpacity,
} from 'react-native'
import PropTypes from 'prop-types'
import { FontSize, Colors } from 'constants'
import Fonts from 'assets/fonts'
import AppText from '../AppText'

const styles = StyleSheet.create({
  header: {
    height: 270,
  },
  inner: {
    paddingVertical: 20,
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingHorizontal: 16,
    paddingTop: 50,
    flex: 1,
    backgroundColor: 'rgba(0,0,0, 0.30)',
  },
  headerText: {
    fontSize: FontSize.xLarge,
    fontFamily: Fonts.euclidCircularAMedium,
    color: 'white',
  },
})

const Header = ({ title, headerRight, headerLeft, image, imageOnPress }) => {
  return (
    <ImageBackground style={styles.header} source={{ uri: image }}>
      <TouchableOpacity style={styles.inner} onPress={imageOnPress}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <View style={{ flex: 1 }}>{headerLeft}</View>
          <AppText style={styles.headerText}>{title}</AppText>
          <View style={{ flex: 1, alignItems: 'flex-end' }}>{headerRight}</View>
        </View>
      </TouchableOpacity>
    </ImageBackground>
  )
}

export default Header

Header.propTypes = {
  headerRight: PropTypes.node,
  headerLeft: PropTypes.node.isRequired,
  title: PropTypes.string,
  image: PropTypes.string,
  imageOnPress: PropTypes.func,
}

Header.defaultProps = {
  headerRight: <View />,
  headerLeft: <View />,
  title: '',
}
