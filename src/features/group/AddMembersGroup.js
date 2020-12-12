/* eslint-disable react/prop-types */
import React, { useEffect } from 'react'
import PropTypes from 'prop-types'
import { useDispatch } from 'react-redux'
import { SafeAreaView, StyleSheet } from 'react-native'

import { ContactsList, Header } from 'components'
import { Colors, Dimensions, Screens } from 'constants'
import { BackButton } from 'components/NavButton'
import * as NavigationService from 'services/navigation'
import { setAdminsGroup, setMembersGroup } from './groupSlice'

const styles = StyleSheet.create({
  container: {
    height: Dimensions.Height,
    width: Dimensions.Width,
    backgroundColor: Colors.white,
    flex: 1,
  },
})

const AddMembersGroup = (props) => {
  const { navigation, route } = props
  const dispatch = useDispatch()
  const { isAdmin } = route.params
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
    if (isAdmin) {
      dispatch(setAdminsGroup(members))
    } else {
      dispatch(setMembersGroup(members))
    }
    NavigationService.navigate(Screens.UpsertGroup)
  }

  return (
    <SafeAreaView style={styles.container}>
      <ContactsList
        onPressSubmit={onPressSubmit}
        checkCondition="isSelected"
        submitText="Confirm"
        subTitle={
          isAdmin ? 'Select admins for group:' : 'Select members for group:'
        }
        {...props}
      />
    </SafeAreaView>
  )
}

AddMembersGroup.propTypes = {
  navigation: PropTypes.objectOf(PropTypes.any).isRequired,
}

export default AddMembersGroup
