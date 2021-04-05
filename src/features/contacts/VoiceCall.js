import React, { useEffect, useState } from 'react'
import { StyleSheet, View, PermissionsAndroid, Platform } from 'react-native'
import RtcEngine from 'react-native-agora'
import { Colors, FontSize } from 'constants'
import { AppButton, Avatar, AppText } from 'components'
import PropTypes from 'prop-types'
import Images from 'assets/images'
import LeaveModal from './VoiceCallModal'
import AnonymousModal from './VoiceCallModal'
import Config from 'react-native-config'
import { useDispatch } from 'react-redux'
import { createVoiceCall } from 'features/contacts/contactsSlice'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: Colors.background,
    paddingTop: 30,
  },
  buttonContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    marginBottom: 50,
    alignItems: 'center',
  },
  button: {
    marginHorizontal: 10,
    borderWidth: 1.5,
    borderColor: Colors.primary,
    height: 60,
    width: 60,
    borderRadius: 100,
  },
})

const VoiceCall = ({ route, navigation }) => {
  const dispatch = useDispatch()

  const [isLeaveModalVisible, setIsLeaveModalVisible] = useState(false)
  const [isAnonymousModalVisible, setIsAnonymousModalVisible] = useState(false)
  const [engine, setEngine] = useState(null)
  const [speakerPhone, setSpeakerPhone] = useState(false)
  const [openMicrophone, setOpenMicrophone] = useState(true)
  const [distorted, setDistorted] = useState(false)

  useEffect(() => {
    const requestCameraAndAudioPermission = async () => {
      try {
        const granted = await PermissionsAndroid.requestMultiple([
          PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
        ])
        if (
          granted['android.permission.RECORD_AUDIO'] ===
          PermissionsAndroid.RESULTS.GRANTED
        ) {
          console.log('You can use the mic')
        } else {
          console.log('Permission denied')
        }
      } catch (err) {
        console.warn(err)
      }
    }

    if (Platform.OS === 'android') {
      // Request required permissions from Android
      requestCameraAndAudioPermission().then(() => {
        console.log('requested!')
      })
    }
  }, [])

  useEffect(() => {
    try {
      let cleanup
      RtcEngine.create(Config.AGORAIO_APP_ID).then(async (engine) => {
        cleanup = engine
        setEngine(engine)
        await engine.enableAudio()
        await engine.setAudioProfile(0, 1)

        if (route.params.isCreate) {
          const res = await dispatch(
            createVoiceCall({
              roomId: route.params.roomId,
              invitedUser: route.params.invitedUser,
            }),
          )
          await engine
            .joinChannel(res.payload, route.params.roomId, null, 0)
            .catch((e) => alert('There was a problem joining the call'))
        } else {
          setIsAnonymousModalVisible(true)
          await engine
            .joinChannel(route.params.token, route.params.roomId, null, 0)
            .catch((e) => alert('There was a problem joining the call'))
        }

        /* engine.addListener('UserJoined', (uid, elapsed) => {
                    console.log('UserJoined', uid, elapsed)
                    if (peerIds.indexOf(uid) === -1) setPeerIds([...peerIds, uid])
                }) */

        /* engine.addListener('UserOffline', (uid, reason) => {
                    console.log('UserOffline', uid, reason)
                    setPeerIds(peerIds.filter(id => id !== uid))
                }) */

        /* engine.addListener('JoinChannelSuccess', (channel, uid, elapsed) => {
                    console.log('JoinChannelSuccess', channel, uid, elapsed)
                    setJoined(true)
                }) */
      })

      return () => cleanup.removeAllListeners()
    } catch (error) {
      console.log(error)
    }
  }, [route, dispatch])

  const leaveChannel = () => {
    setIsLeaveModalVisible(false)
    engine.leaveChannel().then(() => {
      navigation.goBack()
      /* setPeerIds([])
                setJoined(false) */
    })
  }

  const switchSpeakerphone = () => {
    engine
      ?.setEnableSpeakerphone(!speakerPhone)
      .then(() => {
        setSpeakerPhone(!speakerPhone)
      })
      .catch((err) => {
        console.warn('setEnableSpeakerphone', err)
      })
  }

  const switchMicrophone = () => {
    engine
      ?.enableLocalAudio(!openMicrophone)
      .then(() => {
        setOpenMicrophone(!openMicrophone)
      })
      .catch((err) => {
        console.warn('enableLocalAudio', err)
      })
  }

  const switchDistortion = async () => {
    if (distorted) {
      await engine.setLocalVoicePitch(1)
      setDistorted(false)
    } else {
      await engine.setLocalVoicePitch(0.82)
      setDistorted(true)
    }
  }

  return (
    <View style={styles.container}>
      <AppText
        weight="medium"
        fontSize={FontSize.xxxLarge}
        color={Colors.primary}
        style={{ marginBottom: 20 }}>
        {route.params.userName}
      </AppText>
      <Avatar source={Images.defaultAvatar} size={150} />
      <View style={styles.buttonContainer}>
        <AppButton
          icon="mask"
          iconColor={distorted ? 'white' : Colors.primary}
          iconSize={20}
          onPress={switchDistortion}
          style={[
            styles.button,
            {
              backgroundColor: distorted ? Colors.primary : 'transparent',
              marginBottom: 10,
            },
          ]}
          shadow={false}
        />
        <AppText
          weight="medium"
          fontSize={FontSize.xLarge}
          color={Colors.primary}
          style={{ marginBottom: 20 }}>
          {!distorted ? 'Distortion is off' : 'Distortion is on'}
        </AppText>
        <View style={{ flexDirection: 'row' }}>
          <AppButton
            icon="volume-high"
            iconColor={speakerPhone ? 'white' : Colors.primary}
            iconSize={20}
            onPress={switchSpeakerphone}
            style={[
              styles.button,
              {
                backgroundColor: speakerPhone ? Colors.primary : 'transparent',
              },
            ]}
            shadow={false}
          />
          <AppButton
            icon="mute"
            iconColor={!openMicrophone ? 'white' : Colors.primary}
            iconSize={20}
            onPress={switchMicrophone}
            style={[
              styles.button,
              {
                backgroundColor: !openMicrophone
                  ? Colors.primary
                  : 'transparent',
              },
            ]}
            shadow={false}
          />
          <AppButton
            icon="close"
            iconSize={20}
            onPress={() => setIsLeaveModalVisible(true)}
            style={[styles.button]}
            shadow={false}
          />
        </View>
      </View>

      <LeaveModal
        question="Are you sure you want to leave?"
        isModalVisible={isLeaveModalVisible}
        setModalVisible={(value) => setIsLeaveModalVisible(value)}
        onPress={leaveChannel}
      />

      <AnonymousModal
        question="Do you want to distort your voice and be anonymous?"
        isModalVisible={isAnonymousModalVisible}
        setModalVisible={(value) => setIsAnonymousModalVisible(value)}
        onPress={() => {
          engine.setLocalVoicePitch(0.82)
          setDistorted(true)
          setIsAnonymousModalVisible(false)
        }}
      />
    </View>
  )
}

VoiceCall.propTypes = {
  navigation: PropTypes.objectOf(PropTypes.any).isRequired,
  route: PropTypes.object,
}

export default VoiceCall
