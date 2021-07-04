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
  Image,
  ActivityIndicator,
} from 'react-native'
import moment from 'moment'
import {
  AppText,
  AppInput,
  Header,
  AppButton,
  AppBadge,
  Layout,
} from 'components'
import { MessagesBackButton } from 'components/NavButton'
import { Dimensions, Colors, FontSize, Screens } from 'constants'
import { pusher } from 'features/auth/authSlice'
import {
  getMessages,
  sendMessage,
  sendPushNotification as sendPushNotificationAction,
  readConversation,
  removeRoomWithNewMessages,
} from 'features/messages/messagesSlice'
import {
  setAskQuestion,
  renewAskRequest,
  approveAskRequest,
  requestAskRequestPoints,
  finishAskingAskRequest,
} from 'features/questions/askSlice'
import request from 'services/api'
import getConversationName from 'utils/get-conversation-name'
import KeyboardListener from 'react-native-keyboard-listener'
import { hideKeyBoard, showKeyboard } from 'utils'
import FinishAskingModal from './FinishAskingModal'
import { launchImageLibrary } from 'react-native-image-picker'
import firebase from '../../services/firebase'
import KochavaTracker from 'react-native-kochava-tracker'

const styles = StyleSheet.create({
  container: {
    height: Dimensions.Height,
    width: Dimensions.Width,
    backgroundColor: 'transparent',
    flex: 1,
  },
  contentView: {
    flex: 1,
    paddingTop: 6,
  },
  messageItemOuter: {
    marginBottom: 4,
    // flexDirection: 'row',
    paddingHorizontal: 16,
  },
  messageItemInner: {
    paddingHorizontal: 10,
    paddingVertical: 20,
    borderRadius: 4,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    borderBottomRightRadius: 16,
    borderBottomLeftRadius: 0,
    borderWidth: 1,
    borderColor: Colors.grayLight,
    backgroundColor: 'white',
    marginVertical: 2,
  },
  myMessageItemInner: {
    backgroundColor: Colors.purple,
    borderWidth: 0,
    borderTopRightRadius: 16,
    borderBottomRightRadius: 0,
    borderTopLeftRadius: 16,
    borderBottomLeftRadius: 16,
  },
  imageMessage: {
    height: 300,
    justifyContent: null,
    alignItems: null,
    width: '90%',
    paddingTop: 0,
    paddingBottom: 0,
    paddingLeft: 0,
    paddingRight: 0,
  },
  messageItemTime: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 4,
  },
  inputView: {
    padding: 16,
    paddingBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    height: 70,
    borderRadius: 10,
    marginLeft: 10,
    flex: 1,
    borderWidth: 1,
    borderColor: Colors.grayLight,
    color: Colors.text,
    fontSize: FontSize.large,
    paddingVertical: 14,
    paddingHorizontal: 16,
    paddingRight: 105,
    marginRight: 10,
    backgroundColor: 'white',
  },
  descriptionBox: {
    paddingVertical: 10,
    paddingTop: 0,
    paddingHorizontal: 12,
  },
  description: {
    marginLeft: 8,
    color: Colors.purpleText,
    textAlign: 'center',
    fontSize: 14,
  },
  pointsInfoContainer: {
    backgroundColor: 'white',
    marginHorizontal: 30,
    marginBottom: 20,
    paddingVertical: 20,
    borderRadius: 15,
    paddingHorizontal: 20,
  },
})

const Conversation = ({ navigation }) => {
  let keyboardHeight = useRef(new Animated.Value(0))
  let listRef = useRef(null)
  const dispatch = useDispatch()
  const [message, setMessage] = useState(null)
  const [commonGroup, setCommonGroup] = useState(null)
  const user = useSelector((state) => state.auth.user)
  const question = useSelector((state) => state.ask.question)
  const room = useSelector((state) => state.messages.room)
  const messages = useSelector((state) => state.messages.messages)
  const description =
    room && room._id ? getConversationName(room).description : 'description'
  const [
    isFinishQuestionModalVisible,
    setIsFinishQuestionModalVisible,
  ] = useState(false)
  const [imageLoading, setImageLoading] = useState(false)
  const [isFromLinkAndNew, setIsFromLinkAndNew] = useState(
    room.data.isFromLink && messages.length === 0 && room.pointsToTake !== 0,
  )

  useEffect(() => {
    KochavaTracker.sendEventMapObject(
      KochavaTracker.EVENT_TYPE_VIEW_STRING_KEY,
      {
        screen: 'Message List',
        user: user.phoneNumber,
      },
    )
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
            headerRight={
              room.data.isFromAskMeAnything &&
              room.createdBy === user.phoneNumber ? (
                <AppButton
                  shadow={false}
                  icon="phone"
                  iconSize={18}
                  onPress={voiceCallOnPress}
                  style={{
                    backgroundColor: 'transparent',
                    marginLeft: -30,
                    right: -10,
                  }}
                />
              ) : null
            }
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
      dispatch(readConversation(room._id))
      dispatch(removeRoomWithNewMessages(room._id))
      return () => {
        pusher.unsubscribe(room._id)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigation, room, dispatch, user])

  useEffect(() => {
    if (room.data.isFromAskMeAnything) {
      if (!room.data.isFromLink) {
        if (question) {
          dispatch(setAskQuestion(null))
          onSendMessage(question)
        }
      }
    }
  }, [room, question, dispatch, onSendMessage])

  const onChangeMessage = (msg) => setMessage(msg)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const onSendMessage = (message) => {
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
    sendPushNotification(otherUserNumber, message, {
      roomId: room._id,
      type: 'MESSAGE_RECEIVED',
    })
    keyboardHeight.current = new Animated.Value(0)
    Keyboard.dismiss()
  }
  const sendPushNotification = (phoneNumber, message, payload) => {
    dispatch(sendPushNotificationAction({ phoneNumber, message, payload }))
  }

  const voiceCallOnPress = () => {
    const otherUser = room.members.filter((p) => p !== user.phoneNumber)[0]
    navigation.navigate(Screens.VoiceCall, {
      isCreate: true,
      invitedUser: otherUser,
      userName: getConversationName(room).title,
      roomId: room._id,
    })
  }

  const renderMessage = ({ item }) => {
    const { phoneNumber } = user
    const isMyMessage = item.userPhoneNumber === phoneNumber
    const content = item && item.content

    const renderContent = () => {
      if (item.image)
        return (
          <Image
            source={{ uri: item.image }}
            style={{
              flex: 1,
              borderRadius: 16,
              borderBottomLeftRadius: isMyMessage ? 16 : 0,
              borderBottomRightRadius: isMyMessage ? 0 : 16,
            }}
          />
        )
      return (
        <AppText
          fontSize={14}
          weight="medium"
          color={isMyMessage ? Colors.white : Colors.purpleText}>
          {content}
        </AppText>
      )
    }

    return (
      <View
        style={[
          styles.messageItemOuter,
          { alignItems: `flex-${isMyMessage ? 'end' : 'start'}` },
        ]}>
        <View
          style={[
            styles.messageItemInner,
            isMyMessage && styles.myMessageItemInner,
            item.image && styles.imageMessage,
          ]}>
          {renderContent()}
        </View>
        <View style={styles.messageItemTime}>
          <AppText fontSize={FontSize.normal} color={Colors.gray}>
            {moment(item.createdAt).format('HH:mm')}
          </AppText>
        </View>
      </View>
    )
  }

  const getAskRequestButtonText = () => {
    if (room.createdBy === user.phoneNumber) {
      if (room.data.newRequest) return 'Waiting for user to accept'
      else return 'Request to Ask Question'
    } else {
      if (room.data.newRequest) return 'Let them ask another question'
      else return 'User Finished Asking'
    }
  }

  const getAskRequestButtonActive = () => {
    if (room.createdBy === user.phoneNumber) return room.data.newRequest
    else return !room.data.newRequest
  }

  const renderInputsCondition = () => {
    return renderInputs()
    // if (room.data.isFromAskMeAnything) {
    //   if (room.data.isFromLink) {
    //     if (!room.data.requestFinished) return renderInputs()
    //     else return null
    //       return (
    //         <AppButton
    //           text={getAskRequestButtonText()}
    //           onPress={() => {
    //             if (!room.data.newRequest) dispatch(renewAskRequest())
    //             else dispatch(approveAskRequest())
    //           }}
    //           disabled={getAskRequestButtonActive()}
    //         />
    //       )
    //   } else return renderInputs()
    // } else return renderInputs()
  }

  const onSendImage = (imageURL) => {
    setImageLoading(true)
    firebase.upload
      .uploadDMImage(imageURL, room._id, user.phoneNumber)
      .then((url) => {
        setImageLoading(false)
        dispatch(
          sendMessage({
            content: null,
            roomId: room._id,
            userPhoneNumber: user.phoneNumber,
            image: url,
          }),
        )
        const otherUserNumber = room.members.find((m) => m !== user.phoneNumber)
        sendPushNotification(otherUserNumber, message, {
          roomId: room._id,
          type: 'MESSAGE_RECEIVED',
        })
      })
      .catch((e) => console.log(e))
  }

  const renderInputs = () => {
    return (
      <View style={styles.inputView}>
        {room.createdBy === user.phoneNumber &&
          room.data.isFromLink &&
          room.pointsToTake !== 0 && (
            <AppButton
              icon="checkmark"
              iconSize={24}
              style={{ width: 40, height: 40 }}
              onPress={() => setIsFinishQuestionModalVisible(true)}
            />
          )}
        <AppInput
          style={styles.input}
          placeholder="Send messages..."
          placeholderTextColor={Colors.gray}
          value={message}
          onChange={onChangeMessage}
        />
        <AppButton
          icon="plus"
          iconSize={16}
          style={{
            width: 40,
            height: 40,
            marginRight: 10,
            position: 'absolute',
            right: '20%',
          }}
          onPress={() => {
            launchImageLibrary(
              {
                mediaType: 'photo',
                quality: 0.1,
              },
              (response) => {
                if (response.didCancel) return
                if (response.errorCode) return
                onSendImage(response.uri)
              },
            )
          }}
        />
        <AppButton
          shadow={false}
          icon="send"
          iconSize={16}
          iconColor={Colors.purple}
          disabled={!message}
          style={{
            width: 40,
            height: 40,
            position: 'absolute',
            right: '10%',
            backgroundColor: Colors.grayLight,
          }}
          onPress={message ? () => onSendMessage(message) : () => {}}
        />
      </View>
    )
  }

  return (
    <Layout>
      <SafeAreaView style={styles.container}>
        <Animated.View
          style={[{ flex: 1, paddingBottom: keyboardHeight.current }]}>
          <StatusBar barStyle="light-content" />
          <KeyboardListener
            onWillShow={(event) => showKeyboard(event, keyboardHeight.current)}
            onWillHide={(event) => hideKeyBoard(event, keyboardHeight.current)}
          />
          {room.createdBy === user.phoneNumber && isFromLinkAndNew && (
            <View style={styles.pointsInfoContainer}>
              <AppText style={styles.description}>
                By talking to {getConversationName(room).title} you agree to
                give {room.pointsToTake} points for his answer
              </AppText>
              <AppButton
                style={{
                  backgroundColor: Colors.purpleLight,
                  marginHorizontal: 20,
                  height: 50,
                  marginTop: 20,
                }}
                onPress={() => setIsFromLinkAndNew(false)}
                text="Yes"
                textStyle={{ color: Colors.purple }}
              />
            </View>
          )}
          {room.createdBy !== user.phoneNumber &&
            room.data.isFromLink &&
            !room.data.pointsRequested && (
              <View style={styles.pointsInfoContainer}>
                <AppText style={styles.description}>
                  Request your points after you answer the question
                </AppText>
                <AppButton
                  style={{
                    backgroundColor: Colors.purpleLight,
                    marginHorizontal: 20,
                    height: 50,
                    marginTop: 20,
                  }}
                  onPress={() => dispatch(requestAskRequestPoints())}
                  text="Request"
                  textStyle={{ color: Colors.purple }}
                />
              </View>
            )}
          {room.createdBy === user.phoneNumber &&
            room.data.isFromLink &&
            room.data.pointsRequested &&
            !room.data.requestFinished && (
              <View style={styles.pointsInfoContainer}>
                <AppText style={styles.description}>
                  {getConversationName(room).title} requested you to release
                  points for his answer
                </AppText>
                <AppButton
                  style={{
                    backgroundColor: Colors.purpleLight,
                    marginHorizontal: 20,
                    height: 50,
                    marginTop: 20,
                  }}
                  onPress={() => dispatch(finishAskingAskRequest())}
                  text="Release"
                  textStyle={{ color: Colors.purple }}
                />
              </View>
            )}
          {room.createdBy === user.phoneNumber &&
            room.data.isFromLink &&
            room.data.requestFinished && (
              <View style={styles.pointsInfoContainer}>
                <AppText style={styles.description}>
                  Request to ask another question for {room.pointsToTake} points
                </AppText>
                <AppButton
                  style={{
                    backgroundColor: Colors.purpleLight,
                    marginHorizontal: 20,
                    height: 50,
                    marginTop: 20,
                  }}
                  onPress={() => dispatch(renewAskRequest())}
                  text="Request"
                  textStyle={{ color: Colors.purple }}
                />
              </View>
            )}
          {room.createdBy !== user.phoneNumber &&
            room.data.isFromLink &&
            room.data.requestFinished &&
            room.data.newRequest && (
              <View style={styles.pointsInfoContainer}>
                <AppText style={styles.description}>
                  {getConversationName(room).title} requested to ask another
                  question
                </AppText>
                <AppButton
                  style={{
                    backgroundColor: Colors.purpleLight,
                    marginHorizontal: 20,
                    height: 50,
                    marginTop: 20,
                  }}
                  onPress={() => dispatch(approveAskRequest())}
                  text="Approve"
                  textStyle={{ color: Colors.purple }}
                />
              </View>
            )}
          {room.createdBy === user.phoneNumber && isFromLinkAndNew ? null : (
            <>
              {commonGroup && commonGroup.name && (
                <View
                  style={{
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '100%',
                    flexDirection: 'row',
                    top: -10,
                  }}>
                  <AppBadge text={commonGroup.name} />
                </View>
              )}
              <View style={styles.descriptionBox}>
                <AppText style={styles.description}>{description}</AppText>
              </View>
              <View
                style={{
                  height: 1,
                  backgroundColor: Colors.grayLight,
                  marginHorizontal: 20,
                  marginBottom: 5,
                }}
              />
            </>
          )}
          <View style={styles.contentView}>
            <FlatList
              inverted
              ref={(e) => {
                listRef = e
              }}
              data={messages}
              renderItem={renderMessage}
              keyExtractor={(item) => String(item._id)}
            />
          </View>
          {imageLoading ? (
            <ActivityIndicator
              style={{ marginVertical: 20 }}
              color={Colors.purple}
            />
          ) : room.createdBy === user.phoneNumber && isFromLinkAndNew ? null : (
            renderInputsCondition()
          )}
        </Animated.View>

        <FinishAskingModal
          isModalVisible={isFinishQuestionModalVisible}
          setModalVisible={(value) => setIsFinishQuestionModalVisible(value)}
          pointsToTake={room.pointsToTake}
        />
      </SafeAreaView>
    </Layout>
  )
}

Conversation.propTypes = {
  navigation: PropTypes.objectOf(PropTypes.any).isRequired,
}

export default Conversation
