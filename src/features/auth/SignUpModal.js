import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { View, TouchableOpacity, Platform } from 'react-native'
import { useDispatch } from 'react-redux'
import Modal from 'react-native-modal'
import LinearGradient from 'react-native-linear-gradient'
import CountryPicker from 'react-native-country-picker-modal'
import { Formik } from 'formik'
import Theme from 'theme'
import Constants from 'constants'
import { AppIcon, AppInput, AppLink, AppButton, AppText } from 'components'
import { signUp } from 'features/auth/authSlice'

const linearGradient = [Constants.Colors.primary, Constants.Colors.primaryLight]

const SignUpModal = ({ isVisible, onClose, openSignInModal }) => {
  const [country, setCountry] = useState(Constants.Misc.DefaultCountry)
  const dispatch = useDispatch()
  const onSubmit = (values, { setSubmitting }) => {
    setSubmitting(true)
    const { phoneNumber, password } = values
    const formattedPhoneNumber = `+${country.callingCode}${phoneNumber}`
    const payload = {
      phoneNumber: formattedPhoneNumber,
      password,
      countryCode: country.cca2,
    }
    dispatch(signUp(payload))
    setSubmitting(false)
    onClose()
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
          <AppText style={Theme.Modal.header} text="Create A Free Account" />
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
                        keyboardType={
                          Platform.OS === 'ios' ? 'number-pad' : 'numeric'
                        }
                        placeholder="Phone Number"
                        placeholderTextColor="rgba(255, 255, 255, 0.8)"
                        autoFocus
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
                  <AppButton
                    text="Join Now"
                    isLoading={isSubmitting}
                    onPress={handleSubmit}
                  />
                </React.Fragment>
              )}
            </Formik>
          </View>
          <View style={Theme.Modal.bottomView}>
            <AppText
              text="Already have an account?"
              style={Theme.Modal.bottomText}
            />
            <AppLink
              text="Sign In"
              color={Constants.Colors.white}
              fontWeight="600"
              style={{ marginLeft: 4 }}
              onPress={openSignInModal}
            />
          </View>
        </View>
      </LinearGradient>
    </Modal>
  )
}

SignUpModal.propTypes = {
  isVisible: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  openSignInModal: PropTypes.func.isRequired,
}

export default SignUpModal
