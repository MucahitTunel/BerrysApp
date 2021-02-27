/* eslint-disable react/prop-types */
import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import PropTypes from 'prop-types'
import { View, StyleSheet, Animated } from 'react-native'
import Modal from 'react-native-modal'
import { BlurView } from '@react-native-community/blur'
import { Dimensions, Colors, FontSize } from 'constants'
import { AppButton, AppText, AppInput } from 'components'
import Theme from 'theme'
import { setAskQuestion } from 'features/questions/askSlice'
import { directMessage } from 'features/messages/messagesSlice'

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

const AskMyQuestionModal = ({ isModalVisible, setModalVisible, request }) => {
  const dispatch = useDispatch()
  const contacts = useSelector((state) => state.contacts.data)
  const [question, setQuestion] = useState('')
  const onSubmit = () => {
    const requester = contacts.find(
      (c) => c.phoneNumber === request.userPhoneNumber,
    )
    dispatch(setAskQuestion(question))
    setModalVisible(false)
    setQuestion('')
    dispatch(
      directMessage({
        userPhoneNumber: requester.phoneNumber,
        askRequestId: request._id,
      }),
    )
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
            <AppText
              fontSize={FontSize.xLarge}
              style={{ marginBottom: 30, textAlign: 'center' }}>
              {`Ask ${request.requester} your question`}
            </AppText>
            <AppInput
              style={styles.input}
              placeholder="Type your question"
              onChange={(value) => setQuestion(value)}
              value={question}
            />
            <View style={styles.actions}>
              <AppButton text="Submit" onPress={onSubmit} />
              <AppButton
                text="Close"
                textStyle={{ color: Colors.primary }}
                style={{
                  backgroundColor: Colors.white,
                  marginTop: 12,
                }}
                onPress={() => setModalVisible(false)}
              />
            </View>
          </View>
        </Animated.View>
      </View>
    </Modal>
  )
}

AskMyQuestionModal.propTypes = {
  isModalVisible: PropTypes.bool,
  setModalVisible: PropTypes.func,
  onGoToContactList: PropTypes.func,
  fromMain: PropTypes.bool,
}

export default AskMyQuestionModal
