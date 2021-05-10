import React from 'react'
import Share from 'react-native-share'
import { Alert, StyleSheet, View, SafeAreaView } from 'react-native'
import Clipboard from '@react-native-community/clipboard'
import { useSelector } from 'react-redux'
import { AppIcon, AppText, Layout } from 'components'
import { Dimensions, Colors, FontSize, Screens } from 'constants'
import ScaleTouchable from '../../components/ScaleTouchable'
import * as NavigationService from 'services/navigation'

const styles = StyleSheet.create({
  container: {
    height: Dimensions.Height,
    width: Dimensions.Width,
    backgroundColor: 'transparent',
    flex: 1,
  },
  item: {
    padding: 16,
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
    backgroundColor: Colors.purpleLight,
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
      const title = `Feel free to ask me anonymously any questions you have`
      const result = await Share.open({
        title,
        url,
        activityItemSources: [
          {
            // For sharing url with custom title.
            placeholderItem: { type: 'url', content: url },
            item: {
              default: { type: 'url', content: url },
            },
            subject: {
              default: title,
            },
            linkMetadata: { originalUrl: url, url, title },
          },
        ],
      })
    } catch (error) {
      Alert.alert('Error', error.message)
    }
  }

  const selectContactsToAskMe = () => {
    NavigationService.navigate(Screens.ContactsToAskMe)
  }

  return (
    <Layout>
      <SafeAreaView style={styles.container}>
        <View
          style={{
            backgroundColor: Colors.background,
            paddingHorizontal: 16,
            paddingTop: 20,
            paddingBottom: 10,
          }}>
          <AppText weight="medium" fontSize={FontSize.xLarge}>
            Invite People to Ask me their Questions
          </AppText>
        </View>
        <ScaleTouchable style={styles.item} onPress={selectContactsToAskMe}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <View style={styles.itemIcon}>
              <AppIcon name="profile" color={Colors.purple} size={20} />
            </View>
            <View>
              <AppText fontSize={FontSize.normal} weight="medium">
                SELECT CONTACTS
              </AppText>
            </View>
          </View>
          <AppIcon name="chevron-right" size={20} color={Colors.purple} />
        </ScaleTouchable>
        <ScaleTouchable style={styles.item} onPress={onPressShare}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <View style={styles.itemIcon}>
              <AppIcon name="share-message" color={Colors.purple} size={20} />
            </View>
            <View>
              <AppText fontSize={FontSize.normal} weight="medium">
                SHARE
              </AppText>
            </View>
          </View>
          <AppIcon name="chevron-right" size={20} color={Colors.purple} />
        </ScaleTouchable>
        <ScaleTouchable style={styles.item} onPress={onPressCopyURL}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              maxWidth: '70%',
            }}>
            <View style={styles.itemIcon}>
              <AppIcon name="share" color={Colors.purple} size={20} />
            </View>
            <View>
              <AppText fontSize={FontSize.normal} weight="medium">
                COPY & SHARE LINK
              </AppText>
              <AppText fontSize={FontSize.normal} color={Colors.gray}>
                {url}
              </AppText>
            </View>
          </View>
          <AppIcon name="copy" size={20} color={Colors.purple} />
        </ScaleTouchable>
      </SafeAreaView>
    </Layout>
  )
}

export default AskMe
