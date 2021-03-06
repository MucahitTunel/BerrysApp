import React, { useState, useEffect, useLayoutEffect } from 'react'
import PropTypes from 'prop-types'
import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  View,
  ScrollView,
  Alert,
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
  removeCurrentGroupMembers,
  createGroup,
  updateGroup,
  setCurrentGroupName,
} from './groupSlice'
import { AnswerRightButton } from 'components/NavButton'
import { BlurView } from '@react-native-community/blur'
import Modal from 'react-native-modal'
import Theme from 'theme'

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
  modalBackdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    height: '100%',
    width: '100%',
  },
  modalInnerView: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
})

const CREATE_GROUP = 'Create Group'
const UPDATE_GROUP = 'Update Group'

// eslint-disable-next-line react/prop-types
const GroupUpsert = ({ navigation, route }) => {
  const dispatch = useDispatch()
  // eslint-disable-next-line react/prop-types
  const { isCreate } = route.params
  const group = useSelector((state) =>
    isCreate ? state.group.new : state.group.current,
  )
  const user = useSelector((state) => state.auth.user)
  const contacts = useSelector((state) => state.contacts.data)
  const loading = useSelector((state) => state.group.loading)
  const [groupName, setGroupName] = useState(group.name)
  useEffect(() => {
    setGroupName(group.name)
  }, [group])

  const [isModalVisible, setIsModalVisible] = useState(false)

  useLayoutEffect(() => {
    const title = isCreate ? CREATE_GROUP : UPDATE_GROUP
    navigation.setOptions({
      header: () => (
        <Header
          title={title}
          headerLeft={<BackButton navigation={navigation} />}
          headerRight={
            isCreate ? (
              <View />
            ) : (
              <AnswerRightButton onPressDots={() => setIsModalVisible(true)} />
            )
          }
        />
      ),
    })
  }, [navigation, isCreate])

  if (loading) return <Loading />
  const groupCreator = isCreate
    ? {
        _id: Date.now().toString(),
        phoneNumber: user.phoneNumber,
        name: 'Creator (You)',
        isDefaultItem: true,
      }
    : {
        _id: Date.now().toString(),
        phoneNumber: group.userPhoneNumber,
        name: 'Creator',
        isDefaultItem: true,
      }
  const members =
    group && group.members ? group.members.concat(groupCreator) : [groupCreator]
  const admins =
    group && group.members
      ? group.members.filter((m) => m.role === 'admin').concat(groupCreator)
      : [groupCreator]
  const isUserAdmin = admins.find((x) => x.phoneNumber === user.phoneNumber)

  const isGroupManager = (g) =>
    g.userPhoneNumber === user.phoneNumber ||
    g.members.find(
      (m) => m.role === 'admin' && m.phoneNumber === user.phoneNumber,
    )
  const isBtnActive =
    (!isCreate && isGroupManager(group)) || (isCreate && !!groupName)

  const onChangeGroupName = (name) => {
    setGroupName(name)
  }
  const onPressConfirm = () => {
    if (isCreate) {
      dispatch(setNewGroupName(groupName))
      dispatch(createGroup())
    } else {
      dispatch(setCurrentGroupName(groupName))
      dispatch(updateGroup())
    }
    NavigationService.navigate(Screens.GroupList)
  }
  const onRemoveMember = (member) => {
    if (member.isDefaultItem) {
      return Alert.alert('Warning', 'Group creator cannot be removed')
    }
    if (isCreate) {
      dispatch(removeNewGroupMembers(member))
    } else {
      dispatch(removeCurrentGroupMembers(member))
    }
  }
  const goToAddMemberScreen = (isAdmin = false, list = []) => {
    if (isCreate) {
      dispatch(setNewGroupName(groupName))
    } else {
      dispatch(setCurrentGroupName(groupName))
    }
    NavigationService.navigate(Screens.GroupAddMembers, {
      isAdmin,
      isCreate,
      groupCreator,
      list,
    })
  }

  const getContactName = (data) => {
    if (user.phoneNumber === data.phoneNumber) return 'Me'
    const contactIndex = contacts.findIndex(
      (c) => c.phoneNumber === data.phoneNumber,
    )
    if (contactIndex > 0) return contacts[contactIndex].name
    return data.name
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
            onChange={onChangeGroupName}
          />
          <View style={styles.addMembersView}>
            <View style={styles.addMembersHeader}>
              <AppText weight="medium" fontSize={FontSize.xLarge}>
                Add Admins
              </AppText>
              <ScaleTouchable
                onPress={() => goToAddMemberScreen(true, admins)}
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
                      {getContactName(admin)}
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
                onPress={() => goToAddMemberScreen(false, members)}
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
                      {getContactName(member)}
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
        <View style={{ paddingHorizontal: 16, marginBottom: 10 }}>
          <AppButton
            text={isCreate ? CREATE_GROUP : UPDATE_GROUP}
            disabled={!isBtnActive}
            onPress={onPressConfirm}
          />
        </View>
      </View>

      {/* Flag question modal */}
      <Modal
        isVisible={isModalVisible}
        style={[Theme.Modal.modalView]}
        animationInTiming={300}
        animationOutTiming={300}>
        <View style={Theme.Modal.modalInnerView}>
          <View style={styles.modalBackdrop}>
            <BlurView style={{ flex: 1 }} blurType="xlight" blurAmount={1} />
          </View>
          <View style={[Theme.Modal.modalInnerView, styles.modalInnerView]}>
            <View style={{ marginVertical: 16 }}>
              <AppButton
                text={isUserAdmin ? 'Delete group' : 'Leave group'}
                onPress={() => {}}
              />
            </View>
            <AppButton
              text="Close"
              textStyle={{ color: Colors.primary }}
              style={{ backgroundColor: Colors.white }}
              onPress={() => setIsModalVisible(false)}
            />
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  )
}

GroupUpsert.propTypes = {
  route: PropTypes.objectOf(PropTypes.any).isRequired,
  navigation: PropTypes.objectOf(PropTypes.any).isRequired,
}

export default GroupUpsert
