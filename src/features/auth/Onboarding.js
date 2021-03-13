import React, { useRef, useState, useEffect } from 'react'
import { StyleSheet, View, SafeAreaView } from 'react-native'
import Swiper from 'react-native-swiper'
import { AppButton, AppImage, AppLink, AppText } from 'components'
import SignInModal from 'features/auth/SignInModal'
import { Colors, Dimensions } from 'constants'
import Images from 'assets/images'
import Theme from 'theme'

const slider = [
  {
    id: 0,
    image: Images.newCarousel1,
    title: 'Ask Questions',
    description: 'Ask our experts or people you now any questions you have',
  },
  {
    id: 1,
    image: Images.newCarousel2,
    title: 'Chat Anonymously',
    description: 'Get honest answers for your awkward and sensitive questions',
  },
  {
    id: 2,
    image: Images.newCarousel3,
    title: 'Join Groups',
    description: 'Create your own groups or join one to discuss any topic',
  },
  {
    id: 3,
    image: Images.newCarousel4,
    title: 'Answer Questions',
    description: 'Get questions from people and earn points for answering',
  },
]

const styles = StyleSheet.create({
  bottomViewWrapper: {
    paddingHorizontal: 16,
    backgroundColor: Colors.white,
  },
  bottomView: {
    height: 90,
    borderTopWidth: 1,
    borderTopColor: Colors.grayLight,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
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
        backgroundColor: Colors.background,
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
                    width={102}
                    height={30}
                    style={{ marginTop: '10%', marginBottom: 10 }}
                  />
                  <AppImage
                    source={slide.image}
                    width={Dimensions.Width}
                    height={350}
                  />
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
          <AppLink
            text={swiperIndex !== 2 ? 'Skip' : ''}
            color={Colors.primary}
            onPress={openSignInModal}
            style={{ minWidth: 60 }}
          />
          <View style={Theme.Slider.dotWrapper}>
            {slider.map((slide) => (
              <View
                key={slide.id}
                style={[
                  Theme.Slider.dot,
                  slide.id === swiperIndex && {
                    backgroundColor: Colors.primary,
                  },
                ]}
              />
            ))}
          </View>
          <AppButton icon={'arrow-forward'} onPress={handleNextSwiper} />
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
