import React, { useEffect, useState } from 'react'
import {
  ScrollView,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  View,
  Image,
} from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
import * as NavigationService from 'services/navigation'
import { Colors, Dimensions, Screens, FontSize } from 'constants'
import Fonts from 'assets/fonts'
import {
  AppText,
  ScaleTouchable,
  AppButton,
  Loading,
  Layout,
  AppIcon,
  AppInput,
} from 'components'
import { getGroups, getGroup } from './groupSlice'
import Images from 'assets/images'

const styles = StyleSheet.create({
  container: {
    height: Dimensions.Height,
    width: Dimensions.Width,
    flex: 1,
    marginBottom: 30,
  },
  groupBox: {
    paddingTop: 15,
    paddingHorizontal: 10,
  },
  groupItem: {
    backgroundColor: Colors.white,
    padding: 14,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderColor: Colors.background,
    width: '45%',
    marginBottom: 10,
    borderRadius: 15,
  },
  groupItemLast: {
    borderBottomWidth: 0,
  },
  groupPictureContainer: {
    height: 70,
    width: 70,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 35,
    backgroundColor: '#DFE4F4',
    marginBottom: 15,
  },
  groupPicture: {
    height: 30,
    width: 30,
    resizeMode: 'contain',
  },
  header: {
    backgroundColor: Colors.purple,
    alignItems: 'center',
    width: Dimensions.Width,
    paddingBottom: 20,
  },
})

const GroupList = () => {
  const dispatch = useDispatch()
  const user = useSelector((state) => state.auth.user)
  const myGroups = useSelector((state) => state.group.groups)
  const loading = useSelector((state) => state.group.loading)
  // const isGroupManager = (g) =>
  //   g.userPhoneNumber === user.phoneNumber ||
  //   g.members.find(
  //     (m) => m.role === 'admin' && m.phoneNumber === user.phoneNumber,
  //   )

  const [searchText, setSearchText] = useState('')

  useEffect(() => {
    dispatch(getGroups())
  }, [dispatch])

  const onPressGroupItem = (groupId, type) => {
    dispatch(getGroup({ groupId, type })).then(() =>
      NavigationService.navigate(Screens.GroupUpsert, { isCreate: false }),
    )
  }

  const goToGroupCreateScreen = () => {
    NavigationService.navigate(Screens.GroupCreate)
  }

  const renderEmpty = () => (
    <View
      style={{
        paddingTop: 40,
        alignItems: 'center',
        justifyContent: 'center',
      }}>
      <AppText style={{ textAlign: 'center' }}>
        Create your first group and have honest conversations
      </AppText>
      <View
        style={{
          paddingHorizontal: 16,
          margin: 16,
          width: '64%',
        }}>
        <AppButton text="Create a group" onPress={goToGroupCreateScreen} />
      </View>
    </View>
  )

  return (
    <>
      {/* <View style={styles.header}>
        <AppText fontSize={FontSize.xLarge} color="white">
          {
            myGroups.filter((g) => g.name.toLowerCase().includes(searchText))
              .length
          }{' '}
          Groups
        </AppText>
        <View style={{ width: '85%', marginTop: 10 }}>
          <View style={{ position: 'absolute', top: 18, left: 20, zIndex: 1 }}>
            <AppIcon name="search" color={Colors.gray} size={20} />
          </View>
          <AppInput
            placeholder="Search"
            placeholderTextColor={Colors.gray}
            value={searchText}
            icon="search"
            style={{
              backgroundColor: 'white',
              paddingLeft: 50,
              fontSize: 15,
              fontFamily: Fonts.euclidCircularAMedium,
              color: Colors.text,
            }}
            onChange={(value) => setSearchText(value.toLowerCase())}
          />
        </View>
      </View> */}
      <Layout innerStyle={{ paddingTop: 20 }}>
        <SafeAreaView style={styles.container}>
          <StatusBar barStyle="light-content" />
          <ScrollView>
            <View style={styles.groupBox}>
              <View
                style={{
                  flexWrap: 'wrap',
                  width: '100%',
                  flexDirection: 'row',
                  justifyContent: 'space-evenly',
                }}>
                {loading && myGroups.length === 0 && <Loading />}
                {myGroups.length
                  ? myGroups
                      .filter((g) => g.name.toLowerCase().includes(searchText))
                      .map((group, index) => (
                        <ScaleTouchable
                          key={group._id}
                          style={[
                            styles.groupItem,
                            index === myGroups.length - 1 &&
                              styles.groupItemLast,
                          ]}
                          onPress={() =>
                            onPressGroupItem(group._id, group.type)
                          }>
                          <View style={styles.groupPictureContainer}>
                            <Image
                              source={Images.groupWhite}
                              style={styles.groupPicture}
                            />
                          </View>
                          <AppText
                            fontSize={FontSize.normal}
                            weight="bold"
                            color={Colors.purpleText}>
                            {group.name}{' '}
                            {/* {isGroupManager(group) && '(manager)'} */}
                          </AppText>
                          <AppText
                            fontSize={FontSize.normal}
                            weight="normal"
                            color={Colors.gray}
                            style={{ marginTop: 5 }}>
                            {group.members.length} members
                          </AppText>
                        </ScaleTouchable>
                      ))
                  : renderEmpty()}
              </View>
            </View>
          </ScrollView>
        </SafeAreaView>
      </Layout>
    </>
  )
}

export default GroupList
