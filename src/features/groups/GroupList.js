import React, { useEffect } from 'react'
import {
  ScrollView,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  View,
} from 'react-native'
import { useDispatch, useSelector } from 'react-redux'

import * as NavigationService from 'services/navigation'
import { Colors, Dimensions, Screens, FontSize } from 'constants'
import {
  AppIcon,
  AppText,
  ScaleTouchable,
  AppButton,
  Loading,
} from 'components'
import { getGroups, getGroup } from './groupSlice'

const styles = StyleSheet.create({
  container: {
    height: Dimensions.Height,
    width: Dimensions.Width,
    backgroundColor: Colors.background,
    flex: 1,
  },
  groupBox: {
    padding: 16,
  },
  groupItem: {
    backgroundColor: Colors.white,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderColor: Colors.background,
  },
  groupItemLast: {
    borderBottomWidth: 0,
  },
  creatGroupBtn: {
    position: 'absolute',
    right: 16,
    bottom: 40,
  },
})

const GroupList = () => {
  const dispatch = useDispatch()
  const user = useSelector((state) => state.auth.user)
  const myGroups = useSelector((state) => state.group.groups)
  const loading = useSelector((state) => state.group.loading)
  const isGroupManager = (g) =>
    g.userPhoneNumber === user.phoneNumber ||
    g.members.find(
      (m) => m.role === 'admin' && m.phoneNumber === user.phoneNumber,
    )
  useEffect(() => {
    dispatch(getGroups())
  }, [dispatch])
  const onPressGroupItem = (groupId) => {
    dispatch(getGroup(groupId))
    NavigationService.navigate(Screens.GroupUpsert, { isCreate: false })
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
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <ScrollView>
        <View style={styles.groupBox}>
          <AppText weight="medium" style={{ marginBottom: 16 }}>
            My Groups
          </AppText>
          <View>
            {loading && <Loading />}
            {myGroups.length
              ? myGroups.map((group, index) => (
                  <ScaleTouchable
                    key={group._id}
                    style={[
                      styles.groupItem,
                      index === myGroups.length - 1 && styles.groupItemLast,
                    ]}
                    onPress={() => onPressGroupItem(group._id)}>
                    <AppText fontSize={FontSize.normal} weight="medium">
                      {group.name} {isGroupManager(group) && '(manager)'}
                    </AppText>
                    <AppIcon
                      name="chevron-right"
                      size={20}
                      color={Colors.gray}
                    />
                  </ScaleTouchable>
                ))
              : renderEmpty()}
          </View>
        </View>
      </ScrollView>
      {myGroups.length > 0 && (
        <AppButton
          icon="plus"
          style={styles.creatGroupBtn}
          onPress={goToGroupCreateScreen}
        />
      )}
    </SafeAreaView>
  )
}

export default GroupList
