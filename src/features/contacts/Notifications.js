import React, { useEffect, useState } from 'react'
import {
  View,
  StyleSheet,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
} from 'react-native'
import { AppText, Layout, AppIcon } from 'components'
import { Dimensions, Colors, FontSize, Screens } from 'constants'
import * as NavigationService from 'services/navigation'
import { useDispatch, useSelector } from 'react-redux'
import request from '../../services/api'
import { setHasNotifications } from 'features/auth/authSlice'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: Dimensions.Height,
    width: Dimensions.Width,
    backgroundColor: 'transparent',
  },
  itemContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
    borderBottomColor: Colors.grayLight,
    borderBottomWidth: 1,
    paddingBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  itemText: {
    width: 280,
  },
})

const Notifications = () => {
  const dispatch = useDispatch()
  const user = useSelector((state) => state.auth.user)

  const [notifications, setNotifications] = useState([])
  const [isRefreshing, setIsRefreshing] = useState(false)

  useEffect(() => {
    dispatch(setHasNotifications(false))
    fetchNotifications()
    readNotifications()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const itemOnPress = (payload) => {
    /* switch(payload.type) {
            case 'QUESTION_ANSWERED':
            if (payload.questionId) {
                dispatch(getQuestion(payload.questionId))
                NavigationService.navigate(Screens.Answers, { isPopular: false })
            }
            break
        } */
  }

  const renderList = ({ item, index }) => {
    return (
      <View
        style={styles.itemContainer}
        onPress={() => itemOnPress(item.data.payload)}>
        <AppText color="black" weight="medium" style={styles.itemText}>
          {item.data.message}
        </AppText>
        <AppIcon name="chevron-right" color={Colors.gray} size={30} />
      </View>
    )
  }

  const readNotifications = () => {
    request({
      method: 'POST',
      url: 'notifications/read',
      params: {
        userPhoneNumber: user.phoneNumber,
      },
    }).catch((error) => console.log(error))
  }

  const fetchNotifications = () => {
    setIsRefreshing(true)
    request({
      method: 'GET',
      url: 'notifications',
      params: {
        userPhoneNumber: user.phoneNumber,
      },
    })
      .then((res) => {
        const { data } = res
        setNotifications(data.notifications.reverse())
        setIsRefreshing(false)
      })
      .catch((error) => setIsRefreshing(false))
  }

  return (
    <Layout>
      <SafeAreaView style={styles.container}>
        <FlatList
          data={notifications}
          renderItem={renderList}
          refreshing={isRefreshing}
          onRefresh={fetchNotifications}
          keyExtractor={(item, index) => index.toString()}
        />
      </SafeAreaView>
    </Layout>
  )
}

export default Notifications
