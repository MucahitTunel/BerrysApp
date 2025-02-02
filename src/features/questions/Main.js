/* eslint-disable react/prop-types */
import React, { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import PropTypes from 'prop-types'
import {
  KeyboardAvoidingView,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  View,
  Image,
  TouchableOpacity,
  Platform,
  ScrollView,
  Alert,
} from 'react-native'
import Modal from 'react-native-modal'
import moment from 'moment'
import ReceiveSharingIntent from 'react-native-receive-sharing-intent'
import OneSignal from 'react-native-onesignal'
import Config from 'react-native-config'
import {
  AppButton,
  AppText,
  AppInput,
  SuccessModal,
  CompareItem,
  Layout,
  CardSwiper,
  Avatar,
  PollItem,
  AppIcon,
} from 'components'
import { Colors, Dimensions, FontSize, Screens } from 'constants'
import Fonts from 'assets/fonts'
import * as NavigationService from 'services/navigation'
import { updatePushToken, setHasNotifications } from 'features/auth/authSlice'
import {
  getQuestions,
  hideQuestion,
  hidePoll,
  hideCompare,
  setCompares,
  setPolls,
  getPopularQuestions,
  skipPopularQuestions,
  setPopularCompares,
  setPopularPolls,
} from 'features/questions/questionsSlice'
import { getRoom, setRoom, getRooms } from 'features/messages/messagesSlice'
import {
  getQuestion,
  getPoll,
  getCompare,
  voteCompare,
  votePopularQuestion,
  setQuestion,
  submitComment,
  votePoll,
  voteQuestion as voteQuestionAction,
  setQuestionCommented,
} from 'features/questions/questionSlice'
import { setAskQuestion } from 'features/questions/askSlice'
import { loadContacts, getLeaderboard } from 'features/contacts/contactsSlice'
import store from 'state/store'
import getConversationName from 'utils/get-conversation-name'
import Images from 'assets/images'
import request from '../../services/api'
import firebase from 'services/firebase'
import MainScreenExtension from './MainScreenExtension'
import Theme from 'theme'
import { BlurView } from '@react-native-community/blur'

import RNUxcam from 'react-native-ux-cam'
RNUxcam.tagScreenName('Main Screen')

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
    height: Dimensions.Height - 145,
    width: Dimensions.Width,
    backgroundColor: 'transparent',
    flex: 1,
  },
  cardItemContainer: {
    height: Dimensions.Height / 1.7,
    borderRadius: 15,
    backgroundColor: 'white',
    borderBottomWidth: 4,
    borderColor: Colors.background,
    padding: 20,
  },
  cardItemHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardItemRelatedContact: {
    backgroundColor: Colors.purpleLight,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 5,
    borderRadius: 5,
    marginRight: 10,
  },
  questionItem: {
    height: '50%',
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
  tabContainer: {
    height: 50,
    backgroundColor: 'white',
    marginHorizontal: 35,
    borderRadius: 15,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 5,
  },
  tabItem: {
    height: '100%',
    width: '50%',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 15,
  },
  pollSelectionContainer: {
    paddingRight: 5,
  },
  triangle: {
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderLeftWidth: 10,
    borderRightWidth: 10,
    borderBottomWidth: 20,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: 'white',
    transform: [{ rotate: '180deg' }],
  },
})

export const RenderCompare = ({ compare, isPopular, onLongPress }) => {
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

    if (isPopular && !compare.showInPopular)
      dispatch(votePopularQuestion({ vote: index, popularId: compare._id }))
    else
      dispatch(
        voteCompare({
          image: index,
          compareId: compare?._id,
          showInPopular: compare.showInPopular,
        }),
      )

    if (isPopular)
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
    else
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

  const seeWhoVotedOnPress = () => {
    NavigationService.navigate(Screens.SeeWhoVoted, {
      receivers: compare.receivers,
      groupNames: compare.groupNames,
      // facebookGroupNames: poll.facebookGroupNames,
      votes: compare.votes,
    })
  }

  const height = compare.question
    ? Dimensions.Height / 3.5
    : Dimensions.Height / 3
  const width = Dimensions.Width / 2.7
  const selectedWidth = Dimensions.Width / 3.8

  return (
    <TouchableOpacity
      style={styles.cardItemContainer}
      onLongPress={() => {
        if (!isPopular) onLongPress()
      }}>
      {renderCardHeader({
        isPopular,
        type: 'compare',
        _id: compare._id,
        name: compare.contactName,
        createdAt: compare.createdAt,
        commonGroup: compare.group,
        myContact: compare.myContact,
        commonInterests: compare.commonInterests,
        commonCountries: compare.commonCountries,
      })}
      {compare.question && (
        <AppText
          style={{ marginTop: 10 }}
          color={Colors.purpleText}
          fontSize={FontSize.large}>
          {compare.question}
        </AppText>
      )}
      <View
        style={{
          flexDirection: 'row',
          flex: 1,
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
        <CompareItem
          height={height}
          width={width}
          selectedWidth={selectedWidth}
          image={compare?.images[0]}
          onPress={() => imageOnPress(0)}
          left
          selected={selectedOption === 0}
          voteNumber={votes[0] ? parseInt(votes[0].toFixed(0)) : 0}
          isVoted={isVoted}
          isResult
          isCreator={compare.userPhoneNumber === user.phoneNumber}
        />
        <CompareItem
          height={height}
          width={width}
          selectedWidth={selectedWidth}
          image={compare?.images[1]}
          onPress={() => imageOnPress(1)}
          selected={selectedOption === 1}
          voteNumber={votes[1] ? parseInt(votes[1].toFixed(0)) : 0}
          isVoted={isVoted}
          isResult
          isCreator={compare.userPhoneNumber === user.phoneNumber}
        />
        <View
          style={{
            position: 'absolute',
            backgroundColor: '#ED4062',
            height: 60,
            width: 60,
            borderRadius: 30,
            left: '40%',
            justifyContent: 'center',
            alignItems: 'center',
            alignSelf: 'center',
          }}>
          <AppText fontSize={FontSize.xxxLarge} weight="bold" color="white">
            VS
          </AppText>
        </View>
      </View>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          marginTop: 12,
        }}>
        <AppText fontSize={15} color={Colors.gray}>
          {`Versus - ${compare.votes.length} Votes`}
        </AppText>
        {/* {compare.votes.length > 0 && !isPopular && (
          <TouchableOpacity onPress={seeWhoVotedOnPress}>
            <AppText fontSize={15} color={Colors.purpleText}>
              See who voted
            </AppText>
          </TouchableOpacity>
        )} */}
      </View>
    </TouchableOpacity>
  )
}

const RenderQuestionImage = ({
  isPopular,
  questionId,
  image,
  dispatch,
  createdAt,
  content,
  comments,
  voteQuestion,
  isVoted,
  group,
  contactName,
  myContact,
  onLongPress,
}) => {
  const onPressQuestion = () => {
    dispatch(getQuestion(questionId))
    NavigationService.navigate(Screens.Answers, { isPopular: false })
  }

  return (
    <TouchableOpacity
      style={styles.cardItemContainer}
      onPress={onPressQuestion}
      onLongPress={() => {
        if (!isPopular) onLongPress()
      }}>
      <View style={{ flex: 1 }}>
        {renderCardHeader({
          isPopular,
          type: 'question',
          _id: questionId,
          name: contactName,
          createdAt,
          voteOnPress: () => voteQuestion(),
          isVoted,
          commonGroup: group,
          myContact,
        })}
        <Image
          source={{ uri: image }}
          style={{ flex: 1, width: '100%', marginTop: 10, borderRadius: 15 }}
        />
        {content && (
          <AppText
            style={{ marginTop: 20 }}
            color={Colors.purpleText}
            fontSize={FontSize.large}>
            {content}
          </AppText>
        )}
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginTop: 12,
          }}>
          <AppText fontSize={15} color={Colors.gray}>
            {`Image - ${comments} Response`}
          </AppText>
        </View>
      </View>
    </TouchableOpacity>
  )
}

const renderCardHeader = ({
  isPopular,
  type,
  id,
  name,
  createdAt,
  voteOnPress,
  isVoted,
  commonGroup,
  myContact,
  commonInterests,
  commonCountries,
}) => {
  return (
    <View>
      <View
        style={[styles.cardItemHeader, { justifyContent: 'space-between' }]}>
        <View style={styles.cardItemHeader}>
          <View
            style={{
              height: 45,
              width: 45,
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: '#DFE4F4',
              borderRadius: 100,
            }}>
            <Avatar size={22} source={Images.profileWhite} />
          </View>
          <View style={{ marginLeft: 10 }}>
            <AppText color={Colors.purpleText}>{name}</AppText>
            <AppText color={Colors.gray} fontSize={FontSize.normal}>
              {moment(createdAt).fromNow()}
            </AppText>
          </View>
        </View>
        {!isPopular && (
          <View style={styles.cardItemHeader}>
            {type === 'question' && (
              <AppButton
                icon="heart"
                iconColor={isVoted ? Colors.primary : Colors.grayLight}
                shadow={false}
                style={{ backgroundColor: 'transparent', right: -15 }}
                onPress={voteOnPress}
              />
            )}
          </View>
        )}
      </View>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          marginTop:
            commonGroup ||
            myContact ||
            commonInterests?.length > 0 ||
            commonCountries?.length > 0
              ? 10
              : 0,
        }}>
        {commonGroup && (
          <View style={[styles.cardItemRelatedContact]}>
            <Avatar source={Images.groupEmpty} size={18} />
            <AppText fontSize={FontSize.normal} style={{ marginLeft: 5 }}>
              {commonGroup.name}
            </AppText>
          </View>
        )}
        {myContact && (
          <View style={styles.cardItemRelatedContact}>
            <Avatar source={Images.groupEmpty} size={18} />
            <AppText fontSize={FontSize.normal} style={{ marginLeft: 5 }}>
              My contacts
            </AppText>
          </View>
        )}
        {commonInterests?.map((item) => (
          <View style={styles.cardItemRelatedContact}>
            <AppText fontSize={FontSize.normal} style={{ marginLeft: 5 }}>
              {item
                .split(' ')
                .map((i) => i.charAt(0).toUpperCase() + i.slice(1))
                .join(' ')}
            </AppText>
          </View>
        ))}
        {commonCountries?.map((item) => (
          <View style={styles.cardItemRelatedContact}>
            <AppText fontSize={FontSize.normal} style={{ marginLeft: 5 }}>
              {item
                .split(' ')
                .map((i) => i.charAt(0).toUpperCase() + i.slice(1))
                .join(' ')}
            </AppText>
          </View>
        ))}
      </View>
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
    votes,
    group,
    contactName,
    myContact,
    showInPopular,
    commonInterests,
    commonCountries,
    isLikeMinded,
  },
  isPopular,
  onLongPress,
}) => {
  const user = useSelector((state) => state.auth.user)
  const dispatch = useDispatch()

  const [answer, setAnswer] = useState(null)
  const [isAnswerAnonymous, setIsAnswerAnonymous] = useState(true)

  const isVoted = votes.find((v) => v.userPhoneNumber === user.phoneNumber)
  const voteQuestion = () => {
    if (isPopular) {
      dispatch(
        votePopularQuestion({
          popularId: _id,
          vote: 1,
          isQuestion: true,
        }),
      )
    } else
      dispatch(
        voteQuestionAction({
          value: 1,
          questionId: _id,
        }),
      )
  }

  if (image)
    return (
      <RenderQuestionImage
        questionId={_id}
        createdAt={createdAt}
        image={image}
        dispatch={dispatch}
        content={content}
        comments={comments}
        voteQuestion={voteQuestion}
        isVoted={isVoted}
        group={group}
        contactName={contactName}
        myContact={myContact}
        isPopular={isPopular}
        commonInterests={commonInterests}
        commonCountries={commonCountries}
        isLikeMinded={isLikeMinded}
        onLongPress={onLongPress}
      />
    )

  if (!user) return null
  const { phoneNumber } = user
  const isFlagged = flaggedBy.includes(phoneNumber)

  const onPressQuestion = () => {
    if (isPopular && !showInPopular)
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
    else dispatch(getQuestion(_id))
    NavigationService.navigate(Screens.Answers, { isPopular, showInPopular })
  }

  const onChangeText = (value) => {
    setAnswer(value === '' ? null : value)
  }

  const sendAnswer = () => {
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
    if (!answer) return
    const payload = {
      comment: answer,
      questionId: _id,
      isAnonymous: isAnswerAnonymous,
      isPopular,
      showInPopular,
    }
    setAnswer(null)
    dispatch(submitComment(payload))
    onPressQuestion()
  }

  return (
    <TouchableOpacity
      style={styles.cardItemContainer}
      onPress={onPressQuestion}
      onLongPress={() => {
        if (!isPopular) onLongPress()
      }}>
      <View style={{ flex: 1 }}>
        {renderCardHeader({
          isPopular,
          type: 'question',
          _id,
          name: contactName,
          createdAt,
          voteOnPress: () => voteQuestion(),
          isVoted,
          commonGroup: group,
          myContact,
          commonInterests,
          commonCountries,
          isLikeMinded,
        })}
        <AppText
          style={{ marginTop: 20 }}
          color={Colors.purpleText}
          fontSize={FontSize.large}>
          {content}
        </AppText>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginTop: 12,
          }}>
          <AppText fontSize={15} color={Colors.gray}>
            {`Text - ${comments} Answers`}
          </AppText>
        </View>
        <View style={{ flex: 1 }} />
        <AppText
          color={Colors.purpleText}
          fontSize={FontSize.normal}
          style={{ width: '100%', textAlign: 'center', marginBottom: 5 }}>
          {`Your answer is ${isAnswerAnonymous ? '' : 'not '}anonymous`}
        </AppText>
        <View style={{ flexDirection: 'row', alignItems: 'flex-end' }}>
          <AppInput
            placeholder="Write your message..."
            placeholderTextColor={Colors.gray}
            onChange={onChangeText}
            style={{
              backgroundColor: Colors.background,
              borderRadius: 15,
              fontSize: FontSize.normal,
              color: Colors.purpleText,
              flex: 1,
              paddingRight: 75,
            }}
            value={answer}
          />
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'flex-end',
              position: 'absolute',
              right: 10,
            }}>
            <AppButton
              icon="eye-off"
              iconColor={isAnswerAnonymous ? Colors.purple : 'white'}
              iconSize={22}
              style={{ backgroundColor: 'transparent', width: 22 }}
              shadow={false}
              onPress={() => setIsAnswerAnonymous(!isAnswerAnonymous)}
            />
            <AppButton
              icon="send"
              iconColor={Colors.purple}
              iconSize={22}
              style={{
                backgroundColor: 'transparent',
                width: 22,
                marginLeft: 10,
              }}
              shadow={false}
              onPress={sendAnswer}
            />
          </View>
        </View>
      </View>
    </TouchableOpacity>
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

export const RenderPoll = ({ poll, isPopular, onLongPress }) => {
  const dispatch = useDispatch()
  const user = useSelector((state) => state.auth.user)
  const popularPolls = useSelector((state) => state.questions.popularPolls)
  const polls = useSelector((state) => state.questions.polls)

  const [votes, setVotes] = useState(false)
  const [isVoted, setIsVoted] = useState(false)
  const [selectedOption, setSelectedOption] = useState(null)

  useEffect(() => {
    if (poll && user) {
      let voted = false
      let votes = {}

      poll.votes.forEach((v) => {
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
        votes[option] = (100 / poll.votes.length) * votes[option]
      })
      setVotes(votes)
    }
  }, [poll, user])

  const onPress = (selectedOption) => {
    if (isVoted) return

    if (isPopular && !poll.showInPopular)
      dispatch(
        votePopularQuestion({ popularId: poll._id, vote: selectedOption }),
      )
    else
      dispatch(
        votePoll({
          option: selectedOption,
          pollId: poll._id,
          showInPopular: poll.showInPopular,
        }),
      )

    if (isPopular) {
      dispatch(
        setPopularPolls(
          popularPolls.map((p) => {
            if (p._id === poll._id)
              return {
                ...p,
                votes: [
                  ...p.votes,
                  { userPhoneNumber: user.phoneNumber, value: selectedOption },
                ],
              }
            return p
          }),
        ),
      )
    } else
      dispatch(
        setPolls(
          polls.map((p) => {
            if (p._id === poll._id)
              return {
                ...p,
                votes: [
                  ...p.votes,
                  { userPhoneNumber: user.phoneNumber, value: selectedOption },
                ],
              }
            return p
          }),
        ),
      )
  }

  const seeWhoVotedOnPress = () => {
    NavigationService.navigate(Screens.SeeWhoVoted, {
      receivers: poll.receivers,
      groupNames: poll.groupNames,
      // facebookGroupNames: poll.facebookGroupNames,
      votes: poll.votes,
    })
  }

  return (
    <TouchableOpacity
      style={styles.cardItemContainer}
      onLongPress={() => {
        if (!isPopular) onLongPress()
      }}>
      <View style={{ flex: 1 }}>
        {renderCardHeader({
          isPopular,
          type: 'poll',
          _id: poll._id,
          name: poll.contactName,
          createdAt: poll.createdAt,
          commonGroup: poll.group,
          myContact: poll.myContact,
          commonInterests: poll.commonInterests,
          commonCountries: poll.commonCountries,
        })}
        <AppText
          style={{ marginTop: 20 }}
          color={Colors.purpleText}
          fontSize={FontSize.large}>
          {poll.question}
        </AppText>
        <ScrollView
          contentContainerStyle={styles.pollSelectionContainer}
          style={{ marginTop: 5 }}>
          {poll.options.map((o, idx) => {
            return (
              <PollItem
                selectedOption={idx === selectedOption}
                showVotes={isVoted}
                text={o.value}
                voteNumber={votes[idx] ? parseInt(votes[idx].toFixed(0)) : 0}
                onPress={() => onPress(idx)}
                style={{ marginBottom: 10 }}
                widthOffset={109}
              />
            )
          })}
        </ScrollView>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginTop: 12,
          }}>
          <AppText fontSize={15} color={Colors.gray}>
            {`Poll - ${poll.votes.length} Votes`}
          </AppText>
          {/* {poll.votes.length > 0 && !isPopular && (
            <TouchableOpacity onPress={seeWhoVotedOnPress}>
              <AppText fontSize={15} color={Colors.purpleText}>
                See who voted
              </AppText>
            </TouchableOpacity>
          )} */}
        </View>
      </View>
    </TouchableOpacity>
  )
}

RenderPoll.propTypes = {
  poll: PropTypes.object,
}

CompareItem.propTypes = {
  data: PropTypes.object,
}

const Main = ({ route }) => {
  const showSuccessModal =
    route && route.params && route.params.showSuccessModal
  const dispatch = useDispatch()
  const questionCommented = useSelector(
    (state) => state.question.questionCommented,
  )
  const questions = useSelector((state) => state.questions)
  const auth = useSelector((state) => state.auth)
  const leaderboard = useSelector((state) => state.contacts.leaderboard)

  const [shareHideModal, setShareHideModal] = useState(false)
  const [onboardingModal, setOnboardingModal] = useState(false)
  const [isSuccessModalVisible, setSuccessModalVisible] = useState(false)
  const [myPosts, setMyPosts] = useState([])
  const [myPostsIndex, setMyPostsIndex] = useState(0)
  const [popularPosts, setPopularPosts] = useState([])
  const [popularPostsIndex, setPopularPostsIndex] = useState(0)
  const [selectedTab, setSelectedTab] = useState(
    auth.onboarding ? 'popular' : 'my-posts',
  )

  const swiperRef = useRef(null)

  useEffect(() => {
    if (auth.onboarding)
      delay(() => NavigationService.navigate(Screens.AskCommonAccounts))
    if (route.params?.showOnboarding) {
      // eslint-disable-next-line react-hooks/exhaustive-deps
      if (!showSuccessModal) {
        delay(() => setOnboardingModal('main'))
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [route, auth])

  useEffect(() => {
    setMyPosts(
      [...questions.data, ...questions.polls, ...questions.compares].sort(
        (a, b) => b.createdAt - a.createdAt,
      ),
    )
  }, [questions.data, questions.polls, questions.compares])

  useEffect(() => {
    setPopularPosts([
      ...questions.popularCompares,
      ...questions.popularPolls,
      ...questions.popularQuestions,
    ])
  }, [
    questions.popularPolls,
    questions.popularCompares,
    questions.popularQuestions,
  ])

  const delay = (cb, time) => {
    setTimeout(cb, 1000 * time)
  }

  useEffect(() => {
    firebase.analytics.logEvent(firebase.analytics.events.SCREEN_NAVIGATION, {
      screen: 'Main Screen',
      user: auth.user.phoneNumber,
    })
    // dispatch(loadContacts())
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
              delay(
                () =>
                  NavigationService.navigate(Screens.Answers, {
                    isPopular: false,
                  }),
                1,
              )
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
    dispatch(getQuestions())
    dispatch(getLeaderboard())
    dispatch(getPopularQuestions())
    dispatch(getRooms())
  }, [dispatch])

  useEffect(() => {
    if (showSuccessModal) {
      setSuccessModalVisible(true)
      NavigationService.updateParams({
        showSuccessModal: false,
        showOnboarding: false,
        forceOnboarding: !!route.params?.showOnboarding,
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showSuccessModal])

  const renderItem = (item) => {
    if (item.type === 'question')
      return <QuestionItem question={item} onLongPress={postOnLongPress} />
    if (
      item.type === 'popular-question' ||
      item.type === 'popular-user-question'
    )
      return <QuestionItem question={item} isPopular />
    if (item.type === 'poll')
      return <RenderPoll poll={item} onLongPress={postOnLongPress} />
    if (item.type === 'compare')
      return <RenderCompare compare={item} onLongPress={postOnLongPress} />
    if (item.type === 'popular-compare' || item.type === 'popular-user-compare')
      return <RenderCompare compare={item} isPopular />
    if (item.type === 'popular-poll' || item.type === 'popular-user-poll')
      return <RenderPoll poll={item} isPopular />
  }

  const postOnLongPress = () => {
    return setShareHideModal(true)
  }

  const renderCard = (card) => {
    if (!card) return null
    return renderItem(card)
  }

  const myPostsOnSwipedLeft = (index) => {
    setMyPostsIndex(index + 1)
    // const post = myPosts[index]
    // switch (post.type) {
    //   case 'question':
    //     return dispatch(hideQuestion(post._id))
    //   case 'poll':
    //     return dispatch(hidePoll(post._id))
    //   case 'compare':
    //     return dispatch(hideCompare(post._id))
    // }
  }

  const myPostsOnSwipedRight = (index) => {
    NavigationService.navigate(Screens.PostQuestion, {
      isSharing: true,
      post: myPosts[index],
    })
  }

  const popularOnSwipedRight = (index) => {
    NavigationService.navigate(Screens.PostQuestion, {
      isSharing: true,
      post: popularPosts[index],
      isPopular: true,
    })
  }

  const popularOnSwipedLeft = (index) => {
    if (!popularPosts[index]) return
    setPopularPostsIndex(index + 1)
    dispatch(skipPopularQuestions(popularPosts[index]))
  }

  useEffect(() => {
    if (myPostsIndex === myPosts.length) {
      dispatch(getQuestions())
      setMyPostsIndex(0)
    }
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, [myPostsIndex])

  useEffect(() => {
    if (questionCommented) {
      if (swiperRef && swiperRef.current) swiperRef.current.swipeLeft()
      dispatch(setQuestionCommented(false))
    }
  }, [questionCommented, dispatch])

  const getPopularSeenAt = () => {
    if (questions.popularSeenAt !== null) {
      const seenDate = new Date(questions.popularSeenAt)
      const today = new Date()

      var diff = (today.getTime() - seenDate.getTime()) / 1000
      diff /= 60 * 60
      return 24 - Math.abs(Math.round(diff))
    } else {
      dispatch(getLeaderboard())
      dispatch(getPopularQuestions())
      return 24
    }
  }

  const renderMyPosts = () => {
    if (myPostsIndex < myPosts.length)
      return (
        <CardSwiper
          data={myPosts}
          renderCard={renderCard}
          onSwipedLeft={myPostsOnSwipedLeft}
          onSwipedRight={myPostsOnSwipedRight}
          cardIndex={myPostsIndex}
          ref={swiperRef}
        />
      )
    return (
      <View
        style={[
          styles.cardItemContainer,
          { padding: 0, marginHorizontal: 20, marginTop: 20 },
        ]}>
        <Image
          source={Images.emptyCard}
          style={{ height: '100%', width: '100%', borderRadius: 15 }}
        />
        <AppText
          color="white"
          fontSize={FontSize.large}
          style={{
            position: 'absolute',
            textAlign: 'center',
            alignSelf: 'center',
            top: 40,
            marginHorizontal: 60,
          }}>
          You skipped all of your posts. Ask or receive questions to see more
          posts!
        </AppText>
      </View>
    )
  }

  const renderPopularCards = () => {
    if (popularPostsIndex < popularPosts.length)
      return (
        <CardSwiper
          data={popularPosts}
          renderCard={renderCard}
          onSwipedLeft={popularOnSwipedLeft}
          cardIndex={popularPostsIndex}
          onSwipedRight={popularOnSwipedRight}
          ref={swiperRef}
        />
      )
    return (
      <ScrollView>
        <View
          style={[
            styles.cardItemContainer,
            { padding: 0, marginHorizontal: 20, marginTop: 20 },
          ]}>
          <Image
            source={Images.emptyCard}
            style={{ height: '100%', width: '100%', borderRadius: 15 }}
          />
          <AppText
            color="white"
            fontSize={FontSize.large}
            style={{
              position: 'absolute',
              textAlign: 'center',
              alignSelf: 'center',
              top: 40,
              marginHorizontal: 60,
            }}>
            You earned {questions.popularEarnedPoints} points today. New popular
            posts would be in {getPopularSeenAt()} hours!
          </AppText>
          <View
            style={{
              position: 'absolute',
              textAlign: 'center',
              alignSelf: 'center',
              bottom: 10,
              marginHorizontal: 60,
            }}>
            <AppText color="white" fontSize={FontSize.large}>
              See Leaderboard
            </AppText>
            <View style={{ transform: [{ rotate: '90deg' }], top: 60 }}>
              <AppIcon name="chevron-right" color="white" size={28} />
            </View>
          </View>
        </View>
        <View
          style={[
            styles.cardItemContainer,
            {
              marginHorizontal: 20,
              backgroundColor: 'transparent',
              height: null,
            },
          ]}>
          <AppText
            weight="bold"
            fontSize={FontSize.xxLarge}
            color={Colors.purpleText}
            style={{ alignSelf: 'center', marginBottom: 10 }}>
            Top 5
          </AppText>
          {leaderboard &&
            leaderboard.map((u) => {
              return (
                <View
                  style={{
                    width: '100%',
                    padding: 20,
                    backgroundColor: Colors.purpleLight,
                    marginBottom: 10,
                    flexDirection: 'row',
                    alignItems: 'center',
                    borderRadius: 15,
                  }}>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      flex: 1,
                    }}>
                    <AppText
                      weight="bold"
                      color={Colors.purpleText}
                      style={{ marginRight: 20 }}>
                      {u.position}.
                    </AppText>
                    {u.profilePicture ? (
                      <Image
                        source={{ uri: u.profilePicture }}
                        style={{
                          height: 50,
                          width: 50,
                          borderRadius: 25,
                        }}
                      />
                    ) : (
                      <View
                        style={{
                          height: 50,
                          width: 50,
                          justifyContent: 'center',
                          alignItems: 'center',
                          backgroundColor: '#DFE4F4',
                          borderRadius: 25,
                        }}>
                        <Avatar size={22} source={Images.profileWhite} />
                      </View>
                    )}
                    <AppText
                      weight="medium"
                      color={Colors.purpleText}
                      style={{ marginLeft: 10 }}>
                      {u.name}
                    </AppText>
                  </View>
                  <AppText weight="bold" color={Colors.purpleText}>
                    {u.totalPoints}p
                  </AppText>
                </View>
              )
            })}
        </View>
      </ScrollView>
    )
  }

  useEffect(() => {
    request({
      method: 'GET',
      url: 'notifications/check',
      params: {
        userPhoneNumber: auth.user.phoneNumber,
      },
    }).then((res) => {
      const { data } = res
      if (data.notifications.length > 0) dispatch(setHasNotifications(true))
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (route.params?.openTab) {
      setSelectedTab(route.params.openTab)
    }
  }, [route.params?.openTab])

  return (
    <ScrollView
      style={{ backgroundColor: Colors.purple }}
      pagingEnabled
      showsVerticalScrollIndicator={false}
      scrollEnabled={!auth.user.isNew}>
      {!auth.user.isNew && <MainScreenExtension />}
      <Layout innerStyle={{ paddingTop: 15 }}>
        <View style={styles.container}>
          <StatusBar barStyle="light-content" />
          <View style={styles.tabContainer}>
            <AppButton
              style={[
                styles.tabItem,
                {
                  backgroundColor:
                    selectedTab === 'my-posts' ? Colors.purple : 'transparent',
                },
              ]}
              text="For Me"
              textStyle={{
                color: selectedTab === 'my-posts' ? 'white' : Colors.purple,
                fontWeight: 'normal',
              }}
              onPress={() => setSelectedTab('my-posts')}
            />
            <AppButton
              style={[
                styles.tabItem,
                {
                  backgroundColor:
                    selectedTab === 'popular' ? Colors.purple : 'transparent',
                },
              ]}
              text="Popular"
              textStyle={{
                color: selectedTab === 'popular' ? 'white' : Colors.purple,
                fontWeight: 'normal',
              }}
              onPress={() => setSelectedTab('popular')}
            />
          </View>
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'position' : null}
            keyboardVerticalOffset={100}
            style={{ flex: 1 }}>
            {selectedTab === 'my-posts' && renderMyPosts()}
            {selectedTab === 'popular' && renderPopularCards()}
          </KeyboardAvoidingView>

          {isSuccessModalVisible && (
            <SuccessModal
              isModalVisible={isSuccessModalVisible}
              closeModal={() => {
                setSuccessModalVisible(false)
                if (route.params?.forceOnboarding)
                  delay(() => setOnboardingModal('main'))
              }}
            />
          )}

          {!!onboardingModal && (
            <Modal visible={!!onboardingModal} transparent>
              <View style={{ flex: 1, backgroundColor: Colors.blackDimmed }}>
                {onboardingModal === 'main' && (
                  <TouchableOpacity
                    style={{ flex: 1 }}
                    // onPress={() => setOnboardingModal(auth.user.survey)}>
                    // onPress={() => setOnboardingModal(false)}>
                    onPress={() => {
                      setOnboardingModal(false)
                    }}>
                    <View
                      style={{
                        alignItems: 'center',
                        position: 'absolute',
                        top: '40%',
                        left: 20,
                      }}>
                      <Image
                        source={Images.onboardingSkip}
                        style={{
                          height: 200,
                          width: 100,
                          resizeMode: 'contain',
                        }}
                      />
                    </View>
                    <View
                      style={{
                        alignItems: 'center',
                        position: 'absolute',
                        top: '40%',
                        right: 20,
                      }}>
                      <Image
                        source={Images.onboardingShare}
                        style={{
                          height: 200,
                          width: 100,
                          resizeMode: 'contain',
                        }}
                      />
                    </View>
                  </TouchableOpacity>
                )}
                {onboardingModal === 'introvert' && (
                  <TouchableOpacity
                    style={{ flex: 1 }}
                    onPress={() => {
                      setOnboardingModal(false)
                    }}>
                    <View
                      style={{
                        alignItems: 'center',
                        position: 'absolute',
                        bottom: '14%',
                        backgroundColor: 'white',
                        padding: 15,
                        borderRadius: 7,
                        alignSelf: 'center',
                      }}>
                      <AppText color="black">Ask Like-Minded Users</AppText>
                    </View>
                    <View
                      style={[
                        styles.triangle,
                        {
                          position: 'absolute',
                          alignSelf: 'center',
                          bottom: '12%',
                        },
                      ]}
                    />
                  </TouchableOpacity>
                )}
                {onboardingModal === 'extravert' && (
                  <TouchableOpacity
                    style={{ flex: 1 }}
                    onPress={() => {
                      setOnboardingModal(false)
                    }}>
                    <View
                      style={{
                        alignItems: 'center',
                        position: 'absolute',
                        top: '13%',
                        backgroundColor: 'white',
                        padding: 15,
                        borderRadius: 7,
                        alignSelf: 'center',
                      }}>
                      <AppText color="black" weight="bold">
                        Earn points by answering
                      </AppText>
                      <AppText
                        color="black"
                        weight="normal"
                        style={{ marginTop: 5 }}>
                        Ask experts any questions you have
                      </AppText>
                    </View>
                    <View
                      style={[
                        styles.triangle,
                        {
                          position: 'absolute',
                          alignSelf: 'center',
                          top: '11%',
                          right: '15%',
                          transform: [{ rotate: '35deg' }],
                          borderLeftWidth: 20,
                          borderRightWidth: 20,
                          borderBottomWidth: 40,
                        },
                      ]}
                    />
                  </TouchableOpacity>
                )}
              </View>
            </Modal>
          )}

          {shareHideModal && (
            <Modal
              isVisible={shareHideModal}
              style={[Theme.Modal.modalView]}
              animationInTiming={300}
              animationOutTiming={300}>
              <View style={Theme.Modal.modalInnerView}>
                <View style={styles.modalBackdrop}>
                  <BlurView
                    style={{ flex: 1 }}
                    blurType="dark"
                    blurAmount={1}
                  />
                </View>
                <View
                  style={{
                    flex: 1,
                    justifyContent: 'center',
                    paddingHorizontal: 30,
                  }}>
                  <View style={{ marginVertical: 16 }}>
                    <AppButton
                      text={'Share Question'}
                      onPress={() => {
                        setShareHideModal(false)
                        myPostsOnSwipedRight(myPostsIndex)
                      }}
                    />
                  </View>
                  <View style={{ marginBottom: 16 }}>
                    <AppButton
                      text={'Hide Question'}
                      onPress={() => {
                        setShareHideModal(false)
                        const index = myPostsIndex
                        const post = myPosts[index]
                        switch (post.type) {
                          case 'question':
                            dispatch(hideQuestion(post._id))
                            break
                          case 'poll':
                            dispatch(hidePoll(post._id))
                            break
                          case 'compare':
                            dispatch(hideCompare(post._id))
                            break
                        }
                        if (swiperRef && swiperRef.current)
                          swiperRef.current.swipeLeft()
                      }}
                    />
                  </View>
                  <AppButton
                    text="Close"
                    textStyle={{ color: Colors.purple }}
                    style={{ backgroundColor: Colors.white }}
                    onPress={() => setShareHideModal(false)}
                  />
                </View>
              </View>
            </Modal>
          )}
        </View>
      </Layout>
    </ScrollView>
  )
}

export default Main
