/* eslint-disable react/prop-types */
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
  ScaleTouchable,
} from 'components'
import { Colors, Dimensions, Screens, Styles } from 'constants'
import Images from 'assets/images'
import Fonts from 'assets/fonts'
import * as NavigationService from 'services/navigation'
import { setUserIsNew, updatePushToken } from 'features/auth/authSlice'
import { getQuestions, hideQuestion } from 'features/questions/questionsSlice'
import { getQuestion } from 'features/questions/questionSlice'
import { setAskQuestion } from 'features/questions/askSlice'
import { loadContacts } from 'features/contacts/contactsSlice'
import store from 'state/store'
import Theme from 'theme'
import Slick from 'react-native-slick'
import surveysList from '../auth/surveysList'
import AskMeAnythingModal from './AskMeAnythingModal'
import { AppImage } from '../../components'

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
    backgroundColor: Colors.background,
    flex: 1,
  },
  questionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    paddingTop: 10,
    paddingRight: 12,
    backgroundColor: Colors.white,
  },
  inputView: {
    padding: 16,
    backgroundColor: Colors.white,
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    marginHorizontal: 10,
    flex: 1,
    fontSize: Styles.FontSize.large,
    color: Colors.gray,
  },
  flatListView: {
    paddingTop: 4,
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
    fontSize: Styles.FontSize.large,
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
})

const RequestToAsk = ({ request }) => {
  const { requester } = request
  const user = useSelector((state) => state.auth.user)
  if (!user || !requester) return null
  const onPressRequestToAsk = () => {
    NavigationService.navigate(Screens.RequestToAsk, {
      request,
    })
  }
  return (
    <Swipeout
      style={{ marginTop: 4 }}
      backgroundColor="transparent"
      buttonWidth={Dimensions.Width - 10}>
      <ScaleTouchable
        style={styles.questionItem}
        onPress={() => onPressRequestToAsk()}>
        <View style={{ flex: 1 }}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
            }}>
            <View
              style={{
                width: 36,
                height: 36,
                borderRadius: 18,
                backgroundColor: 'rgba(235, 84, 80, 0.19)',
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: 10,
              }}>
              <AppImage source={Images.message} width={17} height={15} />
            </View>
            <AppText
              style={{
                marginRight: 5,
                lineHeight: 20,
                flex: 1,
                flexWrap: 'wrap',
              }}
              fontSize={Styles.FontSize.normal}>
              {`You got invited by `}{' '}
              <AppText color={Colors.primary} fontSize={Styles.FontSize.normal}>
                {requester}
              </AppText>{' '}
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
    </Swipeout>
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
  const url = checkURL(content)
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
          <AppText style={{ marginRight: 5 }} fontSize={Styles.FontSize.large}>
            {content}
          </AppText>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginTop: 12,
            }}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <AppText fontSize={15} style={{ marginRight: 38 }}>
                {comments}
                <AppText
                  fontSize={15}
                  color={Colors.gray}>{`  answers`}</AppText>
              </AppText>
              <AppText fontSize={15} style={{ marginRight: 38 }}>
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
          <AppText color={Colors.gray} fontSize={Styles.FontSize.normal}>
            {moment(createdAt).fromNow()}
          </AppText>
          <AppIcon name="chevron-right" size={20} color={Colors.grayLight} />
        </View>
      </ScaleTouchable>
      {url && (
        <RNUrlPreview
          containerStyle={{
            paddingHorizontal: 16,
            backgroundColor: Colors.white,
            borderTopColor: Colors.background,
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
  const { data, loading, requestsToAsk } = questions
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
      NavigationService.navigate(Screens.SelectContacts)
    }
  }

  const sendQuestionFromModal = () => {
    if (questionFromModal) {
      dispatch(setUserIsNew(false))
      dispatch(setAskQuestion(questionFromModal))
      setTimeout(() => {
        NavigationService.navigate(Screens.SelectContacts)
      }, 1000)
    }
  }

  const renderEmpty = () => (
    <AppText style={{ textAlign: 'center' }}>There's no question yet</AppText>
  )

  const onPressSkip = () => dispatch(setUserIsNew(false))

  const onIndexChanged = (index) => {
    setQuestionFromModal(popularQuestions[index])
  }

  const onPressAskMeAnything = () => {
    if (user && user.name) {
      setShowAskingModal(false)
      NavigationService.navigate(Screens.RequestContactsToAsk)
    } else {
      setShowAskingModal(true)
    }
  }

  const isSuggestionsModalVisible = user.isNew && !question

  const renderItem = ({ item }) => <QuestionItem question={item} />

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
      <RequestToAsk request={requestsToAsk} />
      <View style={styles.flatListView}>
        {loading && !data.length && <Loading />}
        <FlatList
          data={data}
          renderItem={renderItem}
          keyExtractor={(item) => item._id}
          ListEmptyComponent={renderEmpty()}
          refreshing={loading}
          onRefresh={() => dispatch(getQuestions())}
          contentContainerStyle={{ paddingBottom: 80 }}
        />
      </View>
      <AppButton
        text="Ask Me"
        textStyle={{ marginLeft: 16 }}
        icon="message-dot"
        iconSize={20}
        onPress={onPressAskMeAnything}
        style={styles.askBtn}
      />

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
              maxHeight: Dimensions.Height - 60,
              paddingBottom: 260,
            },
          ]}>
          <View style={[Theme.Modal.modalInnerView, styles.modalInnerView]}>
            <View style={{ alignItems: 'center', paddingVertical: 10 }}>
              <AppText fontSize={18}>What others are asking?</AppText>
            </View>
            <React.Fragment>
              <Slick
                horizontal={false}
                showsButtons={false}
                activeDotColor={Colors.primaryLight}
                dotColor={Colors.grayLight}
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
                      backgroundColor: Colors.white,
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
                  backgroundColor={Colors.primary}
                  color={Colors.white}
                  borderRadius={Styles.BorderRadius.small}
                />
                <View style={{ alignItems: 'center', marginTop: 16 }}>
                  <AppLink
                    text="Skip"
                    color={Colors.gray}
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
