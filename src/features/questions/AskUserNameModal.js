import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import PropTypes from 'prop-types'
import { View, StyleSheet, Animated } from 'react-native'
import Modal from 'react-native-modal'
import { BlurView } from '@react-native-community/blur'
import { Dimensions, Colors, Screens, FontSize } from 'constants'
import Theme from 'theme'
import * as NavigationService from 'services/navigation'
import { updateName, updateSelectedPoints } from 'features/auth/authSlice'
import AppInput from '../../components/AppInput'
import AppButton from '../../components/AppButton'
import AppText from '../../components/AppText'
import Picker from '../../components/Picker'

const styles = StyleSheet.create({
  container: {
    height: Dimensions.Height,
    width: Dimensions.Width,
    backgroundColor: Colors.grayLight,
    flex: 1,
  },
  inputView: {
    padding: 16,
    backgroundColor: Colors.white,
    flexDirection: 'row',
  },
  input: {
    paddingHorizontal: 20,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: Colors.grayLight,
    color: Colors.text,
  },
  modalBackdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    height: '100%',
    width: '100%',
  },
  modalInnerView: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  content: {
    backgroundColor: Colors.white,
    padding: 20,
    paddingBottom: 5,
    width: Dimensions.Width - 20,
    marginLeft: 10,
    borderRadius: 8,
  },
})

const POINTS = [
  { label: 'Free', value: 0 },
  { label: '10', value: 10 },
  { label: '20', value: 20 },
]

const AskUserNameModal = ({
  isModalVisible,
  setModalVisible,
  toAskMeScreen = false,
}) => {
  const dispatch = useDispatch()
  const user = useSelector((state) => state.auth.user)
  const [name, setName] = useState('')
  const [points, setPoints] = useState(0)

  useEffect(() => {
    if (user?.selectedPoints) setPoints(user.selectedPoints)
  }, [user?.selectedPoints])

  const onSubmit = () => {
    dispatch(updateName({ name }))
    dispatch(updateSelectedPoints(points))
    setName('')
    setModalVisible(false)
    if (toAskMeScreen) {
      NavigationService.navigate(Screens.AskMe)
    }
  }

  useEffect(() => {
    setName(user?.name ? user.name : '')
  }, [user])

  const isBtnDisabled = !name.trim()
  return (
    <Modal
      isVisible={isModalVisible}
      style={[Theme.Modal.modalView]}
      animationInTiming={300}
      animationOutTiming={300}>
      <View style={Theme.Modal.modalInnerView}>
        <View style={styles.modalBackdrop}>
          <BlurView style={{ flex: 1 }} blurType="xlight" blurAmount={1} />
        </View>
        <Animated.View style={{ flex: 1, justifyContent: 'center' }}>
          <AppButton
            icon="close"
            iconSize={15}
            onPress={() => {
              setName(user?.name ? user.name : '')
              setModalVisible(false)
            }}
            style={{
              height: 25,
              width: 25,
              position: 'relative',
              top: 15,
              left: Dimensions.Width - 30,
            }}
          />
          <View style={styles.content}>
            <AppInput
              style={styles.input}
              placeholder={user?.name ? user.name : 'Type your name'}
              onChange={(value) => setName(value)}
              value={name}
            />
            <AppText
              fontSize={FontSize.large}
              weight="italic"
              style={{ color: Colors.primary, marginLeft: 5, marginTop: 20 }}>
              Points for Answering Each Question:
            </AppText>
            <Picker
              items={POINTS}
              selectedValue={points}
              onChange={(value) => {
                setPoints(value)
              }}
            />
            <View style={styles.actions}>
              <AppButton
                text="Continue"
                onPress={onSubmit}
                disabled={isBtnDisabled}
                style={{ marginBottom: 12 }}
              />
            </View>
          </View>
        </Animated.View>
      </View>
    </Modal>
  )
}

AskUserNameModal.propTypes = {
  isModalVisible: PropTypes.bool,
  setModalVisible: PropTypes.func,
  toAskMeScreen: PropTypes.bool,
  onGoToContactList: PropTypes.func,
  fromMain: PropTypes.bool,
}

export default AskUserNameModal
