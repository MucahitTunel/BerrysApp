import React, { useLayoutEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import PropTypes from 'prop-types'
import {
  Animated,
  FlatList,
  Keyboard,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
  View,
  ScrollView,
} from 'react-native'
import { Formik } from 'formik'
import moment from 'moment'
import Modal from 'react-native-modal'
import { BlurView } from '@react-native-community/blur'
import KeyboardListener from 'react-native-keyboard-listener'
import { hideKeyBoard, showKeyboard } from 'utils'
import { Colors, FontSize } from 'constants'
import Images from 'assets/images'
import {
  AppButton,
  AppIcon,
  AppImage,
  AppInput,
  AppText,
  Avatar,
  Header,
  Loading,
  AppBadge,
} from 'components'
import AskUserNameModal from './AskUserNameModal'
import { AnswerRightButton, BackButton } from 'components/NavButton'
import Theme from 'theme'
import {
  flagQuestion,
  getQuestion,
  submitComment,
  voteComment as voteCommentAction,
  voteQuestion as voteQuestionAction,
} from 'features/questions/questionSlice'
import { joinRoom } from 'features/messages/messagesSlice'
import { checkURL } from 'utils'
import RNUrlPreview from 'react-native-url-preview'

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
    borderBottomColor: Colors.grayLight,
    borderBottomWidth: 1,
    paddingTop: 16,
    paddingBottom: 20,
  },
  questionItem: {
    flexDirection: 'row',
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
    backgroundColor: Colors.white,
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    height: 48,
    borderRadius: 24,
    marginLeft: 10,
    flex: 1,
    borderWidth: 1,
    borderColor: Colors.grayLight,
    color: Colors.text,
    fontSize: FontSize.large,
    paddingVertical: 14,
    paddingHorizontal: 16,
    marginRight: 10,
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
})

const Comment = ({
  comment,
  question,
  user,
  setComment,
  setIsMessageModalVisible,
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
  } = comment
  const dispatch = useDispatch()
  const voteComment = (value, questionId, commentId) =>
    dispatch(
      voteCommentAction({
        value,
        commentId,
        questionId,
      }),
    )
  const upVoteComment = (commentId) => voteComment(1, question._id, commentId)
  const downVoteComment = (commentId) =>
    voteComment(-1, question._id, commentId)
  const onPressUser = () => {
    const { phoneNumber } = user
    const { userPhoneNumber } = comment
    if (phoneNumber !== userPhoneNumber) {
      setIsMessageModalVisible(true)
      setComment(comment)
    }
  }
  const nonAnonymousName = username ? username : userPhoneNumber
  return (
    <View style={styles.questionItemWrapper}>
      <View style={styles.questionItem}>
        <TouchableOpacity onPress={() => onPressUser(comment)}>
          <Avatar size={54} />
        </TouchableOpacity>
        <View
          style={{
            flex: 1,
            marginLeft: 10,
          }}>
          <TouchableOpacity onPress={() => onPressUser(comment)}>
            <AppText
              weight="medium"
              color={Colors.primary}
              style={{ marginBottom: 5 }}>
              {isAnonymous ? name : nonAnonymousName}
            </AppText>
          </TouchableOpacity>
          <AppText
            weight="italic"
            fontSize={FontSize.normal}
            style={{ lineHeight: 26 }}
            color={Colors.gray}>{`"${content}"`}</AppText>
        </View>
      </View>
      <View style={styles.headerAnswerView}>
        <AppText
          fontSize={FontSize.normal}
          color={Colors.gray}
          style={{ marginRight: 14 }}>
          {moment(createdAt).fromNow()}
        </AppText>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <AppText fontSize={FontSize.normal}>{`${totalVotes}`}</AppText>
          <TouchableOpacity
            style={{ padding: 5 }}
            onPress={() => upVoteComment(_id)}>
            <AppIcon name="like" size={20} color={Colors.primary} />
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              padding: 5,
              marginLeft: 5,
            }}
            onPress={() => downVoteComment(_id)}>
            <AppIcon name="dislike" size={20} color={Colors.gray} />
          </TouchableOpacity>
        </View>
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
}

const Answers = ({ navigation }) => {
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
  const dispatch = useDispatch()
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
      }
      dispatch(submitComment(payload))
      resetForm({})
      setSubmitting(false)
      keyboardHeight.current = new Animated.Value(0)
      Keyboard.dismiss()
    }
  }
  const voteQuestion = (value, questionId) =>
    dispatch(
      voteQuestionAction({
        value,
        questionId,
      }),
    )
  const upVoteQuestion = () => voteQuestion(1, question._id)
  const downVoteQuestion = () => voteQuestion(-1, question._id)
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

  useLayoutEffect(() => {
    // Have to move this logic here because
    // https://reactnavigation.org/docs/troubleshooting/#i-get-the-warning-non-serializable-values-were-found-in-the-navigation-state
    // eslint-disable-next-line react/prop-types
    navigation.setOptions({
      header: () => (
        <Header
          headerLeft={<BackButton navigation={navigation} />}
          headerRight={
            <AnswerRightButton
              onPressDots={() => setIsFlagModalVisible(true)}
            />
          }
        />
      ),
    })
  }, [navigation])

  const renderEmpty = () => (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <AppText style={{ textAlign: 'center' }}>There's no answer yet</AppText>
    </View>
  )

  if (loading) return <Loading />
  const { flaggedBy = [] } = question
  const isFlagged = flaggedBy.includes(user.phoneNumber)
  const flagButtonText = `${isFlagged ? 'Unflag' : 'Flag'} this question`
  const url = checkURL(question.content)
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.white }}>
      <Animated.View style={{ flex: 1, paddingBottom: keyboardHeight.current }}>
        <StatusBar barStyle="light-content" />
        <KeyboardListener
          onWillShow={(event) => showKeyboard(event, keyboardHeight.current)}
          onWillHide={(event) => hideKeyBoard(event, keyboardHeight.current)}
        />
        <ScrollView>
          <View style={styles.headerView}>
            <View style={{ flexDirection: 'row' }}>
              <View style={{ flex: 1 }}>
                {url ? (
                  <>
                    <RNUrlPreview
                      containerStyle={{
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
                    <AppText
                      weight="medium"
                      color={Colors.gray}
                      style={{ marginTop: 16 }}>
                      What do you think of this video?
                    </AppText>
                  </>
                ) : (
                  <AppText
                    fontSize={FontSize.xxLarge}
                    style={{ marginRight: 10 }}>
                    {question.content}
                  </AppText>
                )}
                {question.group && question.group.name && (
                  <AppBadge
                    text={question.group.name}
                    color={Colors.white}
                    background={Colors.primary}
                  />
                )}
              </View>
              {isFlagged && (
                <AppIcon name="flag" color={Colors.primary} size={20} />
              )}
            </View>
            <View style={[styles.headerAnswerView, { marginTop: 20 }]}>
              <AppText color={Colors.gray} fontSize={FontSize.normal}>
                {moment(question.createdAt).fromNow()}
              </AppText>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <AppText fontSize={FontSize.normal}>
                  {question.totalVotes}
                </AppText>
                <TouchableOpacity
                  style={{ padding: 5 }}
                  onPress={() => upVoteQuestion()}>
                  <AppIcon name="like" size={20} color={Colors.gray} />
                </TouchableOpacity>
                <TouchableOpacity
                  style={{
                    padding: 5,
                    marginLeft: 5,
                  }}
                  onPress={() => downVoteQuestion()}>
                  <AppIcon name="dislike" size={20} color={Colors.gray} />
                </TouchableOpacity>
              </View>
            </View>
          </View>
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
                />
              )}
              keyExtractor={(item) => item._id}
              ListEmptyComponent={renderEmpty()}
              refreshing={loading}
              onRefresh={() => refreshQuestion(question._id)}
              contentContainerStyle={{
                backgroundColor: Colors.white,
                paddingHorizontal: 16,
                minHeight: '100%',
              }}
            />
          </View>
        </ScrollView>
        <View>
          <Formik initialValues={{ cmt: '' }} onSubmit={onSubmit}>
            {({ values, handleChange, handleSubmit }) => (
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
                <AppButton
                  icon="send"
                  iconSize={16}
                  disabled={!values.cmt}
                  style={{ width: 40, height: 40 }}
                  onPress={question.isAbleToAnswer ? handleSubmit : () => {}}
                />
              </View>
            )}
          </Formik>
          <View
            style={{
              padding: 12,
              backgroundColor: 'white',
              borderTopWidth: 2,
              borderTopColor: Colors.background,
            }}>
            <TouchableOpacity
              style={styles.contactItem}
              onPress={() => setIsAnonymous(!isAnonymous)}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <AppImage
                  source={
                    isAnonymous ? Images.checkmarkSelected : Images.checkmark
                  }
                  width={20}
                  height={20}
                />
                <AppText
                  color={Colors.text}
                  fontSize={FontSize.large}
                  style={{ marginLeft: 10 }}>
                  Answer Anonymously
                </AppText>
              </View>
            </TouchableOpacity>
          </View>
        </View>

        {/* Flag question modal */}
        <Modal
          isVisible={isFlagModalVisible}
          style={[Theme.Modal.modalView]}
          animationInTiming={300}
          animationOutTiming={300}>
          <View style={Theme.Modal.modalInnerView}>
            <View style={styles.modalBackdrop}>
              <BlurView style={{ flex: 1 }} blurType="xlight" blurAmount={1} />
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
                textStyle={{ color: Colors.primary }}
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
              <BlurView style={{ flex: 1 }} blurType="xlight" blurAmount={1} />
            </View>
            <View style={[Theme.Modal.modalInnerView, styles.modalInnerView]}>
              <View style={{ marginVertical: 16 }}>
                <AppButton text="Message" onPress={onPressMessageBtn} />
              </View>
              <AppButton
                text="Cancel"
                textStyle={{ color: Colors.primary }}
                style={{ backgroundColor: Colors.white }}
                onPress={() => setIsMessageModalVisible(false)}
              />
            </View>
          </View>
        </Modal>
      </Animated.View>
    </SafeAreaView>
  )
}

Answers.propTypes = {
  navigation: PropTypes.shape({
    setParams: PropTypes.func,
  }).isRequired,
}

export default Answers
