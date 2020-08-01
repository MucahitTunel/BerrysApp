import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import PropTypes from 'prop-types'
import {
  FlatList,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
  View,
  Alert,
} from 'react-native'
import { Formik } from 'formik'
import moment from 'moment'
import Swipeout from 'react-native-swipeout'
import ReceiveSharingIntent from 'react-native-receive-sharing-intent'
import OneSignal from 'react-native-onesignal'
import Config from 'react-native-config'
import { AppIcon, AppInput, AppText, Avatar, Loading } from 'components'
import Constants from 'constants'
import Images from 'assets/images'
import Fonts from 'assets/fonts'
import * as NavigationService from 'services/navigation'
import { updatePushToken } from 'features/auth/authSlice'
import { getQuestions, hideQuestion } from 'features/questions/questionsSlice'
import { getQuestion } from 'features/questions/questionSlice'
import { setAskQuestion } from 'features/questions/askSlice'
import { loadContacts } from 'features/contacts/contactsSlice'
import store from 'state/store'
import RNUrlPreview from 'react-native-url-preview'

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
  const questions = useSelector((state) => state.questions)
  const question = useSelector((state) => state.ask.question)
  const { data, loading } = questions
  const [questionUrl, setQuestionUrl] = useState(null)
  useEffect(() => {
    dispatch(getQuestions())
    dispatch(loadContacts())
    const onReceived = () => (notification) =>
      console.log(`Notification received: ${notification}`)
    const onOpened = () => (openResult) => {
      console.log(`Message: ${openResult.notification.payload.body}`)
      console.log(`Data: ${openResult.notification.payload.additionalData}`)
      console.log(`isActive: ${openResult.notification.isAppInFocus}`)
      console.log(`openResult: ${openResult}`)
    }
    const onIds = () => async (device) => {
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
      kOSSettingsKeyAutoPrompt: false,
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
  }, [question])
  const onSubmit = (values, { setSubmitting, resetForm }) => {
    setSubmitting(true)
    const { question } = values
    dispatch(setAskQuestion(question))
    resetForm({})
    setSubmitting(false)
    NavigationService.navigate(Constants.Screens.SelectContacts)
  }

  const renderEmpty = () => (
    <AppText style={{ textAlign: 'center' }} text="There's no question yet" />
  )

  console.log('> questionUrl', questionUrl)

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <Formik
        enableReinitialize
        initialValues={{ question }}
        onSubmit={onSubmit}>
        {({ values, handleChange, handleSubmit, setFieldValue }) => (
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
              // autoFocus
            />
            <TouchableOpacity onPress={handleSubmit}>
              <AppIcon name="send" color={Constants.Colors.primaryLight} />
            </TouchableOpacity>
          </View>
        )}
      </Formik>
      {questionUrl && (
        <View>
          <RNUrlPreview text={questionUrl} />
        </View>
      )}
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
    </View>
  )
}

export default Main
