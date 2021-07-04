import React, { useEffect, useState } from 'react'
import {
  View,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  Image,
  TouchableOpacity,
} from 'react-native'
import { Layout, AppText, AppButton } from 'components'
import { Dimensions, Colors } from 'constants'
import { useSelector, useDispatch } from 'react-redux'
import request from 'services/api'
import Images from 'assets/images'
import { submitSurvey } from 'features/auth/authSlice'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: Dimensions.Height,
    width: Dimensions.Width,
  },
  flatlist: {
    paddingHorizontal: 30,
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    paddingHorizontal: 15,
    borderRadius: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1.5 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 1,
    backgroundColor: 'white',
    marginRight: 10,
    marginBottom: 20,
  },
  icon: {
    resizeMode: 'contain',
    height: 20,
    width: 20,
    marginRight: 5,
  },
  button: {
    marginHorizontal: 20,
    marginBottom: 20,
  },
})

const INTERESTS = [
  'art',
  'chess',
  'cooking',
  'cycling',
  'dancing',
  'drawing',
  'fishing',
  'entrepreneurship',
  'golfing',
  'hiking',
  'hunting',
  'kayaking',
  'knitting',
  'weight lifting',
  'martial arts',
  'military',
  'painting',
  'parenting',
  'programming',
  'photography',
  'poker',
  'politics',
  'running',
  'robotics',
  'technology',
  'business news',
]

const MySkipped = () => {
  const dispatch = useDispatch()
  const user = useSelector((state) => state.auth.user)

  const [survey, setSurvey] = useState(null)
  const [interests, setInterests] = useState([])

  const getInterests = async () => {
    const { data } = await request({
      method: 'GET',
      url: 'account/interests',
      params: {
        userPhoneNumber: user.phoneNumber,
      },
    })
    const { interests } = data
    setSurvey(data)
    setInterests(interests ? interests : [])
  }

  const saveInterests = async () => {
    dispatch(
      submitSurvey({
        value: survey.value,
        data: { ...survey.data, interests },
        bypassOnboarding: true,
      }),
    )
    alert('Your new interests are saved!')
  }

  useEffect(() => {
    getInterests()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const getIcon = (interest) => {
    switch (interest) {
      case 'art':
        return Images.interestArt
      case 'chess':
        return Images.interestChess
      case 'cooking':
        return Images.interestCooking
      case 'cycling':
        return Images.interestCycling
      case 'dancing':
        return Images.interestDancing
      case 'drawing':
        return Images.interestDrawing
      case 'fishing':
        return Images.interestFishing
      case 'entrepreneurship':
        return Images.interestEntrepreneurship
      case 'golfing':
        return Images.interestGolfing
      case 'hiking':
        return Images.interestHiking
      case 'hunting':
        return Images.interestHunting
      case 'kayaking':
        return Images.interestKayaking
      case 'knitting':
        return Images.interestKnitting
      case 'weight lifting':
        return Images.interestWeightlifting
      case 'martial arts':
        return Images.interestMartialArts
      case 'military':
        return Images.interestMilitary
      case 'painting':
        return Images.interestPainting
      case 'parenting':
        return Images.interestParenting
      case 'programming':
        return Images.interestProgramming
      case 'photography':
        return Images.interestPhotography
      case 'poker':
        return Images.interestPoker
      case 'politics':
        return Images.interestPolitics
      case 'running':
        return Images.interestRunning
      case 'robotics':
        return Images.interestRobotics
      case 'technology':
        return Images.interestTechnology
      case 'business news':
        return Images.interestBusinessNews
    }
  }

  const interestOnPress = (interest) => {
    if (interests.includes(interest))
      setInterests(interests.filter((i) => i !== interest))
    else setInterests([...interests, interest])
  }

  const renderInterests = (item, isActive) => {
    return (
      <TouchableOpacity
        style={[
          styles.itemContainer,
          {
            backgroundColor: isActive ? 'white' : Colors.grayLight,
          },
        ]}
        onPress={() => interestOnPress(item)}>
        <Image source={getIcon(item.toLowerCase())} style={styles.icon} />
        <AppText weight="medium" color={isActive ? 'black' : Colors.gray}>
          {item
            .split(' ')
            .map((i) => i.charAt(0).toUpperCase() + i.slice(1))
            .join(' ')}
        </AppText>
      </TouchableOpacity>
    )
  }

  return (
    <Layout>
      <SafeAreaView style={styles.container}>
        <ScrollView
          contentContainerStyle={{
            flexDirection: 'row',
            alignItems: 'center',
            paddingHorizontal: 20,
            flexWrap: 'wrap',
            paddingVertical: 5,
          }}
          style={{ flex: 1 }}>
          {interests.map((i) => {
            return renderInterests(i, true)
          })}
          {INTERESTS.filter((i) => !interests.includes(i)).map((i) => {
            return renderInterests(i, false)
          })}
        </ScrollView>
        <AppButton
          text="Save Interests"
          style={styles.button}
          onPress={saveInterests}
        />
      </SafeAreaView>
    </Layout>
  )
}

export default MySkipped
