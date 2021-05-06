import React, { useEffect, useState, useLayoutEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { StatusBar, StyleSheet, SafeAreaView, ScrollView } from 'react-native'
import { Dimensions, Colors, FontSize } from 'constants'
import { Header, Layout } from 'components'
import { BackButton } from 'components/NavButton'
import { votePoll, votePopularQuestion, setPoll } from '../questionSlice'
import { setPopularPolls } from '../questionsSlice'
import * as NavigationService from 'services/navigation'
import PropTypes from 'prop-types'

import { PollItem, AppButton, AppText } from 'components'
import { getQuestions, readPoll } from '../questionsSlice'

const styles = StyleSheet.create({
  container: {
    height: Dimensions.Height,
    width: Dimensions.Width,
    backgroundColor: 'transparent',
    flex: 1,
  },
  voteText: { marginLeft: 10, marginBottom: 15, marginTop: 5 },
})

export const PollDetail = ({ route, navigation }) => {
  const dispatch = useDispatch()
  const poll = useSelector((state) => state.question.poll)
  const popularPolls = useSelector((state) => state.questions.popularPolls)
  const user = useSelector((state) => state.auth.user)

  const [isVoted, setIsVoted] = useState(false)
  const [selectedOption, setSelectedOption] = useState(null)
  const [votes, setVotes] = useState({})

  useEffect(() => {
    if (route.params.isPopular) {
      dispatch(setPoll(route.params.poll))
    }
  }, [route, dispatch])

  useEffect(() => {
    if (poll) {
      dispatch(readPoll(poll._id))
    }
  }, [dispatch, poll])

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

  useLayoutEffect(() => {
    navigation.setOptions({
      header: () => (
        <Header
          title="Poll Details"
          headerLeft={
            <BackButton
              navigation={navigation}
              onPress={() => NavigationService.goBack()}
            />
          }
        />
      ),
    })
  }, [navigation, route])

  const renderOption = (item, index) => {
    return (
      <>
        <PollItem
          key={index}
          text={item.value}
          selected={index === selectedOption}
          onPress={() => setSelectedOption(index)}
          isVoted={isVoted}
          style={{ marginBottom: isVoted ? null : 15 }}
          voteNumber={votes[index] ? parseInt(votes[index].toFixed(0)) : 0}
        />
        {(poll.userPhoneNumber === user.phoneNumber || isVoted) && (
          <AppText
            fontSize={15}
            color={Colors.gray}
            style={styles.voteText}>{`${
            votes[index] ? votes[index].toFixed(0) : 0
          }% People voted`}</AppText>
        )}
      </>
    )
  }

  const buttonOnPress = () => {
    if (isVoted) {
      dispatch(getQuestions())
      return NavigationService.goBack()
    }
    if (selectedOption === null) return alert('You have to select an option!')
    if (route.params.isPopular) {
      dispatch(
        votePopularQuestion({ popularId: poll._id, vote: selectedOption }),
      )
      dispatch(
        setPoll({
          ...poll,
          votes: [
            ...poll.votes,
            { userPhoneNumber: user.phoneNumber, value: selectedOption },
          ],
        }),
      )
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
    } else dispatch(votePoll(selectedOption))
  }

  if (!poll) return null
  return (
    <Layout>
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" />
        <ScrollView
          contentContainerStyle={{ paddingBottom: 20, paddingTop: 20 }}>
          <AppText
            color={'black'}
            fontSize={FontSize.xxxLarge}
            weight="medium"
            style={{ paddingLeft: 10, marginBottom: 30 }}>
            {poll.question}
          </AppText>
          {poll.options.map((o, idx) => renderOption(o, idx))}
        </ScrollView>
        <AppButton
          style={{
            margin: 20,
            backgroundColor: isVoted ? 'white' : Colors.primary,
            borderWidth: 1,
            borderColor: Colors.grayLight,
          }}
          onPress={buttonOnPress}
          text={isVoted ? 'Done' : 'Vote'}
          textStyle={{ color: isVoted ? Colors.primary : 'white' }}
        />
      </SafeAreaView>
    </Layout>
  )
}

PollDetail.propTypes = {
  route: PropTypes.object,
  navigation: PropTypes.object,
}

export default PollDetail
