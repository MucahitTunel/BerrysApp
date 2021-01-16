/* eslint-disable react/prop-types */
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import PropTypes from 'prop-types'
import {
  FlatList,
  StatusBar,
  StyleSheet,
  View,
  SafeAreaView,
  ScrollView,
} from 'react-native'
import { useKeyboard } from '@react-native-community/hooks'
import { Formik } from 'formik'
import moment from 'moment'
import RNUrlPreview from 'react-native-url-preview'
import Swipeout from 'react-native-swipeout'
import ReceiveSharingIntent from 'react-native-receive-sharing-intent'
import OneSignal from 'react-native-onesignal'
import Config from 'react-native-config'
import {
  AppButton,
  AppIcon,
  AppInput,
  AppText,
  Avatar,
  Loading,
  ScaleTouchable,
  AppImage,
} from 'components'
import { Colors, Dimensions, Screens, FontSize } from 'constants'
import Images from 'assets/images'
import Fonts from 'assets/fonts'
import * as NavigationService from 'services/navigation'
import { setUserIsNew, updatePushToken } from 'features/auth/authSlice'
import { getQuestions, hideQuestion } from 'features/questions/questionsSlice'
import { getQuestion } from 'features/questions/questionSlice'
import { setAskQuestion } from 'features/questions/askSlice'
import { loadContacts } from 'features/contacts/contactsSlice'
import store from 'state/store'
import surveysList from '../auth/surveysList'
import AskUserNameModal from './AskUserNameModal'
import { checkURL } from 'utils'

ReceiveSharingIntent.getReceivedFiles(
  (files) => {
    // files returns as JSON Array example
    //[{ filePath: null, text: null, weblink: null, mimeType: null, contentUri: null, fileName: null, extension: null }]
    console.log('files')
    console.log(files)
    const weblink = files && files.length && files[0] && files[0].weblink
    console.log('weblink', weblink)
    store.dispatch(setAskQuestion(weblink))
  },
  (error) => {
    console.log(error)
  },
)

// To clear Intents
ReceiveSharingIntent.clearReceivedFiles()

const swipeoutBtns = [
  {
    text: 'Hide',
    backgroundColor: Colors.primary,
    fontFamily: Fonts.euclidCircularAMedium,
  },
]

const styles = StyleSheet.create({
  container: {
    height: Dimensions.Height,
    width: Dimensions.Width,
    backgroundColor: Colors.white,
    flex: 1,
  },
  questionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    paddingTop: 10,
    paddingRight: 12,
    backgroundColor: Colors.white,
    borderBottomWidth: 4,
    borderColor: Colors.background,
  },
  lastQuestionItem: {
    borderBottomWidth: 0,
  },
  inputView: {
    paddingHorizontal: 16,
    backgroundColor: Colors.white,
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    paddingTop: 20,
    marginHorizontal: 10,
    flex: 1,
    fontSize: FontSize.large,
    color: Colors.text,
    height: 84,
  },
  flatListView: {
    paddingTop: 4,
    flex: 1,
  },
  removeQuestionUrlBtn: {
    position: 'absolute',
    top: 8,
    right: 8,
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
    backgroundColor: Colors.white,
    width: Dimensions.Width - 32,
    marginLeft: 16,
    paddingTop: 12,
    borderRadius: 8,
  },
  modalInput: {
    padding: 20,
    paddingTop: 16,
    marginBottom: 10,
    fontSize: FontSize.large,
    height: 50,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: Colors.grayLight,
    flex: 1,
  },
  askBtn: {
    height: 48,
    paddingHorizontal: 40,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    bottom: 24,
    width: 182,
    left: (Dimensions.Width - 182) / 2,
  },
  sendBtn: {
    height: 25,
    width: 56,
    borderRadius: 4,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendBtnDisabled: {
    backgroundColor: Colors.grayLight,
  },
  sendBtnText: {
    fontSize: 13,
    fontFamily: Fonts.euclidCircularAMedium,
    marginLeft: 4,
  },
  requesterIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(235, 84, 80, 0.19)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  requesterText: {
    marginRight: 5,
    lineHeight: 20,
    flex: 1,
    flexWrap: 'wrap',
  },
})

const RequestToAsk = ({ requests }) => {
  const user = useSelector((state) => state.auth.user)
  if (!user || !requests.length) return null
  const onPressRequestToAsk = () => {
    NavigationService.navigate(Screens.RequestToAsk, {
      requests,
    })
  }
  const renderRequester = () => {
    if (requests.length === 1) {
      return (
        <AppText color={Colors.primary} fontSize={FontSize.normal}>
          {requests[0].requester}
        </AppText>
      )
    } else {
      return (
        <AppText weight="medium" fontSize={FontSize.normal}>
          <AppText
            color={Colors.primary}
            fontSize={FontSize.normal}
            weight="medium">
            {requests[0].requester}
          </AppText>
          {` and `}
          <AppText
            color={Colors.primary}
            fontSize={FontSize.normal}
            weight="medium">
            {`${requests.length - 1} People`}
          </AppText>
        </AppText>
      )
    }
  }
  return (
    <ScaleTouchable
      style={[
        styles.questionItem,
        { borderTopWidth: 4, borderTopColor: Colors.background },
      ]}
      onPress={() => onPressRequestToAsk()}>
      <View style={{ flex: 1 }}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
          }}>
          <View style={styles.requesterIcon}>
            <AppImage source={Images.message} width={17} height={15} />
          </View>
          <AppText
            style={styles.requesterText}
            weight="medium"
            fontSize={FontSize.normal}>
            {`You got invited by `}
            {renderRequester()}
            {` to ask your questions anonymously`}
          </AppText>
        </View>
      </View>
      <View
        style={{
          marginLeft: 16,
          flexDirection: 'row',
        }}>
        <AppIcon name="chevron-right" size={20} color={Colors.primary} />
      </View>
    </ScaleTouchable>
  )
}

const QuestionItem = ({
  question: {
    _id,
    content,
    comments = 0,
    totalVotes = 0,
    createdAt,
    flaggedBy = [],
  },
}) => {
  const user = useSelector((state) => state.auth.user)
  const dispatch = useDispatch()
  if (!user) return null
  const { phoneNumber } = user
  const isFlagged = flaggedBy.includes(phoneNumber)
  const onPressQuestion = (questionId) => {
    dispatch(getQuestion(questionId))
    NavigationService.navigate(Screens.Answers)
  }
  const onRemoveQuestion = (direction, _id) => {
    if (direction === 'right') {
      dispatch(hideQuestion(_id))
    }
  }
  return (
    <Swipeout
      style={{ marginBottom: 4 }}
      onOpen={(sectionID, rowId, direction) => onRemoveQuestion(direction, _id)}
      right={swipeoutBtns}
      backgroundColor="transparent"
      buttonWidth={Dimensions.Width - 10}>
      <ScaleTouchable
        style={styles.questionItem}
        onPress={() => onPressQuestion(_id)}>
        {isFlagged && (
          <View style={{ position: 'absolute', right: 20, top: 10 }}>
            <AppIcon name="flag" color={Colors.primary} size={20} />
          </View>
        )}
        <View style={{ flex: 1 }}>
          <AppText style={{ marginRight: 5 }} fontSize={FontSize.large}>
            {content}
          </AppText>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginTop: 12,
            }}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <AppText
                fontSize={15}
                weight="medium"
                style={{ marginRight: 38 }}>
                {comments}
                <AppText
                  fontSize={15}
                  color={Colors.gray}>{`  answers`}</AppText>
              </AppText>
              <AppText
                fontSize={15}
                weight="medium"
                style={{ marginRight: 38 }}>
                {totalVotes}
                <AppText fontSize={15} color={Colors.gray}>{`  votes`}</AppText>
              </AppText>
            </View>
          </View>
        </View>
        <View
          style={{
            marginLeft: 16,
            flexDirection: 'row',
            alignItems: 'center',
          }}>
          <AppText color={Colors.gray} fontSize={FontSize.normal}>
            {moment(createdAt).fromNow()}
          </AppText>
          <AppIcon
            name="chevron-right"
            size={20}
            color={'rgba(128, 128, 128, 0.5)'}
          />
        </View>
      </ScaleTouchable>
    </Swipeout>
  )
}

QuestionItem.propTypes = {
  question: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    content: PropTypes.string.isRequired,
    comments: PropTypes.number.isRequired,
    totalVotes: PropTypes.number.isRequired,
    createdAt: PropTypes.number.isRequired,
    flaggedBy: PropTypes.arrayOf(PropTypes.string).isRequired,
  }),
}

const Main = () => {
  const dispatch = useDispatch()
  const user = useSelector((state) => state.auth.user)
  const questions = useSelector((state) => state.questions)
  const question = useSelector((state) => state.ask.question)
  const { data, loading, requestsToAsk } = questions
  const keyboard = useKeyboard()
  const [questionUrl, setQuestionUrl] = useState(null)
  const [_, setQuestionFromModal] = useState(null)
  const [popularQuestions, setPopularQuestions] = useState(
    surveysList[0].popularQuestions,
  )
  const [isAskUserNameModalVisible, setIsAskUserNameModalVisible] = useState(
    false,
  )

  useEffect(() => {
    dispatch(getQuestions())
    dispatch(loadContacts())
    const onReceived = (notification) =>
      console.log(`Notification received: ${notification}`)
    const onOpened = (openResult) => {
      console.log(`Message: ${openResult.notification.payload.body}`)
      console.log(`Data: ${openResult.notification.payload.additionalData}`)
      console.log(`isActive: ${openResult.notification.isAppInFocus}`)
      console.log(`openResult: ${openResult}`)
    }
    const onIds = async (device) => {
      console.log(`Device info: ${JSON.stringify(device)}`)
      if (device && device.userId) {
        console.log('device.userId', device.userId)
        // save device.userId to database
        dispatch(updatePushToken({ pushToken: device.userId }))
      }
    }
    OneSignal.setLogLevel(6, 0)
    OneSignal.inFocusDisplaying(2)
    OneSignal.init(Config.ONESIGNAL_APP_ID, {
      kOSSettingsKeyAutoPrompt: true,
      kOSSettingsKeyInAppLaunchURL: false,
      kOSSettingsKeyInFocusDisplayOption: 2,
    })
    OneSignal.addEventListener('received', onReceived)
    OneSignal.addEventListener('opened', onOpened)
    OneSignal.addEventListener('ids', onIds)
    return () => {
      OneSignal.removeEventListener('received', onReceived)
      OneSignal.removeEventListener('opened', onOpened)
      OneSignal.removeEventListener('ids', onIds)
    }
  }, [dispatch])

  useEffect(() => {
    const url = checkURL(question)
    setQuestionUrl(url)
  }, [questions, question])
  useEffect(() => {
    const defaultSurveyValue = surveysList[0].value
    const { survey = defaultSurveyValue } = user
    const surveyQuestions = surveysList.find((x) => x.value === survey)
      .popularQuestions
    setPopularQuestions(surveyQuestions || surveysList[0].popularQuestions)
    setQuestionFromModal(surveyQuestions[0])
  }, [user])

  const onSubmit = (values, { setSubmitting, resetForm }) => {
    setSubmitting(true)
    const { question } = values
    if (question) {
      dispatch(setAskQuestion(question))
      resetForm({})
      setSubmitting(false)
      NavigationService.navigate(Screens.SelectContacts)
    }
  }

  const sendQuestionFromModal = (q) => {
    dispatch(setUserIsNew(false))
    dispatch(setAskQuestion(q))
    NavigationService.navigate(Screens.SelectContacts)
  }

  const renderEmpty = () => (
    <View
      style={{
        paddingTop: 40,
        alignItems: 'center',
        justifyContent: 'center',
      }}>
      <AppText style={{ textAlign: 'center' }}>There's no question yet</AppText>
    </View>
  )

  const onPressAskMeAnything = () => {
    if (user && user.name) {
      setIsAskUserNameModalVisible(false)
      NavigationService.navigate(Screens.AskMe)
    } else {
      setIsAskUserNameModalVisible(true)
    }
  }

  const isNewUser = user.isNew && !question

  const renderItem = ({ item }) => <QuestionItem question={item} />

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <Formik
        enableReinitialize
        initialValues={{ question }}
        onSubmit={onSubmit}>
        {({ values, handleSubmit, setFieldValue }) => (
          <View style={styles.inputView}>
            <Avatar source={Images.defaultAvatar} size={50} />
            <AppInput
              style={styles.input}
              placeholder="Ask from people in your circles, anonymously..."
              multiline
              onChange={(value) => {
                setFieldValue('question', value)
                const url = checkURL(value)
                setQuestionUrl(url)
              }}
              value={values.question}
            />
            <AppButton
              text="Post"
              textStyle={styles.sendBtnText}
              icon="send"
              iconSize={12}
              disabled={!values.question}
              style={[
                styles.sendBtn,
                !values.question && styles.sendBtnDisabled,
              ]}
              onPress={handleSubmit}
            />
          </View>
        )}
      </Formik>
      {questionUrl && (
        <View>
          <RNUrlPreview text={questionUrl} />
        </View>
      )}
      <RequestToAsk requests={requestsToAsk} />
      {isNewUser ? (
        <View style={{ flex: 1 }}>
          <View
            style={{
              paddingVertical: 10,
              paddingHorizontal: 16,
              backgroundColor: Colors.background,
            }}>
            <AppText weight="medium" fontSize={FontSize.xLarge}>
              {`Popular Questions `}
              <AppText color={Colors.gray} fontSize={FontSize.normal}>
                (Tap to ask)
              </AppText>
            </AppText>
          </View>
          <ScrollView contentContainerStyle={{ paddingBottom: 80 }}>
            {popularQuestions.map((q, index) => (
              <ScaleTouchable
                key={`${index}_${q}`}
                style={[
                  styles.questionItem,
                  index === popularQuestions.length - 1 &&
                    styles.lastQuestionItem,
                ]}
                onPress={() => sendQuestionFromModal(q)}>
                <AppText style={{ flex: 1, paddingRight: 24 }} weight="medium">
                  {q}
                </AppText>
                <AppIcon
                  name="chevron-right"
                  size={20}
                  color={'rgba(128, 128, 128, 0.5)'}
                />
              </ScaleTouchable>
            ))}
          </ScrollView>
        </View>
      ) : (
        <View style={styles.flatListView}>
          {loading && !data.length && <Loading />}
          <FlatList
            data={data}
            renderItem={renderItem}
            keyExtractor={(item) => item._id}
            ListEmptyComponent={renderEmpty()}
            refreshing={loading}
            onRefresh={() => dispatch(getQuestions())}
            contentContainerStyle={{ paddingBottom: 60 }}
          />
        </View>
      )}
      {!keyboard.keyboardShown && (
        <AppButton
          text="Ask Me"
          textStyle={{ marginLeft: 16 }}
          icon="message-dot"
          iconSize={20}
          onPress={onPressAskMeAnything}
          style={styles.askBtn}
        />
      )}

      {/* AskUserNameModal */}
      <AskUserNameModal
        isModalVisible={isAskUserNameModalVisible}
        setModalVisible={(value) => setIsAskUserNameModalVisible(value)}
        toAskMeScreen
      />
    </SafeAreaView>
  )
}

export default Main
