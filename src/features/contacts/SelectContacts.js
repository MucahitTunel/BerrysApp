import React from 'react'
import { Alert, View } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
import * as NavigationService from 'services/navigation'
import { ContactsList, Avatar, AppText } from 'components'
import { Colors, Screens } from 'constants'
import { setAskContacts } from 'features/questions/askSlice'
import Images from 'assets/images'

const SelectContacts = (props) => {
  const dispatch = useDispatch()
  const ask = useSelector((state) => state.ask)
  const onPressSubmit = (contacts, request) => {
    const MIN_NUM_CONTACTS = 3
    if (contacts.length < MIN_NUM_CONTACTS) {
      return Alert.alert(
        'Warning',
        `You have to select at least ${MIN_NUM_CONTACTS} contacts in order to proceed`,
      )
    }
    dispatch(setAskContacts(contacts))
    return NavigationService.navigate(Screens.Preview, {
      requestToAsk: request,
    })
  }

  return (
    <>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          paddingVertical: 24,
          paddingHorizontal: 16,
          backgroundColor: Colors.white,
          marginBottom: 8,
        }}>
        <Avatar source={Images.defaultAvatar} size={54} />
        <AppText style={{ marginLeft: 16, flex: 1 }}>{ask.question}</AppText>
      </View>
      <ContactsList
        onPressSubmit={onPressSubmit}
        checkCondition="isSelected"
        {...props}
      />
    </>
  )
}

export default SelectContacts
