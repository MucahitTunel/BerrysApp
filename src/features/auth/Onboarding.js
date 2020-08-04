import React, { useState } from 'react'
import { View, StyleSheet, Linking } from 'react-native'
import LinearGradient from 'react-native-linear-gradient'
import Swiper from 'react-native-swiper'
import { AppButton, AppImage, AppLink, AppText } from 'components'
import SignInModal from 'features/auth/SignInModal'
import Constants from 'constants'
import Images from 'assets/images'
import Theme from 'theme'
import { useSelector } from 'react-redux'

const linearGradient = [Constants.Colors.primary, Constants.Colors.primaryLight]

const styles = StyleSheet.create({
  btnView: {
    flex: 1,
    paddingHorizontal: 24,
  },
  linkView: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
})

const Onboarding = () => {
  const loading = useSelector((state) => state.auth.loading)
  const user = useSelector((state) => state.auth.user)
  const [isVisibleSignInModal, setIsVisibleSignInModal] = useState(false)
  const openPrivacyPolicyLink = () =>
    Linking.openURL(Constants.Misc.PrivacyPolicyURL)
  const openSignInModal = () => {
    setTimeout(() => {
      setIsVisibleSignInModal(true)
    }, 500)
  }
  const closeSignInModal = () => setIsVisibleSignInModal(false)
  return (
    <LinearGradient
      style={{ flex: 1 }}
      colors={linearGradient}
      start={{ x: 0.5, y: 0.25 }}
      end={{ x: 0.5, y: 0.75 }}>
      <View style={{ flex: 3 }}>
        <Swiper
          showsButtons={false}
          loop={false}
          activeDotColor="#fff"
          dotStyle={Theme.Slider.dot}
          activeDotStyle={Theme.Slider.activeDot}
          dotColor="rgba(255, 255, 255, 0.5)"
          dotColorAcitve="rgba(255, 255, 255, 1)">
          <View style={Theme.Slider.item}>
            <View style={{ flex: 211 }} />
            <AppImage source={Images.logoWhite} width={120} height={140} />
            <AppText
              text="GET ANSWERS TO ANY OF YOUR"
              style={{
                ...Theme.Slider.itemTitle,
                paddingTop: 50,
              }}
            />
            <AppText text="PERSONAL QUESTIONS" style={Theme.Slider.itemTitle} />
            <View style={{ flex: 216 }} />
          </View>
          <View style={Theme.Slider.item}>
            <AppImage
              source={Images.onboarding2}
              width={Constants.Dimensions.Width}
              height={Constants.Dimensions.Height}
            />
          </View>
          <View style={Theme.Slider.item}>
            <AppImage
              source={Images.onboarding3}
              width={Constants.Dimensions.Width}
              height={Constants.Dimensions.Height}
            />
          </View>
        </Swiper>
      </View>
      <View style={{ flex: 1 }}>
        <View style={styles.btnView}>
          <AppButton
            text="CONTINUE"
            borderRadius={Constants.Styles.BorderRadius.large}
            onPress={openSignInModal}
            isLoading={loading || (user && user.isVerifying)}
          />
        </View>
        <View style={styles.linkView}>
          <AppLink
            text="By continuing, you agree to the Terms of Service and Privacy Policy"
            color="rgba(255, 255, 255, 0.6)"
            fontSize={11}
            style={{ marginBottom: 10 }}
            onPress={openPrivacyPolicyLink}
          />
        </View>
      </View>
      <SignInModal
        isVisible={isVisibleSignInModal}
        onClose={closeSignInModal}
      />
    </LinearGradient>
  )
}

export default Onboarding
