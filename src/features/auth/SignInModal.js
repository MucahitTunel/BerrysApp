import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { View, TouchableOpacity, Platform } from 'react-native'
import Modal from 'react-native-modal'
import LinearGradient from 'react-native-linear-gradient'
import CountryPicker from 'react-native-country-picker-modal'
import { Formik } from 'formik'
import Theme from 'theme'
import Constants from 'constants'
import { AppIcon, AppInput, AppLink, AppButton, AppText } from 'components'

const linearGradient = [Constants.Colors.primary, Constants.Colors.primaryLight]

const SignInModal = ({
  isVisible,
  onClose,
  openSignUpModal,
  openForgotPasswordModal,
}) => {
  const [country, setCountry] = useState(Constants.Misc.DefaultCountry)
  const onSubmit = (values, { setSubmitting }) => {
    setSubmitting(true)
    const { phoneNumber, password } = values
    const formattedPhoneNumber = `+${country.callingCode}${phoneNumber}`
    const payload = {
      phoneNumber: formattedPhoneNumber,
      password,
      countryCode: country.cca2,
    }
    // signIn(payload)
    setSubmitting(false)
  }
  return (
    <Modal
      isVisible={isVisible}
      backdropColor="transparent"
      style={Theme.Modal.modalView}
      animationInTiming={200}
      animationOutTiming={200}>
      <LinearGradient
        colors={linearGradient}
        start={{ x: 0.25, y: 0.5 }}
        end={{ x: 0.75, y: 0.5 }}
        style={{ flex: 1, padding: 20 }}>
        <View style={Theme.Modal.modalInnerView}>
          <TouchableOpacity onPress={onClose} style={Theme.Modal.closeBtn}>
            <AppIcon name="close" color={Constants.Colors.white} />
          </TouchableOpacity>
          <AppText text="Sign In" style={Theme.Modal.header} />
          <View style={Theme.Modal.form}>
            <Formik
              initialValues={{ phoneNumber: '', password: '' }}
              onSubmit={onSubmit}>
              {({ values, handleChange, handleSubmit, isSubmitting }) => (
                <React.Fragment>
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <View style={{ marginTop: -12 }}>
                      <CountryPicker
                        style={{
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                        onSelect={(value) => setCountry(value)}
                        countryCode={country.cca2}
                        translation="eng"
                        withCallingCode
                        withFlagButton
                        withFilter
                      />
                    </View>
                    <AppText
                      text={`+${country.callingCode}`}
                      style={Theme.Modal.phonePrefix}
                    />
                    <View style={{ marginLeft: 6, flex: 1 }}>
                      <AppInput
                        autoFocus
                        keyboardType={
                          Platform.OS === 'ios' ? 'number-pad' : 'numeric'
                        }
                        placeholder="Phone Number"
                        placeholderTextColor="rgba(255, 255, 255, 0.8)"
                        onChange={handleChange('phoneNumber')}
                        value={values.phoneNumber}
                      />
                    </View>
                  </View>
                  <AppInput
                    placeholder="Password"
                    placeholderTextColor="rgba(255, 255, 255, 0.8)"
                    secureTextEntry
                    onChange={handleChange('password')}
                    value={values.password}
                  />
                  <AppLink
                    style={{ marginBottom: 20, alignItems: 'flex-end' }}
                    text="Forgot your password?"
                    color={Constants.Colors.white}
                    onPress={openForgotPasswordModal}
                  />
                  <AppButton
                    text="Sign In"
                    isLoading={isSubmitting}
                    onPress={handleSubmit}
                  />
                </React.Fragment>
              )}
            </Formik>
          </View>
          <View style={Theme.Modal.bottomView}>
            <AppText
              text="Don`t have an account?"
              style={Theme.Modal.bottomText}
            />
            <AppLink
              text="Sign Up"
              color={Constants.Colors.white}
              fontWeight="600"
              style={{ marginLeft: 4 }}
              onPress={openSignUpModal}
            />
          </View>
        </View>
      </LinearGradient>
    </Modal>
  )
}

SignInModal.propTypes = {
  isVisible: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  openSignUpModal: PropTypes.func.isRequired,
  openForgotPasswordModal: PropTypes.func.isRequired,
}

export default SignInModal
