import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import PropTypes from 'prop-types'
import {
  FlatList,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native'
import { Formik } from 'formik'
import moment from 'moment'
import RNUrlPreview from 'react-native-url-preview'
import Modal from 'react-native-modal'
import Swipeout from 'react-native-swipeout'
import ReceiveSharingIntent from 'react-native-receive-sharing-intent'
import OneSignal from 'react-native-onesignal'
import Config from 'react-native-config'
import {
  AppButton,
  AppIcon,
  AppInput,
  AppLink,
  AppText,
  Avatar,
  Loading,
} from 'components'
import Constants from 'constants'
import Images from 'assets/images'
import Fonts from 'assets/fonts'
import * as NavigationService from 'services/navigation'
import { updatePushToken, setUserIsNew } from 'features/auth/authSlice'
import { getQuestions, hideQuestion } from 'features/questions/questionsSlice'
import { getQuestion } from 'features/questions/questionSlice'
import { setAskQuestion } from 'features/questions/askSlice'
import { loadContacts } from 'features/contacts/contactsSlice'
import store from 'state/store'
import Theme from 'theme'
import Slick from 'react-native-slick'
import surveysList from '../auth/surveysList'
import AskMeAnythingModal from './AskMeAnythingModal'

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
    backgroundColor: Constants.Colors.textRed,
  },
]

const styles = StyleSheet.create({
  container: {
    height: Constants.Dimensions.Height,
    width: Constants.Dimensions.Width,
    backgroundColor: Constants.Colors.grayLight,
    flex: 1,
  },
  questionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: Constants.Colors.white,
  },
  inputView: {
    padding: 16,
    backgroundColor: Constants.Colors.white,
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    marginHorizontal: 10,
    flex: 1,
    fontFamily: Fonts.latoRegular,
    fontSize: Constants.Styles.FontSize.large,
  },
  flatListView: {
    paddingTop: 12,
    backgroundColor: 'transparent',
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
    backgroundColor: Constants.Colors.white,
    width: Constants.Dimensions.Width - 32,
    marginLeft: 16,
    paddingTop: 12,
    borderRadius: 8,
  },
  modalInput: {
    padding: 20,
    paddingTop: 16,
    marginBottom: 10,
    fontSize: Constants.Styles.FontSize.large,
    fontFamily: Fonts.latoRegular,
    height: 50,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: Constants.Colors.grayLight,
    flex: 1,
  },
  askBtn: {
    backgroundColor: Constants.Colors.white,
    borderTopWidth: 1,
    borderColor: Constants.Colors.grayLight,
  },
})

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
    NavigationService.navigate(Constants.Screens.Answers)
  }
  const onRemoveQuestion = (direction, _id) => {
    if (direction === 'right') {
      dispatch(hideQuestion(_id))
    }
  }
  const url = checkURL(content)
  return (
    <Swipeout
      style={{
        marginBottom: 8,
        width: Constants.Dimensions.Width - 24,
        marginLeft: 12,
        borderRadius: 8,
      }}
      onOpen={(sectionID, rowId, direction) => onRemoveQuestion(direction, _id)}
      right={swipeoutBtns}
      backgroundColor="transparent"
      buttonWidth={Constants.Dimensions.Width - 10}>
      <TouchableOpacity
        style={styles.questionItem}
        onPress={() => onPressQuestion(_id)}>
        <View style={{ flex: 1 }}>
          <View
            style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <AppText
              style={{ marginRight: 5 }}
              text={content}
              fontSize={Constants.Styles.FontSize.large}
              fontFamily={Fonts.latoBold}
            />
            {isFlagged && (
              <AppIcon name="flag" color={Constants.Colors.primary} size={20} />
            )}
          </View>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginTop: 16,
            }}>
            <View style={{ flexDirection: 'row' }}>
              <AppText
                text={`${comments}  answers`}
                color={Constants.Colors.gray}
                fontFamily={Fonts.latoBold}
                style={{ marginRight: 14 }}
              />
              <AppText
                text={`${totalVotes}  votes`}
                color={Constants.Colors.gray}
              />
            </View>
            <AppText
              text={moment(createdAt).fromNow()}
              color={Constants.Colors.gray}
            />
          </View>
        </View>
        <View
          style={{
            marginLeft: 16,
            flexDirection: 'row',
          }}>
          <AppIcon name="chevron-right" size={20} />
        </View>
      </TouchableOpacity>
      {url && (
        <RNUrlPreview
          containerStyle={{
            paddingHorizontal: 16,
            backgroundColor: Constants.Colors.white,
            borderTopColor: Constants.Colors.grayLight,
            borderTopWidth: 1,
          }}
          imageStyle={{
            width: 100,
          }}
          faviconStyle={{
            alignItems: 'center',
            justifyContent: 'center',
            width: 30,
          }}
          titleNumberOfLines={1}
          text={url}
        />
      )}
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

const checkURL = (str) => {
  const pattern = new RegExp(
    '(https?:\\/\\/)?' + // protocol
    '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
    '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
    '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
    '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
      '(\\#[-a-z\\d_]*)?',
    'i',
  ) // fragment locator
  const isMatch = pattern.test(str)
  if (isMatch) {
    const res = str.match(pattern)
    const url = res && res.length && res[0]
    return url
  }
  return null
}

const Main = () => {
  const dispatch = useDispatch()
  const user = useSelector((state) => state.auth.user)
  const questions = useSelector((state) => state.questions)
  const question = useSelector((state) => state.ask.question)
  const { data, loading } = questions
  const [questionUrl, setQuestionUrl] = useState(null)
  const [questionFromModal, setQuestionFromModal] = useState(null)
  const [popularQuestions, setPopularQuestions] = useState(
    surveysList[0].popularQuestions,
  )
  const [showAskingModal, setShowAskingModal] = useState(false)

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
      NavigationService.navigate(Constants.Screens.SelectContacts)
    }
  }

  const sendQuestionFromModal = () => {
    if (questionFromModal) {
      dispatch(setUserIsNew(false))
      dispatch(setAskQuestion(questionFromModal))
      setTimeout(() => {
        NavigationService.navigate(Constants.Screens.SelectContacts)
      }, 1000)
    }
  }

  const renderEmpty = () => (
    <AppText style={{ textAlign: 'center' }} text="There's no question yet" />
  )

  const onPressSkip = () => dispatch(setUserIsNew(false))

  const onIndexChanged = (index) => {
    setQuestionFromModal(popularQuestions[index])
  }

  const openAskingModal = () => {
    setShowAskingModal(true)
  }

  const isSuggestionsModalVisible = user.isNew && !question

  return (
    <View style={styles.container}>
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
            <TouchableOpacity
              onPress={handleSubmit}
              activeOpacity={values.question ? 0.7 : 1}>
              <AppIcon
                name="send"
                color={
                  values.question
                    ? Constants.Colors.primaryLight
                    : Constants.Colors.grayLight
                }
              />
            </TouchableOpacity>
          </View>
        )}
      </Formik>
      {questionUrl && (
        <View>
          <RNUrlPreview text={questionUrl} />
        </View>
      )}

      <View style={styles.askBtn}>
        <TouchableOpacity
          onPress={openAskingModal}
          style={{
            height: 48,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <AppText
            text="Ask Me Everything"
            color={Constants.Colors.primary}
            fontFamily={Fonts.latoBold}
            fontSize={Constants.Styles.FontSize.normal}
          />
        </TouchableOpacity>
      </View>
      <View style={styles.flatListView}>
        {loading && !data.length && <Loading />}
        <FlatList
          data={data}
          renderItem={({ item }) => <QuestionItem question={item} />}
          keyExtractor={(item) => item._id}
          ListEmptyComponent={renderEmpty()}
          refreshing={loading}
          onRefresh={() => dispatch(getQuestions())}
        />
      </View>

      {/*Suggestion Modal*/}
      <Modal
        isVisible={isSuggestionsModalVisible}
        style={[Theme.Modal.modalView]}
        animationInTiming={300}
        animationOutTiming={300}>
        <View
          style={[
            {
              paddingTop: 40,
              flex: 1,
              maxHeight: Constants.Dimensions.Height - 60,
              paddingBottom: 260,
            },
          ]}>
          <View style={[Theme.Modal.modalInnerView, styles.modalInnerView]}>
            <View style={{ alignItems: 'center', paddingVertical: 10 }}>
              <AppText
                text="What others are asking?"
                fontFamily={Fonts.latoBold}
                fontSize={18}
              />
            </View>
            <React.Fragment>
              <Slick
                horizontal={false}
                showsButtons={false}
                activeDotColor={Constants.Colors.primaryLight}
                dotColor={Constants.Colors.grayLight}
                onIndexChanged={onIndexChanged}
                loop={false}
                paginationStyle={{
                  right: -6,
                  top: 40,
                  alignItems: 'flex-start',
                  justifyContent: 'flex-start',
                }}>
                {popularQuestions.map((q, index) => (
                  <View
                    key={`${index}_${q}`}
                    style={{
                      backgroundColor: Constants.Colors.white,
                      padding: 16,
                      height: 160,
                    }}>
                    <AppInput
                      secondary
                      multiline
                      placeholder="Enter your question..."
                      style={styles.modalInput}
                      onChange={(value) => setQuestionFromModal(value)}
                      value={questionFromModal}
                      autoFocus
                    />
                  </View>
                ))}
              </Slick>
              <View style={{ padding: 16, paddingTop: 10 }}>
                <AppButton
                  onPress={sendQuestionFromModal}
                  text="Select Friends to Ask"
                  backgroundColor={Constants.Colors.primary}
                  color={Constants.Colors.white}
                  borderRadius={Constants.Styles.BorderRadius.small}
                />
                <View style={{ alignItems: 'center', marginTop: 16 }}>
                  <AppLink
                    text="Skip"
                    color={Constants.Colors.gray}
                    onPress={onPressSkip}
                  />
                </View>
              </View>
            </React.Fragment>
          </View>
        </View>
      </Modal>

      {/* AskMeAnything Modal */}
      <AskMeAnythingModal
        isModalVisible={showAskingModal}
        setModalVisible={(value) => setShowAskingModal(value)}
      />
    </View>
  )
}

export default Main
