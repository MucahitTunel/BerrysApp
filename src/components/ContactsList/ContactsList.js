import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import PropTypes from 'prop-types'
import {
  View,
  StatusBar,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  SectionList,
} from 'react-native'
import Constants from 'constants'
import Fonts from 'assets/fonts'
import { AppText, AppIcon, AppButton } from 'components'

const styles = StyleSheet.create({
  container: {
    height: Constants.Dimensions.Height,
    width: Constants.Dimensions.Width,
    backgroundColor: Constants.Colors.grayLight,
    flex: 1,
  },
  flatListView: {
    backgroundColor: Constants.Colors.white,
    flex: 1,
  },
  contactItem: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  searchView: {
    flexDirection: 'row',
    backgroundColor: Constants.Colors.white,
    paddingHorizontal: 10,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: Constants.Colors.grayLight,
  },
  searchInput: { paddingLeft: 10, flex: 1 },
  sectionHeader: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: Constants.Colors.grayLight,
    backgroundColor: Constants.Colors.white,
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
      <TouchableOpacity
        key={item._id}
        style={styles.contactItem}
        onPress={() => onSelectContact(item)}>
        <View style={{ flexDirection: 'row' }}>
          <AppIcon
            name={isChecked ? 'radio-checked' : 'radio-unchecked'}
            size={14}
          />
          <AppText
            style={{ marginLeft: 10 }}
            text={text}
            color={Constants.Colors.text}
            fontSize={Constants.Styles.FontSize.large}
          />
        </View>
        <View>
          <AppText text={rightText} color={Constants.Colors.gray} />
        </View>
      </TouchableOpacity>
    )
  }

  const renderHeader = (key) => {
    if (!key) return null
    return (
      <View style={styles.sectionHeader}>
        <AppText
          text={key}
          color={Constants.Colors.text}
          fontFamily={Fonts.latoBold}
          fontSize={Constants.Styles.FontSize.large}
        />
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
  const placeholder = `Search in ${allContacts.length} contacts ...`
  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <View style={styles.searchView}>
        <AppIcon name="search" color={Constants.Colors.gray} size={20} />
        <TextInput
          placeholder={placeholder}
          style={styles.searchInput}
          value={searchText}
          onChangeText={onChangeSearchText}
        />
      </View>
      <SectionList
        style={styles.flatListView}
        sections={arr}
        keyExtractor={(item, index) => item + index}
        renderItem={({ item }) => renderContact(item)}
        renderSectionHeader={({ section: { title } }) => renderHeader(title)}
      />
      <View style={{ padding: 10, backgroundColor: Constants.Colors.white }}>
        <AppButton
          onPress={() =>
            onPressSubmit(
              contacts.filter((c) => c[checkCondition]),
              request,
            )
          }
          text={submitText}
          backgroundColor={Constants.Colors.primary}
          color={Constants.Colors.white}
          borderRadius={Constants.Styles.BorderRadius.small}
        />
      </View>
    </View>
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
  submitText: 'Submit',
  singleSelect: false,
  route: {},
}

export default ContactsList
