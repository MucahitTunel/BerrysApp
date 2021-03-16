import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { StatusBar, StyleSheet, SafeAreaView, View } from 'react-native'
import { Dimensions, Colors, FontSize } from 'constants'
import { voteCompare } from '../questionSlice'
import * as NavigationService from 'services/navigation'

import { AppButton, AppText, CompareItem } from 'components'
import { getQuestions, readCompare } from '../questionsSlice'

const styles = StyleSheet.create({
  container: {
    height: Dimensions.Height,
    width: Dimensions.Width,
    backgroundColor: Colors.white,
    flex: 1,
  },
  imageContainer: {
    flex: 1,
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  versus: {
    position: 'absolute',
    backgroundColor: 'white',
    height: 60,
    width: 60,
    borderRadius: 30,
    left: Dimensions.Width / 2.37,
    top: Dimensions.Height / 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
})

export const CompareDetail = () => {
  const dispatch = useDispatch()
  const compare = useSelector((state) => state.question.compare)
  const user = useSelector((state) => state.auth.user)

  const [isVoted, setIsVoted] = useState(false)
  const [selectedOption, setSelectedOption] = useState(null)
  const [votes, setVotes] = useState({})

  useEffect(() => {
    if (compare) {
      dispatch(readCompare(compare._id))
    }
  }, [dispatch, compare])

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

  const buttonOnPress = () => {
    if (isVoted) {
      dispatch(getQuestions())
      return NavigationService.goBack()
    }
    if (selectedOption === null) return alert('You have to select a picture!')
    dispatch(voteCompare(selectedOption))
  }

  const imageOnPress = (index) => {
    setSelectedOption(index)
  }

  if (!compare) return null
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <AppText
        color={'black'}
        fontSize={FontSize.xxxLarge}
        weight="medium"
        style={{ paddingLeft: 10, marginBottom: 30, marginTop: 10 }}>
        {compare.question
          ? compare.question
          : 'What do you about this compare?'}
      </AppText>
      <View style={styles.imageContainer}>
        <CompareItem
          image={compare?.images[0]}
          onPress={() => imageOnPress(0)}
          selected={selectedOption === 0}
          voteNumber={votes[0] ? parseInt(votes[0].toFixed(0)) : 0}
          isVoted={isVoted}
          isResult
          isCreator={compare.userPhoneNumber === user.phoneNumber}
        />
        <CompareItem
          image={compare?.images[1]}
          onPress={() => imageOnPress(1)}
          selected={selectedOption === 1}
          voteNumber={votes[1] ? parseInt(votes[1].toFixed(0)) : 0}
          isVoted={isVoted}
          isResult
          isCreator={compare.userPhoneNumber === user.phoneNumber}
        />
        <View style={styles.versus}>
          <AppText
            fontSize={FontSize.xxxLarge}
            weight="bold"
            color={Colors.primary}>
            VS
          </AppText>
        </View>
      </View>
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

CompareDetail.propTypes = {}

export default CompareDetail
