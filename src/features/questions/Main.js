/* eslint-disable react/prop-types */
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import PropTypes from 'prop-types'
import {
  FlatList,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  View,
  Keyboard,
  Image,
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
  AppImage,
  AppInput,
  AppText,
  Avatar,
  ScaleTouchable,
  SuccessModal,
  CompareItem,
} from 'components'
import { Colors, Dimensions, FontSize, Screens } from 'constants'
import Images from 'assets/images'
import Fonts from 'assets/fonts'
import * as NavigationService from 'services/navigation'
import {
  setUserIsNew,
  updatePushToken,
  resetSurvey,
} from 'features/auth/authSlice'
import {
  getQuestions,
  hideQuestion,
  hidePoll,
  hideCompare,
  setCompares,
  getPopularQuestions,
  setPopularCompares,
} from 'features/questions/questionsSlice'
import { getRoom, setRoom, getRooms } from 'features/messages/messagesSlice'
import {
  getQuestion,
  getPoll,
  getCompare,
  voteCompare,
  votePopularQuestion,
  setQuestion,
} from 'features/questions/questionSlice'
import { setAskQuestion, setQuestionImage } from 'features/questions/askSlice'
import { loadContacts } from 'features/contacts/contactsSlice'
import store from 'state/store'
import surveysList from '../auth/surveysList'
import { checkURL } from 'utils'
import getConversationName from 'utils/get-conversation-name'

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
  newAnswer: {
    borderLeftWidth: 2,
    borderLeftColor: Colors.primary,
    backgroundColor: 'rgba(243, 36, 77, .14)',
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
  postTypesContainer: {
    borderTopWidth: 1.5,
    borderColor: Colors.grayLight,
    height: 45,
    width: Dimensions.Width - 40,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
  },
  postType: {
    height: 25,
    flex: 1,
    backgroundColor: 'transparent',
    borderRadius: 4,
    borderWidth: 0.5,
    borderColor: Colors.grayLight,
    borderTopWidth: 0,
    borderBottomWidth: 0,
  },
  changeCategoryContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 60,
    justifyContent: 'space-between',
  },
  changeCategoryButton: {
    height: 30,
    marginBottom: 20,
    marginTop: 10,
    paddingHorizontal: 10,
    borderRadius: 100,
    backgroundColor: 'transparent',
  },
})

export const RenderCompare = ({ compare, isPopular }) => {
  const style = { width: Dimensions.Width / 2.03 }

  const user = useSelector((state) => state.auth.user)
  const popularCompares = useSelector(
    (state) => state.questions.popularCompares,
  )
  const compares = useSelector((state) => state.questions.compares)
  const dispatch = useDispatch()

  const [isVoted, setIsVoted] = useState(false)
  const [selectedOption, setSelectedOption] = useState(null)
  const [votes, setVotes] = useState({})

  useEffect(() => {
    if (compare && user) {
      let voted = false
      let votes = {}

      compare.votes.forEach((v) => {
        if (votes[v.value]) votes[v.value]++
        else {
          votes[v.value] = 1
        }
        if (v.userPhoneNumber === user.phoneNumber) voted = v
      })

      if (voted) {
        setIsVoted(true)
        setSelectedOption(voted.value)
      } else {
        setIsVoted(false)
        setSelectedOption(null)
      }

      Object.keys(votes).forEach((option) => {
        votes[option] = (100 / compare.votes.length) * votes[option]
      })
      setVotes(votes)
    }
  }, [compare, user])

  const imageOnPress = (index) => {
    setSelectedOption(index)
    if (isPopular) {
      dispatch(votePopularQuestion({ vote: index, popularId: compare._id }))
      dispatch(
        setPopularCompares(
          popularCompares.map((c) => {
            if (c._id === compare._id) {
              return {
                ...c,
                votes: [
                  ...compare.votes,
                  { userPhoneNumber: user.phoneNumber, value: index },
                ],
              }
            } else return c
          }),
        ),
      )
    } else {
      dispatch(voteCompare({ image: index, compareId: compare?._id }))
      dispatch(
        setCompares(
          compares.map((c) => {
            if (c._id === compare._id) {
              return {
                ...c,
                votes: [
                  ...compare.votes,
                  { userPhoneNumber: user.phoneNumber, value: index },
                ],
              }
            } else return c
          }),
        ),
      )
    }
  }

  return (
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        borderBottomWidth: 4,
        borderColor: Colors.background,
        paddingBottom: 10,
      }}>
      <CompareItem
        image={compare?.images[0]}
        onPress={() => imageOnPress(0)}
        selected={selectedOption === 0}
        voteNumber={votes[0] ? parseInt(votes[0].toFixed(0)) : 0}
        isVoted={isVoted}
        isResult
        isCreator={compare.userPhoneNumber === user.phoneNumber}
        style={style}
        imageStyle={style}
        selectedStyle={style}
      />
      <CompareItem
        image={compare?.images[1]}
        onPress={() => imageOnPress(1)}
        selected={selectedOption === 1}
        voteNumber={votes[1] ? parseInt(votes[1].toFixed(0)) : 0}
        isVoted={isVoted}
        isResult
        isCreator={compare.userPhoneNumber === user.phoneNumber}
        style={style}
        imageStyle={style}
        selectedStyle={style}
      />
      <View
        style={{
          position: 'absolute',
          backgroundColor: 'white',
          height: 60,
          width: 60,
          borderRadius: 30,
          left: Dimensions.Width / 2.37,
          top: Dimensions.Height / 5,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <AppText
          fontSize={FontSize.xxxLarge}
          weight="bold"
          color={Colors.primary}>
          VS
        </AppText>
      </View>
    </View>
  )
}

const RenderQuestionImage = ({ questionId, image, isNew, dispatch }) => {
  const onPressQuestion = () => {
    dispatch(getQuestion(questionId))
    NavigationService.navigate(Screens.Answers)
  }

  return (
    <View>
      <Image
        source={{ uri: image }}
        style={{ height: Dimensions.Width, width: undefined }}
      />
      <ScaleTouchable
        style={[
          {
            flexDirection: 'row',
            justifyContent: 'space-between',
            paddingHorizontal: 15,
            paddingVertical: 10,
            borderBottomWidth: 4,
            borderColor: Colors.background,
          },
          isNew && styles.newAnswer,
        ]}
        onPress={onPressQuestion}>
        <AppText color="black" fontSize={FontSize.large} weight="medium">
          Comment
        </AppText>
        <AppIcon
          name="chevron-right"
          size={20}
          color={'rgba(128, 128, 128, 0.5)'}
        />
      </ScaleTouchable>
    </View>
  )
}

export const QuestionItem = ({
  question: {
    _id,
    content,
    comments = 0,
    commentData,
    totalVotes = 0,
    createdAt,
    flaggedBy = [],
    isNew,
    image,
  },
  isPopular,
}) => {
  const user = useSelector((state) => state.auth.user)
  const dispatch = useDispatch()

  if (image)
    return (
      <RenderQuestionImage
        questionId={_id}
        isNew={isNew}
        image={image}
        dispatch={dispatch}
      />
    )

  if (!user) return null
  const { phoneNumber } = user
  const isFlagged = flaggedBy.includes(phoneNumber)
  const onPressQuestion = (questionId) => {
    if (isPopular)
      dispatch(
        setQuestion({
          _id,
          content,
          comments: commentData,
          createdAt,
          isAbleToAnswer: true,
          totalVotes,
        }),
      )
    else dispatch(getQuestion(questionId))
    NavigationService.navigate(Screens.Answers, { isPopular })
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
        style={[styles.questionItem, isNew && styles.newAnswer]}
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
              <AppText fontSize={15} color={Colors.gray}>
                {image ? 'Image  -  ' : ''}
              </AppText>
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
    image: PropTypes.string,
  }),
}

export const PollItem = ({ data, isPopular }) => {
  const dispatch = useDispatch()

  const onPress = () => {
    if (!isPopular) dispatch(getPoll(data._id))
    NavigationService.navigate(Screens.PollDetails, {
      isPopular,
      poll: data,
    })
  }

  const onRemovePoll = (direction, _id) => {
    if (direction === 'right') {
      dispatch(hidePoll(_id))
    }
  }

  return (
    <Swipeout
      style={{ marginBottom: 4 }}
      onOpen={(sectionID, rowId, direction) =>
        onRemovePoll(direction, data._id)
      }
      right={swipeoutBtns}
      backgroundColor="transparent"
      buttonWidth={Dimensions.Width - 10}>
      <ScaleTouchable
        style={[styles.questionItem, data.isNew && styles.newAnswer]}
        onPress={onPress}>
        <View style={{ flex: 1 }}>
          <AppText style={{ marginRight: 5 }} fontSize={FontSize.large}>
            {data.question}
          </AppText>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginTop: 12,
            }}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <AppText fontSize={15} color={Colors.gray}>{`Poll  -  `}</AppText>
              <AppText
                fontSize={15}
                weight="medium"
                style={{ marginRight: 38 }}>
                {data.votes.length}
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
            {moment(data.createdAt).fromNow()}
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

PollItem.propTypes = {
  data: PropTypes.object,
}

CompareItem.propTypes = {
  data: PropTypes.object,
}

const Main = ({ route }) => {
  const showSuccessModal =
    route && route.params && route.params.showSuccessModal
  const dispatch = useDispatch()
  const user = useSelector((state) => state.auth.user)
  const questions = useSelector((state) => state.questions)
  const question = useSelector((state) => state.ask.question)
  const keyboard = useKeyboard()
  const [questionUrl, setQuestionUrl] = useState(null)
  const [_, setQuestionFromModal] = useState(null)
  const [popularQuestions, setPopularQuestions] = useState(
    surveysList[0].popularQuestions,
  )
  const [isSuccessModalVisible, setSuccessModalVisible] = useState(false)
  const [listData, setListData] = useState([])

  useEffect(() => {
    setListData(
      [
        ...questions.popularQuestions,
        ...questions.popularPolls,
        ...questions.popularCompares,
        ...questions.data,
        ...questions.polls,
        ...questions.compares,
      ].sort((a, b) => b.createdAt - a.createdAt),
    )
  }, [
    questions.data,
    questions.polls,
    questions.compares,
    questions.popularPolls,
    questions.popularCompares,
    questions.popularQuestions,
  ])

  const delay = (cb, time) => {
    setTimeout(cb, 1000 * time)
  }

  useEffect(() => {
    dispatch(loadContacts())
    const onReceived = (notification) =>
      console.log(`Notification received: ${notification}`)
    const onOpened = (openResult) => {
      // console.log(`Message: ${openResult.notification.payload.body}`)
      // console.log(`Data: ${openResult.notification.payload.additionalData}`)
      // console.log(`isActive: ${openResult.notification.isAppInFocus}`)
      // console.log(`openResult: ${JSON.stringify(openResult)}`)
      const additionalData = openResult?.notification?.payload?.additionalData
      if (additionalData && additionalData.type) {
        switch (additionalData.type) {
          case 'MESSAGE_RECEIVED': {
            if (additionalData.roomId) {
              dispatch(getRoom({ roomId: additionalData.roomId }))
            }
            break
          }
          case 'QUESTION_ANSWERED':
          case 'QUESTION_ASKED': {
            if (additionalData.questionId) {
              dispatch(getQuestion(additionalData.questionId))
              delay(() => NavigationService.navigate(Screens.Answers), 1)
            }
            break
          }
          case 'POLL_ASKED': {
            if (additionalData.pollId) {
              dispatch(getPoll(additionalData.pollId))
              delay(() => NavigationService.navigate(Screens.PollDetails), 1)
            }
            break
          }
          case 'COMPARE_ASKED': {
            if (additionalData.compareId) {
              dispatch(getCompare(additionalData.compareId))
              delay(() => NavigationService.navigate(Screens.CompareDetails), 1)
            }
            break
          }
          case 'RENEW_ASK_REQUEST':
          case 'APPROVE_ASK_REQUEST':
            if (additionalData.room) {
              dispatch(setRoom(additionalData.room))
              delay(() => NavigationService.navigate(Screens.Conversation), 1)
            }
            break
          case 'JOIN_VOICE_CALL':
            if (additionalData.room) {
              delay(
                () =>
                  NavigationService.navigate(Screens.VoiceCall, {
                    isCreate: false,
                    roomId: additionalData.channelName,
                    token: additionalData.token,
                    userName: getConversationName(additionalData.room).title,
                  }),
                1,
              )
            }
          default:
            break
        }
      }
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch])

  useEffect(() => {
    dispatch(getPopularQuestions())
    dispatch(getRooms())
  }, [dispatch])

  useEffect(() => {
    const url = checkURL(question)
    setQuestionUrl(url)
  }, [questions, question])
  useEffect(() => {
    const { survey = surveysList[0].value } = user
    const surveyQuestions = surveysList.find((x) => x.value === survey)
      .popularQuestions
    setPopularQuestions(surveyQuestions || surveysList[0].popularQuestions)
    setQuestionFromModal(surveyQuestions[0])
  }, [user])

  useEffect(() => {
    if (showSuccessModal) {
      setSuccessModalVisible(true)
      NavigationService.updateParams({ showSuccessModal: false })
    }
  }, [showSuccessModal])

  const onSubmit = (values, { setSubmitting, resetForm }) => {
    setSubmitting(true)
    const { question } = values
    if (question) {
      Keyboard.dismiss()
      dispatch(setQuestionImage(null))
      dispatch(setAskQuestion(question))
      resetForm({})
      setSubmitting(false)
      NavigationService.navigate(Screens.PostQuestion)
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
    NavigationService.navigate(Screens.AskMe)
  }

  const isNewUser = user.isNew && listData.length === 0
  const renderItem = ({ item, index }) => {
    if (item.type === 'question') return <QuestionItem question={item} />
    if (item.type === 'popular-question')
      return <QuestionItem question={item} isPopular />
    if (item.type === 'poll') return <PollItem data={item} />
    if (item.type === 'compare') return <RenderCompare compare={item} />
    if (item.type === 'popular-compare')
      return <RenderCompare compare={item} isPopular />
    if (item.type === 'popular-poll') return <PollItem data={item} isPopular />
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <Formik
        enableReinitialize
        initialValues={{ question }}
        onSubmit={onSubmit}>
        {({ values, handleSubmit, setFieldValue, setValues }) => (
          <View
            style={{
              alignItems: 'center',
              borderBottomWidth: 4,
              borderBottomColor: Colors.background,
            }}>
            <View style={styles.inputView}>
              <Avatar source={Images.defaultAvatar} size={50} />
              <AppInput
                style={styles.input}
                placeholder="Ask anonymously your contacts..."
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
            <View style={styles.postTypesContainer}>
              <AppButton
                shadow={false}
                icon="image"
                iconSize={20}
                iconColor={'#c6c6c6'}
                style={[styles.postType, { borderLeftWidth: 0 }]}
                onPress={() =>
                  NavigationService.navigate(Screens.QuestionWithImage)
                }
              />
              <AppButton
                shadow={false}
                icon="poll"
                iconSize={20}
                iconColor={'#c6c6c6'}
                style={styles.postType}
                onPress={() => NavigationService.navigate(Screens.CreatePoll)}
              />
              <AppButton
                shadow={false}
                icon="versus"
                iconSize={20}
                iconColor={'#c6c6c6'}
                style={[styles.postType, { borderRightWidth: 0 }]}
                onPress={() =>
                  NavigationService.navigate(Screens.CreateCompare)
                }
              />
            </View>
          </View>
        )}
      </Formik>
      {questionUrl && (
        <View>
          <RNUrlPreview text={questionUrl} />
        </View>
      )}
      {isNewUser ? (
        <View style={{ flex: 1 }}>
          <View
            style={{
              paddingVertical: 10,
              paddingHorizontal: 16,
              backgroundColor: Colors.background,
            }}>
            <View style={styles.changeCategoryContainer}>
              <View>
                <AppText weight="medium" fontSize={FontSize.xLarge}>
                  Popular Questions
                </AppText>
                <AppText color={Colors.gray} fontSize={FontSize.normal}>
                  Tap to ask
                </AppText>
              </View>
              <AppButton
                style={styles.changeCategoryButton}
                text="Change Category"
                textStyle={{ fontSize: FontSize.normal, color: Colors.primary }}
                onPress={() => dispatch(resetSurvey())}
              />
            </View>
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
          <FlatList
            data={listData}
            renderItem={renderItem}
            keyExtractor={(_, index) => index.toString()}
            ListEmptyComponent={renderEmpty()}
            refreshing={false}
            onRefresh={() => {
              dispatch(getQuestions())
              dispatch(getPopularQuestions())
            }}
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

      {isSuccessModalVisible && (
        <SuccessModal
          isModalVisible={true}
          closeModal={() => setSuccessModalVisible(false)}
        />
      )}
    </SafeAreaView>
  )
}

export default Main
