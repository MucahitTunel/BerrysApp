/* eslint-disable */
import React, { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import PropTypes from 'prop-types'
import {
  Animated,
  FlatList,
  Keyboard,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
  View,
  Image,
  ActivityIndicator,
} from 'react-native'
import { Formik } from 'formik'
import moment from 'moment'
import Modal from 'react-native-modal'
import { BlurView } from '@react-native-community/blur'
import KeyboardListener from 'react-native-keyboard-listener'
import { checkURL, hideKeyBoard, showKeyboard } from 'utils'
import { Colors, FontSize, Dimensions } from 'constants'
import {
  AppButton,
  AppInput,
  AppText,
  Avatar,
  Header,
  ImageHeader,
  Loading,
  Layout,
  AppIcon
} from 'components'
import AskUserNameModal from './AskUserNameModal'
import { AnswerRightButton, BackButton } from 'components/NavButton'
import Theme from 'theme'
import {
  flagQuestion,
  getQuestion,
  submitComment,
} from 'features/questions/questionSlice'
import { readQuestion } from 'features/questions/questionsSlice'
import { joinRoom } from 'features/messages/messagesSlice'
import { launchImageLibrary } from 'react-native-image-picker'
import firebase from '../../services/firebase'
import * as NavigationService from '../../services/navigation'
import { blacklistContacts, reportUser } from 'features/contacts/contactsSlice'

const styles = StyleSheet.create({
  headerView: {
    backgroundColor: Colors.white,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  headerAnswerView: {
    marginTop: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  questionItemWrapper: {
    paddingTop: 16,
    paddingBottom: 20,
    paddingHorizontal: 20,
    backgroundColor: 'white',
    marginHorizontal: 30,
    borderRadius: 15,
    marginBottom: 15
  },
  questionItem: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  lastQuestionItemWrapper: {
    borderBottomWidth: 0,
  },
  flatListView: {
    paddingVertical: 8,
    backgroundColor: Colors.background,
    flex: 1,
  },
  inputView: {
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    height: 70,
    borderRadius: 10,
    marginLeft: 10,
    flex: 1,
    borderWidth: 1,
    borderColor: Colors.grayLight,
    color: Colors.text,
    fontSize: FontSize.large,
    paddingVertical: 14,
    paddingHorizontal: 16,
    marginRight: 10,
    paddingRight: 110,
    backgroundColor: 'white'
  },
  inputButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'absolute',
    right: '10%'
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
    backgroundColor: Colors.white,
    borderTopWidth: 1,
    borderColor: Colors.grayLight,
  },
  header: {
    backgroundColor: Colors.purple,
    width: Dimensions.Width,
  },
})

const Comment = ({
  comment,
  question,
  user,
  setComment,
  setIsMessageModalVisible,
  setCommentUserPhoneNumber,
  isPopular,
}) => {
  const {
    _id,
    name,
    createdAt,
    content,
    totalVotes = 0,
    isAnonymous,
    userPhoneNumber,
    username,
    image,
    isExpert,
  } = comment
  const onPressUser = () => {
    if (isExpert) return
    const { phoneNumber } = user
    const { userPhoneNumber } = comment
    if (phoneNumber !== userPhoneNumber) {
      setCommentUserPhoneNumber(userPhoneNumber)
      setIsMessageModalVisible(true)
      setComment(comment)
    }
  }
  const nonAnonymousName = `Anonymous ${Math.floor(Math.random() * 900) + 100}`
  return (
    <View style={styles.questionItemWrapper}>
      <View style={styles.questionItem}>
        <TouchableOpacity onPress={onPressUser}>
          <Avatar size={54} />
        </TouchableOpacity>
        <View
          style={{
            flex: 1,
            marginLeft: 10,
          }}>
          <TouchableOpacity onPress={onPressUser}>
            <AppText
              weight="medium"
              color={Colors.purpleText}
              style={{ marginBottom: 5 }}>
              {!isAnonymous ? name : nonAnonymousName}
            </AppText>
            <AppText
              fontSize={FontSize.normal}
              color={Colors.gray}
              style={{ marginRight: 14 }}>
              {moment(createdAt).fromNow()}
            </AppText>
          </TouchableOpacity>
        </View>
        <AppButton
            icon="more-vertical"
            iconSize={22}
            iconColor={Colors.purple}
            style={{ backgroundColor: 'transparent', justifyContent: 'flex-end' }}
            onPress={onPressUser}
            shadow={false}
          />
      </View>
      <View style={[styles.headerAnswerView, { flex: 1 }]}>
        {image ? 
          <Image
            source={{ uri: image }}
            style={{ height: Dimensions.Height / 3, resizeMode: 'cover', width: '100%', borderRadius: 15 }}
          />
          :
          <AppText
          fontSize={FontSize.large}
          color={Colors.purpleText}
        >
          {content}
        </AppText>
      }
      </View>
    </View>
  )
}

Comment.propTypes = {
  user: PropTypes.objectOf(PropTypes.any).isRequired,
  comment: PropTypes.objectOf(PropTypes.any).isRequired,
  question: PropTypes.objectOf(PropTypes.any).isRequired,
  setIsMessageModalVisible: PropTypes.func.isRequired,
  setComment: PropTypes.func.isRequired,
  isPopular: PropTypes.bool,
}

const Answers = ({ route, navigation }) => {
  let keyboardHeight = useRef(new Animated.Value(0))
  const [isFlagModalVisible, setIsFlagModalVisible] = useState(false)
  const [isMessageModalVisible, setIsMessageModalVisible] = useState(false)
  const [isAskUserNameModalVisible, setIsAskUserNameModalVisible] = useState(
    false,
  )
  const [isAnonymous, setIsAnonymous] = useState(true)
  const [comment, setComment] = useState(null)
  const user = useSelector((state) => state.auth.user)
  const question = useSelector((state) => state.question.data)
  const loading = useSelector((state) => state.question.loading)
  const contacts = useSelector((state) => state.contacts.data)
  const dispatch = useDispatch()
  const [uploadedImage, setUploadedImage] = useState(null)
  const [imageLoading, setImageLoading] = useState(false)

  const onSubmit = (values, { setSubmitting, resetForm }) => {
    if (!isAnonymous && !user.name) {
      setIsAskUserNameModalVisible(true)
    } else {
      setSubmitting(true)
      const { cmt } = values
      const payload = {
        comment: cmt,
        questionId: question._id,
        isAnonymous,
        image: uploadedImage,
        isPopular: route.params.isPopular,
      }
      dispatch(submitComment(payload))
      resetForm({})
      setSubmitting(false)
      keyboardHeight.current = new Animated.Value(0)
      Keyboard.dismiss()
    }
  }

  const refreshQuestion = (questionId) => dispatch(getQuestion(questionId))
  const onPressFlagQuestion = (value) =>
    dispatch(flagQuestion({ value, question }))
  const onPressMessageBtn = () => {
    const { phoneNumber } = user
    const { userPhoneNumber } = comment
    if (phoneNumber !== userPhoneNumber) {
      dispatch(
        joinRoom({
          phoneNumber: userPhoneNumber,
          questionId: question._id,
          isFromQuestionPage: true,
        }),
      )
    }
    setIsMessageModalVisible(false)
  }
  const [imageModalVisible, setImageModalVisible] = useState(false)

  useLayoutEffect(() => {
    navigation.setOptions({
      header: () => {
        return question?.image ? null : 
        (
          <Header
            title="Post"
            headerLeft={<BackButton navigation={navigation} />}
            headerRight={
              route.params.isPopular ? null : (
                <AnswerRightButton
                  onPressDots={() => setIsFlagModalVisible(true)}
                />
              )
            }
          />
        )
      },
    })
  }, [navigation, route, question])

  useEffect(() => {
    if (question) {
      dispatch(readQuestion(question._id))
    }
  }, [dispatch, question])

  const renderEmpty = () => (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', marginTop: 50 }}>
      <AppText style={{ textAlign: 'center', color: Colors.purpleText }}>There's no answer yet</AppText>
    </View>
  )

  const renderPeopleInvited = () => {
    if (question?.groups.length) {
      return (
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', width: '70%' }}>
          <AppText weight="italic" color={Colors.gray}>
            To: {question.group.name}
          </AppText>
        </View>
      )
    }
    return (
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', width: '70%' }}>
        <AppText weight="italic" color={Colors.gray}>
          To:
          {`${
            question.isAskExperts
              ? ` Berry's Expert${question.receivers.length > 0 ? ', ' : ''}`
              : ' '
          }`}
        </AppText>
        {question.receivers.map((receiver, index) => {
          if (!receiver) return null
          return (
            <View key={receiver.phoneNumber}>
              <AppText weight="italic" color={Colors.gray}>
                {receiver.name} {index < question.receivers.length - 1 && ', '}
              </AppText>
            </View>
          )
        })}
      </View>
    )
  }

  const [url, setUrl] = useState(null)
  const [message, setMessage] = useState(null)
  useEffect(() => {
    if (question?.content) {
      let extraStr = ''
      let url = null
      const contentSplitted = question.content.split(' ')
      contentSplitted.forEach((item) => {
        const link = checkURL(item)
        if (link) url = link
        else extraStr += `${item} `
      })
      setMessage(extraStr)
      setUrl(url)
    }
  }, [question])

  const onSendImage = (imageURL, cb) => {
    setImageLoading(true)
    firebase.upload
      .uploadCommentImage(imageURL, question._id, user.phoneNumber)
      .then((url) => {
        setUploadedImage(url)
        cb()
        setImageLoading(false)
      })
      .catch((e) => console.log(e))
  }

  const [commentUserPhoneNumber, setCommentUserPhoneNumber] = useState(null)
  const [reportContainer, setReportContainer] = useState(false)
  const [reportMessage, setReportMessage] = useState(null)
  const reportOnPress = () => {
    dispatch(reportUser({ reportedUserPhoneNumber: commentUserPhoneNumber, message: reportMessage }))
    setIsMessageModalVisible(false)
    setReportContainer(false)
    setTimeout(() => alert('You have successfully reported this user!'), 500)
  }

  if (loading) return <Loading />
  const { flaggedBy = [], userPhoneNumber } = question
  const isFlagged = flaggedBy.includes(user.phoneNumber)
  const flagButtonText = `${isFlagged ? 'Unflag' : 'Flag'} this question`
  const isQuestionOwner = userPhoneNumber === user.phoneNumber
  return (
    <>
    {!question.image ?
      (<View style={styles.header}>
        <AppText
          weight="bold"
          fontSize={FontSize.xxLarge}
          style={{ color: 'white', marginLeft: 15, marginBottom: 30 }}>
          {message}
        </AppText>
      </View>) :
      (
        <ImageHeader
        title="Post"
        headerLeft={
          <BackButton
            navigation={navigation}
            onPress={() => NavigationService.goBack()}
          />
        }
        headerRight={
          route.params.isPopular ? null : (
            <AnswerRightButton
              onPressDots={() => setIsFlagModalVisible(true)}
            />
          )
        }
        image={question.image}
      />
      )
    }
    <Layout style={{ top: question.image ? -30 : 0, backgroundColor: question.image ? 'transparent' : Colors.purple }} innerStyle={{ paddingTop: question.image ? 10 : 30 }}>
    <SafeAreaView style={{ flex: 1, top: question.image ? 20 : 0 }}>
      <Animated.View style={{ flex: 1, paddingBottom: keyboardHeight.current }}>
        <StatusBar barStyle="light-content" />
        <KeyboardListener
          onWillShow={(event) => showKeyboard(event, keyboardHeight.current)}
          onWillHide={(event) => hideKeyBoard(event, keyboardHeight.current)}
        />
        <ScrollView>
        {question.image && 
              <AppText
                weight="bold"
                color={Colors.purpleText}
                fontSize={FontSize.xxLarge}
                style={{ marginLeft: 30, marginBottom: 15 }}>
                {message ? message : 'What do you think about this?'}
              </AppText>
          }
          <View style={styles.flatListView}>
            <FlatList
              scrollEnabled={false}
              data={question.comments}
              renderItem={({ item }) => (
                <Comment
                  comment={item}
                  question={question}
                  user={user}
                  setIsMessageModalVisible={setIsMessageModalVisible}
                  setComment={setComment}
                  isPopular={route.params.isPopular}
                  setCommentUserPhoneNumber={setCommentUserPhoneNumber}
                />
              )}
              keyExtractor={(item) => item._id}
              ListEmptyComponent={renderEmpty()}
              refreshing={loading}
              onRefresh={() => refreshQuestion(question._id)}
            />
          </View>
        </ScrollView>
        <View>
          <Formik initialValues={{ cmt: '' }} onSubmit={onSubmit}>
            {({ values, handleChange, handleSubmit }) => (
              <>
                {imageLoading ? (
                  <ActivityIndicator />
                ) : (
                  <>
                  {values.cmt !== '' &&
                    <TouchableOpacity onPress={() => setIsAnonymous(!isAnonymous)} style={{ width: '100%', alignItems: 'center', marginTop: 10}}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                      <View
                        style={{
                          height: 20,
                          width: 20,
                          justifyContent: 'center',
                          alignItems: 'center',
                          backgroundColor: isAnonymous ? Colors.purple : Colors.grayLight,
                          borderRadius: 10,
                        }}>
                        <AppIcon name="checkmark" color="white" size={15} />
                      </View>
                      <AppText
                        color={Colors.purpleText}
                        fontSize={FontSize.large}
                        style={{ marginLeft: 10 }}
                        weight="medium">
                        Send DM Anonymously
                      </AppText>
                    </View>
                  </TouchableOpacity>
                  }
                  <View style={styles.inputView}>
                    <AppInput
                      style={styles.input}
                      placeholder={
                        question.isAbleToAnswer
                          ? 'Type a message...'
                          : 'You cannot answer this question'
                      }
                      placeholderTextColor={Colors.gray}
                      editable={question.isAbleToAnswer}
                      onChange={handleChange('cmt')}
                      value={values.cmt}
                    />
                    <View style={styles.inputButtons}>
                      <AppButton
                        icon="image"
                        iconSize={16}
                        style={{ width: 40, height: 40, marginRight: 10 }}
                        onPress={() => {
                          launchImageLibrary(
                            {
                              mediaType: 'photo',
                              quality: 0.1,
                            },
                            (response) => {
                              if (response.didCancel) return
                              if (response.errorCode) return
                              onSendImage(response.uri, handleSubmit)
                            },
                          )
                        }}
                        shadow={false}
                      />
                      <AppButton
                        icon="send"
                        iconSize={22}
                        iconColor={Colors.purple}
                        disabled={!values.cmt}
                        style={{ width: 40, height: 40, backgroundColor: Colors.background }}
                        onPress={
                          question.isAbleToAnswer ? handleSubmit : () => {}
                        }
                        shadow={false}
                      />
                    </View>
                  </View>
                  </>
                )}
              </>
            )}
          </Formik>
        </View>

        {/* Flag question modal */}
        <Modal
          isVisible={isFlagModalVisible}
          style={[Theme.Modal.modalView]}
          animationInTiming={300}
          animationOutTiming={300}>
          <View style={Theme.Modal.modalInnerView}>
            <View style={styles.modalBackdrop}>
              <BlurView style={{ flex: 1 }} blurType="dark" blurAmount={1} />
            </View>
            <View style={[Theme.Modal.modalInnerView, styles.modalInnerView]}>
              <View style={{ marginVertical: 16 }}>
                <AppButton
                  text={flagButtonText}
                  onPress={() => onPressFlagQuestion(!isFlagged)}
                />
              </View>
              <AppButton
                text="Close"
                textStyle={{ color: Colors.purple }}
                style={{ backgroundColor: Colors.white }}
                onPress={() => setIsFlagModalVisible(false)}
              />
            </View>
          </View>
        </Modal>

        {/* AskUserNameModal */}
        <AskUserNameModal
          isModalVisible={isAskUserNameModalVisible}
          setModalVisible={(value) => setIsAskUserNameModalVisible(value)}
        />

        {/* Message user modal */}
        <Modal
          isVisible={isMessageModalVisible}
          style={[Theme.Modal.modalView]}
          animationInTiming={300}
          animationOutTiming={300}>
          <View style={Theme.Modal.modalInnerView}>
            <View style={styles.modalBackdrop}>
              <BlurView style={{ flex: 1 }} blurType="dark" blurAmount={1} />
            </View>
            <View style={[Theme.Modal.modalInnerView, styles.modalInnerView]}>
              {reportContainer ?
                <>
                  <AppInput
                    placeholder="Enter your message..."
                    placeholderTextColor={Colors.gray}
                    style={{ minHeight: 100, maxHeight: 150, backgroundColor: 'white', marginBottom: 30, color: 'black' }}
                    multiline
                    onChange={(value) => setReportMessage(value === '' ? null : value)}
                  />
                  <AppButton text="Send Report" onPress={reportOnPress} style={{ marginBottom: 20 }} />
                </>
              :
                <>
                              <View style={{ marginBottom: 16 }}>
                <AppButton text="Message" onPress={onPressMessageBtn} />
              </View>
              <View style={{ marginBottom: 16 }}>
                <AppButton text="Block" onPress={() => dispatch(blacklistContacts(contacts.filter(c => c.phoneNumber === commentUserPhoneNumber)))} />
              </View>
              <View style={{ marginBottom: 16 }}>
                <AppButton text="Report" onPress={() => setReportContainer(true)} />
              </View>
                </>
              }
              <AppButton
                text="Cancel"
                textStyle={{ color: Colors.purple }}
                style={{ backgroundColor: Colors.white }}
                onPress={() => {
                  setReportContainer(false)
                  setIsMessageModalVisible(false)
                }}
              />
            </View>
          </View>
        </Modal>

        {/* Question image modal */}
        <Modal
          isVisible={imageModalVisible}
          style={[Theme.Modal.modalView]}
          animationInTiming={300}
          animationOutTiming={300}>
          <TouchableOpacity
            style={Theme.Modal.modalInnerView}
            onPress={() => setImageModalVisible(false)}>
            <View style={styles.modalBackdrop}>
              <BlurView style={{ flex: 1 }} blurType="dark" blurAmount={1} />
            </View>
            <Image
              source={{ uri: question.image }}
              style={{ height: Dimensions.Height, resizeMode: 'contain' }}
            />
          </TouchableOpacity>
        </Modal>
      </Animated.View>
    </SafeAreaView>
    </Layout>
    </>
  )
}

Answers.propTypes = {
  navigation: PropTypes.shape({
    setParams: PropTypes.func,
  }).isRequired,
  route: PropTypes.object,
}

export default Answers
