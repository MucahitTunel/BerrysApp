/* eslint-disable */
import React, { useEffect, useState, useLayoutEffect } from 'react'
import { useDispatch } from 'react-redux'
import { StatusBar, StyleSheet, View, SafeAreaView, Image, ScrollView } from 'react-native'
import { AppButton, AppText, ScaleTouchable, SimpleHeader } from 'components'
import { Dimensions, Colors, FontSize } from 'constants'
import Images from 'assets/images'
import { submitSurvey } from 'features/auth/authSlice'

const styles = StyleSheet.create({
  container: {
    height: Dimensions.Height,
    width: Dimensions.Width,
    flex: 1,
    backgroundColor: 'white'
  },
  surveyItem: {
    borderWidth: 1,
    borderColor: Colors.grayLight,
    borderRadius: 15,
    alignItems: 'center',
    paddingVertical: 30,
    paddingHorizontal: 35,
    backgroundColor: 'white',
  },
  surveyItemActive: {
    borderColor: Colors.purple,
    backgroundColor: Colors.purple,
  },
  surveyItemText: {
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 5,
  },
})

const Survey = ({ route, navigation }) => {
  const dispatch = useDispatch()

    const { value, data } = route.params

  const [interests, setInterests] = useState([])

  const onPressContinue = () => {
    dispatch(submitSurvey({ value, data: {...data, interests } }))
  }

  useLayoutEffect(() => {
    navigation.setOptions({
      header: () => (
        <View style={{ backgroundColor: 'white', height: 100, justifyContent: "flex-end", alignItems: 'center', marginBottom: 20}}>
            <AppText
                weight="bold"
                color="black"
                fontSize={FontSize.xxxLarge}
                style={{ marginBottom: 5}}
            >
                Choose your interests
            </AppText>
            <AppText
                color="#626579"
                weight="normal"
            >
                To be able to ask like-minded users
            </AppText>
        </View>
      ),
    })
  }, [navigation])

  const renderItem = (image, text, isSelected) => {
    
    const itemOnPress = () => {
        text = text.toLowerCase()
        if(interests.includes(text)) setInterests(interests.filter(i => i !== text))
        else setInterests([...interests, text])
    }

      return (
          <ScaleTouchable
            style={{
                flexDirection: 'row', alignItems: 'center',
                padding: 10,
                paddingHorizontal: 15,
                borderRadius: 30,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 1.5 },
                shadowOpacity: 0.2,
                shadowRadius: 2,
                elevation: 1,
                backgroundColor: interests.includes(text.toLowerCase()) ? Colors.purple : 'white',
                marginRight: 10,
                marginBottom: 20
            }}
            onPress={itemOnPress}
          >
              <Image source={image} style={{
                  resizeMode: 'contain',
                  height: 20,
                  width: 20,
                  marginRight: 5
              }}/>
              <AppText
                color={interests.includes(text.toLowerCase()) ? 'white' : Colors.purpleText}
              >
                  {text}
              </AppText>
          </ScaleTouchable>
      )
  }

  return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" />
        <ScrollView
          contentContainerStyle={{
            flexDirection: 'row',
            alignItems: 'center',
            // justifyContent: 'space-between',
            paddingHorizontal: 20,
            flexWrap: 'wrap',
            paddingVertical: 5,
          }} style={{ flex: 1 }}>
          {renderItem(Images.interestArt, 'Art')}
          {renderItem(Images.interestChess, 'Chess')}
          {renderItem(Images.interestCooking, 'Cooking')}
          {renderItem(Images.interestCycling, 'Cycling')}
          {renderItem(Images.interestDancing, 'Dancing')}
          {renderItem(Images.interestDrawing, 'Drawing')}
          {renderItem(Images.interestFishing, 'Fishing')}
          {renderItem(Images.interestEntrepreneurship, 'Entrepreneurship')}
          {renderItem(Images.interestGolfing, 'Golfing')}
          {renderItem(Images.interestHiking, 'Hiking')}
          {renderItem(Images.interestHunting, 'Hunting')}
          {renderItem(Images.interestKayaking, 'Kayaking')}
          {renderItem(Images.interestKnitting, 'Knitting')}
          {renderItem(Images.interestWeightlifting, 'Weight Lifting')}
          {renderItem(Images.interestMartialArts, 'Martial Arts')}
          {renderItem(Images.interestMilitary, 'Military')}
          {renderItem(Images.interestPainting, 'Painting')}
          {renderItem(Images.interestParenting, 'Parenting')}
          {renderItem(Images.interestProgramming, 'Programming')}
          {renderItem(Images.interestPhotography, 'Photography')}
          {renderItem(Images.interestPoker, 'Poker')}
          {renderItem(Images.interestPolitics, 'Politics')}
          {renderItem(Images.interestRunning, 'Running')}
          {renderItem(Images.interestRobotics, 'Robotics')}
          {renderItem(Images.interestTechnology, 'Technology')}
          {renderItem(Images.interestBusinessNews, 'Business News')}
        </ScrollView>
        <View
          style={{
            marginTop: 20,
            marginBottom: 16,
            paddingHorizontal: 16,
            justifyContent: 'flex-end',
            paddingBottom: 10,
          }}>
          <AppButton text="Continue" onPress={onPressContinue} style={{ marginBottom: 10}}/>
          <AppButton
          text="Skip for now"
          onPress={onPressContinue} style={{ backgroundColor: 'transparent'}}
            textStyle={{ color: '#AAA'}}
          />
        </View>
      </SafeAreaView>
  )
}

export default Survey
