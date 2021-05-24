import React, { useState, useEffect } from 'react'
import {
  View,
  StyleSheet,
  ScrollView,
  Dimensions,
  TouchableOpacity,
  Image,
} from 'react-native'
import { AppInput, AppText, Layout, Avatar, AppIcon } from 'components'
import { Colors, FontSize, Screens } from 'constants'
import Images from 'assets/images'
import { useDispatch, useSelector } from 'react-redux'
import { updateName, logout } from 'features/auth/authSlice'
import * as NavigationService from 'services/navigation'
import { launchImageLibrary } from 'react-native-image-picker'

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
    flexDirection: 'row',
    paddingHorizontal: 40,
    paddingBottom: 30,
  },
  avatarContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.background,
    width: 80,
    height: 80,
    borderRadius: 40,
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
    height: 30,
    fontSize: 16,
    flex: 1,
    textAlign: 'center',
  },
})

const Account = () => {
  const dispatch = useDispatch()
  const user = useSelector((state) => state.auth.user)

  const [editName, setEditName] = useState(false)
  const [name, setName] = useState('')
  const [selectedProfilePicture, setSelectedProfilePicture] = useState(null)

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
      case 'engaged':
        return 'My Engaged Posts'
      case 'logout':
        return 'Logout'
      case 'report':
        return 'Report'
    }
  }

  const getItemIcon = (type) => {
    switch (type) {
      case 'points':
        return Images.folderFilled
      case 'contacts':
        return Images.groupFilled
      case 'posts':
      case 'engaged':
        return Images.graphFilled
      case 'logout':
        return Images.logout
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
          {type === 'report' ? (
            <AppIcon name="flag" size={24} color={Colors.purple} />
          ) : (
            <Avatar source={getItemIcon(type)} size={24} />
          )}
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
      dispatch(updateName({ name, image: selectedProfilePicture }))
      setEditName(false)
    } else setEditName(true)
  }

  const pickProfileImage = () => {
    launchImageLibrary(
      {
        mediaType: 'photo',
        quality: 0.1,
      },
      (response) => {
        if (response.didCancel) return
        if (response.errorCode) return
        setSelectedProfilePicture(response.uri)
      },
    )
  }

  return (
    <>
      <View style={styles.header}>
        <View style={styles.avatarContainer}>
          <TouchableOpacity onPress={pickProfileImage} disabled={!editName}>
            <Image
              style={{
                width: user.profilePicture || editName ? 80 : 40,
                height: user.profilePicture || editName ? 80 : 40,
                resizeMode: 'cover',
                borderRadius: 40,
              }}
              source={
                user.profilePicture
                  ? { uri: user.profilePicture }
                  : editName
                  ? { uri: selectedProfilePicture }
                  : Images.profileGray
              }
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={{ position: 'absolute', top: 60, right: 0 }}
            onPress={editOnPress}>
            <Avatar source={Images.edit} size={32} />
          </TouchableOpacity>
        </View>
        <View style={{ flex: 1, paddingHorizontal: 30 }}>
          {!editName ? (
            <AppText
              fontSize={FontSize.xLarge}
              weight="medium"
              style={{
                color: 'white',
                marginTop: 15,
                textAlign: 'center',
                height: 30,
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
            fontSize={FontSize.medium}
            style={{
              color: '#dcdcdc',
              marginBottom: 15,
              textAlign: 'center',
              marginHorizontal: 10,
            }}>
            You can always switch anonymous mode
          </AppText>
        </View>
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
            {renderItem('engaged', () =>
              NavigationService.navigate(Screens.MyEngaged),
            )}
            <View
              style={{ height: 1, backgroundColor: Colors.backgroundDarker }}
            />
            {renderItem('report', () =>
              NavigationService.navigate(Screens.Report),
            )}
            {renderItem('logout', () => dispatch(logout()))}
          </ScrollView>
        </View>
      </Layout>
    </>
  )
}

export default Account
