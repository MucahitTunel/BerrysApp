/* eslint-disable react/prop-types */
import React, { useLayoutEffect, useRef, useState } from 'react'
import { useSelector } from 'react-redux'
import { View, StatusBar, StyleSheet, Animated } from 'react-native'
import moment from 'moment'
import KeyboardListener from 'react-native-keyboard-listener'
import { hideKeyBoard, showKeyboard } from 'utils'
import Constants from 'constants'
import Fonts from 'assets/fonts'
import { AppText, AppButton, Loading, Header } from 'components'
import { BackButton } from 'components/NavButton'
import AskMyQuestionModal from './AskMyQuestionModal'

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
    marginLeft: 10,
    flex: 1,
    fontFamily: Fonts.latoRegular,
    fontSize: Constants.Styles.FontSize.large,
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
  askBtn: {
    padding: 10,
    backgroundColor: Constants.Colors.white,
  },
})

const RequestToAsk = ({ navigation, route }) => {
  let keyboardHeight = useRef(new Animated.Value(0))
  const [showAskingModal, setShowAskingModal] = useState(false)
  const loading = useSelector((state) => state.question.loading)
  const { request } = route.params
  const { requester } = request
  const title = `${requester} invited you to ask him a question anonymously`

  useLayoutEffect(() => {
    // Have to move this logic here because
    // https://reactnavigation.org/docs/troubleshooting/#i-get-the-warning-non-serializable-values-were-found-in-the-navigation-state
    // eslint-disable-next-line react/prop-types
    navigation.setOptions({
      header: () => (
        <Header headerLeft={<BackButton navigation={navigation} />} />
      ),
    })
  }, [navigation])

  if (loading) return <Loading />
  return (
    <Animated.View
      style={[styles.container, { paddingBottom: keyboardHeight.current }]}>
      <StatusBar barStyle="light-content" />
      <KeyboardListener
        onWillShow={(event) => showKeyboard(event, keyboardHeight.current)}
        onWillHide={(event) => hideKeyBoard(event, keyboardHeight.current)}
      />
      <View style={styles.headerView}>
        <View style={{ flexDirection: 'row' }}>
          <AppText
            text={title}
            fontSize={Constants.Styles.FontSize.xxLarge}
            fontFamily={Fonts.latoBold}
            style={{ marginRight: 10 }}
          />
        </View>
        <View style={styles.headerInner}>
          <AppText
            text={moment(request.createdAt).fromNow()}
            color={Constants.Colors.gray}
            style={{ marginRight: 14 }}
            fontSize={Constants.Styles.FontSize.medium}
          />
        </View>
      </View>
      <View style={styles.askBtn}>
        <AppButton
          onPress={() => setShowAskingModal(true)}
          text="Ask My Question"
          backgroundColor={Constants.Colors.primary}
          color={Constants.Colors.white}
          borderRadius={Constants.Styles.BorderRadius.small}
        />
      </View>

      {/*AskMyQuestion Modal*/}
      <AskMyQuestionModal
        request={request}
        isModalVisible={showAskingModal}
        setModalVisible={(value) => setShowAskingModal(value)}
      />
    </Animated.View>
  )
}

export default RequestToAsk
