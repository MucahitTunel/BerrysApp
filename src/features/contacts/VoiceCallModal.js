/* eslint-disable react/prop-types */
import React from 'react'
import { useDispatch } from 'react-redux'
import PropTypes from 'prop-types'
import { View, StyleSheet, Animated } from 'react-native'
import Modal from 'react-native-modal'
import { BlurView } from '@react-native-community/blur'
import { Dimensions, Colors, FontSize } from 'constants'
import { AppButton, AppText } from 'components'
import Theme from 'theme'

import RNUxcam from 'react-native-ux-cam'
RNUxcam.tagScreenName('Voice Call Modal')

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
    width: Dimensions.Width - 20,
    marginLeft: 10,
    borderRadius: 8,
  },
})

const VoiceCallModal = ({
  question,
  isModalVisible,
  setModalVisible,
  onPress,
}) => {
  const onSubmit = () => {
    onPress()
  }

  const closeModal = () => {
    setModalVisible(false)
  }

  return (
    <Modal
      isVisible={isModalVisible}
      style={[Theme.Modal.modalView]}
      animationInTiming={300}
      animationOutTiming={300}>
      <View style={Theme.Modal.modalInnerView}>
        <View style={styles.modalBackdrop}>
          <BlurView style={{ flex: 1 }} blurType="dark" blurAmount={1} />
        </View>
        <Animated.View style={{ flex: 1, justifyContent: 'center' }}>
          <View style={styles.content}>
            <AppText
              fontSize={FontSize.xLarge}
              style={{ marginBottom: 10, textAlign: 'center' }}>
              {question}
            </AppText>
            <View style={styles.actions}>
              <AppButton text="Yes" onPress={onSubmit} />
              <AppButton
                text="No"
                textStyle={{ color: Colors.purpleText }}
                style={{
                  backgroundColor: Colors.white,
                  marginTop: 12,
                }}
                onPress={closeModal}
              />
            </View>
          </View>
        </Animated.View>
      </View>
    </Modal>
  )
}

VoiceCallModal.propTypes = {
  isModalVisible: PropTypes.bool,
  setModalVisible: PropTypes.func,
  onPress: PropTypes.func,
  question: PropTypes.string,
}

export default VoiceCallModal
