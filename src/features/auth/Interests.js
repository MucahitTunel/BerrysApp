/* eslint-disable */
import React, { useState } from 'react'
import { StatusBar, StyleSheet, View, SafeAreaView, Image, ScrollView } from 'react-native'
import { AppButton, AppText, ScaleTouchable, SimpleHeader } from 'components'
import { Dimensions, Colors, FontSize, Screens } from 'constants'
import Images from 'assets/images'
import Modal from 'react-native-modal'
import Theme from 'theme'
import { BlurView } from '@react-native-community/blur'

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

const mainInterests = [
  'Art',
  'Cooking',
  'Cycling',
  'Dancing',
  'Drawing',
  'Fishing',
  'Entrepreneurship',
  'Golfing',
  'Hiking',
  'Hunting',
  'Kayaking',
  'Weight Lifting',
  'Martial Arts',
  'Painting',
  'Parenting',
  'Programming',
  'Photography',
  'Poker',
  'Politics',
  'Running',
  'Technology',
  'Business News',
]
const extraInterests = [
  'Camping',
'Cars',
'Gardening',
'Meditation',
'Musical Instrument',
'Singing',
'Skiing',
'Skydiving',
'Theater',
'Writing',
'Boardgames',
'Chess',
'Skating',
'Basketball',
'Baseball',
'Volleyball',
'Football',
'Soccer',
'Tennis',
'Snowboarding',
'Traveling',
'Checkers',
'Monopoly',
'Hockey',
'Cricket',
'Table tennis',
'Golf',
'Climbing',
'Yoga',
'Reading',
'Food',
'Pets',
'Music',
'Movies',
'Video Games',
'Fitness',
'Working out',
'Gym',
'Watching Sports',
'Socializing',
'Watches',
'Jewelry',
'Collectibles',
'Boating',
'Wine',
'Fashion & style',
'Culinary',
'Auto Repairs',
'Antiques',
'Genealogy',
'Home Improvement',
'Chess',
'Knitting',
'Military',
'Robotics'
]

const Survey = ({ route, navigation }) => {
  // const dispatch = useDispatch()

    // const { value, data } = route.params

  const [interests, setInterests] = useState([])
  const [isModalVisible, setIsModalVisible] = useState(false)

  const onPressContinue = () => {
    navigation.navigate(Screens.Permissions, {
      surveyData: { interests: interests.map(i => i.toLowerCase()) }
    })
    // dispatch(submitSurvey({ /* value,  */data: {/* ...data,  */interests } }))
  }

  const renderItem = (image, text, isModal = false) => {
    
    const itemOnPress = () => {
      
        if(isModal) {
          return setIsModalVisible(true)
        }

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
                backgroundColor: interests.includes(text) ? Colors.purple : 'white',
                marginRight: 10,
                marginBottom: 20
            }}
            onPress={itemOnPress}
          >
              {/* <Image source={image} style={{
                  resizeMode: 'contain',
                  height: 20,
                  width: 20,
                  marginRight: 5
              }}/> */}
              <AppText
                color={interests.includes(text) ? 'white' : Colors.purpleText}
              >
                  {text}
              </AppText>
          </ScaleTouchable>
      )
  }

  return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" />
        <View style={{ backgroundColor: 'white', height: 60, justifyContent: "flex-end", alignItems: 'center', marginBottom: 10}}>
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
        <ScrollView
          contentContainerStyle={{
            flexDirection: 'row',
            alignItems: 'center',
            // justifyContent: 'space-between',
            paddingHorizontal: 20,
            flexWrap: 'wrap',
            paddingVertical: 5,
          }} style={{ flex: 1 }}>
            {interests.map(i => {
              return renderItem(null, i)
            })}
          {mainInterests.filter(i => !interests.includes(i)).map(i => {
            return renderItem(null, i)
          })}
          {renderItem(Images.interestBusinessNews, 'Show More...', true)}
        </ScrollView>
        <View
          style={{
            marginTop: 20,
            marginBottom: 16,
            paddingHorizontal: 16,
            justifyContent: 'flex-end',
            paddingBottom: 10,
          }}>
          <AppButton text="Continue" onPress={onPressContinue} style={{ marginBottom: 10}} disabled={interests.length === 0}/>
          {/* <AppButton
          text="Skip for now"
          onPress={onPressContinue} style={{ backgroundColor: 'transparent'}}
            textStyle={{ color: '#AAA'}}
          /> */}
        </View>

        <Modal
      isVisible={isModalVisible}
      style={[Theme.Modal.modalView]}
      animationInTiming={300}
      animationOutTiming={300}>
      <View style={Theme.Modal.modalInnerView}>
        <View style={{
              position: 'absolute',
              top: 0,
              left: 0,
              height: '100%',
              width: '100%',
              flex: 1,
        }}>
          <BlurView style={{ flex: 1 }} blurType="light" blurAmount={1} />
        </View>
        <ScrollView
          contentContainerStyle={{
            flexDirection: 'row',
            alignItems: 'center',
            // justifyContent: 'space-between',
            paddingHorizontal: 20,
            flexWrap: 'wrap',
            paddingVertical: 5,
            paddingTop: 40
          }} style={{ flex: 1 }}>
            {extraInterests.map(i => {
              return renderItem(null, i)
            })}
        </ScrollView>
        <AppButton text="Continue" onPress={() => setIsModalVisible(false)} style={{ marginBottom: 50, marginHorizontal: 15 }} />
        </View>
      </Modal>

      </SafeAreaView>
  )
}

export default Survey
