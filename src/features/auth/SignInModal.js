import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import PropTypes from 'prop-types'
import { View, TouchableOpacity, Platform } from 'react-native'
import Modal from 'react-native-modal'
import LinearGradient from 'react-native-linear-gradient'
import CountryPicker from 'react-native-country-picker-modal'
import { Formik } from 'formik'
import Theme from 'theme'
import { Colors, Misc } from 'constants'
import { AppIcon, AppInput, AppButton, AppText } from 'components'
import { signIn } from 'features/auth/authSlice'

const linearGradient = [Colors.primary, Colors.primaryLight]

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
            <AppIcon name="close" color={Colors.white} />
          </TouchableOpacity>
          <AppText text="Sign In" style={Theme.Modal.header} />
          <View style={Theme.Modal.form}>
            <Formik initialValues={{ phoneNumber: '' }} onSubmit={onSubmit}>
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
                  <AppButton
                    text="Sign In"
                    isLoading={isSubmitting}
                    onPress={handleSubmit}
                  />
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
