import React, { useState, useEffect, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import PropTypes from 'prop-types'
import { SceneMap, TabView, TabBar } from 'react-native-tab-view'
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  View,
  Alert,
  Image,
} from 'react-native'
import { useKeyboard } from '@react-native-community/hooks'
import { Colors, Dimensions, FontSize } from 'constants'
import Fonts from 'assets/fonts'
import Images from 'assets/images'
import AskUserNameModal from '../../features/questions/AskUserNameModal'
import { getGroups } from 'features/groups/groupSlice'
import {
  setAskAnonymously,
  setAskQuestion,
  setQuestionImage,
} from 'features/questions/askSlice'
import AppButton from '../AppButton'
import AppIcon from '../AppIcon'
import AppImage from '../AppImage'
import AppInput from '../AppInput'
import AppText from '../AppText'
import Avatar from '../Avatar'
import ScaleTouchable from '../ScaleTouchable'
import ContactsListItem from '../ContactsListItem'
import RecyclerList from '../RecyclerListView'
import { launchImageLibrary } from 'react-native-image-picker'

const styles = StyleSheet.create({
  container: {
    height: Dimensions.Height,
    width: Dimensions.Width,
    backgroundColor: Colors.white,
    flex: 1,
  },
  flatListView: {
    backgroundColor: Colors.white,
    flex: 1,
    paddingHorizontal: 16,
  },
  contactItem: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderColor: 'rgba(151, 151, 151, 0.2)',
  },
  filterWrapper: {
    backgroundColor: Colors.white,
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  searchInput: { paddingLeft: 10, flex: 1 },
  sectionHeader: {
    backgroundColor: Colors.white,
    paddingTop: 10,
    paddingLeft: 20,
  },
})

const TabRoute = () => <View />

const ContactsList = ({
  checkCondition,
  singleSelect,
  submitText,
  onPressSubmit,
  route,
  subTitle,
  isPostQuestion,
  showGroups,
  isLoading,
  defaultItem,
  selectedItems = [],
}) => {
  const dispatch = useDispatch()
  useEffect(() => {
    dispatch(getGroups())
  }, [dispatch])
  const ask = useSelector((state) => state.ask)
  const user = useSelector((state) => state.auth.user)
  const { isAnonymous } = ask
  const request = route?.params?.request
  const allContacts = useSelector((state) => state.contacts.data)
  const allGroups = useSelector((state) =>
    state.group.groups.map((group) => {
      return { ...group, type: 'group' }
    }),
  )
  const keyboard = useKeyboard()
  const [isAskUserNameModalVisible, setIsAskUserNameModalVisible] = useState(
    false,
  )
  const [searchText, setSearchText] = useState('')
  const [contacts, setContacts] = useState(
    (defaultItem
      ? [
          defaultItem,
          ...allContacts.filter(
            (c) => c.phoneNumber !== defaultItem.phoneNumber,
          ),
        ]
      : allContacts
    )
      .map((c) => {
        const isRequester =
          route &&
          route.params &&
          route.params.requester &&
          route.params.requester.phoneNumber === c.phoneNumber
        const isSelected = selectedItems.indexOf(c.phoneNumber) >= 0
        const isDefaultItem = c.isDefaultItem
        if (isRequester || isSelected || isDefaultItem) {
          return {
            ...c,
            isSelected: true,
            type: 'contact',
          }
        }
        return c
      })
      .filter((c) => {
        return !!c[checkCondition]
      }),
  )
  const [tabIndex, setTabIndex] = React.useState(0)
  const [routes] = React.useState([
    { key: 'first', title: 'Contacts' },
    { key: 'second', title: 'Groups' },
  ])
  const [groupedActiveContacts, setGroupedActiveContacts] = useState([])
  const [groupedInactiveContacts, setGroupedInctiveContacts] = useState([])
  const [contactsArr, setContactsArr] = useState([])

  const changeTabsView = (index) => {
    setTabIndex(index)
  }

  const onChangeSearchText = (value) => {
    setSearchText(value)
    if (value !== '') {
      const newSearch = [
        ...groupedActiveContacts,
        ...groupedInactiveContacts,
      ].filter((item) => {
        if (item.type === 'contact' || item.type === 'group') {
          const regex = new RegExp(value, 'gmi')
          return (
            regex.test(item.name) ||
            regex.test(item.phoneNumber) ||
            regex.test(item.email)
          )
        }
      })
      setContactsArr(newSearch)
    } else
      setContactsArr([...groupedActiveContacts, ...groupedInactiveContacts])
  }

  const onSelectContact = (item) => {
    if (item.isDefaultItem) {
      return Alert.alert('Warning', 'Group creator cannot be removed')
    }

    const newValue = !(contacts.findIndex((x) => x._id === item._id) >= 0)

    if (singleSelect) return setContacts(newValue ? [item] : [])

    const selected = [...contacts]
    if (newValue) setContacts([...contacts, item])
    else setContacts(selected.filter((element) => element._id !== item._id))
  }

  const showRightText = false

  const renderGroup = (type, data) => {
    return (
      <ContactsListItem
        isChecked={[data._id] in seledtedContactIds}
        item={data}
        onPress={onSelectContact}
        style={styles.contactItem}
      />
    )
  }

  const seledtedContactIds = useMemo(() => {
    return Object.assign({}, ...contacts.map((item) => ({ [item._id]: true })))
  }, [contacts])

  const renderContact = (type, data) => {
    if (type === 'section') return renderHeader(data.title)
    return (
      <ContactsListItem
        isChecked={[data._id] in seledtedContactIds}
        checkCondition={checkCondition}
        item={data}
        onPress={onSelectContact}
        showRightText={showRightText}
        style={styles.contactItem}
        isContact={true}
      />
    )
  }

  const renderHeader = (title) => {
    if (!title) return null
    return (
      <View style={styles.sectionHeader}>
        <AppText fontSize={FontSize.xLarge} weight="medium">
          {title}
        </AppText>
      </View>
    )
  }

  const sortAlphabetically = (a, b) => {
    const nameA = a.name.toLowerCase()
    const nameB = b.name.toLowerCase()
    if (nameA < nameB) {
      return -1
    }
    if (nameA > nameB) {
      return 1
    }
    return 0
  }

  // Prepare contact list once
  // Only apply regex search and selection on this list for performance
  useEffect(() => {
    const activeContacts = allContacts
      .filter((c) => !!c.isAppUser)
      .map((c) => {
        return { ...c, type: 'contact' }
      })
    const sortedActiveContacts = activeContacts.sort(sortAlphabetically)
    setGroupedActiveContacts(sortedActiveContacts)

    const inactiveContacts = allContacts.filter((c) => !c.isAppUser)
    const sortedContacts = inactiveContacts.sort(sortAlphabetically)
    const groupedContacts = sortedContacts.reduce((r, e) => {
      // get first letter of name of current element
      const group = e.name[0]
      // if there is no property in accumulator with this letter create it
      if (!r[group]) {
        r[group] = { key: group, children: [e] }
      }
      // if there is push current element to children array for that letter
      else r[group].children.push(e)
      // return accumulator
      return r
    }, {})

    const groupedContactsArr = Object.values(groupedContacts)
      .map((group) => {
        const section = []
        section.push({
          type: 'section',
          title: group.key.charAt(0).toUpperCase() + group.key.slice(1),
        })
        section.push(
          ...group.children.map((contact) => {
            return { ...contact, type: 'contact' }
          }),
        )
        return section
      })
      .flat()

    setGroupedInctiveContacts(groupedContactsArr)

    setContactsArr([...sortedActiveContacts, ...groupedContactsArr])
  }, [allContacts])

  const isShowingGroups = tabIndex === 1

  const toggleAnonymously = () => {
    dispatch(setAskAnonymously(!isAnonymous))
  }

  const onPress = () => {
    if (isPostQuestion && !isAnonymous && !user.name) {
      setIsAskUserNameModalVisible(true)
    } else {
      onPressSubmit(
        contacts.filter((item) => item.type === 'contact'),
        contacts.filter((item) => item.type === 'group').map((g) => g._id),
        request,
      )
    }
  }

  const [image, setImage] = useState(null)
  useEffect(() => {
    if (route.params?.chooseImage) {
      dispatch(setQuestionImage(null))
      if (ask.question === '' || !ask.question)
        dispatch(setAskQuestion('What do you think about this?'))
      launchImageLibrary(
        {
          mediaType: 'photo',
          quality: 0.1,
        },
        (response) => {
          if (response.didCancel) return
          if (response.errorCode) return
          setImage(response.uri)
          dispatch(setQuestionImage(response.uri))
        },
      )
    }
  }, [route.params?.chooseImage, dispatch, ask])

  const questionOnChange = (value) => {
    dispatch(
      setAskQuestion(value !== '' ? value : 'What do you think about this?'),
    )
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <ScrollView>
        {isPostQuestion && (
          <>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                paddingVertical: 24,
                paddingHorizontal: 16,
                backgroundColor: Colors.white,
              }}>
              <Avatar source={Images.defaultAvatar} size={54} />
              <AppInput
                placeholder={ask.question}
                value={ask.question}
                onChange={questionOnChange}
                placeholderTextColor={Colors.gray}
                style={{ color: 'black', paddingRight: 90, paddingTop: 0 }}
                multiline
              />
            </View>
            {image && (
              <Image
                source={{ uri: image }}
                style={{ height: Dimensions.Height / 3, resizeMode: 'contain' }}
              />
            )}
            <View style={{ paddingVertical: 12, paddingHorizontal: 16 }}>
              <ScaleTouchable onPress={toggleAnonymously}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <AppImage
                    source={
                      isAnonymous ? Images.checkmarkSelected : Images.checkmark
                    }
                    width={20}
                    height={20}
                  />
                  <AppText
                    style={{ marginLeft: 10 }}
                    color={Colors.text}
                    fontSize={FontSize.large}>
                    Ask Anonymously
                  </AppText>
                </View>
              </ScaleTouchable>
            </View>
          </>
        )}
        <View style={styles.filterWrapper}>
          {!singleSelect && (
            <>
              <AppText fontSize={FontSize.xLarge} weight="medium">
                {subTitle}
              </AppText>
              {contacts.length > 0 && (
                <View
                  style={{
                    flexDirection: 'row',
                    marginVertical: 12,
                    flexWrap: 'wrap',
                  }}>
                  {contacts.map((contact) => {
                    return (
                      <ScaleTouchable
                        key={contact._id}
                        onPressItem={contact}
                        onPress={onSelectContact}
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
                          {contact.name}
                        </AppText>
                        <AppIcon name="close" size={10} color={Colors.gray} />
                      </ScaleTouchable>
                    )
                  })}
                </View>
              )}
            </>
          )}
          <View>
            <View
              style={{ position: 'absolute', top: 18, left: 20, zIndex: 1 }}>
              <AppIcon name="search" color={Colors.gray} size={20} />
            </View>
            <AppInput
              placeholder="Search"
              placeholderTextColor={Colors.gray}
              value={searchText}
              icon="search"
              style={{
                backgroundColor: Colors.background,
                paddingLeft: 50,
                fontSize: 15,
                fontFamily: Fonts.euclidCircularAMedium,
                color: Colors.text,
              }}
              onChange={onChangeSearchText}
            />
          </View>
        </View>
        {showGroups && (
          <TabView
            navigationState={{ index: tabIndex, routes }}
            renderTabBar={(props) => (
              <TabBar
                style={{ backgroundColor: Colors.white }}
                renderLabel={({ route, focused }) => (
                  <AppText
                    color={focused ? Colors.text : '#808080'}
                    weight="medium"
                    fontSize={17}>
                    {route.title}
                  </AppText>
                )}
                indicatorStyle={{ backgroundColor: Colors.primary }}
                {...props}
              />
            )}
            renderScene={SceneMap({
              first: TabRoute,
              second: TabRoute,
            })}
            onIndexChange={changeTabsView}
            initialLayout={{
              height: 0,
            }}
            style={{
              borderBottomWidth: 1,
              borderColor: Colors.background,
            }}
          />
        )}
        {(isShowingGroups ? allGroups.length > 0 : contactsArr.length > 0) && (
          <RecyclerList
            data={isShowingGroups ? allGroups : contactsArr}
            rowRenderer={isShowingGroups ? renderGroup : renderContact}
            extendedState={seledtedContactIds}
          />
        )}
      </ScrollView>
      <View
        style={{
          padding: 10,
          backgroundColor: Colors.white,
        }}>
        {!keyboard.keyboardShown && (
          <AppButton
            isLoading={isLoading}
            disabled={isLoading}
            onPress={onPress}
            text={submitText}
          />
        )}
      </View>

      {/* AskUserNameModal */}
      <AskUserNameModal
        isModalVisible={isAskUserNameModalVisible}
        setModalVisible={(value) => setIsAskUserNameModalVisible(value)}
      />
    </SafeAreaView>
  )
}

ContactsList.propTypes = {
  subTitle: PropTypes.string.isRequired,
  checkCondition: PropTypes.string.isRequired,
  onPressSubmit: PropTypes.func.isRequired,
  route: PropTypes.object.isRequired,
  showRightText: PropTypes.bool,
  submitText: PropTypes.string,
  singleSelect: PropTypes.bool,
  isPostQuestion: PropTypes.bool,
  showGroups: PropTypes.bool,
  isLoading: PropTypes.bool,
  defaultItem: PropTypes.object,
  selectedItems: PropTypes.array,
}

ContactsList.defaultProps = {
  showRightText: false,
  submitText: 'Confirm Post',
  singleSelect: false,
  isPostQuestion: false,
  showGroups: false,
  isLoading: false,
  defaultItem: null,
  selectedItems: [],
}

export default ContactsList
