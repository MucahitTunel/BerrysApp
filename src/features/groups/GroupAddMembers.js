/* eslint-disable react/prop-types */
import React, { useEffect } from 'react'
import PropTypes from 'prop-types'
import { useDispatch, useSelector } from 'react-redux'
import { SafeAreaView, StyleSheet } from 'react-native'
import { ContactsList, Header, Layout } from 'components'
import { Colors, Dimensions, Screens } from 'constants'
import { BackButton } from 'components/NavButton'
import * as NavigationService from 'services/navigation'
import {
  setNewGroupMembers,
  setNewGroupAdmins,
  setCurrentGroupMembers,
  setCurrentGroupAdmins,
} from './groupSlice'

import RNUxcam from 'react-native-ux-cam'
RNUxcam.tagScreenName('Group Add Members')

const styles = StyleSheet.create({
  container: {
    height: Dimensions.Height,
    width: Dimensions.Width,
    flex: 1,
  },
})

const GroupAddMembers = ({ navigation, route }) => {
  const dispatch = useDispatch()
  const allContacts = useSelector((state) => state.contacts.data)
  const { isAdmin, isCreate, groupCreator, list } = route.params

  const nonContact = list.filter(
    (c) => !allContacts.find((ac) => ac.phoneNumber === c.phoneNumber),
  )

  useEffect(() => {
    navigation.setOptions({
      header: () => (
        <Header
          title={route.params.isAdmin ? 'Add Admins' : 'Add Members'}
          headerLeft={<BackButton navigation={navigation} />}
        />
      ),
    })
  }, [navigation, route.params.isAdmin])

  const onPressSubmit = (members) => {
    const filtered = [...members.filter((m) => !m.isDefaultItem), ...nonContact]
    if (isCreate) {
      if (isAdmin) {
        dispatch(setNewGroupAdmins(filtered))
      } else {
        dispatch(setNewGroupMembers(filtered))
      }
    } else {
      if (isAdmin) {
        dispatch(setCurrentGroupAdmins(filtered))
      } else {
        dispatch(setCurrentGroupMembers(filtered))
      }
    }
    NavigationService.navigate(Screens.GroupUpsert, { isCreate })
  }

  const subTitle = isAdmin
    ? 'Select admins for group:'
    : 'Select members for group:'

  const selectedItems = list.map((i) => i.phoneNumber)

  return (
    <SafeAreaView style={styles.container}>
      <ContactsList
        onPressSubmit={onPressSubmit}
        checkCondition="isSelected"
        submitText="Confirm"
        subTitle={subTitle}
        defaultItem={groupCreator}
        selectedItems={selectedItems}
        showSelected={false}
      />
    </SafeAreaView>
  )
}

GroupAddMembers.propTypes = {
  navigation: PropTypes.objectOf(PropTypes.any).isRequired,
}

export default GroupAddMembers
