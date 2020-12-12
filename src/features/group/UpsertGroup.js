import React, { useState } from 'react'
import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  View,
  ScrollView,
} from 'react-native'
import { useDispatch, useSelector } from 'react-redux'

import * as NavigationService from 'services/navigation'
import { Colors, Dimensions, FontSize, Screens } from 'constants'
import Fonts from 'assets/fonts'
import {
  AppInput,
  AppButton,
  AppText,
  ScaleTouchable,
  AppIcon,
} from 'components'
import { setGroupName } from './groupSlice'

const ADMIN_LIST = [
  {
    _id: 1,
    name: 'Rebbeca',
  },
  {
    _id: 2,
    name: 'Nick',
  },
  {
    _id: 3,
    name: 'Hansson',
  },
]

const MEMBER_LIST = [
  {
    _id: 1,
    name: 'Rebbeca',
  },
  {
    _id: 2,
    name: 'Nick',
  },
  {
    _id: 3,
    name: 'Hansson',
  },
  {
    _id: 4,
    name: 'Micheal',
  },
  {
    _id: 5,
    name: 'Hansson',
  },
  {
    _id: 6,
    name: 'Alex',
  },
]

const styles = StyleSheet.create({
  container: {
    height: Dimensions.Height,
    width: Dimensions.Width,
    backgroundColor: Colors.background,
    flex: 1,
  },
  templateList: {
    marginTop: 32,
  },
  templateItem: {
    backgroundColor: Colors.white,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 2,
    borderColor: Colors.background,
  },
  templateItemLast: {
    borderBottomWidth: 0,
  },
  templateItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  groupNameInput: {
    fontSize: FontSize.xxxLarge,
    fontFamily: Fonts.euclidCircularAMedium,
    color: Colors.text,
    backgroundColor: Colors.white,
    paddingHorizontal: 16,
    height: 100,
    marginBottom: 8,
  },
  addMembersView: {
    backgroundColor: Colors.white,
    marginTop: 4,
  },
  addMembersHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderColor: Colors.background,
    paddingVertical: 24,
    paddingHorizontal: 16,
  },
  addMembersBody: {
    flexDirection: 'row',
    padding: 24,
    paddingBottom: 16,
    paddingHorizontal: 16,
    flexWrap: 'wrap',
  },
  memberItem: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(151, 151, 151, 0.53)',
    padding: 8,
    borderRadius: 5,
    marginRight: 10,
    marginBottom: 10,
  },
})

const UpsertGroup = () => {
  const dispatch = useDispatch()
  const [groupName, addGroupName] = useState('')
  const group = useSelector((state) => state.group)

  const onChangeGroupName = (name) => addGroupName(name)
  const createGroup = () => {
    dispatch(setGroupName(groupName))
    NavigationService.navigate(Screens.GroupList)
  }
  const removeMember = (member, isAdmin = true) => {}
  const goToAddMemberScreen = (isAdmin = false) => {
    NavigationService.navigate(Screens.AddMembersGroup, {
      isAdmin,
    })
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <View style={{ height: '100%' }}>
        <ScrollView style={{ flex: 1 }}>
          <AppInput
            placeholder="Enter group name"
            placeholderTextColor={Colors.gray}
            value={groupName}
            icon="search"
            style={styles.groupNameInput}
            onChangeText={onChangeGroupName}
          />
          <View style={styles.addMembersView}>
            <View style={styles.addMembersHeader}>
              <AppText weight="medium" fontSize={FontSize.xLarge}>
                Add Admins
              </AppText>
              <ScaleTouchable
                onPress={() => goToAddMemberScreen(true)}
                style={{ flexDirection: 'row', alignItems: 'center' }}>
                {!!group.admins.length && (
                  <AppText
                    weight="medium"
                    fontSize={FontSize.xLarge}
                    color={Colors.gray}>
                    {group.admins.length}
                  </AppText>
                )}
                <AppIcon name="chevron-right" size={24} color={Colors.gray} />
              </ScaleTouchable>
            </View>
            <View style={styles.addMembersBody}>
              {group.admins.length ? (
                group.admins.map((member) => (
                  <ScaleTouchable
                    key={member._id}
                    onPress={() => removeMember(member, true)}
                    style={styles.memberItem}>
                    <AppText
                      color={Colors.gray}
                      fontSize={FontSize.normal}
                      weight="medium"
                      style={{ marginRight: 10 }}>
                      {member.name}
                    </AppText>
                    <AppIcon name="close" size={10} color={Colors.gray} />
                  </ScaleTouchable>
                ))
              ) : (
                <AppText style={{ textAlign: 'center' }} color={Colors.gray}>
                  There's no admin yet
                </AppText>
              )}
            </View>
          </View>
          <View style={styles.addMembersView}>
            <View style={styles.addMembersHeader}>
              <AppText weight="medium" fontSize={FontSize.xLarge}>
                Add Members
              </AppText>
              <ScaleTouchable
                onPress={() => goToAddMemberScreen(false)}
                style={{ flexDirection: 'row', alignItems: 'center' }}>
                {!!group.members.length && (
                  <AppText
                    weight="medium"
                    fontSize={FontSize.xLarge}
                    color={Colors.gray}>
                    {group.members.length}
                  </AppText>
                )}
                <AppIcon name="chevron-right" size={24} color={Colors.gray} />
              </ScaleTouchable>
            </View>
            <View style={styles.addMembersBody}>
              {group.members.length ? (
                group.members.map((member) => (
                  <ScaleTouchable
                    key={member._id}
                    onPress={() => removeMember(member, false)}
                    style={styles.memberItem}>
                    <AppText
                      color={Colors.gray}
                      fontSize={FontSize.normal}
                      weight="medium"
                      style={{ marginRight: 10 }}>
                      {member.name}
                    </AppText>
                    <AppIcon name="close" size={10} color={Colors.gray} />
                  </ScaleTouchable>
                ))
              ) : (
                <AppText style={{ textAlign: 'center' }} color={Colors.gray}>
                  There's no member yet
                </AppText>
              )}
            </View>
          </View>
        </ScrollView>
        <View style={{ paddingHorizontal: 16 }}>
          <AppButton
            text="Create Group"
            disabled={!groupName}
            onPress={createGroup}
          />
        </View>
      </View>
    </SafeAreaView>
  )
}

export default UpsertGroup
