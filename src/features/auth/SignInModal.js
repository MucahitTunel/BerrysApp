import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import PropTypes from 'prop-types'
import { View, Platform, Linking } from 'react-native'
import Modal from 'react-native-modal'
import LinearGradient from 'react-native-linear-gradient'
import CountryPicker from 'react-native-country-picker-modal'
import { Formik } from 'formik'
import Theme from 'theme'
import { Colors, Misc, Styles } from 'constants'
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
import Fonts from 'assets/fonts'

const linearGradient = [Colors.primary, 'rgb(235, 67, 75)']

const SignInModal = ({ isVisible, onClose }) => {
  const [country, setCountry] = useState(Misc.DefaultCountry)
  const dispatch = useDispatch()
  const onSubmit = (values, { setSubmitting }) => {
    setSubmitting(true)
    const { phoneNumber } = values
    const formattedPhoneNumber = `+${country.callingCode}${phoneNumber}`
    const payload = {
      phoneNumber: formattedPhoneNumber,
      countryCode: country.cca2,
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
        <View style={Theme.Modal.modalInnerView}>
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
            <AppText
              fontSize={28}
              fontFamily={Fonts.euclidCircularASemiBold}
              color={Colors.white}>
              Sign In
            </AppText>
            <AppText color={Colors.white}>
              Please enter your Phone number.
            </AppText>
            <Formik initialValues={{ phoneNumber: '' }} onSubmit={onSubmit}>
              {({ values, handleChange, handleSubmit, isSubmitting }) => (
                <React.Fragment>
                  <View
                    style={{
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
                    }}>
                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        borderRightWidth: 1,
                        borderColor: 'rgba(255, 255, 255, 0.3)',
                        paddingRight: 10,
                      }}>
                      <CountryPicker
                        onSelect={(value) => setCountry(value)}
                        countryCode={country.cca2}
                        translation="eng"
                        withCallingCode
                        withFlagButton
                        withFilter
                      />
                      <AppText
                        style={
                          Theme.Modal.phonePrefix
                        }>{`+${country.callingCode}`}</AppText>
                      <AppIcon name="triangle" color={Colors.white} size={8} />
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
                  </View>
                  <AppButton
                    text="Sign In"
                    disabled={isSubmitting || !values.phoneNumber}
                    onPress={handleSubmit}
                    style={{ backgroundColor: Colors.white }}
                    textStyle={{ color: Colors.primary }}
                  />
                  <AppText
                    fontSize={Styles.FontSize.normal}
                    color={Colors.white}
                    style={{ lineHeight: 24, marginTop: 24 }}>
                    {`By clicking Sign In, you agree to our `}
                    <AppLink
                      text="Privacy Policy"
                      color={Colors.white}
                      textStyle={{
                        fontSize: Styles.FontSize.normal,
                        textDecorationLine: 'underline',
                      }}
                      onPress={openPrivacyPolicyLink}
                    />
                    {` and `}
                    <AppLink
                      text="Terms and Conditions"
                      color={Colors.white}
                      textStyle={{
                        fontSize: Styles.FontSize.normal,
                        textDecorationLine: 'underline',
                      }}
                      onPress={openPrivacyPolicyLink}
                    />
                  </AppText>
                </React.Fragment>
              )}
            </Formik>
          </View>
        </View>
      </LinearGradient>
    </Modal>
  )
}

SignInModal.propTypes = {
  isVisible: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
}

export default SignInModal
