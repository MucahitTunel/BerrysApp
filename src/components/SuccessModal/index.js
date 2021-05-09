/* eslint-disable react/prop-types */
import React, { useEffect } from 'react'
import PropTypes from 'prop-types'
import { View, StyleSheet, Animated, Keyboard } from 'react-native'
import Modal from 'react-native-modal'
import { BlurView } from '@react-native-community/blur'
import { Colors, FontSize } from 'constants'
import { AppButton } from 'components'
import Theme from 'theme'
import LottieView from 'lottie-react-native'
import AppText from '../AppText'

const styles = StyleSheet.create({
  modalBackdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    height: '100%',
    width: '100%',
  },
  content: {
    backgroundColor: Colors.white,
    marginHorizontal: 50,
    borderRadius: 10,
    paddingVertical: 15,
  },
  closeIcon: {
    backgroundColor: 'transparent',
    right: 5,
    position: 'absolute',
    top: 5,
    zIndex: 9999,
  },
})

const SuccessModal = ({ isModalVisible, closeModal }) => {
  useEffect(() => {
    Keyboard.dismiss()
  }, [])

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
            <AppButton
              icon="close"
              iconSize={18}
              iconColor={Colors.gray}
              style={styles.closeIcon}
              shadow={false}
              onPress={closeModal}
            />
            <View
              style={{
                alignItems: 'center',
              }}>
              <LottieView
                style={{ height: 130, top: -5 }}
                source={require('../../assets/lotties/check-circle')}
                autoPlay
                loop={false}
              />
            </View>
            <AppText
              fontSize={FontSize.xxxLarge}
              weight="bold"
              style={{ textAlign: 'center', color: 'black', top: -30 }}>
              You have asked
            </AppText>
            <AppText
              fontSize={FontSize.large}
              style={{
                textAlign: 'center',
                color: Colors.gray,
                top: -15,
                marginHorizontal: 30,
              }}>
              The points you get are reduced{' '}
              <AppText style={{ color: Colors.primary }}>by 10</AppText> for
              asking questions
            </AppText>
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
