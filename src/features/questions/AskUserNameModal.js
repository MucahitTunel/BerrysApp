import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import PropTypes from 'prop-types'
import { View, StyleSheet, Animated } from 'react-native'
import Modal from 'react-native-modal'
import { BlurView } from '@react-native-community/blur'
import { Dimensions, Colors, Screens } from 'constants'
import { AppInput, AppButton } from 'components'
import Theme from 'theme'
import * as NavigationService from 'services/navigation'
import { updateName } from 'features/auth/authSlice'

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

const AskUserNameModal = ({
  isModalVisible,
  setModalVisible,
  toAskMeScreen = false,
}) => {
  const dispatch = useDispatch()
  const [name, setName] = useState('')
  const onSubmit = () => {
    dispatch(updateName({ name }))
    setName('')
    setModalVisible(false)
    if (toAskMeScreen) {
      NavigationService.navigate(Screens.AskMe)
    }
  }
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
          <View style={styles.content}>
            <AppInput
              style={styles.input}
              placeholder="Type your name"
              onChange={(value) => setName(value)}
              value={name}
            />
            <View style={styles.actions}>
              <AppButton text="Submit" onPress={onSubmit} />
              <AppButton
                text="Close"
                textStyle={{ color: Colors.primary }}
                style={{ backgroundColor: Colors.white, marginBottom: 12 }}
                onPress={() => setModalVisible(false)}
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
