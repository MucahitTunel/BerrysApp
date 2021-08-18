import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import PropTypes from 'prop-types'
import {
  View,
  Platform,
  Linking,
  StyleSheet,
  SafeAreaView,
  ScrollView,
} from 'react-native'
import Modal from 'react-native-modal'
import LinearGradient from 'react-native-linear-gradient'
import CountryPicker from 'react-native-country-picker-modal'
import { Formik } from 'formik'
import Theme from 'theme'
import { Colors, Misc, FontSize } from 'constants'
import {
  AppInput,
  AppButton,
  AppText,
  AppImage,
  AppIcon,
  AppLink,
} from 'components'
import { signIn } from 'features/auth/authSlice'
import Images from 'assets/images'
import ScaleTouchable from '../../components/ScaleTouchable'

import RNUxcam from 'react-native-ux-cam'
RNUxcam.tagScreenName('SignIn Modal')

const linearGradient = [Colors.purple, Colors.purple]

const styles = StyleSheet.create({
  countryPickerWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.44)',
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    height: 56,
    borderRadius: 7,
    padding: 10,
    marginBottom: 24,
    marginTop: 48,
  },
  flagWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRightWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    paddingRight: 10,
  },
})

const SignInModal = ({ isVisible, onClose }) => {
  const [country, setCountry] = useState(Misc.DefaultCountry)
  const [isOpenModal, setOpenModal] = useState(false)
  const dispatch = useDispatch()
  const onSubmit = (values, { setSubmitting }) => {
    setSubmitting(true)
    const { phoneNumber } = values
    const formattedPhoneNumber = `+${country.callingCode}${phoneNumber}`
    const payload = {
      phoneNumber: formattedPhoneNumber,
      countryCode: country.cca2,
      countryName: country.name,
    }
    dispatch(signIn(payload))
    setSubmitting(false)
    onClose()
  }
  const openPrivacyPolicyLink = () => Linking.openURL(Misc.PrivacyPolicyURL)
  return (
    <Modal
      isVisible={isVisible}
      backdropColor="transparent"
      style={Theme.Modal.modalView}
      hideModalContentWhileAnimating
      animationInTiming={200}
      animationOutTiming={200}>
      <LinearGradient
        colors={linearGradient}
        start={{ x: 0.25, y: 0.5 }}
        end={{ x: 0.75, y: 0.5 }}
        style={{ flex: 1, paddingHorizontal: 16, paddingTop: 40 }}>
        <SafeAreaView style={Theme.Modal.modalInnerView}>
          <View style={Theme.Modal.header}>
            <AppButton
              icon="close"
              iconSize={16}
              onPress={onClose}
              style={{ backgroundColor: 'transparent', height: 18, width: 18 }}
            />
            <AppImage
              source={Images.logo}
              style={{ tintColor: Colors.white }}
              width={102}
            />
            <View />
          </View>
          <View style={Theme.Modal.form}>
            <AppText fontSize={28} weight="bold" color={Colors.white}>
              Sign In
            </AppText>
            <AppText color={Colors.white}>
              Please enter your Phone number.
            </AppText>
            <Formik initialValues={{ phoneNumber: '' }} onSubmit={onSubmit}>
              {({ values, handleChange, handleSubmit, isSubmitting }) => (
                <React.Fragment>
                  <ScrollView
                    contentContainerStyle={styles.countryPickerWrapper}>
                    <View style={styles.flagWrapper}>
                      <CountryPicker
                        onSelect={(value) => setCountry(value)}
                        countryCode={country.cca2}
                        translation="eng"
                        withCallingCode
                        withFlagButton
                        withFilter
                        visible={isOpenModal}
                        onClose={() => setOpenModal(false)}
                      />
                      <ScaleTouchable
                        onPress={() => setOpenModal(true)}
                        style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <AppText
                          style={
                            Theme.Modal.phonePrefix
                          }>{`+${country.callingCode}`}</AppText>
                        <AppIcon
                          name="triangle"
                          color={Colors.white}
                          size={8}
                        />
                      </ScaleTouchable>
                    </View>
                    <View style={{ marginLeft: 6, flex: 1 }}>
                      <AppInput
                        autoFocus
                        keyboardType={
                          Platform.OS === 'ios' ? 'number-pad' : 'numeric'
                        }
                        placeholder="Phone Number"
                        placeholderTextColor="rgba(255, 255, 255, 0.5)"
                        onChange={handleChange('phoneNumber')}
                        value={values.phoneNumber}
                      />
                    </View>
                  </ScrollView>
                  <AppButton
                    text="Sign In"
                    disabled={isSubmitting || !values.phoneNumber}
                    onPress={handleSubmit}
                    style={{ backgroundColor: Colors.white, marginBottom: 10 }}
                    textStyle={{ color: Colors.purple }}
                  />
                  <AppText
                    fontSize={FontSize.normal}
                    color={Colors.white}
                    style={{ lineHeight: 24, marginTop: 24 }}>
                    {`By clicking Sign In, you agree to our `}
                    <AppLink
                      text="Privacy Policy"
                      color={Colors.white}
                      textStyle={{
                        fontSize: FontSize.normal,
                        textDecorationLine: 'underline',
                      }}
                      onPress={openPrivacyPolicyLink}
                    />
                    {` and `}
                    <AppLink
                      text="Terms and Conditions"
                      color={Colors.white}
                      textStyle={{
                        fontSize: FontSize.normal,
                        textDecorationLine: 'underline',
                      }}
                      onPress={openPrivacyPolicyLink}
                    />
                  </AppText>
                </React.Fragment>
              )}
            </Formik>
          </View>
        </SafeAreaView>
      </LinearGradient>
    </Modal>
  )
}

SignInModal.propTypes = {
  isVisible: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
}

export default SignInModal
