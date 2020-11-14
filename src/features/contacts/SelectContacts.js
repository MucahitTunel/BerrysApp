import React from 'react'
import { Alert, View, SafeAreaView } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
import { ContactsList, Avatar, AppText, AppImage } from 'components'
import { Colors, Styles } from 'constants'
import { askQuestion, setAskAnonymously } from 'features/questions/askSlice'
import Images from 'assets/images'
import ScaleTouchable from '../../components/ScaleTouchable'

const SelectContacts = (props) => {
  const dispatch = useDispatch()
  const ask = useSelector((state) => state.ask)
  const { isAnonymous } = ask
  const onPressSubmit = (contacts, request) => {
    const MIN_NUM_CONTACTS = 3
    if (contacts.length < MIN_NUM_CONTACTS) {
      return Alert.alert(
        'Warning',
        `You have to select at least ${MIN_NUM_CONTACTS} contacts in order to proceed`,
      )
    }
    dispatch(askQuestion(request))
  }

  const toggleAnonymously = () => {
    dispatch(setAskAnonymously(!isAnonymous))
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          paddingVertical: 24,
          paddingHorizontal: 16,
          backgroundColor: Colors.white,
        }}>
        <Avatar source={Images.defaultAvatar} size={54} />
        <AppText style={{ marginLeft: 16, flex: 1 }}>{ask.question}</AppText>
      </View>
      <View style={{ paddingVertical: 12, paddingHorizontal: 16 }}>
        <ScaleTouchable onPress={toggleAnonymously}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <AppImage
              source={isAnonymous ? Images.checkmarkSelected : Images.checkmark}
              width={20}
              height={20}
            />
            <AppText
              style={{ marginLeft: 10 }}
              color={Colors.text}
              fontSize={Styles.FontSize.large}>
              Ask Anonymously
            </AppText>
          </View>
        </ScaleTouchable>
      </View>
      <ContactsList
        onPressSubmit={onPressSubmit}
        checkCondition="isSelected"
        subTitle="Select contacts:"
        {...props}
      />
    </SafeAreaView>
  )
}

export default SelectContacts
