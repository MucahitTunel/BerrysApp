import React, { useRef, useState } from 'react'
import { StyleSheet, View, SafeAreaView } from 'react-native'
import Swiper from 'react-native-swiper'
import { AppButton, AppImage, AppLink, AppText } from 'components'
import SignInModal from 'features/auth/SignInModal'
import { Colors } from 'constants'
import Images from 'assets/images'
import Theme from 'theme'
import { useSelector } from 'react-redux'

const slider = [
  {
    id: 0,
    image: Images.carousel1,
    title: 'Ask Anonymously',
    description: 'Ask Anonymously your Friends, Family and Peers',
  },
  {
    id: 1,
    image: Images.carousel2,
    title: 'Select Contacts to Ask',
    description: 'Get honest answers for your awkward and sensitive questions',
  },
  {
    id: 2,
    image: Images.carousel3,
    title: 'Get Honest Answers',
    description: 'Ask anonymously & publicly. Ask only people selected by you',
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
  const loading = useSelector((state) => state.auth.loading)
  const user = useSelector((state) => state.auth.user)
  const [isVisibleSignInModal, setIsVisibleSignInModal] = useState(false)
  const [swiperIndex, setSwiperIndex] = useState(0)
  const swiperRef = useRef(null)
  console.log('swiperRef', swiperRef)
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
          scrollEnabled={false}>
          {slider.map((slide) => {
            return (
              <View style={Theme.Slider.item} key={slide.id}>
                <View style={Theme.Slider.imagesView}>
                  <AppImage
                    source={Images.logo}
                    width={102}
                    height={30}
                    style={{ marginBottom: '40%' }}
                  />
                  <AppImage source={slide.image} width={190} height={194} />
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
