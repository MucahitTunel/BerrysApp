/* eslint-disable react/prop-types */
import React from 'react'
import PropTypes from 'prop-types'
import { View, StyleSheet, Animated } from 'react-native'
import Modal from 'react-native-modal'
import { BlurView } from '@react-native-community/blur'
import { Dimensions, Colors, FontSize, Screens } from 'constants'
import Theme from 'theme'
import LottieView from 'lottie-react-native'
import { AppText } from 'components'
import { AppButton, AppLink } from '../index'

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
    paddingHorizontal: 20,
    paddingVertical: 40,
    width: Dimensions.Width - 20,
    marginLeft: 10,
    borderRadius: 8,
  },
})

const SuccessModal = ({ isModalVisible, closeModal }) => {
  const onSubmit = () => {
    closeModal()
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
            <View
              style={{
                height: 50,
                alignItems: 'center',
              }}>
              <LottieView
                style={{ height: 60 }}
                source={require('../../assets/lotties/check-circle')}
                autoPlay
                loop={false}
              />
            </View>
            <AppText
              fontSize={FontSize.xLarge}
              style={{ textAlign: 'center', marginTop: 16 }}>
              Your question was submitted!
            </AppText>
            <View style={{ alignItems: 'center', marginTop: 24 }}>
              <AppButton
                onPress={onSubmit}
                text={'Close'}
                style={{ height: 40, borderRadius: 20, width: 150 }}
              />
            </View>
          </View>
        </Animated.View>
      </View>
    </Modal>
  )
}

SuccessModal.propTypes = {
  isModalVisible: PropTypes.bool,
  setModalVisible: PropTypes.func,
  onGoToContactList: PropTypes.func,
  fromMain: PropTypes.bool,
}

export default SuccessModal
