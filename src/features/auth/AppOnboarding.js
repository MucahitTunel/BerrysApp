import React, { useRef, useState, useEffect } from 'react'
import { StyleSheet, View, SafeAreaView, Image } from 'react-native'
import Swiper from 'react-native-swiper'
import { AppButton, AppText, AppInput } from 'components'
import { Colors, Dimensions, FontSize, Screens } from 'constants'
import Images from 'assets/images'
import { useDispatch } from 'react-redux'
import { setOnBoarding } from './authSlice'
import * as NavigationService from '../../services/navigation'
import { loadContacts } from 'features/contacts/contactsSlice'

const slider = [
  {
    id: 0,
    image: Images.onboarding1,
  },
  {
    id: 1,
    image: Images.onboarding2,
  },
  {
    id: 2,
    image: Images.onboarding4,
  },
  {
    id: 3,
    title: 'Get more answer(s) to your questions',
    subTitle: `by inviting more contacts to use Berry's`,
  },
]

const styles = StyleSheet.create({
  bottomViewWrapper: {
    paddingHorizontal: 16,
    backgroundColor: Colors.white,
    marginBottom: 10,
  },
  bottomView: {
    height: 65,
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    paddingHorizontal: 20,
    borderWidth: 1,
    borderColor: Colors.gray,
    color: Colors.text,
    marginHorizontal: 30,
    marginTop: 30,
    marginBottom: 20,
    backgroundColor: 'white',
  },
  nameContainer: {
    borderColor: Colors.primary,
    borderWidth: 1.5,
    width: '90%',
    marginVertical: 50,
    borderRadius: 10,
    paddingVertical: 35,
  },
})

const AppOnboarding = () => {
  const dispatch = useDispatch()
  const [swiperIndex, setSwiperIndex] = useState(0)
  const swiperRef = useRef(null)

  const [name, setName] = useState('')

  useEffect(() => {
    // dispatch(loadContacts())
  }, [dispatch])

  const handleNextSwiper = () => {
    if (swiperIndex >= slider.length - 1) {
      navigateContactList()
      return
    }
    swiperRef.current.scrollBy(1)
    setSwiperIndex(swiperIndex + 1)
  }
  const getCurrentIndex = (currentIndex) => {
    setSwiperIndex(currentIndex)
  }

  const renderImage = (slide) => {
    return (
      <View style={{ alignItems: 'center', paddingTop: 10 }} key={slide.id}>
        <View
          style={{
            height: Dimensions.Height / 1.2,
            width: Dimensions.Width / 1.1,
            borderRadius: 10,
            borderColor: Colors.gray,
            borderWidth: 1,
          }}>
          <Image
            source={slide.image}
            style={{
              resizeMode: 'stretch',
              height: undefined,
              width: undefined,
              flex: 1,
              borderRadius: 6,
            }}
          />
        </View>
      </View>
    )
  }

  const renderNameInput = (slide) => {
    return (
      <View style={{ alignItems: 'center', paddingTop: 30 }} key={slide.id}>
        <AppText
          color="black"
          weight="medium"
          fontSize={FontSize.xxLarge}
          style={{ textAlign: 'center' }}>
          {slide.title}
        </AppText>
        <AppText
          color="black"
          fontSize={FontSize.large}
          style={{ textAlign: 'center', paddingHorizontal: 30, marginTop: 10 }}>
          {slide.subTitle}
        </AppText>
        <View style={styles.nameContainer}>
          <AppText
            color="black"
            fontSize={FontSize.xxLarge}
            style={{ textAlign: 'center' }}>
            Hey, this is me...
          </AppText>
          <AppInput
            style={styles.input}
            placeholder="Enter your name..."
            placeholderTextColor={Colors.gray}
            value={name}
            onChange={(value) => setName(value)}
          />
          <AppText
            color="black"
            fontSize={FontSize.large}
            style={{
              textAlign: 'center',
              marginTop: 40,
              marginHorizontal: 20,
            }}>
            I'm using Berry's to anonymously post and share. It's more fun and
            helpful to you use it together!
          </AppText>
        </View>
        <AppButton
          onPress={() => dispatch(setOnBoarding(false))}
          text="Skip"
          style={{ backgroundColor: 'transparent' }}
          textStyle={{ color: Colors.primary }}
        />
      </View>
    )
  }

  const navigateContactList = () => {
    if (name === '') return alert('Please enter your name')
    NavigationService.navigate(Screens.SelectContacts, {
      submitText: 'Select Contacts',
      isOnboarding: true,
      showGroups: false,
      onboardingName: name,
    })
  }

  return (
    <SafeAreaView
      style={{
        flex: 1,
        flexDirection: 'column',
        backgroundColor: Colors.white,
      }}>
      <View style={{ flex: 5 }}>
        <Swiper
          ref={swiperRef}
          showsButtons={false}
          loop={false}
          showsPagination={false}
          activeDotColor={Colors.primary}
          onIndexChanged={(index) => getCurrentIndex(index)}>
          {slider.map((slide) => {
            if (slide.id !== 3) return renderImage(slide)
            else return renderNameInput(slide)
          })}
        </Swiper>
      </View>
      <View style={styles.bottomViewWrapper}>
        <View style={styles.bottomView}>
          <AppButton
            onPress={handleNextSwiper}
            text={swiperIndex === 3 ? 'Send' : 'Next'}
            style={{ flex: 1 }}
          />
        </View>
      </View>
    </SafeAreaView>
  )
}

export default AppOnboarding
