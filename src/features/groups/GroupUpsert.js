import React, { useState, useEffect, useLayoutEffect } from 'react'
import PropTypes from 'prop-types'
import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  View,
  ScrollView,
  Alert,
  Keyboard,
  FlatList,
  Image,
  TouchableOpacity,
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
  Layout,
  Avatar,
} from 'components'
import { BackButton } from 'components/NavButton'
import {
  setNewGroupName,
  removeNewGroupMembers,
  removeCurrentGroupMembers,
  createGroup,
  updateGroup,
  setCurrentGroupName,
  deleteGroup,
  leaveGroup,
  activateJoinLink,
  deactivateJoinLink,
  getSharedPosts,
} from './groupSlice'
import {
  setAskGroups,
  askQuestion,
  setAskQuestion,
} from 'features/questions/askSlice'
import { AnswerRightButton } from 'components/NavButton'
import { BlurView } from '@react-native-community/blur'
import Modal from 'react-native-modal'
import Theme from 'theme'
import { Formik } from 'formik'
import { checkURL } from 'utils'
import RNUrlPreview from 'react-native-url-preview'
import Clipboard from '@react-native-community/clipboard'
import { QuestionItem, PollItem, RenderCompare } from '../questions/Main'
import Images from 'assets/images'
import { Color } from 'react-native-agora'

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
    fontSize: FontSize.large,
    fontFamily: Fonts.euclidCircularAMedium,
    color: Colors.text,
    backgroundColor: Colors.white,
    paddingHorizontal: 16,
    marginBottom: 5,
    marginHorizontal: 30,
  },
  addMembersView: {
    backgroundColor: Colors.white,
    marginTop: 4,
    borderRadius: 15,
    marginHorizontal: 30,
    marginBottom: 5,
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
    borderColor: 'black',
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
  inputView: {
    paddingHorizontal: 16,
    backgroundColor: Colors.white,
    flexDirection: 'row',
    alignItems: 'center',
    width: Dimensions.Width,
  },
  input: {
    paddingTop: 20,
    marginHorizontal: 10,
    flex: 1,
    fontSize: FontSize.large,
    color: Colors.text,
    height: 84,
  },
  sendBtn: {
    height: 25,
    width: 56,
    borderRadius: 4,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendBtnDisabled: {
    backgroundColor: Colors.grayLight,
  },
  sendBtnText: {
    fontSize: 13,
    fontFamily: Fonts.euclidCircularAMedium,
    marginLeft: 4,
  },
  copyLink: {
    padding: 16,
    backgroundColor: Colors.white,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 15,
    marginTop: 15,
  },
  copyLinkItemIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: Colors.purpleLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  sharedPostsContainer: {
    paddingHorizontal: 30,
    marginBottom: 10,
  },
  header: {
    width: Dimensions.Width,
    backgroundColor: Colors.purple,
    paddingBottom: 15,
    paddingHorizontal: 20,
    justifyContent: 'center',
  },
  groupPictureContainer: {
    height: 90,
    width: 90,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 45,
    backgroundColor: '#DFE4F4',
  },
  groupPicture: {
    height: 40,
    width: 40,
    resizeMode: 'contain',
  },
  groupMemberContainer: {
    flex: 1,
    width: Dimensions.Width / 3.3,
    justifyContent: 'center',
    alignItems: 'center',
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
  const question = useSelector((state) => state.question.data)
  const contacts = useSelector((state) => state.contacts.data)
  const loading = useSelector((state) => state.group.loading)

  const [groupName, setGroupName] = useState(group.name)
  const [changeGroupName, setChangeGroupName] = useState(false)

  const sharedQuestions = useSelector((state) => state.group.sharedQuestions)
  const sharedPolls = useSelector((state) => state.group.sharedPolls)
  const sharedCompares = useSelector((state) => state.group.sharedCompares)

  useEffect(() => {
    setGroupName(group.name)
    dispatch(getSharedPosts())
  }, [group, dispatch])
  const [questionUrl, setQuestionUrl] = useState(null)

  const [isModalVisible, setIsModalVisible] = useState(false)

  const joinURL = `https://api.berrysapp.com/app/group/${group._id}`

  useLayoutEffect(() => {
    const title = !isCreate ? group.name : 'Edit Group Info'
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
  }, [navigation, isCreate, group])

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
    if (isUserAdmin) return data.phoneNumber
    if (data.isAppUser && data.inAppName) return data.inAppName
    return `Anonymous ${Math.floor(Math.random() * 999) + 100}`
  }

  const groupExitOnPress = () => {
    setIsModalVisible(false)
    NavigationService.goBack()
    isUserAdmin ? dispatch(deleteGroup()) : dispatch(leaveGroup())
  }

  const onQuestionPost = (values, { setSubmitting, resetForm }) => {
    setSubmitting(true)
    const { question } = values
    if (question) {
      Keyboard.dismiss()
      dispatch(setAskQuestion(question))
      dispatch(setAskGroups([group]))
      dispatch(askQuestion())
      resetForm({})
      setSubmitting(false)
    }
  }

  const renderSharedPosts = ({ item, index }) => {
    const renderItem = () => {
      if (item.type === 'question') return <QuestionItem question={item} />
      if (item.type === 'poll') return <PollItem data={item} />
      if (item.type === 'compare') return <RenderCompare compare={item} />
    }

    return <View style={{ marginBottom: 10 }}>{renderItem()}</View>
  }

  const renderEmptyPosts = () => {
    return (
      <View
        style={{
          flex: 1,
          alignItems: 'center',
          height: Dimensions.Height,
          top: '20%',
        }}>
        <AppText
          color="black"
          fontSize={FontSize.xLarge}
          style={{ textAlign: 'center' }}>
          There is no posts shared with this group
        </AppText>
      </View>
    )
  }

  return (
    <>
      {!isCreate && (
        <View style={styles.header}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
            }}>
            <View style={styles.groupPictureContainer}>
              <Image source={Images.groupEmpty} style={styles.groupPicture} />
              <TouchableOpacity
                style={{ position: 'absolute', top: 65, right: 0 }}
                onPress={() => setChangeGroupName(!changeGroupName)}>
                <Avatar source={Images.edit} size={32} />
              </TouchableOpacity>
            </View>
            <View style={styles.groupMemberContainer}>
              <AppText color="white" fontSize={FontSize.xLarge} weight="bold">
                {admins.length}
              </AppText>
              <AppText color="white" fontSize={FontSize.large}>
                Group Admins
              </AppText>
            </View>
            <View style={styles.groupMemberContainer}>
              <AppText color="white" fontSize={FontSize.xLarge} weight="bold">
                {members.length}
              </AppText>
              <AppText color="white" fontSize={FontSize.large}>
                Group Members
              </AppText>
            </View>
          </View>
          {!changeGroupName && group.joinableByLink && (
            <ScaleTouchable
              style={styles.copyLink}
              onPress={() => {
                Clipboard.setString(joinURL)
                Alert.alert('Success', 'The URL has been copied to clipboard')
              }}>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  maxWidth: '70%',
                }}>
                <View style={styles.copyLinkItemIcon}>
                  <AppIcon name="share" color={Colors.purple} size={20} />
                </View>
                <View>
                  <AppText
                    fontSize={FontSize.normal}
                    weight="bold"
                    color={Colors.purpleText}>
                    COPY & SHARE JOIN LINK
                  </AppText>
                  <AppText fontSize={FontSize.normal} color={Colors.purpleText}>
                    {joinURL}
                  </AppText>
                </View>
              </View>
              <AppIcon name="copy" size={20} color={Colors.purple} />
            </ScaleTouchable>
          )}
        </View>
      )}
      <Layout>
        <SafeAreaView style={styles.container}>
          <StatusBar barStyle="light-content" />
          <View style={{ height: '100%' }}>
            <ScrollView style={{ flex: 1 }}>
              {(isCreate || changeGroupName) && (
                <AppInput
                  placeholder="Enter group name"
                  placeholderTextColor="black"
                  value={groupName}
                  icon="search"
                  style={styles.groupNameInput}
                  onChange={onChangeGroupName}
                />
              )}
              {(isCreate || changeGroupName) && (
                <View style={styles.addMembersView}>
                  <View style={styles.addMembersHeader}>
                    <AppText
                      weight="medium"
                      fontSize={FontSize.xLarge}
                      color="black">
                      Add Admins
                    </AppText>
                    <ScaleTouchable
                      onPress={() => goToAddMemberScreen(true, admins)}
                      style={{ flexDirection: 'row', alignItems: 'center' }}>
                      {!!admins.length && (
                        <AppText
                          weight="medium"
                          fontSize={FontSize.xLarge}
                          color="black">
                          {String(admins.length)}
                        </AppText>
                      )}
                      <AppIcon name="chevron-right" size={24} color="black" />
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
                            color="black"
                            fontSize={FontSize.normal}
                            weight="medium"
                            style={{ marginRight: 10 }}>
                            {getContactName(admin)}
                          </AppText>
                          <AppIcon name="close" size={10} color="black" />
                        </ScaleTouchable>
                      ))
                    ) : (
                      <AppText
                        style={{ textAlign: 'center' }}
                        color={Colors.gray}>
                        There's no admin yet
                      </AppText>
                    )}
                  </View>
                </View>
              )}
              {(isCreate || changeGroupName) && (
                <View style={styles.addMembersView}>
                  <View style={styles.addMembersHeader}>
                    <AppText
                      weight="medium"
                      fontSize={FontSize.xLarge}
                      color="black">
                      Add Members
                    </AppText>
                    <ScaleTouchable
                      onPress={() => goToAddMemberScreen(false, members)}
                      style={{ flexDirection: 'row', alignItems: 'center' }}>
                      {!!members.length && (
                        <AppText
                          weight="medium"
                          fontSize={FontSize.xLarge}
                          color="black">
                          {members.length}
                        </AppText>
                      )}
                      <AppIcon name="chevron-right" size={24} color="black" />
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
                            color="black"
                            fontSize={FontSize.normal}
                            weight="medium"
                            style={{ marginRight: 10 }}>
                            {getContactName(member)}
                          </AppText>
                          <AppIcon name="close" size={10} color="black" />
                        </ScaleTouchable>
                      ))
                    ) : (
                      <AppText style={{ textAlign: 'center' }} color="black">
                        There's no member yet
                      </AppText>
                    )}
                  </View>
                </View>
              )}
              {!isCreate && !changeGroupName && (
                <View style={styles.sharedPostsContainer}>
                  <FlatList
                    data={[
                      ...sharedQuestions,
                      ...sharedPolls,
                      ...sharedCompares,
                    ]}
                    renderItem={renderSharedPosts}
                    ListEmptyComponent={renderEmptyPosts}
                    style={{ flex: 1 }}
                  />
                </View>
              )}
            </ScrollView>
            {(isCreate || changeGroupName) && (
              <View style={{ paddingHorizontal: 16, marginBottom: 10 }}>
                <AppButton
                  text={isCreate ? CREATE_GROUP : UPDATE_GROUP}
                  disabled={!isBtnActive}
                  onPress={onPressConfirm}
                />
              </View>
            )}
          </View>

          {/* Flag question modal */}
          <Modal
            isVisible={isModalVisible}
            style={[Theme.Modal.modalView]}
            animationInTiming={300}
            animationOutTiming={300}>
            <View style={Theme.Modal.modalInnerView}>
              <View style={styles.modalBackdrop}>
                <BlurView style={{ flex: 1 }} blurType="dark" blurAmount={1} />
              </View>
              <View style={[Theme.Modal.modalInnerView, styles.modalInnerView]}>
                {isUserAdmin && (
                  <AppButton
                    text={
                      group.joinableByLink
                        ? 'Deactivate join link'
                        : 'Activate join link'
                    }
                    onPress={() => {
                      if (group.joinableByLink) dispatch(deactivateJoinLink())
                      else dispatch(activateJoinLink())
                    }}
                  />
                )}
                <View style={{ marginVertical: 16 }}>
                  <AppButton
                    text={isUserAdmin ? 'Delete group' : 'Leave group'}
                    onPress={groupExitOnPress}
                  />
                </View>
                <AppButton
                  text="Close"
                  textStyle={{ color: Colors.purple }}
                  style={{ backgroundColor: Colors.white }}
                  onPress={() => setIsModalVisible(false)}
                />
              </View>
            </View>
          </Modal>
        </SafeAreaView>
      </Layout>
    </>
  )
}

GroupUpsert.propTypes = {
  route: PropTypes.objectOf(PropTypes.any).isRequired,
  navigation: PropTypes.objectOf(PropTypes.any).isRequired,
}

export default GroupUpsert
