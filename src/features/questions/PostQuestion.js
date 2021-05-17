import React, { useLayoutEffect, useEffect, useState } from 'react'
import {
  View,
  SafeAreaView,
  StyleSheet,
  BackHandler,
  ScrollView,
  Linking,
  AppState,
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
  askQuestion,
  setIsAskExperts,
} from 'features/questions/askSlice'
import * as NavigationService from '../../services/navigation'
import { AnswerRightButton, BackButton } from 'components/NavButton'
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

const styles = StyleSheet.create({
  container: {
    height: Dimensions.Height,
    width: Dimensions.Width,
    backgroundColor: 'transparent',
    flex: 1,
  },
  selectionRow: {
    marginTop: 20,
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
})

const PostQuestion = ({ navigation, route }) => {
  const dispatch = useDispatch()
  const question = useSelector((state) => state.ask.question)
  const contacts = useSelector((state) => state.ask.contacts)
  const contactPermission = useSelector(
    (state) => state.contacts.contactPermission,
  )
  const groups = useSelector((state) => state.ask.groups)
  const loading = useSelector((state) => state.ask.loading)
  const isAnonymous = useSelector((state) => state.ask.isAnonymous)
  const isAskExperts = useSelector((state) => state.ask.isAskExperts)
  const allContacts = useSelector((state) => state.contacts.data)

  const [allContactsSelected, setAllContactsSelected] = useState(false)
  const [sheetOpened, setSheetOpened] = useState(false)

  const selectedItems = contacts.map((c) => c.phoneNumber)
  const selectedGroups = groups.map((g) => g._id)

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
    dispatch(setIsAskExperts(false))
  }, [dispatch, route])

  useLayoutEffect(() => {
    navigation.setOptions({
      header: () => (
        <Header
          title={route.params?.isSharing ? 'Share Question' : 'Post Question'}
          headerLeft={
            <BackButton
              navigation={navigation}
              onPress={() => dispatch(setAskQuestion(null))}
            />
          }
          headerRight={
            <AnswerRightButton
              onPressDots={() => swiperRef.current.snapTo(0)}
            />
          }
        />
      ),
    })
  }, [navigation, dispatch, swiperRef, route])

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
      !isAskExperts &&
      !allContactsSelected &&
      groups.length === 0 &&
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
          return dispatch(createPoll())
        }
        if (post.type === 'popular-compare') {
          console.log(post)
          dispatch(setCompareImages([post.images[0], post.images[0]]))
          return dispatch(createCompare(true))
        }
        dispatch(askQuestion())
        return
      }

      switch (post.type) {
        case 'question':
          dispatch(shareQuestion({ id: post.id }))
        case 'poll':
          dispatch(sharePoll({ id: post.id }))
        case 'compare':
          dispatch(shareCompare({ id: post.id }))
      }
      alert('Post shared successfully!')
      return NavigationService.goBack()
    }

    if (allContactsSelected) dispatch(setAskContacts(allContacts))
    if (route.params?.poll) return dispatch(createPoll())
    if (route.params?.compare) return dispatch(createCompare())
    dispatch(askQuestion())
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
        {isAskExperts && (
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
        )}
        {[...contacts, ...groups, 'icon'].map((item) => {
          if (item === 'icon') {
            return (
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
            )
          }
          return (
            <ScaleTouchable
              key={item._id}
              onPress={() => {
                if (item.type === 'contact')
                  dispatch(
                    setAskContacts(contacts.filter((c) => c._id !== item._id)),
                  )
                else
                  dispatch(
                    setAskGroups(groups.filter((c) => c._id !== item._id)),
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
            <ScaleTouchable
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
            </ScaleTouchable>
          </View>
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
                paddingBottom: 20,
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
            {!contactPermission && (
              <AppButton
                text="Sync Your Contacts"
                onPress={() => Linking.openSettings()}
                style={{
                  height: 30,
                  marginTop: 10,
                  marginHorizontal: 20,
                  backgroundColor: Colors.primary,
                }}
                textStyle={{ fontSize: FontSize.large }}
              />
            )}
            <ScrollView>
              {(!route.params?.isSharing || route.params?.isPopular) && (
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <AppText
                    color="black"
                    fontSize={FontSize.normal}
                    weight="medium"
                    style={{ marginLeft: 20 }}>
                    Me:
                  </AppText>
                  <View
                    style={{
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
                            : 'transparent',
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
                            : 'transparent',
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
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginTop: 20,
                }}>
                <AppText
                  color="black"
                  fontSize={FontSize.normal}
                  weight="medium"
                  style={{ marginLeft: 20, marginRight: 5 }}>
                  To:
                </AppText>
                {renderContacts()}
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
