import React from 'react'
import PropTypes from 'prop-types'
import { StyleSheet, View } from 'react-native'
import { AppText, Avatar, AppLink } from 'components'
import { Colors, Screens, Styles } from 'constants'
import Images from 'assets/images'
import Fonts from 'assets/fonts'
import { useDispatch } from 'react-redux'
import { logout } from 'features/auth/authSlice'

const menu = [
  {
    name: 'Main',
    screen: Screens.MainStack,
  },
  // {
  //   name: 'Import Gmail contacts',
  //   screen: Screens.ImportGmailContactsStack,
  // },
  {
    name: 'Unfollow contacts',
    screen: Screens.FollowContactsStack,
  },
  {
    name: 'Report',
    screen: Screens.ReportStack,
  },
  {
    name: 'Group',
    screen: Screens.GroupStack,
  },
]

const styles = StyleSheet.create({
  infoView: {
    alignItems: 'center',
    paddingTop: 60,
    paddingBottom: 24,
    backgroundColor: Colors.primary,
  },
  menuView: {
    justifyContent: 'space-between',
    flex: 1,
    paddingVertical: 16,
    backgroundColor: Colors.white,
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
    <View style={{ flex: 1, paddingBottom: 20 }}>
      <View style={styles.infoView}>
        <Avatar source={Images.defaultAvatar} size={60} />
        <AppText color={Colors.white} style={{ marginTop: 10 }}>
          Anonymous
        </AppText>
      </View>
      <View style={styles.menuView}>
        <View>
          {menu.map((item) => (
            <AppLink
              key={item.name}
              text={item.name}
              textStyle={{
                fontFamily: Fonts.euclidCircularARegular,
                fontSize: Styles.FontSize.large,
              }}
              style={styles.menuItem}
              onPress={() => navigateToScreen(item.screen)}
            />
          ))}
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
