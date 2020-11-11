import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import PropTypes from 'prop-types'
import {
  SafeAreaView,
  SectionList,
  StatusBar,
  StyleSheet,
  View,
} from 'react-native'
import { Colors, Dimensions, Styles } from 'constants'
import {
  AppButton,
  AppIcon,
  AppImage,
  AppInput,
  AppText,
  Avatar,
  ScaleTouchable,
} from 'components'
import Fonts from 'assets/fonts'
import Images from 'assets/images'

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

const ContactsList = ({
  checkCondition,
  singleSelect,
  submitText,
  onPressSubmit,
  route,
}) => {
  const request = route && route.params && route.params.request
  const allContacts = useSelector((state) => state.contacts.data)
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
  const onChangeSearchText = (value) => setSearchText(value)
  const onSelectContact = (item) => {
    const existed = contacts.find(
      (c) =>
        (c.phoneNumber &&
          item.phoneNumber &&
          c.phoneNumber === item.phoneNumber) ||
        (c.email && item.email && c.email === item.email),
    )
    const newValue = !item[checkCondition]
    let res
    if (!singleSelect) {
      if (existed) {
        res = contacts.map((c) => {
          if (
            (c.phoneNumber &&
              item.phoneNumber &&
              c.phoneNumber === item.phoneNumber) ||
            (c.email && item.email && c.email === item.email)
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
        <AppText fontSize={Styles.FontSize.medium} weight="medium">
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
        (c.phoneNumber &&
          contact.phoneNumber &&
          c.phoneNumber === contact.phoneNumber) ||
        (c.email && contact.email && c.email === contact.email),
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
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <View style={styles.filterWrapper}>
        {!singleSelect && (
          <>
            <AppText fontSize={Styles.FontSize.xLarge} weight="medium">
              {`Share with `}
              <AppText fontSize={Styles.FontSize.normal} color={Colors.gray}>
                (Select at least 3 contacts)
              </AppText>
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
                          fontSize={Styles.FontSize.normal}
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
          <View style={{ position: 'absolute', top: 18, left: 20, zIndex: 1 }}>
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
      <SectionList
        style={styles.flatListView}
        sections={arr}
        keyExtractor={(item, index) => item + index}
        renderItem={({ item }) => renderContact(item)}
        renderSectionHeader={({ section: { title } }) => renderHeader(title)}
      />
      <View style={{ padding: 10, backgroundColor: Colors.white }}>
        <AppButton
          onPress={() =>
            onPressSubmit(
              contacts.filter((c) => c[checkCondition]),
              request,
            )
          }
          text={submitText}
        />
      </View>
    </SafeAreaView>
  )
}

ContactsList.propTypes = {
  showRightText: PropTypes.bool,
  submitText: PropTypes.string,
  checkCondition: PropTypes.string.isRequired,
  singleSelect: PropTypes.bool,
  onPressSubmit: PropTypes.func.isRequired,
  route: PropTypes.object.isRequired,
}

ContactsList.defaultProps = {
  showRightText: false,
  submitText: 'Confirm Post',
  singleSelect: false,
  route: {},
}

export default ContactsList
