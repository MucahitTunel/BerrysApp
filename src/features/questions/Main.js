import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
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
import Swipeout from 'react-native-swipeout'
import { Avatar, AppIcon, AppText, AppInput, Loading } from 'components'
import Constants from 'constants'
import Images from 'assets/images'
import Fonts from 'assets/fonts'
import * as NavigationService from 'services/navigation'
import { getQuestions, hideQuestion } from 'features/questions/questionsSlice'
import { setAskQuestion } from 'features/questions/questionSlice'
import { loadContacts } from 'features/contacts/contactsSlice'
import ReceiveSharingIntent from 'react-native-receive-sharing-intent'
import store from 'state/store'

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
    borderBottomColor: Constants.Colors.grayLight,
    borderBottomWidth: 1,
    paddingVertical: 14,
    marginLeft: 16,
    width: Constants.Dimensions.Width - 32,
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
    paddingVertical: 16,
    backgroundColor: Constants.Colors.white,
    marginTop: 10,
    flex: 1,
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
  const onPressQuestion = () => {}
  const onRemoveQuestion = (direction, _id) => {
    if (direction === 'right') {
      dispatch(hideQuestion(_id))
    }
  }
  return (
    <Swipeout
      onOpen={(sectionID, rowId, direction) => onRemoveQuestion(direction, _id)}
      right={swipeoutBtns}
      backgroundColor="transparent"
      buttonWidth={Constants.Dimensions.Width - 10}>
      <TouchableOpacity
        style={styles.questionItem}
        onPress={() => onPressQuestion(_id)}>
        <View style={{ flex: 1 }}>
          <View style={{ flexDirection: 'row' }}>
            <AppText
              style={{ marginRight: 5 }}
              text={content}
              fontSize={Constants.Styles.FontSize.large}
            />
            {isFlagged && (
              <AppIcon name="flag" color={Constants.olors.primary} size={20} />
            )}
          </View>
          <View
            style={{
              flexDirection: 'row',
              marginTop: 16,
            }}>
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
        </View>
        <View
          style={{
            marginLeft: 16,
            flexDirection: 'row',
          }}>
          <AppText
            text={moment(createdAt).fromNow()}
            color={Constants.Colors.gray}
          />
          <AppIcon name="chevron-right" size={20} />
        </View>
      </TouchableOpacity>
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
  const questions = useSelector((state) => state.questions)
  const question = useSelector((state) => state.question.question)
  const { data, loading } = questions
  useEffect(() => {
    dispatch(getQuestions())
    dispatch(loadContacts())
  }, [dispatch])
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

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <Formik
        enableReinitialize
        initialValues={{ question }}
        onSubmit={onSubmit}>
        {({ values, handleChange, handleSubmit }) => (
          <View style={styles.inputView}>
            <Avatar source={Images.defaultAvatar} size={50} />
            <AppInput
              style={styles.input}
              placeholder="Ask from people in your circles, anonymously..."
              multiline
              onChange={handleChange('question')}
              value={values.question}
              // autoFocus
            />
            <TouchableOpacity onPress={handleSubmit}>
              <AppIcon name="send" color={Constants.Colors.primaryLight} />
            </TouchableOpacity>
          </View>
        )}
      </Formik>
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
