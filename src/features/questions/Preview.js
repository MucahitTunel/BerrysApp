import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  View,
  StatusBar,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native'
import { Dimensions, Colors, Styles } from 'constants'
import Images from 'assets/images'
import { Avatar, AppText, AppIcon, AppButton, AppImage } from 'components'
import { askQuestion, setAskAnonymously } from 'features/questions/askSlice'
import PropTypes from 'prop-types'

const styles = StyleSheet.create({
  container: {
    height: Dimensions.Height,
    width: Dimensions.Width,
    backgroundColor: Colors.white,
    flex: 1,
  },
  contentView: {
    backgroundColor: Colors.white,
    flex: 1,
    padding: 16,
  },
  headerView: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: Colors.grayLight,
    paddingBottom: 10,
    marginBottom: 14,
  },
})

const Preview = ({ route }) => {
  const requestToAsk = route && route.params && route.params.requestToAsk
  const ask = useSelector((state) => state.ask)
  const { isAnonymous } = ask
  const dispatch = useDispatch()
  const onConfirmQuestion = () => {
    dispatch(askQuestion(requestToAsk))
  }
  const renderContact = (contact) => {
    return (
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          paddingVertical: 10,
        }}>
        <Avatar source={Images.defaultAvatar} size={40} />
        <AppText fontSize={Styles.FontSize.large} style={{ marginLeft: 10 }}>
          {contact.name}
        </AppText>
      </View>
    )
  }
  const toggleAnonymously = () => {
    dispatch(setAskAnonymously(!isAnonymous))
  }
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <View style={styles.contentView}>
        <View style={{ marginBottom: 24 }}>
          <View style={styles.headerView}>
            <AppIcon name="help-circle" size={20} />
            <AppText style={{ marginLeft: 8 }}>Question</AppText>
          </View>
          <AppText color={Colors.text} fontSize={Styles.FontSize.xLarge}>
            {ask && ask.question}
          </AppText>
        </View>

        <View style={{ flex: 1 }}>
          <View style={styles.headerView}>
            <AppIcon name="profile" size={20} />
            <AppText style={{ marginLeft: 8 }}>Contacts</AppText>
          </View>
          <View style={{ flex: 1 }}>
            <FlatList
              data={ask.contacts}
              renderItem={({ item }) => renderContact(item)}
              keyExtractor={(item) => item.phoneNumber}
            />
          </View>
        </View>
        <View style={{ paddingTop: 10 }}>
          <TouchableOpacity
            style={styles.contactItem}
            onPress={toggleAnonymously}>
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
                fontSize={Styles.FontSize.large}>
                Ask Anonymously
              </AppText>
            </View>
          </TouchableOpacity>
        </View>
      </View>
      <View style={{ padding: 10, backgroundColor: Colors.white }}>
        <AppButton onPress={onConfirmQuestion} text="Confirm Post" />
      </View>
    </SafeAreaView>
  )
}

Preview.propTypes = {
  route: PropTypes.object.isRequired,
}

Preview.defaultProps = {
  route: {},
}

export default Preview
