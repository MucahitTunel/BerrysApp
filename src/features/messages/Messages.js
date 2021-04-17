/* eslint-disable react/prop-types */
import React, { useEffect } from 'react'
import PropTypes from 'prop-types'
import { useDispatch, useSelector } from 'react-redux'
import moment from 'moment'
import {
  FlatList,
  StatusBar,
  StyleSheet,
  View,
  TouchableOpacity,
} from 'react-native'
import { Dimensions, Colors, Screens, FontSize } from 'constants'
import {
  Avatar,
  AppText,
  AppIcon,
  Loading,
  ScaleTouchable,
  AppImage,
} from 'components'
import * as NavigationService from 'services/navigation'
import getConversationName from 'utils/get-conversation-name'
import { getRooms, setRoom } from 'features/messages/messagesSlice'
import Images from 'assets/images'

moment.locale('en', {
  relativeTime: {
    future: 'in %s',
    past: '%s ago',
    s: 'seconds',
    ss: '%ss',
    m: 'a minute',
    mm: '%dm',
    h: 'an hour',
    hh: '%dh',
    d: 'a day',
    dd: '%dd',
    M: 'a month',
    MM: '%dM',
    y: 'a year',
    yy: '%dY',
  },
})

const styles = StyleSheet.create({
  container: {
    height: Dimensions.Height,
    width: Dimensions.Width,
    backgroundColor: Colors.grayLight,
    flex: 1,
  },
  flatListView: {
    backgroundColor: Colors.white,
    flex: 1,
  },
  conversationItemOuter: {
    paddingHorizontal: 10,
  },
  conversationItemInner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.grayLight,
  },
  conversationItemChild: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  noBottomBorder: {
    borderBottomWidth: 0,
  },
  dotNewMessage: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: Colors.primary,
    position: 'absolute',
    top: 10,
    right: 0,
  },
})

export const Messages = ({ route, navigation }) => {
  const dispatch = useDispatch()
  const user = useSelector((state) => state.auth.user)
  const questions = useSelector((state) => state.questions)
  const messagesState = useSelector((state) => state.messages)
  const { loading, rooms } = messagesState

  // If a user posts a question, they are not new anymore
  const isNewUser = !(
    questions.data.find((q) => user.phoneNumber === q.userPhoneNumber) ||
    questions.compares.find((q) => user.phoneNumber === q.userPhoneNumber) ||
    questions.polls.find((q) => user.phoneNumber === q.userPhoneNumber)
  )
  const askRequests = isNewUser
    ? [
        {
          receivers: [
            {
              hasAsked: false,
              phoneNumber: '+905358982130',
            },
          ],
          requester: `Berry's Expert`,
          isExpert: true,
        },
        ...questions.requestsToAsk,
      ]
    : questions.requestsToAsk

  useEffect(() => {
    navigation.addListener('focus', () => {
      if (route.params?.fromMain)
        return NavigationService.updateParams({ fromMain: false })
      dispatch(getRooms())
    })
  }, [dispatch, navigation, route])

  const onPressConversation = (conversation) => {
    dispatch(setRoom(conversation))
    NavigationService.navigate(Screens.Conversation)
  }

  const RequestToAsk = ({ requests }) => {
    const user = useSelector((state) => state.auth.user)
    if (!user || !requests.length) return null
    const onPressRequestToAsk = () => {
      NavigationService.navigate(Screens.RequestToAsk, {
        requests,
      })
    }
    const renderRequester = () => {
      // const invited = requests.reduce((acc, request) => acc + request.receivers.length, 0) - 1

      const uniqueRequests = []
      requests.map((r) => {
        if (
          !uniqueRequests.find((ur) => ur.userPhoneNumber === r.userPhoneNumber)
        )
          uniqueRequests.push(r)
      })

      if (uniqueRequests.length === 1) {
        return (
          <AppText color={Colors.primary} fontSize={FontSize.normal}>
            {uniqueRequests[0].requester}
          </AppText>
        )
      } else {
        const amount = uniqueRequests.length - 1
        return (
          <AppText weight="medium" fontSize={FontSize.normal}>
            <AppText
              color={Colors.primary}
              fontSize={FontSize.normal}
              weight="medium">
              {uniqueRequests[0].requester}
            </AppText>
            {` and `}
            <AppText
              color={Colors.primary}
              fontSize={FontSize.normal}
              weight="medium">
              {`${amount}${amount === 1 ? ' User' : ' Users'}`}
            </AppText>
          </AppText>
        )
      }
    }

    return (
      <ScaleTouchable
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          padding: 16,
          paddingRight: 12,
          backgroundColor: Colors.white,
          borderBottomWidth: 4,
          borderColor: Colors.background,
        }}
        onPress={() => onPressRequestToAsk()}>
        <View style={{ flex: 1 }}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
            }}>
            <View
              style={{
                width: 36,
                height: 36,
                borderRadius: 18,
                backgroundColor: 'rgba(235, 84, 80, 0.19)',
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: 10,
              }}>
              <AppImage source={Images.message} width={17} height={15} />
            </View>
            <AppText
              style={{
                marginRight: 5,
                lineHeight: 20,
                flex: 1,
                flexWrap: 'wrap',
              }}
              weight="medium"
              fontSize={FontSize.normal}>
              {renderRequester()}
              {` invited you to ask your questions anonymously`}
            </AppText>
          </View>
        </View>
        <View
          style={{
            marginLeft: 16,
            flexDirection: 'row',
          }}>
          <AppIcon name="chevron-right" size={20} color={Colors.primary} />
        </View>
      </ScaleTouchable>
    )
  }

  const renderConversationItem = (conversation, index, rooms) => {
    const { lastMessage, isNew } = conversation
    const content = (lastMessage && lastMessage.content) || ''
    const isMyMessage =
      lastMessage && user.phoneNumber === lastMessage.userPhoneNumber
    const time = (lastMessage && lastMessage.createdAt) || Date.now()
    const timeText = moment(time).fromNow()
    const title = getConversationName(conversation).title
    return (
      <TouchableOpacity
        style={styles.conversationItemOuter}
        onPress={() => onPressConversation(conversation)}>
        <View
          style={[
            styles.conversationItemInner,
            index === rooms.length - 1 && styles.noBottomBorder,
          ]}>
          <View style={[styles.conversationItemChild, { flex: 1 }]}>
            <Avatar size={40} />
            <View style={{ marginLeft: 10, width: '80%' }}>
              <AppText weight={isNew ? 'bold' : 'medium'}>{title}</AppText>
              <AppText
                numberOfLines={1}
                ellipsizeMode="tail"
                color={isNew ? Colors.text : Colors.gray}
                fontSize={FontSize.normal}
                style={{ marginTop: 4 }}>{`${
                isMyMessage ? 'You:' : ''
              } ${content}`}</AppText>
            </View>
          </View>
          <View style={[styles.conversationItemChild]}>
            <AppText color={Colors.gray}>{timeText}</AppText>
            <AppIcon
              name="chevron-right"
              size={20}
              color={'rgba(128, 128, 128, 0.5)'}
            />
          </View>
          {isNew && <View style={styles.dotNewMessage} />}
        </View>
      </TouchableOpacity>
    )
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <View style={styles.flatListView}>
        <RequestToAsk requests={askRequests} />
        {loading ? (
          <Loading />
        ) : (
          <FlatList
            data={rooms}
            renderItem={({ item, index }) =>
              renderConversationItem(item, index, rooms)
            }
            keyExtractor={(item) => item._id}
            refreshing={loading}
            onRefresh={() => dispatch(getRooms())}
          />
        )}
      </View>
    </View>
  )
}

Messages.propTypes = {
  navigation: PropTypes.objectOf(PropTypes.any).isRequired,
  route: PropTypes.object,
}

export default Messages
