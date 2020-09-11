import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { View, StyleSheet, Animated } from 'react-native'
import Modal from 'react-native-modal'
import { BlurView } from '@react-native-community/blur'
import Constants from 'constants'
import Fonts from 'assets/fonts'
import { AppInput, AppButton, AppText } from 'components'
import Theme from 'theme'

const styles = StyleSheet.create({
  container: {
    height: Constants.Dimensions.Height,
    width: Constants.Dimensions.Width,
    backgroundColor: Constants.Colors.grayLight,
    flex: 1,
  },
  headerView: {
    backgroundColor: Constants.Colors.white,
    padding: 16,
    borderBottomColor: Constants.Colors.grayLight,
    borderBottomWidth: 1,
  },
  headerInner: {
    flexDirection: 'row',
    marginTop: 10,
    alignItems: 'center',
  },
  headerAnswerView: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerAnswerInner: {
    flexDirection: 'row',
    marginTop: 10,
    alignItems: 'center',
  },
  questionItem: {
    flexDirection: 'row',
    borderBottomColor: Constants.Colors.grayLight,
    borderBottomWidth: 1,
    paddingBottom: 14,
    marginBottom: 14,
    marginLeft: 16,
    width: Constants.Dimensions.Width - 32,
  },
  lastQuestionItem: {
    borderBottomWidth: 0,
    marginBottom: 0,
  },
  flatListView: {
    paddingVertical: 16,
    backgroundColor: Constants.Colors.white,
    flex: 1,
  },
  inputView: {
    padding: 16,
    backgroundColor: Constants.Colors.white,
    flexDirection: 'row',
  },
  input: {
    paddingHorizontal: 20,
    marginBottom: 10,
    fontSize: Constants.Styles.FontSize.large,
    fontFamily: Fonts.latoRegular,
    height: 50,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: Constants.Colors.grayLight,
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
    backgroundColor: Constants.Colors.white,
    padding: 20,
    paddingBottom: 5,
    width: Constants.Dimensions.Width - 20,
    marginLeft: 10,
    borderRadius: 8,
  },
})

const AskMeAnythingModal = ({ isModalVisible, setModalVisible }) => {
  const [name, setName] = useState('')
  const onSubmit = () => {}
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
            <AppText
              text="We won’t show your name to other users unless you want to."
              color={Constants.Colors.gray}
              style={{ padding: 5, marginBottom: 5 }}
            />
            <View style={styles.actions}>
              <AppButton
                text="Submit"
                backgroundColor={Constants.Colors.primary}
                color={Constants.Colors.white}
                onPress={onSubmit}
                activeOpacity={name ? 0.2 : 1}
              />
              <AppButton text="Close" onPress={() => setModalVisible(false)} />
            </View>
          </View>
        </Animated.View>
      </View>
    </Modal>
  )
}

AskMeAnythingModal.propTypes = {
  isModalVisible: PropTypes.bool,
  setModalVisible: PropTypes.func,
  onGoToContactList: PropTypes.func,
  fromMain: PropTypes.bool,
}

export default AskMeAnythingModal
