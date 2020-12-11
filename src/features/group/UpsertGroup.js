import React, { useState } from 'react'
import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  View,
  ScrollView,
} from 'react-native'

import { Colors, Dimensions, FontSize } from 'constants'
import Fonts from 'assets/fonts'
import {
  AppInput,
  AppButton,
  AppText,
  ScaleTouchable,
  AppIcon,
} from 'components'

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
  const [groupName, setGroupName] = useState('')

  const onChangeGroupName = (name) => setGroupName(name)
  const createGroup = () => {}
  const removeMember = (member, isAdmin = true) => {}

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
                style={{ flexDirection: 'row', alignItems: 'center' }}>
                {!!ADMIN_LIST.length && (
                  <AppText
                    weight="medium"
                    fontSize={FontSize.xLarge}
                    color={Colors.gray}>
                    {ADMIN_LIST.length}
                  </AppText>
                )}
                <AppIcon name="chevron-right" size={24} color={Colors.gray} />
              </ScaleTouchable>
            </View>
            <View
              style={{
                flexDirection: 'row',
                padding: 24,
                paddingBottom: 16,
                paddingHorizontal: 16,
              }}>
              {ADMIN_LIST.map((member) => (
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
              ))}
            </View>
          </View>
          <View style={styles.addMembersView}>
            <View style={styles.addMembersHeader}>
              <AppText weight="medium" fontSize={FontSize.xLarge}>
                Add Members
              </AppText>
              <ScaleTouchable
                style={{ flexDirection: 'row', alignItems: 'center' }}>
                {!!MEMBER_LIST.length && (
                  <AppText
                    weight="medium"
                    fontSize={FontSize.xLarge}
                    color={Colors.gray}>
                    {MEMBER_LIST.length}
                  </AppText>
                )}
                <AppIcon name="chevron-right" size={24} color={Colors.gray} />
              </ScaleTouchable>
            </View>
            <View
              style={{
                flexDirection: 'row',
                padding: 24,
                paddingBottom: 16,
                paddingHorizontal: 16,
                flexWrap: 'wrap',
              }}>
              {MEMBER_LIST.map((member) => (
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
              ))}
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
