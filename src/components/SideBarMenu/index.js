import React from 'react'
import PropTypes from 'prop-types'
import { StyleSheet, View, TouchableOpacity } from 'react-native'
import { AppText, Avatar, AppLink } from 'components'
import { Colors, Screens, Styles } from 'constants'
import Images from 'assets/images'
import Fonts from 'assets/fonts'
import { useDispatch } from 'react-redux'
import { logout } from 'features/auth/authSlice'

const styles = StyleSheet.create({
  infoView: {
    alignItems: 'center',
    paddingVertical: 24,
    backgroundColor: Colors.primary,
  },
  menuView: {
    justifyContent: 'space-between',
    flex: 1,
    paddingVertical: 16,
  },
  menuItem: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderLeftWidth: 4,
    borderColor: Colors.white,
  },
  menuItemActive: {
    borderColor: Colors.primary,
  },
})

const SideBarMenu = ({ navigation }) => {
  const dispatch = useDispatch()
  const onPressLogout = () => dispatch(logout())

  const navigateToScreen = (routeName) => {
    navigation.closeDrawer()
    setTimeout(() => {
      navigation.navigate(routeName)
    }, 0)
  }

  return (
    <View style={{ flex: 1 }}>
      <View style={styles.infoView}>
        <Avatar source={Images.defaultAvatar} size={60} />
        <AppText
          text="Anonymous"
          color={Colors.white}
          fontSize={Styles.FontSize.large}
          fontFamily={Fonts.latoBold}
          style={{ marginTop: 10 }}
        />
      </View>
      <View style={styles.menuView}>
        <View>
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => navigateToScreen(Screens.MainStack)}>
            <AppText
              text="Main"
              fontSize={Styles.FontSize.large}
              color={Colors.text}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => navigateToScreen(Screens.ImportGmailContactsStack)}>
            <AppText
              text="Import Gmail contacts"
              fontSize={Styles.FontSize.large}
              color={Colors.text}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => navigateToScreen(Screens.FollowContactsStack)}>
            <AppText
              text="Unfollow contacts"
              fontSize={Styles.FontSize.large}
              color={Colors.text}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => navigateToScreen(Screens.ReportStack)}>
            <AppText
              text="Report"
              fontSize={Styles.FontSize.large}
              color={Colors.text}
            />
          </TouchableOpacity>
        </View>
        <View style={{ alignItems: 'center' }}>
          <AppLink
            text="Log out"
            color={Colors.primary}
            onPress={onPressLogout}
          />
        </View>
      </View>
    </View>
  )
}

SideBarMenu.propTypes = {
  navigation: PropTypes.shape({
    closeDrawer: PropTypes.func.isRequired,
    dispatch: PropTypes.func.isRequired,
    navigate: PropTypes.func.isRequired,
  }).isRequired,
}

export default SideBarMenu
