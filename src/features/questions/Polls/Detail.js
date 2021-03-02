import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { StatusBar, StyleSheet, SafeAreaView, ScrollView } from 'react-native'
import { Dimensions, Colors, FontSize } from 'constants'
import { votePoll } from '../questionSlice'
import * as NavigationService from 'services/navigation'

import { PollItem, AppButton, AppText } from 'components'
import { getQuestions } from '../questionsSlice'

const styles = StyleSheet.create({
  container: {
    height: Dimensions.Height,
    width: Dimensions.Width,
    backgroundColor: Colors.white,
    flex: 1,
  },
  voteText: { marginLeft: 10, marginBottom: 15, marginTop: 5 },
})

export const PollDetail = () => {
  const dispatch = useDispatch()
  const poll = useSelector((state) => state.question.poll)
  const user = useSelector((state) => state.auth.user)

  const [isVoted, setIsVoted] = useState(false)
  const [selectedOption, setSelectedOption] = useState(null)
  const [votes, setVotes] = useState({})

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
        {isVoted && (
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
    dispatch(votePoll(selectedOption))
  }

  if (!poll) return null
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <ScrollView contentContainerStyle={{ paddingBottom: 20, paddingTop: 20 }}>
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
  )
}

PollDetail.propTypes = {}

export default PollDetail
