import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { Alert, TouchableOpacity, View } from 'react-native'
import { ContactsList, AppText, AppIcon } from 'components'
import { joinRoom } from 'features/messages/messagesSlice'
import { FontSize, Colors } from 'constants'

import RNUxcam from 'react-native-ux-cam'
RNUxcam.tagScreenName('Message Contacts')

const MessageContacts = (props) => {
  const dispatch = useDispatch()

  const [isAnonymous, setIsAnonymous] = useState(true)

  const onPressSubmit = (contacts) => {
    if (contacts.length < 1) {
      return Alert.alert(
        'Warning',
        'You have to select a contact to send messages to',
      )
    }
    const contact = contacts[0]

    dispatch(
      joinRoom({
        phoneNumber: contact.phoneNumber,
        isFromContactsList: true,
        isAnonymous,
      }),
    )
  }

  const anonymousDM = () => {
    return (
      <View
        style={{
          padding: 15,
        }}>
        <TouchableOpacity onPress={() => setIsAnonymous(!isAnonymous)}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <View
              style={{
                height: 30,
                width: 30,
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: isAnonymous ? Colors.purple : Colors.grayLight,
                borderRadius: 15,
              }}>
              <AppIcon name="checkmark" color="white" size={20} />
            </View>
            <AppText
              color={Colors.purpleText}
              fontSize={FontSize.large}
              style={{ marginLeft: 10 }}
              weight="bold">
              Send DM Anonymously
            </AppText>
          </View>
        </TouchableOpacity>
      </View>
    )
  }

  return (
    <ContactsList
      checkCondition="isSelected"
      submitText="Message"
      singleSelect
      showRightText={false}
      onPressSubmit={onPressSubmit}
      subTitle="Select a contact to send messages:"
      {...props}
      checkboxComponent={anonymousDM}
    />
  )
}

export default MessageContacts
