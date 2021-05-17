/* eslint-disable react/prop-types */
import React, { useEffect, useState } from 'react'
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
  AppInput,
  AppIcon,
  Loading,
  ScaleTouchable,
  AppImage,
  Layout,
} from 'components'
import * as NavigationService from 'services/navigation'
import getConversationName from 'utils/get-conversation-name'
import { getRooms, setRoom } from 'features/messages/messagesSlice'
import Images from 'assets/images'
import Fonts from 'assets/fonts'

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
    backgroundColor: 'transparent',
    flex: 1,
  },
  flatListView: {
    flex: 1,
    paddingBottom: 20,
  },
  conversationItemOuter: {
    paddingHorizontal: 30,
  },
  conversationItemInner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
  },
  conversationItemChild: {
    flexDirection: 'row',
    alignItems: 'center',
    height: '100%',
  },
  dotNewMessage: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: Colors.primary,
    position: 'absolute',
    top: 45,
    right: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  onlineIndicator: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#48EF97',
    position: 'absolute',
    top: 0,
    left: '18%',
    borderWidth: 2,
    borderColor: 'white',
  },
  avatarBackGround: {
    height: 50,
    width: 50,
    borderRadius: 25,
    backgroundColor: Colors.grayLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
})

export const Messages = ({ route, navigation }) => {
  const dispatch = useDispatch()
  const user = useSelector((state) => state.auth.user)
  const questions = useSelector((state) => state.questions)
  const messagesState = useSelector((state) => state.messages)
  const { loading, rooms } = messagesState

  const [searchText, setSearchText] = useState('')

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
              phoneNumber: user.phoneNumber,
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
          <AppText weight="bold" fontSize={FontSize.normal}>
            <AppText
              color={Colors.primary}
              fontSize={FontSize.normal}
              weight="bold">
              {uniqueRequests[0].requester}
            </AppText>
            {` and `}
            <AppText
              color={Colors.primary}
              fontSize={FontSize.normal}
              weight="bold">
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
          paddingTop: 0,
          paddingHorizontal: 10,
          borderBottomWidth: 1,
          borderColor: Colors.grayLight,
          marginHorizontal: 20,
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
                width: 50,
                height: 50,
                borderRadius: 25,
                backgroundColor: 'rgba(235, 84, 80, 0.19)',
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: 10,
              }}>
              <AppImage source={Images.message} width={20} height={25} />
            </View>
            <AppText
              style={{
                marginRight: 5,
                lineHeight: 20,
                flex: 1,
                flexWrap: 'wrap',
                color: 'black',
              }}
              weight="bold"
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
          <AppIcon name="chevron-right" size={20} color="black" />
        </View>
      </ScaleTouchable>
    )
  }

  const renderSearch = () => {
    return (
      <View style={{ marginHorizontal: 30, marginTop: 10 }}>
        <View style={{ position: 'absolute', top: 18, left: 20, zIndex: 1 }}>
          <AppIcon name="search" color={Colors.gray} size={20} />
        </View>
        <AppInput
          placeholder="Search"
          placeholderTextColor={Colors.gray}
          value={searchText}
          icon="search"
          style={{
            backgroundColor: 'white',
            paddingLeft: 50,
            fontSize: 15,
            fontFamily: Fonts.euclidCircularAMedium,
            color: Colors.text,
          }}
          onChange={(value) => setSearchText(value.toLowerCase())}
        />
      </View>
    )
  }

  const renderConversationItem = ({ item, index }) => {
    if (item === 'requests') return <RequestToAsk requests={askRequests} />
    if (item === null) return item
    const { lastMessage, isNew } = item
    const content = (lastMessage && lastMessage.content) || ''
    const isMyMessage =
      lastMessage && user.phoneNumber === lastMessage.userPhoneNumber
    const time = (lastMessage && lastMessage.createdAt) || Date.now()
    const timeText = moment(time).fromNow()
    const title = getConversationName(item).title
    return (
      <TouchableOpacity
        style={styles.conversationItemOuter}
        onPress={() => onPressConversation(item)}>
        <View style={styles.conversationItemInner}>
          <View style={[styles.conversationItemChild, { flex: 1 }]}>
            <View style={styles.avatarBackGround}>
              <Avatar size={22} source={Images.profileGray} />
            </View>
            {/* {true && <View style={styles.onlineIndicator} />} */}
            <View style={{ marginLeft: 15, width: '80%' }}>
              <AppText weight="bold" style={{ color: 'black' }}>
                {title}
              </AppText>
              <AppText
                numberOfLines={1}
                ellipsizeMode="tail"
                color={Colors.gray}
                fontSize={FontSize.normal}
                style={{ marginTop: 4 }}>{`${
                isMyMessage ? 'You: ' : ''
              }${content}`}</AppText>
            </View>
          </View>
          <View
            style={[
              styles.conversationItemChild,
              { alignItems: 'flex-start' },
            ]}>
            <AppText color={Colors.gray}>{timeText}</AppText>
          </View>
          {isNew && <View style={styles.dotNewMessage} />}
        </View>
      </TouchableOpacity>
    )
  }

  return (
    <Layout innerStyle={{ paddingTop: 20 }}>
      <View style={styles.container}>
        <StatusBar barStyle="light-content" />
        <View style={styles.flatListView}>
          {loading ? (
            <Loading />
          ) : (
            <FlatList
              data={[
                'requests',
                // rooms.length > 0 ? 'room' : null,
                ...rooms.filter((r) =>
                  getConversationName(r)
                    .title.toLowerCase()
                    .includes(searchText),
                ),
              ]}
              renderItem={renderConversationItem}
              keyExtractor={(item, index) => index.toString()}
              refreshing={loading}
              onRefresh={() => dispatch(getRooms())}
            />
          )}
        </View>
      </View>
    </Layout>
  )
}

Messages.propTypes = {
  navigation: PropTypes.objectOf(PropTypes.any).isRequired,
  route: PropTypes.object,
}

export default Messages
