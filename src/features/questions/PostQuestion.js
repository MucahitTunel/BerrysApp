import React, { useLayoutEffect, useEffect, useState } from 'react'
import {
  View,
  SafeAreaView,
  StyleSheet,
  BackHandler,
  ScrollView,
} from 'react-native'
import {
  AppInput,
  AppButton,
  Header,
  Avatar,
  ScaleTouchable,
  AppIcon,
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

const styles = StyleSheet.create({
  container: {
    height: Dimensions.Height,
    width: Dimensions.Width,
    backgroundColor: Colors.white,
    flex: 1,
  },
  selectionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
    justifyContent: 'space-between',
    borderBottomColor: Colors.grayLight,
    borderBottomWidth: 1.5,
    paddingBottom: 10,
  },
  selectionRowText: {
    marginLeft: 10,
  },
})

const PostQuestion = ({ navigation }) => {
  const dispatch = useDispatch()
  const question = useSelector((state) => state.ask.question)
  const contacts = useSelector((state) => state.ask.contacts)
  const groups = useSelector((state) => state.ask.groups)
  const loading = useSelector((state) => state.ask.loading)
  const isAnonymous = useSelector((state) => state.ask.isAnonymous)
  const isAskExperts = useSelector((state) => state.ask.isAskExperts)
  const allContacts = useSelector((state) => state.contacts.data)

  const selectedItems = contacts.map((c) => c.phoneNumber)
  const selectedGroups = groups.map((g) => g._id)

  const swiperRef = React.useRef(null)

  useLayoutEffect(() => {
    navigation.setOptions({
      header: () => (
        <Header
          title={'Post Question'}
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
  }, [navigation, dispatch, swiperRef])

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

  const toggleAnonymously = () => {
    dispatch(setAskAnonymously(!isAnonymous))
  }

  const onPress = () => {
    if (!question) {
      return alert('You have to write a question to continue!')
    }
    if (contacts.length === 0) dispatch(setAskContacts(allContacts))
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
          flexWrap: 'wrap',
        }}>
        {[...contacts, ...groups].map((item) => {
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
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                borderWidth: 1,
                borderColor: 'rgba(151, 151, 151, 0.53)',
                paddingVertical: 4,
                paddingHorizontal: 8,
                borderRadius: 5,
                marginRight: 10,
                marginBottom: 10,
              }}>
              <AppText
                color={Colors.gray}
                fontSize={FontSize.normal}
                weight="medium"
                style={{ marginRight: 10 }}>
                {item.name}
              </AppText>
              <AppIcon name="close" size={10} color={Colors.gray} />
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
          backgroundColor: Colors.blackDimmed,
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
            Who can see & Answer to your post?
          </AppText>
          <ScaleTouchable
            style={styles.selectionRow}
            onPress={() => dispatch(setAskContacts([]))}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <AppButton
                icon={contacts.length === 0 ? 'checkmark' : 'profile'}
                iconSize={24}
                shadow={false}
                style={{
                  backgroundColor:
                    contacts.length === 0 ? Colors.primary : Colors.grayLight,
                  height: 40,
                  width: 40,
                }}
                disabled
              />
              <AppText
                style={styles.selectionRowText}
                weight="medium"
                color="black">
                All Contacts
              </AppText>
            </View>
          </ScaleTouchable>
          <ScaleTouchable
            style={styles.selectionRow}
            onPress={() => navigateContactList(true)}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <AppButton
                icon={contacts.length !== 0 ? 'checkmark' : 'profile'}
                iconSize={24}
                shadow={false}
                style={{
                  backgroundColor:
                    contacts.length !== 0 ? Colors.primary : Colors.grayLight,
                  height: 40,
                  width: 40,
                }}
                disabled
              />
              <AppText
                style={styles.selectionRowText}
                weight="medium"
                color="black">
                Select Contacts
              </AppText>
            </View>
            <AppIcon name="chevron-right" size={24} color={Colors.gray} />
          </ScaleTouchable>
          <ScaleTouchable
            style={styles.selectionRow}
            onPress={() => navigateContactList(false)}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <AppButton
                icon={groups.length !== 0 ? 'checkmark' : 'group-senior'}
                iconSize={18}
                shadow={false}
                style={{
                  backgroundColor:
                    groups.length !== 0 ? Colors.primary : Colors.grayLight,
                  height: 40,
                  width: 40,
                }}
                disabled
              />
              <AppText
                style={styles.selectionRowText}
                weight="medium"
                color="black">
                Select Groups
              </AppText>
            </View>
            <AppIcon name="chevron-right" size={24} color={Colors.gray} />
          </ScaleTouchable>
          <ScaleTouchable
            style={styles.selectionRow}
            onPress={() => dispatch(setIsAskExperts(true))}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <AppButton
                icon={isAskExperts ? 'checkmark' : 'message-dot'}
                iconSize={18}
                shadow={false}
                style={{
                  backgroundColor: isAskExperts
                    ? Colors.primary
                    : Colors.grayLight,
                  height: 40,
                  width: 40,
                }}
                disabled
              />
              <AppText
                style={styles.selectionRowText}
                weight="medium"
                color="black">
                Berry's Experts
              </AppText>
            </View>
          </ScaleTouchable>
        </View>
      </View>
    )
  }

  return (
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
              paddingTop: 20,
              paddingBottom: 10,
              paddingHorizontal: 16,
              backgroundColor: Colors.white,
              borderBottomColor: Colors.background,
              borderBottomWidth: 4,
            }}>
            <Avatar source={Images.defaultAvatar} size={54} />
            <AppInput
              placeholder={
                question !== '' && question
                  ? question
                  : 'What do you think about this?'
              }
              value={question}
              onChange={questionOnChange}
              placeholderTextColor={Colors.gray}
              style={{ color: 'black', paddingRight: 90, paddingTop: 0 }}
              multiline
            />
          </View>
          <ScrollView>
            <View style={{ flexDirection: 'row' }}>
              <ScaleTouchable
                onPress={toggleAnonymously}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  borderWidth: 1,
                  borderColor: 'rgba(151, 151, 151, 0.53)',
                  paddingVertical: 5,
                  paddingHorizontal: 8,
                  borderRadius: 5,
                  marginLeft: 10,
                  marginTop: 10,
                  marginBottom: 10,
                }}>
                <AppText
                  color={Colors.gray}
                  fontSize={FontSize.normal}
                  weight="medium"
                  style={{ marginRight: 15 }}>
                  {isAnonymous ? 'Anonymous' : 'Not Anonymous'}
                </AppText>
                <AppIcon name="triangle" size={6} color={Colors.gray} />
              </ScaleTouchable>
              {contacts.length === 0 && (
                <ScaleTouchable
                  onPress={() => swiperRef.current.snapTo(0)}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    borderWidth: 1,
                    borderColor: 'rgba(151, 151, 151, 0.53)',
                    paddingVertical: 5,
                    paddingHorizontal: 8,
                    borderRadius: 5,
                    marginLeft: 10,
                    marginTop: 10,
                    marginBottom: 10,
                  }}>
                  <AppText
                    color={Colors.gray}
                    fontSize={FontSize.normal}
                    weight="medium"
                    style={{ marginRight: 15 }}>
                    All Contacts
                  </AppText>
                  <AppIcon name="triangle" size={6} color={Colors.gray} />
                </ScaleTouchable>
              )}
            </View>
            {isAskExperts && (
              <ScaleTouchable
                onPress={() => dispatch(setIsAskExperts(false))}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  borderWidth: 1,
                  borderColor: 'rgba(151, 151, 151, 0.53)',
                  paddingVertical: 5,
                  paddingHorizontal: 8,
                  borderRadius: 5,
                  marginLeft: 10,
                  marginBottom: 10,
                  width: Dimensions.Width / 2.6,
                }}>
                <AppText
                  color={Colors.gray}
                  fontSize={FontSize.normal}
                  weight="medium"
                  style={{ marginRight: 15 }}>
                  Berry's Experts
                </AppText>
                <AppIcon name="triangle" size={6} color={Colors.gray} />
              </ScaleTouchable>
            )}
            {(contacts.length > 0 || groups.length > 0) && renderContacts()}
          </ScrollView>
        </View>
        <AppButton
          text="Confirm Post"
          onPress={onPress}
          style={{
            marginBottom: 20,
            marginHorizontal: 20,
            backgroundColor: loading ? Colors.grayLight : Colors.primary,
          }}
          isLoading={loading}
          disabled={loading}
        />
      </View>
      <BottomSheet
        ref={swiperRef}
        snapPoints={['160%', 0]}
        initialSnap={1}
        renderContent={() => Selection()}
        enabledContentTapInteraction={false}
        enabledInnerScrolling={false}
      />
    </SafeAreaView>
  )
}

PostQuestion.propTypes = {
  navigation: PropTypes.object,
}

export default PostQuestion
