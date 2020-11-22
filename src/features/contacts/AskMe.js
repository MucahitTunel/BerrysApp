import React from 'react'
import { Alert, StyleSheet, View, SafeAreaView, Share } from 'react-native'
import Clipboard from '@react-native-community/clipboard'
import { useSelector } from 'react-redux'
import { AppIcon, AppText } from 'components'
import { Dimensions, Colors, Styles, Screens } from 'constants'
import ScaleTouchable from '../../components/ScaleTouchable'
import * as NavigationService from 'services/navigation'

const styles = StyleSheet.create({
  container: {
    height: Dimensions.Height,
    width: Dimensions.Width,
    backgroundColor: Colors.white,
    flex: 1,
  },
  item: {
    padding: 16,
    backgroundColor: Colors.white,
    borderBottomWidth: 4,
    borderColor: Colors.background,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  itemIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(251, 222, 221, .4)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
})

const AskMe = () => {
  const user = useSelector((state) => state.auth.user)
  const url = `https://api.berrysapp.com/app/chat/${user._id}`
  const onPressCopyURL = () => {
    Clipboard.setString(url)
    Alert.alert('Success', 'The URL has been copied to clipboard')
  }
  const onPressShare = async () => {
    try {
      const result = await Share.share({
        url,
      })
      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // shared with activity type of result.activityType
        } else {
          // shared
        }
      } else if (result.action === Share.dismissedAction) {
        // dismissed
      }
    } catch (error) {
      Alert.alert('Error', error.message)
    }
  }

  const selectContactsToAskMe = () => {
    NavigationService.navigate(Screens.ContactsToAskMe)
  }

  return (
    <SafeAreaView style={styles.container}>
      <View
        style={{
          backgroundColor: Colors.background,
          paddingHorizontal: 16,
          paddingTop: 20,
          paddingBottom: 10,
        }}>
        <AppText weight="medium" fontSize={Styles.FontSize.xLarge}>
          Invite People to Ask me their Questions
        </AppText>
      </View>
      <ScaleTouchable style={styles.item} onPress={selectContactsToAskMe}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <View style={styles.itemIcon}>
            <AppIcon name="profile" color={Colors.primary} size={20} />
          </View>
          <View>
            <AppText fontSize={Styles.FontSize.normal} weight="medium">
              SELECT CONTACTS
            </AppText>
          </View>
        </View>
        <AppIcon name="chevron-right" size={20} color={Colors.primary} />
      </ScaleTouchable>
      <ScaleTouchable style={styles.item} onPress={onPressCopyURL}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            maxWidth: '70%',
          }}>
          <View style={styles.itemIcon}>
            <AppIcon name="share" color={Colors.primary} size={20} />
          </View>
          <View>
            <AppText fontSize={Styles.FontSize.normal} weight="medium">
              COPY & SHARE LINK
            </AppText>
            <AppText fontSize={Styles.FontSize.normal} color={Colors.gray}>
              {`https://api.berrysapp.com/app/chat/${user._id}`}
            </AppText>
          </View>
        </View>
        <AppIcon name="copy" size={20} color={Colors.primary} />
      </ScaleTouchable>
      <ScaleTouchable style={styles.item} onPress={onPressShare}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <View style={styles.itemIcon}>
            <AppIcon name="share-message" color={Colors.primary} size={20} />
          </View>
          <View>
            <AppText fontSize={Styles.FontSize.normal} weight="medium">
              SHARE
            </AppText>
          </View>
        </View>
        <AppIcon name="chevron-right" size={20} color={Colors.primary} />
      </ScaleTouchable>
    </SafeAreaView>
  )
}

export default AskMe
