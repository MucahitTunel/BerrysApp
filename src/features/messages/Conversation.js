import React, { useEffect, useRef, useState } from 'react'
import PropTypes from 'prop-types'
import { useDispatch, useSelector } from 'react-redux'
import {
  StyleSheet,
  View,
  StatusBar,
  FlatList,
  TouchableOpacity,
} from 'react-native'
import moment from 'moment'
import { AppText, AppIcon, AppInput, Header, Avatar } from 'components'
import { MessagesBackButton } from 'components/NavButton'
import Constants from 'constants'
import { pusher } from 'features/auth/authSlice'
import {
  getMessages,
  sendMessage,
  sendPushNotification as sendPushNotificationAction,
} from 'features/messages/messagesSlice'
import getConversationName from 'utils/get-conversation-name'

const styles = StyleSheet.create({
  container: {
    height: Constants.Dimensions.Height,
    width: Constants.Dimensions.Width,
    backgroundColor: Constants.Colors.background,
    flex: 1,
  },
  contentView: {
    flex: 1,
    paddingTop: 16,
  },
  messageItemOuter: {
    marginBottom: 4,
    flexDirection: 'row',
    paddingHorizontal: 16,
  },
  messageItemInner: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    borderTopRightRadius: 16,
    borderBottomRightRadius: 16,
    borderWidth: 1,
    borderColor: Constants.Colors.grayLight,
    width: '80%',
  },
  myMessageItemInner: {
    backgroundColor: Constants.Colors.primaryLight,
    borderWidth: 0,
    borderTopRightRadius: 8,
    borderBottomRightRadius: 8,
    borderTopLeftRadius: 16,
    borderBottomLeftRadius: 16,
  },
  messageItemTime: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 4,
  },
  input: {
    height: 50,
    paddingHorizontal: 20,
    marginBottom: 10,
    borderRadius: 2,
    fontSize: 16,
    flex: 1,
  },
})

const Conversation = ({ navigation }) => {
  let listRef = useRef(null)
  const dispatch = useDispatch()
  const [message, setMessage] = useState(null)
  const user = useSelector((state) => state.auth.user)
  const room = useSelector((state) => state.messages.room)
  const messages = useSelector((state) => state.messages.messages)

  useEffect(() => {
    if (room && room._id) {
      const title = getConversationName(room)
      navigation.setOptions({
        header: () => (
          <Header
            title={title}
            headerLeft={<MessagesBackButton navigation={navigation} />}
            headerRight={<Avatar size={40} />}
          />
        ),
      })
      const callback = () => {
        if (listRef) {
          setTimeout(() => {
            listRef.scrollToIndex({ index: 0 })
          }, 500)
        }
      }
      dispatch(getMessages(callback))
      return () => {
        pusher.unsubscribe(room._id)
      }
    }
  }, [navigation, room, dispatch])

  const onChangeMessage = (msg) => setMessage(msg)
  const onSendMessage = () => {
    dispatch(
      sendMessage({
        content: message,
        roomId: room._id,
        userPhoneNumber: user.phoneNumber,
      }),
    )
    setMessage('')
    const otherUserNumber = room.members.find((m) => m !== user.phoneNumber)
    const msg = `${user.phoneNumber}: ${message}`
    sendPushNotification(otherUserNumber, msg)
  }
  const sendPushNotification = (phoneNumber, message) => {
    dispatch(sendPushNotificationAction({ phoneNumber, message }))
  }

  const renderMessage = (msg) => {
    const { phoneNumber } = user
    const isMyMessage = msg.userPhoneNumber === phoneNumber
    const content = msg && msg.content
    return (
      <View
        style={[
          styles.messageItemOuter,
          { justifyContent: `flex-${isMyMessage ? 'end' : 'start'}` },
        ]}>
        <View
          style={[
            styles.messageItemInner,
            isMyMessage && styles.myMessageItemInner,
          ]}>
          <AppText
            text={content}
            fontSize={16}
            color={
              isMyMessage ? Constants.Colors.white : Constants.Colors.black
            }
          />
          <View style={styles.messageItemTime}>
            <AppText
              text={moment(msg.createdAt).format('HH:mm')}
              color={
                isMyMessage ? Constants.Colors.white : Constants.Colors.gray
              }
            />
          </View>
        </View>
      </View>
    )
  }
  return (
    <View style={[styles.container]}>
      <StatusBar barStyle="light-content" />
      <View style={styles.contentView}>
        <FlatList
          inverted
          ref={(e) => {
            listRef = e
          }}
          data={messages}
          renderItem={({ item }) => renderMessage(item)}
          keyExtractor={(item) => String(item._id)}
        />
      </View>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          borderTopWidth: 1,
          borderTopColor: Constants.Colors.grayLight,
        }}>
        <AppInput
          style={styles.input}
          placeholder="Enter your message..."
          value={message}
          onChange={onChangeMessage}
        />
        <TouchableOpacity
          activeOpacity={message ? 0.2 : 1}
          style={{ paddingRight: 16 }}
          onPress={message ? onSendMessage : () => {}}>
          <AppIcon
            name="send"
            color={
              message ? Constants.Colors.primary : Constants.Colors.grayLight
            }
          />
        </TouchableOpacity>
      </View>
    </View>
  )
}

Conversation.propTypes = {
  navigation: PropTypes.objectOf(PropTypes.any).isRequired,
}

export default Conversation
