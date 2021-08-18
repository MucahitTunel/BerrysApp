import React from 'react'
import { View, StyleSheet, SafeAreaView, Image, ScrollView } from 'react-native'
import { Layout, AppText, AppButton, Avatar } from 'components'
import { Dimensions, Colors, FontSize, Screens } from 'constants'
import { useSelector, useDispatch } from 'react-redux'
import Images from 'assets/images'
import * as NavigationService from 'services/navigation'
import { setOnboarding } from 'features/auth/authSlice'

import RNUxcam from 'react-native-ux-cam'
RNUxcam.tagScreenName('Ask Common Accounts')

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: Dimensions.Height,
    width: Dimensions.Width,
    backgroundColor: 'transparent',
  },
  header: {
    backgroundColor: Colors.purple,
    paddingVertical: 20,
    paddingTop: 50,
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 20,
  },
  pictureContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#DFE4F4',
    borderWidth: 1,
    borderColor: Colors.purple,
    height: 50,
    width: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  askItemPictureContainer: {
    height: 45,
    width: 45,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#DFE4F4',
    borderRadius: 100,
    marginRight: 10,
  },
  askItemContainer: {
    backgroundColor: 'white',
    marginHorizontal: 20,
    padding: 20,
    borderRadius: 25,
    marginBottom: 10,
  },
  askItemHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
})

const CommonAccounts = () => {
  const dispatch = useDispatch()
  const appUserCount = useSelector((state) => state.contacts.appUserCount)
  const commonData = useSelector((state) => state.contacts.commonAccountCounts)

  const renderInAppContacts = () => {
    return (
      <>
        <View style={styles.pictureContainer}>
          <Image
            source={Images.newProfile}
            style={{
              width: 30,
              height: 30,
              resizeMode: 'contain',
              borderRadius: 15,
            }}
          />
        </View>
        <AppText color="#EB5757">{appUserCount + ' '}</AppText>
        <AppText color="white">
          of your contacts {appUserCount === 1 ? 'is' : 'are'} using Berry
        </AppText>
      </>
    )
  }

  const renderAskItem = ({ name, count, description, onPress }) => {
    return (
      <View style={styles.askItemContainer}>
        <View style={styles.askItemHeader}>
          <View style={styles.askItemPictureContainer}>
            <Avatar size={22} source={Images.profileWhite} />
          </View>
          <View>
            <AppText color={Colors.purpleText}>{name}</AppText>
            <AppText color="#b9b9b9">{count} Users</AppText>
          </View>
        </View>
        <AppText
          color={Colors.purpleText}
          fontSize={FontSize.xLarge}
          style={{ marginVertical: 20 }}>
          {description}
        </AppText>
        <AppButton
          style={{ backgroundColor: Colors.purpleLight, borderRadius: 25 }}
          text="Ask Them"
          textStyle={{ color: Colors.purpleText, fontSize: FontSize.normal }}
          onPress={onPress}
        />
      </View>
    )
  }

  const nextOnPress = () => {
    dispatch(setOnboarding(false))
    NavigationService.navigate(Screens.Main, {
      showOnboarding: true,
    })
  }

  return (
    <>
      <View style={styles.header}>{renderInAppContacts()}</View>
      <Layout>
        <SafeAreaView style={styles.container}>
          <ScrollView style={{ flex: 1 }}>
            {commonData && (
              <>
                {commonData.likeMinded &&
                  renderAskItem({
                    isLikeMinded: true,
                    name: 'Like-Minded Users',
                    count: commonData.likeMinded,
                    description: 'These users have 3 common interests with you',
                    onPress: () => {
                      dispatch(setOnboarding(false))
                      NavigationService.navigate(
                        Screens.QuestionTypeSelection,
                        {
                          isLikeMindedSelected: true,
                          showOnboarding: true,
                        },
                      )
                    },
                  })}
                {Object.keys(commonData).map((key) => {
                  if (key !== 'likeMinded') {
                    const name = key
                      .split(' ')
                      .map((i) => i.charAt(0).toUpperCase() + i.slice(1))
                      .join(' ')
                    return renderAskItem({
                      name,
                      count: commonData[key].count,
                      description: `Ask users who are into ${name}`,
                      onPress: () => {
                        dispatch(setOnboarding(false))
                        NavigationService.navigate(
                          Screens.QuestionTypeSelection,
                          {
                            isTargetedInterest: [
                              {
                                _id: commonData[key]._id,
                                name: name.toLowerCase(),
                              },
                            ],
                            showOnboarding: true,
                          },
                        )
                      },
                    })
                  }
                })}
              </>
            )}
          </ScrollView>
          <AppButton
            text="Next"
            style={{ marginHorizontal: 30, marginBottom: 20 }}
            onPress={nextOnPress}
          />
        </SafeAreaView>
      </Layout>
    </>
  )
}

export default CommonAccounts
