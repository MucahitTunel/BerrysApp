import React, { useEffect, useRef, useState } from 'react'
import PropTypes from 'prop-types'
import { useDispatch, useSelector } from 'react-redux'
import {
  StyleSheet,
  View,
  StatusBar,
  FlatList,
  SafeAreaView,
  Animated,
  Keyboard,
} from 'react-native'
import moment from 'moment'
import { AppText, AppInput, Header, AppButton, AppBadge } from 'components'
import { MessagesBackButton } from 'components/NavButton'
import { Dimensions, Colors, FontSize } from 'constants'
import { pusher } from 'features/auth/authSlice'
import {
  getMessages,
  sendMessage,
  sendPushNotification as sendPushNotificationAction,
} from 'features/messages/messagesSlice'
import request from 'services/api'
import getConversationName from 'utils/get-conversation-name'
import KeyboardListener from 'react-native-keyboard-listener'
import { hideKeyBoard, showKeyboard } from 'utils'

const styles = StyleSheet.create({
  container: {
    height: Dimensions.Height,
    width: Dimensions.Width,
    backgroundColor: Colors.white,
    flex: 1,
  },
  contentView: {
    flex: 1,
    paddingTop: 6,
  },
  messageItemOuter: {
    marginBottom: 4,
    flexDirection: 'row',
    paddingHorizontal: 16,
  },
  messageItemInner: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 4,
    borderTopRightRadius: 16,
    borderBottomRightRadius: 16,
    borderWidth: 1,
    borderColor: Colors.grayLight,
    width: '80%',
  },
  myMessageItemInner: {
    backgroundColor: Colors.primaryLight,
    borderWidth: 0,
    borderTopRightRadius: 4,
    borderBottomRightRadius: 4,
    borderTopLeftRadius: 16,
    borderBottomLeftRadius: 16,
  },
  messageItemTime: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 4,
  },
  inputView: {
    padding: 16,
    paddingBottom: 10,
    backgroundColor: Colors.white,
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    height: 48,
    borderRadius: 24,
    marginLeft: 10,
    flex: 1,
    borderWidth: 1,
    borderColor: Colors.grayLight,
    color: Colors.text,
    fontSize: FontSize.large,
    paddingVertical: 14,
    paddingHorizontal: 16,
    marginRight: 10,
  },
  descriptionBox: {
    backgroundColor: Colors.white,
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  description: {
    marginLeft: 8,
    color: Colors.primaryLight,
    textAlign: 'center',
    fontSize: 14,
  },
})

const Conversation = ({ navigation }) => {
  let keyboardHeight = useRef(new Animated.Value(0))
  let listRef = useRef(null)
  const dispatch = useDispatch()
  const [message, setMessage] = useState(null)
  const [commonGroup, setCommonGroup] = useState(null)
  const user = useSelector((state) => state.auth.user)
  const room = useSelector((state) => state.messages.room)
  const messages = useSelector((state) => state.messages.messages)
  const description =
    room && room._id ? getConversationName(room).description : 'description'

  useEffect(() => {
    const getCommonGroup = async () => {
      const { data } = await request({
        method: 'GET',
        url: 'chat/common-group',
        params: {
          roomId: room._id,
        },
      })
      const { group } = data
      setCommonGroup(group)
    }
    if (room && room._id) {
      const title = getConversationName(room).title
      navigation.setOptions({
        header: () => (
          <Header
            title={title}
            headerLeft={<MessagesBackButton navigation={navigation} />}
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
      getCommonGroup()
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
    // const msg = `${user.phoneNumber}: ${message}`
    sendPushNotification(otherUserNumber, message)
    keyboardHeight.current = new Animated.Value(0)
    Keyboard.dismiss()
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
            fontSize={16}
            weight="medium"
            color={isMyMessage ? Colors.white : Colors.black}>
            {content}
          </AppText>
          <View style={styles.messageItemTime}>
            <AppText
              fontSize={FontSize.normal}
              color={isMyMessage ? Colors.white : Colors.gray}>
              {moment(msg.createdAt).format('HH:mm')}
            </AppText>
          </View>
        </View>
      </View>
    )
  }
  return (
    <SafeAreaView style={styles.container}>
      <Animated.View
        style={[{ flex: 1, paddingBottom: keyboardHeight.current }]}>
        <StatusBar barStyle="light-content" />
        <KeyboardListener
          onWillShow={(event) => showKeyboard(event, keyboardHeight.current)}
          onWillHide={(event) => hideKeyBoard(event, keyboardHeight.current)}
        />
        {commonGroup && commonGroup.name && (
          <View
            style={{
              alignItems: 'center',
              justifyContent: 'center',
              width: '100%',
              flexDirection: 'row',
              paddingTop: 4,
            }}>
            <AppBadge text={commonGroup.name} />
          </View>
        )}
        <View style={styles.descriptionBox}>
          <AppText style={styles.description}>{description}</AppText>
        </View>
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
        <View style={styles.inputView}>
          <AppInput
            style={styles.input}
            placeholder="Enter your message..."
            placeholderTextColor={Colors.gray}
            value={message}
            onChange={onChangeMessage}
          />
          <AppButton
            icon="send"
            iconSize={16}
            disabled={!message}
            style={{ width: 40, height: 40 }}
            onPress={message ? onSendMessage : () => {}}
          />
        </View>
      </Animated.View>
    </SafeAreaView>
  )
}

Conversation.propTypes = {
  navigation: PropTypes.objectOf(PropTypes.any).isRequired,
}

export default Conversation
