import React, { useLayoutEffect, useEffect, useState } from 'react'
import {
  View,
  SafeAreaView,
  StyleSheet,
  BackHandler,
  ScrollView,
  Linking,
  AppState,
  Image,
  TouchableOpacity,
} from 'react-native'
import {
  AppInput,
  AppButton,
  Header,
  Avatar,
  ScaleTouchable,
  AppIcon,
  Layout,
} from 'components'
import { Dimensions, Colors, FontSize, Screens } from 'constants'
import { useDispatch, useSelector } from 'react-redux'
import AppText from '../../components/AppText'
import {
  setAskQuestion,
  setAskAnonymously,
  setAskContacts,
  setAskGroups,
  setAskFacebookGroups,
  askQuestion,
  // setIsAskExperts,
  setLikeMinded,
  setIsFollowedInterests,
  setTargetedInterests,
  setTargetedCountries,
} from 'features/questions/askSlice'
import * as NavigationService from '../../services/navigation'
import { CloseButton } from 'components/NavButton'
import Images from 'assets/images'
import PropTypes from 'prop-types'
import BottomSheet from 'reanimated-bottom-sheet'
import { loadContacts } from 'features/contacts/contactsSlice'
import {
  createPoll,
  createCompare,
  shareQuestion,
  shareCompare,
  sharePoll,
  setPollOptions,
  setCompareImages,
} from '../questions/questionSlice'
// import { contactSettingsAlert } from 'features/contacts/helpers'
import firebase from 'services/firebase'

const styles = StyleSheet.create({
  container: {
    height: Dimensions.Height,
    width: Dimensions.Width,
    backgroundColor: 'transparent',
    flex: 1,
  },
  selectionRow: {
    marginTop: 10,
    width: 85,
  },
  selectionRowText: {
    textAlign: 'center',
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'black',
    padding: 10,
    borderRadius: 10,
    marginLeft: 10,
    marginTop: 10,
  },
  extraSelectionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 15,
  },
  extraOuterContainer: {
    flex: 1,
    alignItems: 'center',
    marginHorizontal: 10,
  },
  extraContainer: {
    backgroundColor: 'white',
    height: 160,
    width: '100%',
    marginBottom: 15,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  extraSelected: {
    backgroundColor: Colors.purpleLight,
    borderWidth: 1,
    borderColor: Colors.purple,
  },
  targetedInnerCircle: {
    height: 85,
    width: 85,
    borderRadius: 42.5,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    opacity: 0.5,
  },
  targetedInnerCircleFirst: {
    backgroundColor: '#EEC9F4',
    left: -10,
  },
  targetedInnerCircleSecond: {
    backgroundColor: '#F3C0AA',
    right: -10,
  },
  targetedInnerCircleThird: {
    backgroundColor: '#C9C9F2',
    top: -15,
  },
})

const PostQuestion = ({ navigation, route }) => {
  const dispatch = useDispatch()
  const user = useSelector((state) => state.auth.user)
  const question = useSelector((state) => state.ask.question)
  const contacts = useSelector((state) => state.ask.contacts)
  const groups = useSelector((state) => state.ask.groups)
  const facebookGroups = useSelector((state) => state.ask.facebookGroups)
  const loading = useSelector((state) => state.ask.loading)
  const isAnonymous = useSelector((state) => state.ask.isAnonymous)
  // const isAskExperts = useSelector((state) => state.ask.isAskExperts)
  const isLikeMinded = useSelector((state) => state.ask.isLikeMinded)
  const isFollowedInterests = useSelector(
    (state) => state.ask.isFollowedInterests,
  )
  const targetedInterests = useSelector((state) => state.ask.targetedInterests)
  const targetedCountries = useSelector((state) => state.ask.targetedCountries)
  const allContacts = useSelector((state) => state.contacts.data)

  const [allContactsSelected, setAllContactsSelected] = useState(false)
  const [sheetOpened, setSheetOpened] = useState(false)

  const selectedItems = contacts.map((c) => c.phoneNumber)
  const selectedGroups = [...groups, ...facebookGroups].map((g) => g._id)

  const swiperRef = React.useRef(null)
  const appState = React.useRef(AppState.currentState)

  useEffect(() => {
    if (route.params?.isSharing) {
      const { post } = route.params
      if (post.type.includes('question')) dispatch(setAskQuestion(post.content))
      else dispatch(setAskQuestion(post.question))
    }
    dispatch(setAskContacts([]))
    dispatch(setAskGroups([]))
    dispatch(setAskFacebookGroups([]))
    // dispatch(setIsAskExperts(false))
    dispatch(setLikeMinded(!!route.params.isLikeMindedSelected))
    dispatch(setIsFollowedInterests(false))
    dispatch(
      setTargetedInterests(
        route.params.isTargetedInterest ? route.params.isTargetedInterest : [],
      ),
    )
    dispatch(setTargetedCountries([]))
  }, [dispatch, route])

  useLayoutEffect(() => {
    navigation.setOptions({
      header: () => (
        <Header
          title={route.params?.isSharing ? 'Share Question' : 'Post Question'}
          headerRight={
            <CloseButton
              navigation={navigation}
              onPress={() => dispatch(setAskQuestion(null))}
            />
          }
        />
      ),
    })
  }, [navigation, dispatch, route])

  useEffect(() => {
    if (allContacts.length === 0) dispatch(loadContacts())
    const _handleAppStateChange = (nextAppState) => {
      if (
        appState.current.match(/inactive|background/) &&
        nextAppState === 'active'
      )
        if (allContacts.length === 0) dispatch(loadContacts())
      appState.current = nextAppState
    }
    AppState.addEventListener('change', _handleAppStateChange)
    return () => {
      AppState.removeEventListener('change', _handleAppStateChange)
    }
  }, [allContacts, dispatch])

  useEffect(() => {
    const listener = () => {
      dispatch(setAskQuestion(null))
      return false
    }
    BackHandler.addEventListener('hardwareBackPress', listener)
    return () => BackHandler.removeEventListener('hardwareBackPress', listener)
  }, [dispatch])

  const questionOnChange = (value) => {
    dispatch(setAskQuestion(value !== '' ? value : null))
  }

  const toggleAnonymously = (value) => {
    dispatch(setAskAnonymously(value))
  }

  const onPress = () => {
    if (!route.params?.isSharing && !question) {
      if (route.params?.question)
        return alert('You have to write a question to continue!')
    }
    if (
      // !isAskExperts &&
      !isLikeMinded &&
      !isFollowedInterests &&
      targetedInterests.length === 0 &&
      targetedCountries.length === 0 &&
      !allContactsSelected &&
      groups.length === 0 &&
      facebookGroups.length === 0 &&
      contacts.length === 0
    )
      return alert(
        `You have to select people to ${
          route.params?.isSharing ? 'share this post!' : 'send your question!'
        }`,
      )

    if (route.params?.isSharing) {
      const { post } = route.params

      if (route.params.isPopular) {
        if (allContactsSelected) dispatch(setAskContacts(allContacts))
        if (post.type === 'popular-poll') {
          dispatch(setPollOptions(post.options))
          return dispatch(
            createPoll({ showOnboarding: !!route.params?.showOnboarding }),
          )
        }
        if (post.type === 'popular-compare') {
          dispatch(setCompareImages([post.images[0], post.images[0]]))
          return dispatch(
            createCompare({
              disableUpload: true,
              showOnboarding: !!route.params?.showOnboarding,
            }),
          )
        }
        dispatch(
          askQuestion({ showOnboarding: !!route.params?.showOnboarding }),
        )
        return
      }

      switch (post.type) {
        case 'question':
          dispatch(shareQuestion({ id: post._id }))
        case 'poll':
          dispatch(sharePoll({ id: post._id }))
        case 'compare':
          dispatch(shareCompare({ id: post._id }))
      }
      alert('Post shared successfully!')
      return NavigationService.goBack()
    }

    if (allContactsSelected) dispatch(setAskContacts(allContacts))
    if (route.params?.poll)
      return dispatch(
        createPoll({ showOnboarding: !!route.params?.showOnboarding }),
      )
    if (route.params?.compare)
      return dispatch(
        createCompare({ showOnboarding: !!route.params?.showOnboarding }),
      )
    dispatch(askQuestion({ showOnboarding: !!route.params?.showOnboarding }))
    firebase.analytics.logEvent(firebase.analytics.events.SCREEN_NAVIGATION, {
      screen: 'Create Post',
      user: user.phoneNumber,
    })
  }

  const navigateContactList = (isContact) => {
    swiperRef.current.snapTo(1)
    NavigationService.navigate(Screens.SelectContacts, {
      postQuestion: true,
      submitText: 'Select Contacts',
      selectedItems,
      selectedGroups,
      tab: isContact ? 'contact' : 'group',
    })
  }

  const renderContacts = () => {
    return (
      <View
        style={{
          flexDirection: 'row',
          marginHorizontal: 10,
          marginRight: 50,
          flexWrap: 'wrap',
          alignItems: 'center',
        }}>
        {allContactsSelected && contacts.length === 0 && (
          <ScaleTouchable
            onPress={() => {
              setAllContactsSelected(false)
              swiperRef.current.snapTo(0)
            }}
            style={[styles.itemContainer, { marginLeft: 0, marginRight: 10 }]}>
            <AppText
              color="black"
              fontSize={FontSize.normal}
              weight="medium"
              style={{ marginRight: 10 }}>
              All Contacts
            </AppText>
            <AppIcon name="close" size={12} color={Colors.purple} />
          </ScaleTouchable>
        )}
        {/* {isAskExperts && (
          <ScaleTouchable
            onPress={() => dispatch(setIsAskExperts(false))}
            style={[
              styles.itemContainer,
              {
                width: Dimensions.Width / 2.6,
                marginLeft: 0,
                marginRight: 10,
              },
            ]}>
            <AppText
              color="black"
              fontSize={FontSize.normal}
              weight="medium"
              style={{ marginRight: 10 }}>
              Berry's Experts
            </AppText>
            <AppIcon name="close" size={12} color={Colors.purple} />
          </ScaleTouchable>
        )} */}
        {isFollowedInterests && (
          <ScaleTouchable
            onPress={() => dispatch(setIsFollowedInterests(false))}
            style={[
              styles.itemContainer,
              {
                width: Dimensions.Width / 2.2,
                marginLeft: 0,
                marginRight: 5,
              },
            ]}>
            <AppText
              color="black"
              fontSize={FontSize.normal}
              weight="medium"
              style={{ marginRight: 10 }}>
              Followed Interests
            </AppText>
            <AppIcon name="close" size={12} color={Colors.purple} />
          </ScaleTouchable>
        )}
        {[...contacts, ...groups, ...facebookGroups].map((item, idx) => {
          return (
            <>
              <ScaleTouchable
                key={item._id}
                onPress={() => {
                  if (item.type === 'contact')
                    dispatch(
                      setAskContacts(
                        contacts.filter((c) => c._id !== item._id),
                      ),
                    )
                  else
                    dispatch(
                      setAskGroups(groups.filter((c) => c._id !== item._id)),
                    )
                  dispatch(
                    setAskFacebookGroups(
                      facebookGroups.filter((c) => c._id !== item._id),
                    ),
                  )
                }}
                style={[
                  styles.itemContainer,
                  { marginLeft: 0, marginRight: 10 },
                ]}>
                <AppText
                  color="black"
                  fontSize={FontSize.normal}
                  weight="medium"
                  style={{ marginRight: 10 }}>
                  {item.name}
                </AppText>
                <AppIcon name="close" size={12} color={Colors.purple} />
              </ScaleTouchable>
              {/* {idx === [...contacts, ...groups, ...facebookGroups].length - 1 &&
                <AppButton
                icon="plus"
                iconSize={18}
                iconColor="white"
                shadow={false}
                style={{
                  backgroundColor: Colors.purple,
                  height: 30,
                  width: 30,
                }}
                onPress={() => swiperRef.current.snapTo(0)}
              />
              } */}
            </>
          )
        })}
      </View>
    )
  }

  const Selection = () => {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: !sheetOpened ? 'transparent' : Colors.blackDimmed,
          paddingTop: Dimensions.Height,
        }}>
        <View
          style={{
            paddingTop: 10,
            height: Dimensions.Height,
            paddingHorizontal: 20,
            backgroundColor: 'white',
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            alignItems: 'center',
          }}>
          <View style={{ alignItems: 'center' }}>
            <View
              style={{
                height: 5,
                width: 90,
                borderRadius: 50,
                backgroundColor: 'black',
                marginBottom: 20,
              }}
            />
          </View>
          <AppText color="black" fontSize={FontSize.xLarge} weight="medium">
            Who can see & Answer to your post
          </AppText>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <ScaleTouchable
              style={styles.selectionRow}
              onPress={() => {
                setAllContactsSelected(true)
                dispatch(setAskContacts([]))
              }}>
              <View style={{ alignItems: 'center' }}>
                <AppButton
                  icon={
                    allContactsSelected && contacts.length === 0
                      ? 'checkmark'
                      : 'profile'
                  }
                  iconSize={24}
                  shadow={false}
                  style={{
                    backgroundColor:
                      allContactsSelected && contacts.length === 0
                        ? Colors.purple
                        : Colors.purpleDimmed,
                    height: 50,
                    width: 50,
                    borderRadius: 10,
                    marginBottom: 10,
                  }}
                  disabled
                  onPress={() => {}}
                />
                <AppText
                  numberOfLines={2}
                  style={styles.selectionRowText}
                  color="black">
                  All Contacts
                </AppText>
              </View>
            </ScaleTouchable>
            <ScaleTouchable
              style={styles.selectionRow}
              onPress={() => navigateContactList(true)}>
              <View style={{ alignItems: 'center' }}>
                <AppButton
                  icon={contacts.length !== 0 ? 'checkmark' : 'profile'}
                  iconSize={24}
                  shadow={false}
                  style={{
                    backgroundColor:
                      contacts.length !== 0
                        ? Colors.purple
                        : Colors.purpleDimmed,
                    height: 50,
                    width: 50,
                    borderRadius: 10,
                    marginBottom: 10,
                  }}
                  disabled
                  onPress={() => {}}
                />
                <AppText style={styles.selectionRowText} color="black">
                  Select Contacts
                </AppText>
              </View>
            </ScaleTouchable>
            <ScaleTouchable
              style={styles.selectionRow}
              onPress={() => navigateContactList(false)}>
              <View style={{ alignItems: 'center' }}>
                <AppButton
                  icon={groups.length !== 0 ? 'checkmark' : 'group-senior'}
                  iconSize={18}
                  shadow={false}
                  style={{
                    backgroundColor:
                      groups.length !== 0 ? Colors.purple : Colors.purpleDimmed,
                    height: 50,
                    width: 50,
                    borderRadius: 10,
                    marginBottom: 10,
                  }}
                  disabled
                  onPress={() => {}}
                />
                <AppText style={styles.selectionRowText} color="black">
                  Select Groups
                </AppText>
              </View>
            </ScaleTouchable>
            {/* <ScaleTouchable
              style={styles.selectionRow}
              onPress={() => dispatch(setIsAskExperts(true))}>
              <View style={{ alignItems: 'center' }}>
                <AppButton
                  icon={isAskExperts ? 'checkmark' : 'message-dot'}
                  iconSize={18}
                  shadow={false}
                  style={{
                    backgroundColor: isAskExperts
                      ? Colors.purple
                      : Colors.purpleDimmed,
                    height: 50,
                    width: 50,
                    borderRadius: 10,
                    marginBottom: 10,
                  }}
                  disabled
                  onPress={() => {}}
                />
                <AppText style={styles.selectionRowText} color="black">
                  Berry's Experts
                </AppText>
              </View>
            </ScaleTouchable> */}
            <ScaleTouchable
              style={styles.selectionRow}
              onPress={() => dispatch(setIsFollowedInterests(true))}>
              <View style={{ alignItems: 'center' }}>
                <AppButton
                  icon={isFollowedInterests ? 'checkmark' : 'message-dot'}
                  iconSize={18}
                  shadow={false}
                  style={{
                    backgroundColor: isFollowedInterests
                      ? Colors.purple
                      : Colors.purpleDimmed,
                    height: 50,
                    width: 50,
                    borderRadius: 10,
                    marginBottom: 10,
                  }}
                  disabled
                  onPress={() => {}}
                />
                <AppText style={styles.selectionRowText} color="black">
                  Followed Interests
                </AppText>
              </View>
            </ScaleTouchable>
          </View>
        </View>
      </View>
    )
  }

  const getInnerCircleStyle = (idx) => {
    const totalLength = targetedInterests.length + targetedCountries.length
    switch (totalLength) {
      case 1:
        return { ...styles.targetedInnerCircleFirst, left: null }
      case 2:
        if (idx === 0) return styles.targetedInnerCircleFirst
        else return styles.targetedInnerCircleSecond
      case 3:
        if (idx === 0)
          return { ...styles.targetedInnerCircleFirst, bottom: -20 }
        if (idx === 1)
          return { ...styles.targetedInnerCircleSecond, bottom: -20 }
        else return styles.targetedInnerCircleThird
    }
  }

  const renderTargetedUsers = () => {
    return (
      <View style={styles.extraOuterContainer}>
        <TouchableOpacity
          style={[
            styles.extraContainer,
            (targetedInterests.length > 0 || targetedCountries.length > 0) &&
              styles.extraSelected,
          ]}
          onPress={() =>
            NavigationService.navigate(Screens.SelectTargetedUsers)
          }>
          {targetedInterests.length > 0 || targetedCountries.length > 0 ? (
            <View style={{ justifyContent: 'center', alignItems: 'center' }}>
              {[...targetedInterests, ...targetedCountries].map((item, idx) => {
                return (
                  <View
                    style={[
                      styles.targetedInnerCircle,
                      getInnerCircleStyle(idx),
                    ]}>
                    <AppText
                      fontSize={FontSize.medium}
                      color="black"
                      style={{ textAlign: 'center' }}>
                      {item.name
                        .split(' ')
                        .map((i) => i.charAt(0).toUpperCase() + i.slice(1))
                        .join(' ')}
                    </AppText>
                  </View>
                )
              })}
            </View>
          ) : (
            <View
              style={{
                height: 60,
                width: 60,
                borderRadius: 30,
                backgroundColor: Colors.purple,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <AppIcon name="plus" size={30} color="white" />
            </View>
          )}
        </TouchableOpacity>
        <AppText color="black" fontSize={FontSize.normal}>
          Targeted Users
        </AppText>
        <TouchableOpacity
          disabled={
            targetedInterests.length === 0 && targetedCountries.length === 0
          }
          onPress={() => {
            dispatch(setTargetedCountries([]))
            dispatch(setTargetedInterests([]))
          }}>
          <AppText
            weight="medium"
            color={
              targetedInterests.length === 0 && targetedCountries.length === 0
                ? 'transparent'
                : '#2F80ED'
            }
            fontSize={FontSize.normal}>
            Clear
          </AppText>
        </TouchableOpacity>
      </View>
    )
  }

  const renderLikeMindedUsers = () => {
    return (
      <View style={styles.extraOuterContainer}>
        <TouchableOpacity
          style={[styles.extraContainer, isLikeMinded && styles.extraSelected]}
          onPress={() => dispatch(setLikeMinded(!isLikeMinded))}>
          <Image
            source={Images.likeMinded}
            style={{
              resizeMode: 'contain',
              height: 60,
              width: 60,
            }}
          />
        </TouchableOpacity>
        <AppText color="black" fontSize={FontSize.normal}>
          Like-Minded Users
        </AppText>
        <View>
          <AppText
            weight="medium"
            color="transparent"
            fontSize={FontSize.normal}>
            Clear
          </AppText>
        </View>
      </View>
    )
  }

  return (
    <Layout>
      <SafeAreaView style={styles.container}>
        <View style={{ flex: 1 }}>
          <View
            style={{
              flex: 1,
            }}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                paddingBottom: 10,
                paddingHorizontal: 16,
                paddingLeft: 30,
                borderBottomColor: Colors.backgroundDarker,
                borderBottomWidth: 1,
                marginBottom: 10,
              }}>
              <Avatar source={Images.newProfile} size={24} />
              <AppInput
                placeholder={
                  question !== '' && question
                    ? question
                    : 'What do you think about today?'
                }
                value={question}
                onChange={questionOnChange}
                placeholderTextColor={Colors.gray}
                style={{
                  color: 'black',
                  marginLeft: 15,
                  paddingRight: 90,
                  paddingTop: 0,
                  height: undefined,
                  maxHeight: 180,
                }}
                multiline
                editable={!route.params?.isSharing}
              />
            </View>
            <ScrollView>
              {(!route.params?.isSharing || route.params?.isPopular) && (
                <View>
                  <AppText
                    color="black"
                    fontSize={FontSize.normal}
                    weight="medium"
                    style={{ marginLeft: 20, marginVertical: 10 }}>
                    How I'd like to ask:
                  </AppText>
                  <View
                    style={{
                      marginLeft: 10,
                      flexWrap: 'wrap',
                      width: '100%',
                      flexDirection: 'row',
                      alignItems: 'center',
                    }}>
                    <ScaleTouchable
                      onPress={() => toggleAnonymously(true)}
                      style={[
                        styles.itemContainer,
                        {
                          backgroundColor: isAnonymous
                            ? Colors.purpleLight
                            : 'white',
                          borderWidth: isAnonymous ? 1 : 0,
                        },
                      ]}>
                      <Avatar
                        source={Images.newAnonymous}
                        size={24}
                        overflow="visible"
                        style={{ marginRight: 10 }}
                      />
                      <AppText
                        color={isAnonymous ? Colors.purple : 'black'}
                        fontSize={FontSize.normal}
                        weight="medium">
                        Anonymous
                      </AppText>
                    </ScaleTouchable>
                    <ScaleTouchable
                      onPress={() => toggleAnonymously(false)}
                      style={[
                        styles.itemContainer,
                        {
                          backgroundColor: !isAnonymous
                            ? Colors.purpleLight
                            : 'white',
                          borderWidth: isAnonymous ? 0 : 1,
                        },
                      ]}>
                      <Avatar
                        source={Images.newNotAnonymous}
                        size={24}
                        overflow="visible"
                        style={{ marginRight: 10 }}
                      />
                      <AppText
                        color={!isAnonymous ? Colors.purple : 'black'}
                        fontSize={FontSize.normal}
                        weight="medium">
                        Not Anonymous
                      </AppText>
                    </ScaleTouchable>
                  </View>
                </View>
              )}
              <View
                style={{
                  marginTop: 20,
                  paddingHorizontal: 10,
                }}>
                <AppText
                  color="black"
                  fontSize={FontSize.normal}
                  weight="medium"
                  style={{ marginLeft: 10 }}>
                  Who can see and answer my post:
                </AppText>
                <View style={styles.extraSelectionContainer}>
                  {renderTargetedUsers()}
                  {renderLikeMindedUsers()}
                </View>
                <View
                  style={[
                    styles.contactsAndGroupsContainer,
                    { marginBottom: 15 },
                  ]}>
                  {renderContacts()}
                </View>
                <AppButton
                  text="Add Contacts & Groups"
                  style={{
                    marginHorizontal: 10,
                    backgroundColor: Colors.purpleLight,
                    borderRadius: 20,
                    marginBottom: 20,
                  }}
                  textStyle={{ color: Colors.purpleText, fontWeight: '100' }}
                  onPress={() => swiperRef.current.snapTo(0)}
                />
              </View>
            </ScrollView>
          </View>
          <AppButton
            text={route.params?.isSharing ? 'Share Post' : 'Confirm Post'}
            onPress={onPress}
            style={{
              marginBottom: 20,
              marginHorizontal: 20,
              backgroundColor: loading ? Colors.grayLight : Colors.purple,
            }}
            isLoading={loading}
            disabled={loading}
          />
        </View>
        <BottomSheet
          ref={swiperRef}
          snapPoints={['130%', 0]}
          initialSnap={1}
          renderContent={Selection}
          enabledContentTapInteraction={false}
          enabledInnerScrolling={false}
          onOpenStart={() => setSheetOpened(true)}
          onCloseStart={() => setSheetOpened(false)}
        />
      </SafeAreaView>
    </Layout>
  )
}

PostQuestion.propTypes = {
  navigation: PropTypes.object,
  route: PropTypes.object,
}

export default PostQuestion
