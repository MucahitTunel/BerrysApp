import React, { useRef, useState } from 'react'
import { StyleSheet, View, SafeAreaView, Image } from 'react-native'
import Swiper from 'react-native-swiper'
import { AppButton } from 'components'
import { Colors, Dimensions } from 'constants'
import Images from 'assets/images'
import { useDispatch } from 'react-redux'
import { setOnBoarding } from './authSlice'

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
    image: Images.onboarding3,
  },
  {
    id: 3,
    image: Images.onboarding4,
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
})

const AppOnboarding = () => {
  const dispatch = useDispatch()
  const [swiperIndex, setSwiperIndex] = useState(0)
  const swiperRef = useRef(null)

  const handleNextSwiper = () => {
    if (swiperIndex >= slider.length - 1) {
      dispatch(setOnBoarding(false))
      return
    }
    swiperRef.current.scrollBy(1)
    setSwiperIndex(swiperIndex + 1)
  }
  const getCurrentIndex = (currentIndex) => {
    setSwiperIndex(currentIndex)
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
            return (
              <View
                style={{ alignItems: 'center', paddingTop: 10 }}
                key={slide.id}>
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
          })}
        </Swiper>
      </View>
      <View style={styles.bottomViewWrapper}>
        <View style={styles.bottomView}>
          <AppButton
            onPress={handleNextSwiper}
            text={swiperIndex === 3 ? 'Continue to App' : 'Next'}
            style={{ flex: 1 }}
          />
        </View>
      </View>
    </SafeAreaView>
  )
}

export default AppOnboarding
