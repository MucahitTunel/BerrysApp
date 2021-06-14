import React from 'react'
import { StyleSheet, View } from 'react-native'
import PropTypes from 'prop-types'
import LinearGradient from 'react-native-linear-gradient'
import { FontSize, Colors } from 'constants'
import Fonts from 'assets/fonts'
import { useSelector } from 'react-redux'
import AppText from '../AppText'
import AppIcon from '../AppIcon'

const styles = StyleSheet.create({
  header: {
    backgroundColor: 'white',
    paddingVertical: 20,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 50,
    justifyContent: 'center',
    borderBottomWidth: 1,
    borderBottomColor: Colors.grayLight,
    marginHorizontal: 20,
  },
  headerText: {
    fontSize: FontSize.xLarge,
    fontFamily: Fonts.euclidCircularAMedium,
    color: 'black',
    textAlign: 'center',
    // width: 250,
  },
})

const SimpleHeader = ({ title }) => {
  const user = useSelector((state) => state.auth.user)
  return (
    <View style={[styles.header]}>
      {/* <View style={{ position: 'absolute', left: 0, top:53}}>
        <AppIcon
          name="close"
          size={16}
          color="black"
        />
        </View> */}
      <AppText style={styles.headerText} numberOfLines={2}>
        {title}
      </AppText>
    </View>
  )
}

export default SimpleHeader

SimpleHeader.propTypes = {
  title: PropTypes.string,
}

SimpleHeader.defaultProps = {
  title: '',
}
