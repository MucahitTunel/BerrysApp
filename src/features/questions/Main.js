import React from 'react'
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
import Swipeout from 'react-native-swipeout'
import { Avatar, AppIcon, AppText, AppInput, Loading } from 'components'
import Constants from 'constants'
import Images from 'assets/images'
import Fonts from 'assets/fonts'

const swipeoutBtns = [
  {
    text: 'Hide',
    backgroundColor: Constants.Colors.textRed,
  },
]

const styles = StyleSheet.create({
  container: {
    height: Constants.Dimensions.heightScreen,
    width: Constants.Dimensions.widthScreen,
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
    width: Constants.Dimensions.widthScreen - 32,
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
  if (!user) return null
  const { phoneNumber } = user
  const isFlagged = flaggedBy.includes(phoneNumber)
  const onPressQuestion = () => {}
  const onRemoveQuestion = () => {}
  return (
    <Swipeout
      onOpen={(sectionID, rowId, direction) => onRemoveQuestion(direction, _id)}
      right={swipeoutBtns}
      backgroundColor="transparent"
      buttonWidth={Constants.Dimensions.widthScreen - 10}>
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

QuestionItem.propTypes = {}

const Main = () => {
  const questions = []
  const loading = false

  const getQuestions = () => {}
  const onSubmit = () => {}

  const renderEmpty = () => (
    <AppText style={{ textAlign: 'center' }} text="There's no question yet" />
  )

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <Formik initialValues={{ question: '' }} onSubmit={onSubmit}>
        {({ values, handleChange, handleSubmit }) => (
          <View style={styles.inputView}>
            <Avatar source={Images.defaultAvatar} size={50} />
            <AppInput
              style={styles.input}
              placeholder="Ask from people in your circles, anonymously..."
              multiline
              onChange={handleChange('question')}
              value={values.question}
              autoFocus
            />
            <TouchableOpacity onPress={handleSubmit}>
              <AppIcon name="send" color={Constants.Colors.primaryLight} />
            </TouchableOpacity>
          </View>
        )}
      </Formik>
      <View style={styles.flatListView}>
        {loading && !questions.length && <Loading />}
        <FlatList
          data={questions}
          renderItem={({ item }) => <QuestionItem question={item} />}
          keyExtractor={(item) => item._id}
          ListEmptyComponent={renderEmpty()}
          refreshing={loading}
          onRefresh={() => getQuestions()}
        />
      </View>
    </View>
  )
}

export default Main
