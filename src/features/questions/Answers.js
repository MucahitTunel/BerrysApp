import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import PropTypes from 'prop-types'
import {
  View,
  TouchableOpacity,
  FlatList,
  StatusBar,
  StyleSheet,
} from 'react-native'
import { Formik } from 'formik'
import moment from 'moment'
import Modal from 'react-native-modal'
import { BlurView } from '@react-native-community/blur'
import Constants from 'constants'
import Fonts from 'assets/fonts'
import {
  Avatar,
  AppText,
  AppIcon,
  AppInput,
  AppButton,
  Loading,
} from 'components'
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
})

const Comment = ({ comment }) => {
  const { _id, name, createdAt, content, totalVotes = 0 } = comment
  const upVoteComment = () => {}
  const downVoteComment = () => {}
  const onPressUser = () => {}
  return (
    <View style={styles.questionItem}>
      <TouchableOpacity onPress={() => onPressUser(comment)}>
        <Avatar size={50} />
      </TouchableOpacity>
      <View
        style={{
          flex: 1,
          marginLeft: 10,
        }}>
        <TouchableOpacity onPress={() => onPressUser(comment)}>
          <AppText
            text={name}
            color={Constants.Colors.blue}
            fontFamily={Fonts.latoBold}
            style={{ marginBottom: 5 }}
          />
        </TouchableOpacity>
        <AppText text={content} fontSize={Constants.Styles.FontSize.large} />
        <View style={styles.headerAnswerView}>
          <View style={styles.headerAnswerInner}>
            <AppText
              text={moment(createdAt).fromNow()}
              color={Constants.Colors.gray}
              style={{ marginRight: 14 }}
              fontSize={Constants.Styles.FontSize.medium}
            />
            <AppText text={`${totalVotes}`} color={Constants.Colors.gray} />
            <TouchableOpacity
              style={{ padding: 5 }}
              onPress={() => upVoteComment(_id)}>
              <AppIcon name="like" size={16} color={Constants.Colors.gray} />
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                padding: 5,
                marginRight: 5,
              }}
              onPress={() => downVoteComment(_id)}>
              <AppIcon name="unlike" size={16} color={Constants.Colors.gray} />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  )
}

Comment.propTypes = {
  comment: PropTypes.shape({
    _id: PropTypes.string,
    name: PropTypes.string,
    content: PropTypes.string,
    createdAt: PropTypes.number,
    totalVotes: PropTypes.number,
  }),
}

const Answers = () => {
  const [isFlagModalVisible, setIsFlagModalVisible] = useState(false)
  const [isMessageModalVisible, setIsMessageModalVisible] = useState(false)
  const user = useSelector((state) => state.auth.user)
  const question = useSelector((state) => state.question.data)
  const loading = useSelector((state) => state.question.loading)
  const onSubmit = () => {}
  const upVoteQuestion = () => {}
  const downVoteQuestion = () => {}
  const refreshQuestion = () => {}
  const onPressFlagQuestion = () => {}
  const onPressMessageBtn = () => {}

  const renderEmpty = () => (
    <AppText style={{ textAlign: 'center' }} text="There's no answer yet" />
  )

  if (loading) return <Loading />
  const { flaggedBy = [] } = question
  const isFlagged = flaggedBy.includes(user.phoneNumber)
  const flagButtonText = `${isFlagged ? 'Unflag' : 'Flag'} this question`
  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <View style={styles.headerView}>
        <View style={{ flexDirection: 'row' }}>
          <AppText
            text={question.content}
            fontSize={Constants.Styles.FontSize.xxLarge}
            fontFamily={Fonts.latoBold}
            style={{ marginRight: 10 }}
          />
          {isFlagged && (
            <AppIcon name="flag" color={Constants.Colors.primary} size={20} />
          )}
        </View>
        <View style={styles.headerInner}>
          <AppText
            text={moment(question.createdAt).fromNow()}
            color={Constants.Colors.gray}
            style={{ marginRight: 14 }}
            fontSize={Constants.Styles.FontSize.medium}
          />
          <AppText text={question.totalVotes} color={Constants.Colors.gray} />
          <TouchableOpacity
            style={{ padding: 5 }}
            onPress={() => upVoteQuestion()}>
            <AppIcon name="like" size={16} color={Constants.Colors.gray} />
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              padding: 5,
              marginRight: 5,
            }}
            onPress={() => downVoteQuestion()}>
            <AppIcon name="unlike" size={16} color={Constants.Colors.gray} />
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.flatListView}>
        <FlatList
          data={question.comments}
          renderItem={({ item }) => <Comment comment={item} />}
          keyExtractor={(item) => item._id}
          ListEmptyComponent={renderEmpty()}
          refreshing={loading}
          onRefresh={() => refreshQuestion(question._id)}
        />
      </View>
      <View
        style={{
          borderTopColor: Constants.Colors.grayLight,
          borderTopWidth: 1,
        }}>
        <Formik initialValues={{ comment: '' }} onSubmit={onSubmit}>
          {({ values, handleChange, handleSubmit }) => (
            <View style={styles.inputView}>
              <AppInput
                style={styles.input}
                placeholder={
                  question.isAbleToAnswer
                    ? 'Type a message...'
                    : 'You cannot answer this question'
                }
                editable={question.isAbleToAnswer}
                multiline
                onChange={handleChange('comment')}
                value={values.comment}
              />
              <TouchableOpacity
                style={{
                  opacity: question.isAbleToAnswer ? 1 : 0.3,
                  activeOpacity: 0.3,
                }}
                onPress={question.isAbleToAnswer ? handleSubmit : () => {}}>
                <AppIcon name="send" color={Constants.Colors.primaryLight} />
              </TouchableOpacity>
            </View>
          )}
        </Formik>
      </View>

      {/* Flag the question modal */}
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
                backgroundColor={Constants.Colors.primary}
                color={Constants.Colors.white}
                onPress={() => onPressFlagQuestion(!isFlagged)}
              />
            </View>
            <AppButton
              text="Close"
              onPress={() => setIsFlagModalVisible(false)}
            />
          </View>
        </View>
      </Modal>

      {/* Flag the question modal */}
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
              <AppButton
                text="Message"
                backgroundColor={Constants.Colors.primary}
                color={Constants.Colors.white}
                onPress={onPressMessageBtn}
              />
            </View>
            <AppButton
              text="Cancel"
              onPress={() => setIsMessageModalVisible(false)}
            />
          </View>
        </View>
      </Modal>
    </View>
  )
}

Answers.propTypes = {
  navigation: PropTypes.shape({
    setParams: PropTypes.func,
  }).isRequired,
}

export default Answers
