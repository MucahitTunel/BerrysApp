import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
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
  Loading,
  Header,
} from 'components'
import { BackButton } from 'components/NavButton'
import {
  setNewGroupName,
  removeNewGroupMembers,
  createGroup,
} from './groupSlice'

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

// eslint-disable-next-line react/prop-types
const GroupUpsert = ({ navigation, route }) => {
  const dispatch = useDispatch()
  // eslint-disable-next-line react/prop-types
  const { isCreate } = route.params
  const group = useSelector((state) =>
    isCreate ? state.group.new : state.group.current,
  )
  const loading = useSelector((state) => state.group.loading)
  const [groupName, setGroupName] = useState(isCreate ? '' : group.name)
  useEffect(() => {
    setGroupName(group.name)
  }, [group])
  useEffect(() => {
    const title = route.params.isCreate ? 'Create Group' : 'Edit Group'
    navigation.setOptions({
      header: () => (
        <Header
          title={title}
          headerLeft={<BackButton navigation={navigation} />}
        />
      ),
    })
  }, [navigation, route.params.isCreate])
  if (loading) return <Loading />
  const members =
    group && group.members
      ? group.members.filter((m) => m.role === 'member')
      : []
  const admins =
    group && group.members
      ? group.members.filter((m) => m.role === 'admin')
      : []

  const isBtnActive = !!(groupName && members.length > 0 && admins.length > 0)

  const onChangeGroupName = (name) => {
    setGroupName(name)
  }
  const onPressCreateGroup = () => {
    dispatch(setNewGroupName(groupName))
    dispatch(createGroup())
    NavigationService.navigate(Screens.GroupList)
  }
  const onRemoveMember = (member) => {
    dispatch(removeNewGroupMembers(member))
  }
  const goToAddMemberScreen = (isAdmin = false) => {
    NavigationService.navigate(Screens.GroupAddMembers, {
      isAdmin,
      isCreate,
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
                {!!admins.length && (
                  <AppText
                    weight="medium"
                    fontSize={FontSize.xLarge}
                    color={Colors.gray}>
                    {String(admins.length)}
                  </AppText>
                )}
                <AppIcon name="chevron-right" size={24} color={Colors.gray} />
              </ScaleTouchable>
            </View>
            <View style={styles.addMembersBody}>
              {admins.length ? (
                admins.map((admin) => (
                  <ScaleTouchable
                    key={admin.phoneNumber}
                    onPress={() => onRemoveMember(admin)}
                    style={styles.memberItem}>
                    <AppText
                      color={Colors.gray}
                      fontSize={FontSize.normal}
                      weight="medium"
                      style={{ marginRight: 10 }}>
                      {admin.name}
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
                {!!members.length && (
                  <AppText
                    weight="medium"
                    fontSize={FontSize.xLarge}
                    color={Colors.gray}>
                    {members.length}
                  </AppText>
                )}
                <AppIcon name="chevron-right" size={24} color={Colors.gray} />
              </ScaleTouchable>
            </View>
            <View style={styles.addMembersBody}>
              {members.length ? (
                members.map((member) => (
                  <ScaleTouchable
                    key={member.phoneNumber}
                    onPress={() => onRemoveMember(member)}
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
            disabled={!isBtnActive}
            onPress={onPressCreateGroup}
          />
        </View>
      </View>
    </SafeAreaView>
  )
}

GroupUpsert.propTypes = {
  route: PropTypes.objectOf(PropTypes.any).isRequired,
  navigation: PropTypes.objectOf(PropTypes.any).isRequired,
}

export default GroupUpsert
