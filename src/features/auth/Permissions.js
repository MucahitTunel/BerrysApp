import React, { useState, useEffect } from 'react'
import {
  SafeAreaView,
  View,
  StyleSheet,
  TouchableOpacity,
  Platform,
} from 'react-native'
import { AppText, AppButton, AppImage, AppIcon } from 'components'
import { Colors, Dimensions, FontSize } from 'constants'
import * as NavigationService from 'services/navigation'
import Images from 'assets/images'
import { useDispatch, useSelector } from 'react-redux'
import { submitSurvey } from 'features/auth/authSlice'
import { loadContacts } from 'features/contacts/contactsSlice'
import PropTypes from 'prop-types'
import {
  check,
  PERMISSIONS,
  RESULTS,
  request,
  openSettings,
  checkNotifications,
  requestNotifications,
} from 'react-native-permissions'
import firebase from 'services/firebase'

import RNUxcam from 'react-native-ux-cam'
RNUxcam.tagScreenName('Permissions')

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: Dimensions.Height,
    width: Dimensions.Width,
    backgroundColor: 'white',
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,
    paddingHorizontal: 20,
  },
  itemImage: {
    backgroundColor: Colors.purpleLight,
    height: 60,
    width: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemTexts: {
    marginLeft: 20,
  },
})

const Permissions = ({ route }) => {
  const dispatch = useDispatch()

  const user = useSelector((state) => state.auth.user)

  const [location, setLocation] = useState(false)
  const [notification, setNotification] = useState(false)
  const [contact, setContact] = useState(false)

  useEffect(() => {
    firebase.analytics.logEvent(firebase.analytics.events.SCREEN_NAVIGATION, {
      screen: 'Permission Screen',
      user: user.phoneNumber,
    })
  })

  // useEffect(() => {
  //   checkNotifications().then(({ status, settings }) => {
  //     switch (status) {
  //       case RESULTS.UNAVAILABLE:
  //       case RESULTS.DENIED:
  //       case RESULTS.LIMITED:
  //       case RESULTS.BLOCKED:
  //         requestNotifications(['alert', 'sound']).then(({ status }) => {
  //           if (status === RESULTS.GRANTED) setNotification(true)
  //         })
  //         break
  //       case RESULTS.GRANTED:
  //         return setNotification(true)
  //     }
  //   })
  //   if (Platform.OS === 'android') {
  //     check(PERMISSIONS.ANDROID.READ_CONTACTS).then((result) => {
  //       switch (result) {
  //         case RESULTS.UNAVAILABLE:
  //         case RESULTS.DENIED:
  //         case RESULTS.LIMITED:
  //         case RESULTS.BLOCKED:
  //           request(PERMISSIONS.ANDROID.READ_CONTACTS).then((result) => {
  //             if (result === RESULTS.GRANTED) setContact(true)
  //           })
  //           break
  //         case RESULTS.GRANTED:
  //           return setContact(true)
  //       }
  //     })
  //     // check(PERMISSIONS.ANDROID.ACCESS_COARSE_LOCATION).then((result) => {
  //     //   switch (result) {
  //     //     case RESULTS.UNAVAILABLE:
  //     //     case RESULTS.DENIED:
  //     //     case RESULTS.LIMITED:
  //     //     case RESULTS.BLOCKED:
  //     //       request(PERMISSIONS.ANDROID.ACCESS_COARSE_LOCATION).then(
  //     //         (result) => {
  //     //           if (result === RESULTS.GRANTED) setLocation(true)
  //     //         },
  //     //       )
  //     //       break
  //     //     case RESULTS.GRANTED:
  //     //       return setLocation(true)
  //     //   }
  //     // })
  //   } else {
  //     check(PERMISSIONS.IOS.CONTACTS).then((result) => {
  //       switch (result) {
  //         case RESULTS.UNAVAILABLE:
  //         case RESULTS.DENIED:
  //         case RESULTS.LIMITED:
  //         case RESULTS.BLOCKED:
  //           request(PERMISSIONS.IOS.CONTACTS).then((result) => {
  //             if (result === RESULTS.GRANTED) setContact(true)
  //           })
  //           break
  //         case RESULTS.GRANTED:
  //           return setContact(true)
  //       }
  //     })
  //     // check(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE).then((result) => {
  //     //   switch (result) {
  //     //     case RESULTS.UNAVAILABLE:
  //     //     case RESULTS.DENIED:
  //     //     case RESULTS.LIMITED:
  //     //     case RESULTS.BLOCKED:
  //     //       request(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE).then((result) => {
  //     //         if (result === RESULTS.GRANTED) setLocation(true)
  //     //       })
  //     //       break
  //     //     case RESULTS.GRANTED:
  //     //       return setLocation(true)
  //     //   }
  //     // })
  //   }
  // })

  const renderItem = (type) => {
    const size = 25

    const getTitle = () => {
      switch (type) {
        case 'bellFilled':
          return 'Notifications'
        case 'newProfileFilled':
          return 'Contacts'
        case 'location':
          return 'Location'
      }
    }

    const getDesc = () => {
      switch (type) {
        case 'bellFilled':
          return 'So you know when like-minded users answer your questions'
        case 'newProfileFilled':
          return 'So you can ask your contacts and they can ask you'
        case 'location':
          return 'So you can ask like-minded people in your town and state'
      }
    }

    const getOnPress = () => {
      switch (type) {
        case 'bellFilled':
          return setNotification(!notification)
        case 'newProfileFilled':
          return setContact(!contact)
        case 'location':
          return setLocation(!location)
      }
    }

    const getCheckmark = () => {
      switch (type) {
        case 'bellFilled':
          return notification
        case 'newProfileFilled':
          return contact
        case 'location':
          return location
      }
    }

    const onPress = () => {
      switch (type) {
        case 'bellFilled':
          if (!notification) {
            requestNotifications(['alert', 'sound']).then(({ status }) => {
              if (status === RESULTS.GRANTED) setNotification(true)
              else
                openSettings().catch(() => console.warn('cannot open settings'))
            })
          }
          return
        case 'newProfileFilled':
          if (!contact) {
            request(
              Platform.OS === 'ios'
                ? PERMISSIONS.IOS.CONTACTS
                : PERMISSIONS.ANDROID.READ_CONTACTS,
            ).then((result) => {
              if (result === RESULTS.GRANTED) {
                dispatch(loadContacts())
                setContact(true)
              } else
                openSettings().catch(() => console.warn('cannot open settings'))
            })
          }
          return
        case 'location':
          if (!location) {
            request(
              Platform.OS === 'ios'
                ? PERMISSIONS.IOS.LOCATION_WHEN_IN_USE
                : PERMISSIONS.ANDROID.ACCESS_COARSE_LOCATION,
            ).then((result) => {
              if (result === RESULTS.GRANTED) setLocation(true)
              else
                openSettings().catch(() => console.warn('cannot open settings'))
            })
          }
          return
      }
    }

    return (
      <TouchableOpacity style={styles.itemContainer} onPress={onPress}>
        <View style={styles.itemImage}>
          <AppImage source={Images[type]} width={size} height={size} />
        </View>
        <View style={styles.itemTexts}>
          <AppText
            weight="bold"
            color={Colors.purple}
            fontSize={FontSize.xLarge}>
            {getTitle()}
          </AppText>
          <AppText
            weight="normal"
            color="#808080"
            fontSize={FontSize.medium}
            style={{ maxWidth: 210 }}>
            {getDesc()}
          </AppText>
        </View>
        <View style={{ flex: 1 }} />
        <AppIcon
          name="checkmark"
          size={22}
          color={Colors.background}
          style={{
            backgroundColor: getCheckmark()
              ? Colors.purple
              : Colors.backgroundDarker,
          }}
          background
        />
      </TouchableOpacity>
    )
  }

  const submit = () => {
    dispatch(submitSurvey({ data: route.params.surveyData }))
  }

  return (
    <SafeAreaView style={styles.container}>
      <View
        style={{
          backgroundColor: 'white',
          alignItems: 'center',
          marginTop: 30,
        }}>
        <AppText
          weight="bold"
          color="black"
          fontSize={FontSize.xxxLarge}
          style={{ marginBottom: 20 }}>
          Permissions
        </AppText>
      </View>
      <AppText
        weight="normal"
        color="#626579"
        fontSize={FontSize.large}
        style={{
          textAlign: 'center',
          alignSelf: 'center',
          marginHorizontal: 20,
          marginBottom: 30,
        }}>
        Berry's lets you anonymously ask like-minded people and to get their
        honest opinions. We'll need you to allow a few permissions to get
        started
      </AppText>
      {/* {renderItem('location')} */}
      {renderItem('newProfileFilled')}
      {renderItem('bellFilled')}
      <View style={{ flex: 1 }} />
      <AppButton
        text="Next"
        style={{ marginBottom: 30, marginHorizontal: 30 }}
        disabled={/* !location ||  */ !notification /*  || !contact */}
        onPress={submit}
      />
    </SafeAreaView>
  )
}

Permissions.propTypes = {
  route: PropTypes.object,
}

export default Permissions
