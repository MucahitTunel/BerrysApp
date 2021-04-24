import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { Alert, TouchableOpacity, View } from 'react-native'
import { ContactsList, AppImage, AppText } from 'components'
import { joinRoom } from 'features/messages/messagesSlice'
import Images from 'assets/images'
import { FontSize, Colors } from 'constants'

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
          padding: 12,
          backgroundColor: 'white',
        }}>
        <TouchableOpacity onPress={() => setIsAnonymous(!isAnonymous)}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <AppImage
              source={isAnonymous ? Images.checkmarkSelected : Images.checkmark}
              width={20}
              height={20}
            />
            <AppText
              color={Colors.text}
              fontSize={FontSize.large}
              style={{ marginLeft: 10 }}>
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
