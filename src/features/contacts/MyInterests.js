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
  'weight lifting',
  'martial arts',
  'painting',
  'parenting',
  'programming',
  'photography',
  'poker',
  'politics',
  'running',
  'technology',
  'business news',
  'camping',
  'cars',
  'gardening',
  'meditation',
  'musical instrument',
  'singing',
  'skiing',
  'skydiving',
  'theater',
  'writing',
  'boardgames',
  'chess',
  'skating',
  'basketball',
  'baseball',
  'volleyball',
  'football',
  'soccer',
  'tennis',
  'snowboarding',
  'traveling',
  'checkers',
  'monopoly',
  'hockey',
  'cricket',
  'table tennis',
  'golf',
  'climbing',
  'yoga',
  'reading',
  'food',
  'pets',
  'music',
  'movies',
  'video games',
  'fitness',
  // 'working out',
  // 'gym',
  // 'watching sports',
  'socializing',
  'watches',
  'jewelry',
  'collectibles',
  'boating',
  'wine',
  'fashion & style',
  // 'culinary',
  'auto repairs',
  'antiques',
  'genealogy',
  'home improvement',
  'chess',
  'knitting',
  'military',
  'robotics',
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
      case 'antiques':
        return Images.interestAntique
      case 'baseball':
        return Images.interestBaseball
      case 'basketball':
        return Images.interestBasketball
      case 'boardgames':
        return Images.interestBoardGames
      case 'boating':
        return Images.interestBoating
      case 'camping':
        return Images.interestCamping
      case 'cars':
        return Images.interestCar
      case 'auto repairs':
        return Images.interestCarRepair
      case 'checkers':
        return Images.interestChecker
      case 'climbing':
        return Images.interestClimbing
      case 'cricket':
        return Images.interestCricket
      case 'fashion & style':
        return Images.interestFashion
      case 'fitness':
        return Images.interestFitness
      case 'food':
        return Images.interestFood
      case 'football':
        return Images.interestFootball
      case 'gardening':
        return Images.interestGardening
      case 'genealogy':
        return Images.interestGenealogy
      case 'golf':
        return Images.interestGolf
      case 'hockey':
        return Images.interestHockey
      case 'jewelry':
        return Images.interestJewelry
      case 'meditation':
        return Images.interestMeditation
      case 'monopoly':
        return Images.interestMonopoly
      case 'movies':
        return Images.interestMovies
      case 'music':
        return Images.interestMusic
      case 'musical instrument':
        return Images.interestMusicalInsturments
      case 'pets':
        return Images.interestPet
      case 'reading':
        return Images.interestReading
      case 'singing':
        return Images.interestSinging
      case 'skating':
        return Images.interestSkating
      case 'skiing':
        return Images.interestSkiing
      case 'skydiving':
        return Images.interestSkydiving
      case 'snowboarding':
        return Images.interesSnowboarding
      case 'soccer':
        return Images.interestSoccer
      case 'socializing':
        return Images.interestSocializing
      case 'table tennis':
        return Images.interestTableTennis
      case 'tennis':
        return Images.interestTennis
      case 'theater':
        return Images.interestTheater
      case 'traveling':
        return Images.interestTraveling
      case 'video games':
        return Images.interestVideogame
      case 'volleyball':
        return Images.interestVolleyball
      case 'watches':
        return Images.interestWatches
      case 'wine':
        return Images.interestWine
      case 'writing':
        return Images.interestWriting
      case 'yoga':
        return Images.interestYoga
      case 'collectibles':
        return Images.interestCollectible
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
        {getIcon(item.toLowerCase()) && (
          <Image source={getIcon(item.toLowerCase())} style={styles.icon} />
        )}
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
