import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import moment from 'moment'
import {
  FlatList,
  StatusBar,
  StyleSheet,
  View,
  TouchableOpacity,
} from 'react-native'
import Constants from 'constants'
import { Avatar, AppText, AppIcon, Loading } from 'components'
import * as NavigationService from 'services/navigation'
import getConversationName from 'utils/get-conversation-name'
import { getRooms, setRoom } from 'features/messages/messagesSlice'

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
    height: Constants.Dimensions.Height,
    width: Constants.Dimensions.Width,
    backgroundColor: Constants.Colors.grayLight,
    flex: 1,
  },
  flatListView: {
    backgroundColor: Constants.Colors.white,
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
    borderBottomColor: Constants.Colors.grayLight,
  },
  conversationItemChild: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  noBottomBorder: {
    borderBottomWidth: 0,
  },
})

export const Messages = () => {
  const dispatch = useDispatch()
  const user = useSelector((state) => state.auth.user)
  const messagesState = useSelector((state) => state.messages)
  const { loading, rooms } = messagesState

  useEffect(() => {
    dispatch(getRooms())
  }, [dispatch])

  const onPressConversation = (conversation) => {
    dispatch(setRoom(conversation))
    NavigationService.navigate(Constants.Screens.Conversation)
  }

  const renderConversationItem = (conversation, index, rooms) => {
    const { lastMessage } = conversation
    const content = (lastMessage && lastMessage.content) || ''
    const isMyMessage =
      lastMessage && user.phoneNumber === lastMessage.userPhoneNumber
    const time = (lastMessage && lastMessage.createdAt) || Date.now()
    const timeText = moment(time).fromNow()
    const title = getConversationName(conversation)
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
              <AppText text={title} fontSize={16} />
              <AppText
                numberOfLines={1}
                ellipsizeMode="tail"
                text={`${isMyMessage ? 'You:' : ''} ${content}`}
                color={Constants.Colors.gray}
                style={{ marginTop: 4 }}
              />
            </View>
          </View>
          <View style={[styles.conversationItemChild]}>
            <AppText text={timeText} color={Constants.Colors.gray} />
            <AppIcon name="chevron-right" size={20} />
          </View>
        </View>
      </TouchableOpacity>
    )
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <View style={styles.flatListView}>
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

export default Messages
