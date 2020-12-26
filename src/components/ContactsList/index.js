import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import PropTypes from 'prop-types'
import { SceneMap, TabView, TabBar } from 'react-native-tab-view'
import {
  SafeAreaView,
  ScrollView,
  SectionList,
  StatusBar,
  StyleSheet,
  View,
  FlatList,
} from 'react-native'
import { Colors, Dimensions, FontSize } from 'constants'
import Fonts from 'assets/fonts'
import Images from 'assets/images'
import AskUserNameModal from '../../features/questions/AskUserNameModal'
import { getGroups } from 'features/groups/groupSlice'
import { setAskAnonymously } from 'features/questions/askSlice'
import AppButton from '../AppButton'
import AppIcon from '../AppIcon'
import AppImage from '../AppImage'
import AppInput from '../AppInput'
import AppText from '../AppText'
import Avatar from '../Avatar'
import ScaleTouchable from '../ScaleTouchable'

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
  isGroup,
  isLoading,
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
  const myGroups = useSelector((state) => state.group.groups)
  const [isAskUserNameModalVisible, setIsAskUserNameModalVisible] = useState(
    false,
  )
  const [searchText, setSearchText] = useState('')
  const [contacts, setContacts] = useState(
    allContacts
      .map((c) => {
        if (
          route &&
          route.params &&
          route.params.requester &&
          route.params.requester.phoneNumber === c.phoneNumber
        ) {
          return {
            ...c,
            isSelected: true,
          }
        }
        return c
      })
      .filter((c) => {
        return !!c[checkCondition]
      }),
  )
  const [groups, setGroups] = useState([])
  const [tabIndex, setTabIndex] = React.useState(0)
  const [routes] = React.useState([
    { key: 'first', title: 'Contacts' },
    { key: 'second', title: 'Groups' },
  ])

  const changeTabsView = (index) => {
    setTabIndex(index)
  }

  const onChangeSearchText = (value) => setSearchText(value)
  const onSelectGroup = (group) => {
    let newGroups = []
    if (groups.indexOf(group._id) >= 0) {
      newGroups = groups.filter((gid) => gid !== group._id)
    } else {
      newGroups = [...groups, group._id]
    }
    setGroups(newGroups)
  }
  const onSelectContact = (item) => {
    const existed = contacts.find(
      (c) =>
        c.phoneNumber && item.phoneNumber && c.phoneNumber === item.phoneNumber,
    )
    const newValue = !item[checkCondition]
    let res
    if (!singleSelect) {
      if (existed) {
        res = contacts.map((c) => {
          if (
            c.phoneNumber &&
            item.phoneNumber &&
            c.phoneNumber === item.phoneNumber
          ) {
            return {
              ...c,
              [checkCondition]: newValue,
            }
          }
          return c
        })
      } else {
        res = [
          ...contacts,
          {
            ...item,
            [checkCondition]: newValue,
          },
        ]
      }
    } else if (existed) {
      res = []
    } else {
      res = [
        {
          ...item,
          [checkCondition]: newValue,
        },
      ]
    }
    setContacts(res)
  }
  const showRightText = false

  const renderGroup = ({ item }) => {
    const text = item.name
    const isChecked = groups.indexOf(item._id) >= 0
    return (
      <ScaleTouchable
        key={item._id}
        style={styles.contactItem}
        onPress={() => onSelectGroup(item)}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Avatar source={Images.defaultAvatar} size={38} />
          <AppText style={{ marginLeft: 10 }} weight="medium">
            {text}
          </AppText>
        </View>
        <View>
          <AppImage
            source={isChecked ? Images.checkmarkSelected : Images.checkmark}
            width={20}
            height={20}
          />
        </View>
      </ScaleTouchable>
    )
  }

  const renderContact = (item) => {
    const isChecked = item[checkCondition]
    let text = item.name
    if (isChecked && checkCondition === 'isBlocked') {
      text = `${item.name} (invisible)`
    }
    if (isChecked && checkCondition === 'isBlacklisted') {
      text = `${item.name} (blacklisted)`
    }
    const rightText = showRightText && item.isAppUser ? `active` : ''
    return (
      <ScaleTouchable
        key={item._id}
        style={styles.contactItem}
        onPress={() => onSelectContact(item)}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Avatar source={Images.defaultAvatar} size={38} />
          <AppText style={{ marginLeft: 10 }} weight="medium">
            {text}
            <AppText color={Colors.gray}>{rightText}</AppText>
          </AppText>
        </View>
        <View>
          <AppImage
            source={isChecked ? Images.checkmarkSelected : Images.checkmark}
            width={20}
            height={20}
          />
        </View>
      </ScaleTouchable>
    )
  }

  const renderHeader = (key) => {
    if (!key) return null
    return (
      <View style={styles.sectionHeader}>
        <AppText fontSize={FontSize.medium} weight="medium">
          {key}
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

  let searchRes
  if (searchText) {
    searchRes = allContacts.filter((c) => {
      const regex = new RegExp(searchText, 'gmi')
      return (
        regex.test(c.name) || regex.test(c.phoneNumber) || regex.test(c.email)
      )
    })
  } else {
    searchRes = allContacts
  }

  const contactsToRender = searchRes.map((contact) => {
    const existed = contacts.find(
      (c) =>
        c.phoneNumber &&
        contact.phoneNumber &&
        c.phoneNumber === contact.phoneNumber,
    )
    return existed || contact
  })
  const activeContacts = contactsToRender.filter((c) => !!c.isAppUser)
  const sortedActiveContacts = activeContacts.sort(sortAlphabetically)
  const groupActiveContacts = [
    {
      title: null,
      data: sortedActiveContacts,
    },
  ]
  const inactiveContacts = contactsToRender.filter((c) => !c.isAppUser)
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

  const groupedContactsArr = Object.values(groupedContacts).map((group) => {
    return { title: group.key, data: group.children }
  })

  const arr = [...groupActiveContacts, ...groupedContactsArr]

  const isShowingGroups = tabIndex === 1

  const toggleAnonymously = () => {
    dispatch(setAskAnonymously(!isAnonymous))
  }

  const onPress = () => {
    if (isPostQuestion && !isAnonymous && !user.name) {
      setIsAskUserNameModalVisible(true)
    } else {
      onPressSubmit(
        contacts.filter((c) => c[checkCondition]),
        request,
      )
    }
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
              <AppText style={{ marginLeft: 16, flex: 1 }}>
                {ask.question}
              </AppText>
            </View>
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
              {!!contacts.filter((c) => c[checkCondition]) && (
                <View
                  style={{
                    flexDirection: 'row',
                    marginVertical: 12,
                    flexWrap: 'wrap',
                  }}>
                  {contacts
                    .filter((c) => c[checkCondition])
                    .map((contact) => {
                      return (
                        <ScaleTouchable
                          key={contact._id}
                          onPress={() => onSelectContact(contact)}
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
                  {groups.map((groupId) => {
                    const group = myGroups.find((g) => g._id === groupId)
                    return (
                      <ScaleTouchable
                        key={groupId}
                        onPress={() => onSelectGroup(group)}
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
                          {group.name}
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
              onChangeText={onChangeSearchText}
            />
          </View>
        </View>
        {isGroup && (
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
        {isShowingGroups ? (
          <FlatList
            style={styles.flatListView}
            data={myGroups}
            renderItem={renderGroup}
            keyExtractor={(item) => item._id}
          />
        ) : (
          <SectionList
            style={styles.flatListView}
            sections={arr}
            keyExtractor={(item, i) => item + i}
            renderItem={({ item }) => renderContact(item)}
            renderSectionHeader={({ section: { title } }) =>
              renderHeader(title)
            }
          />
        )}
      </ScrollView>
      <View
        style={{
          padding: 10,
          backgroundColor: Colors.white,
        }}>
        <AppButton
          isLoading={isLoading}
          disabled={isLoading}
          onPress={onPress}
          text={submitText}
        />
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
  isGroup: PropTypes.bool,
  isLoading: PropTypes.bool,
}

ContactsList.defaultProps = {
  showRightText: false,
  submitText: 'Confirm Post',
  singleSelect: false,
  isPostQuestion: false,
  isGroup: false,
  isLoading: false,
}

export default ContactsList
