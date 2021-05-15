import React, { useState, useEffect } from 'react'
import {
  View,
  StyleSheet,
  ScrollView,
  Dimensions,
  TouchableOpacity,
} from 'react-native'
import { AppInput, AppText, Layout, Avatar, AppIcon } from 'components'
import { Colors, FontSize, Screens } from 'constants'
import Images from 'assets/images'
import { useDispatch, useSelector } from 'react-redux'
import { updateName, logout } from 'features/auth/authSlice'
import * as NavigationService from 'services/navigation'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingBottom: 30,
  },
  infoContainer: {
    paddingHorizontal: 20,
  },
  header: {
    backgroundColor: Colors.purple,
    alignItems: 'center',
    width: Dimensions.Width,
    paddingTop: 50,
  },
  avatarContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.background,
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  pointsContainer: {
    backgroundColor: Colors.purpleLight,
    marginHorizontal: 30,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
    borderRadius: 10,
    marginBottom: 10,
  },
  itemContainer: {
    flexDirection: 'row',
    padding: 10,
    alignItems: 'center',
  },
  itemIconContainer: {
    padding: 15,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemTextContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 20,
    justifyContent: 'space-between',
    flex: 1,
  },
  nameInput: {
    padding: 0,
    marginTop: 5,
    textDecorationLine: 'underline',
  },
})

const Account = () => {
  const dispatch = useDispatch()
  const user = useSelector((state) => state.auth.user)

  const [editName, setEditName] = useState(false)
  const [name, setName] = useState('')

  useEffect(() => {
    setName(user?.name ? user.name : '')
  }, [user, dispatch])

  const getItemText = (type) => {
    switch (type) {
      case 'points':
        return 'Points per Answer'
      case 'contacts':
        return 'My Contacts'
      case 'posts':
        return 'My Posts'
      case 'logout':
        return 'Logout'
    }
  }

  const getItemIcon = (type) => {
    switch (type) {
      case 'points':
        return Images.folderFilled
      case 'contacts':
        return Images.groupFilled
      case 'posts':
        return Images.graphFilled
      case 'logout':
        return Images.logout
    }
  }

  const renderItem = (type, onPress) => {
    return (
      <TouchableOpacity style={styles.itemContainer} onPress={onPress}>
        <View
          style={[
            styles.itemIconContainer,
            { backgroundColor: type === 'logout' ? '#FFEAEA' : 'white' },
          ]}>
          <Avatar source={getItemIcon(type)} size={24} />
        </View>
        <View style={styles.itemTextContainer}>
          <AppText
            fontSize={FontSize.large}
            style={{ color: Colors.purpleText }}
            weight="medium">
            {getItemText(type)}
          </AppText>
          <AppIcon name="chevron-right" size={24} color={Colors.purple} />
        </View>
      </TouchableOpacity>
    )
  }

  const editOnPress = () => {
    if (editName) {
      dispatch(updateName({ name }))
      setEditName(false)
    } else setEditName(true)
  }

  return (
    <>
      <View style={styles.header}>
        <View style={styles.avatarContainer}>
          <Avatar source={Images.profileGray} size={48} />
          <TouchableOpacity
            style={{ position: 'absolute', top: 75, right: 5 }}
            onPress={editOnPress}>
            <Avatar source={Images.edit} size={32} />
          </TouchableOpacity>
        </View>
        {!editName ? (
          <AppText
            fontSize={FontSize.xxLarge}
            weight="medium"
            style={{
              color: 'white',
              marginTop: 15,
              marginBottom: 5,
            }}>
            {user.name}
          </AppText>
        ) : (
          <AppInput
            style={styles.nameInput}
            placeholder={name}
            placeholderTextColor="white"
            value={name}
            onChange={(value) => setName(value)}
          />
        )}
        <AppText
          fontSize={FontSize.large}
          style={{
            color: '#dcdcdc',
            marginBottom: 15,
            marginHorizontal: 100,
            textAlign: 'center',
          }}>
          You can always switch anonymous mode
        </AppText>
      </View>
      <Layout>
        <View style={styles.container}>
          <ScrollView contentContainerStyle={styles.infoContainer}>
            <View style={styles.pointsContainer}>
              <AppText
                fontSize={FontSize.large}
                style={{ color: Colors.purple }}
                weight="medium">
                {`${user.points} Points`}
              </AppText>
            </View>
            {renderItem('points', () =>
              NavigationService.navigate(Screens.PointsInput),
            )}
            {renderItem('contacts', () =>
              NavigationService.navigate(Screens.FollowContacts),
            )}
            {renderItem('posts', () =>
              NavigationService.navigate(Screens.MyPosts),
            )}
            <View
              style={{ height: 1, backgroundColor: Colors.backgroundDarker }}
            />
            {renderItem('logout', () => dispatch(logout()))}
          </ScrollView>
        </View>
      </Layout>
    </>
  )
}

export default Account
