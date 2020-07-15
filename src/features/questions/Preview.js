import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { View, StatusBar, StyleSheet, FlatList } from 'react-native'
import Constants from 'constants'
import Images from 'assets/images'
import { Avatar, AppText, AppIcon, AppButton } from 'components'
import { askQuestion } from 'features/questions/questionSlice'

const styles = StyleSheet.create({
  container: {
    height: Constants.Dimensions.Height,
    width: Constants.Dimensions.Width,
    backgroundColor: Constants.Colors.grayLight,
    flex: 1,
  },
  contentView: {
    backgroundColor: Constants.Colors.white,
    flex: 1,
    padding: 16,
  },
  headerView: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: Constants.Colors.grayLight,
    paddingBottom: 10,
    marginBottom: 14,
  },
})

const Preview = () => {
  const ask = useSelector((state) => state.question)
  const dispatch = useDispatch()
  const onConfirmQuestion = () => dispatch(askQuestion())
  const renderContact = (contact) => {
    return (
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          paddingVertical: 10,
        }}>
        <Avatar source={Images.defaultAvatar} size={40} />
        <AppText
          text={contact.name}
          fontSize={Constants.Styles.FontSize.large}
          style={{ marginLeft: 10 }}
        />
      </View>
    )
  }
  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <View style={styles.contentView}>
        <View style={{ marginBottom: 24 }}>
          <View style={styles.headerView}>
            <AppIcon name="help-circle" size={20} />
            <AppText text="Question" style={{ marginLeft: 8 }} />
          </View>
          <AppText
            text={ask && ask.question}
            color={Constants.Colors.text}
            fontSize={Constants.Styles.FontSize.xLarge}
          />
        </View>

        <View style={{ flex: 1 }}>
          <View style={styles.headerView}>
            <AppIcon name="user" size={20} />
            <AppText text="Contacts" style={{ marginLeft: 8 }} />
          </View>
          <View style={{ flex: 1 }}>
            <FlatList
              data={ask.contacts}
              renderItem={({ item }) => renderContact(item)}
              keyExtractor={(item) => item.phoneNumber}
            />
          </View>
        </View>
      </View>
      <View style={{ padding: 10, backgroundColor: Constants.Colors.white }}>
        <AppButton
          onPress={onConfirmQuestion}
          text="Confirm"
          backgroundColor={Constants.Colors.primary}
          color={Constants.Colors.white}
          borderRadius={Constants.Styles.BorderRadius.small}
        />
      </View>
    </View>
  )
}

export default Preview
