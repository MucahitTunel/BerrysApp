import React, { useEffect, useState } from 'react'
import { View, ScrollView, StyleSheet, SafeAreaView, Image } from 'react-native'
import { Layout, AppText } from 'components'
import { Dimensions } from 'constants'
import { useSelector } from 'react-redux'
import request from 'services/api'
import Images from 'assets/images'

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
})

const MySkipped = () => {
  const user = useSelector((state) => state.auth.user)

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
    setInterests(interests ? interests : [])
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

  const renderInterests = (item) => {
    return (
      <View style={styles.itemContainer}>
        <Image source={getIcon(item.toLowerCase())} style={styles.icon} />
        <AppText weight="medium" color="black">
          {item
            .split(' ')
            .map((i) => i.charAt(0).toUpperCase() + i.slice(1))
            .join(' ')}
        </AppText>
      </View>
    )
  }

  return (
    <Layout>
      <SafeAreaView style={styles.container}>
        <ScrollView
          contentContainerStyle={{
            flexDirection: 'row',
            alignItems: 'center',
            // justifyContent: 'space-between',
            paddingHorizontal: 20,
            flexWrap: 'wrap',
            paddingVertical: 5,
          }}
          style={{ flex: 1 }}>
          {interests.map((i) => {
            return renderInterests(i)
          })}
        </ScrollView>
      </SafeAreaView>
    </Layout>
  )
}

export default MySkipped
