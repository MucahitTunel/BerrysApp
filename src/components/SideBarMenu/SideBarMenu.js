import React from 'react'
import PropTypes from 'prop-types'
import { StyleSheet, View, TouchableOpacity } from 'react-native'
import { AppText, Avatar, AppLink } from 'components'
import Constants from 'constants'
import Images from 'assets/images'
import Fonts from 'assets/fonts'
import { useDispatch } from 'react-redux'
import { logout } from 'features/auth/authSlice'

const styles = StyleSheet.create({
  infoView: {
    alignItems: 'center',
    paddingVertical: 24,
    backgroundColor: Constants.Colors.primary,
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
    borderColor: Constants.Colors.white,
  },
  menuItemActive: {
    borderColor: Constants.Colors.primary,
  },
})

const SideBarMenu = ({ activeItemKey, navigation }) => {
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
          color={Constants.Colors.white}
          fontSize={Constants.Styles.FontSize.large}
          fontFamily={Fonts.latoBold}
          style={{ marginTop: 10 }}
        />
      </View>
      <View style={styles.menuView}>
        <View>
          <TouchableOpacity
            style={[
              styles.menuItem,
              activeItemKey === Constants.Screens.MainStack &&
                styles.menuItemActive,
            ]}
            onPress={() => navigateToScreen(Constants.Screens.MainStack)}>
            <AppText
              text="Main"
              fontSize={Constants.Styles.FontSize.large}
              color={
                activeItemKey === Constants.Screens.MainStack
                  ? Constants.Colors.primary
                  : Constants.Colors.text
              }
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.menuItem,
              activeItemKey === Constants.Screens.FollowContactsStack &&
                styles.menuItemActive,
            ]}
            onPress={() =>
              navigateToScreen(Constants.Screens.FollowContactsStack)
            }>
            <AppText
              text="Unfollow contacts"
              fontSize={Constants.Styles.FontSize.large}
              color={
                activeItemKey === Constants.Screens.FollowContactsStack
                  ? Constants.Colors.primary
                  : Constants.Colors.text
              }
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.menuItem,
              activeItemKey === Constants.Screens.ReportStack &&
                styles.menuItemActive,
            ]}
            onPress={() => navigateToScreen(Constants.Screens.ReportStack)}>
            <AppText
              text="Report"
              fontSize={Constants.Styles.FontSize.large}
              color={
                activeItemKey === Constants.Screens.ReportStack
                  ? Constants.Colors.primary
                  : Constants.Colors.text
              }
            />
          </TouchableOpacity>
        </View>
        <View style={{ alignItems: 'center' }}>
          <AppLink
            text="Log out"
            color={Constants.Colors.primary}
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
  activeItemKey: PropTypes.string.isRequired,
}

export default SideBarMenu
