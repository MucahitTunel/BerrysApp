import React, { useRef, useState } from 'react'
import { StyleSheet, View, SafeAreaView, Linking } from 'react-native'
import Swiper from 'react-native-swiper'
import { AppButton, AppImage, AppLink, AppText } from 'components'
import SignInModal from 'features/auth/SignInModal'
import { Colors } from 'constants'
import Images from 'assets/images'
import Theme from 'theme'

const slider = [
  {
    id: 0,
    image: Images.newSignin,
    title: 'Ask Like-minded People, Anonymously or Openly',
    description: 'Get Their Honest Opinion',
  },
]

const styles = StyleSheet.create({
  bottomViewWrapper: {
    paddingHorizontal: 16,
  },
  bottomView: {
    height: 90,
    borderTopWidth: 1,
    borderTopColor: Colors.grayLight,
    justifyContent: 'center',
  },
})

const Onboarding = () => {
  const [isVisibleSignInModal, setIsVisibleSignInModal] = useState(false)
  const [swiperIndex, setSwiperIndex] = useState(0)
  const swiperRef = useRef(null)

  const openSignInModal = () => {
    setTimeout(() => {
      setIsVisibleSignInModal(true)
    }, 500)
  }
  const closeSignInModal = () => setIsVisibleSignInModal(false)
  const handleNextSwiper = () => {
    if (swiperIndex >= slider.length - 1) {
      openSignInModal()
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
        backgroundColor: 'white',
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
              <View style={Theme.Slider.item} key={slide.id}>
                <View style={Theme.Slider.imagesView}>
                  <AppImage
                    source={Images.logo}
                    width={160}
                    height={40}
                    style={{ marginBottom: '10%', marginTop: 20 }}
                  />
                  <AppImage source={slide.image} width={300} height={300} />
                </View>
                <View style={Theme.Slider.textView}>
                  <AppText text={slide.title} style={Theme.Slider.itemTitle}>
                    {slide.title}
                  </AppText>
                  <AppText style={Theme.Slider.itemDescription}>
                    {slide.description}
                  </AppText>
                </View>
              </View>
            )
          })}
        </Swiper>
      </View>
      <View style={styles.bottomViewWrapper}>
        <View style={styles.bottomView}>
          <AppButton
            text="Continue"
            onPress={handleNextSwiper}
            style={{ backgroundColor: Colors.purple }}
          />
        </View>
      </View>
      <SignInModal
        isVisible={isVisibleSignInModal}
        onClose={closeSignInModal}
      />
    </SafeAreaView>
  )
}

export default Onboarding
