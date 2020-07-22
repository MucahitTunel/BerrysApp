import React from 'react'
import { Text, View, TouchableOpacity, ActivityIndicator } from 'react-native'
import { Formik } from 'formik'
import LinearGradient from 'react-native-linear-gradient'
import { AppInput } from 'components'
import Constants from 'constants'
import { useDispatch } from 'react-redux'
import { verifyPhoneNumber, resendVerifyCode } from 'features/auth/authSlice'

const linearGradientColors = [
  Constants.Colors.primary,
  Constants.Colors.primaryLight,
]

const styles = {
  modalView: {
    margin: 0,
    width: Constants.Dimensions.Width,
    height: Constants.Dimensions.Height,
  },
  modalInnerView: {
    height: Constants.Dimensions.Height,
  },
  header: {
    color: Constants.Colors.white,
    fontSize: 18,
    textAlign: 'center',
    marginTop: 20,
  },
  form: {
    marginTop: 80,
    marginBottom: 20,
  },
  input: {
    height: 50,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 20,
    marginBottom: 10,
    borderRadius: 2,
    fontSize: 16,
    color: Constants.Colors.white,
  },
  modalBtn: {
    backgroundColor: Constants.Colors.white,
    borderRadius: 2,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  modalBtnText: {
    fontWeight: 'bold',
    color: Constants.Colors.textRed,
  },
  bottomView: {
    marginTop: 20,
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bottomBtn: {
    fontWeight: '700',
    color: Constants.Colors.white,
    marginLeft: 5,
  },
}

const PhoneVerification = () => {
  const dispatch = useDispatch()
  const onSubmit = (values, { setSubmitting }) => {
    setSubmitting(true)
    const { verifyCode } = values
    const payload = { verifyCode }
    dispatch(verifyPhoneNumber(payload))
    setSubmitting(false)
  }
  const onPressResendCode = () => dispatch(resendVerifyCode())
  return (
    <View style={styles.modalView}>
      <LinearGradient
        colors={linearGradientColors}
        start={{ x: 0.25, y: 0.5 }}
        end={{ x: 0.75, y: 0.5 }}
        style={{ flex: 1, padding: 20, paddingTop: 40 }}>
        <View style={styles.modalInnerView}>
          <Text style={styles.header}>Enter verification code</Text>
          <Formik initialValues={{ verifyCode: '' }} onSubmit={onSubmit}>
            {({ values, handleChange, handleSubmit, isSubmitting }) => (
              <React.Fragment>
                <View style={styles.form}>
                  <AppInput
                    style={styles.input}
                    placeholder="Verification Code"
                    placeholderTextColor="rgba(255, 255, 255, 0.8)"
                    keyboardType="numeric"
                    onChange={handleChange('verifyCode')}
                    value={values.verifyCode}
                  />
                </View>
                <TouchableOpacity
                  style={styles.modalBtn}
                  onPress={() => !isSubmitting && handleSubmit()}>
                  {isSubmitting ? (
                    <ActivityIndicator />
                  ) : (
                    <Text style={styles.modalBtnText}>Submit</Text>
                  )}
                </TouchableOpacity>
              </React.Fragment>
            )}
          </Formik>

          <View style={styles.bottomView}>
            <TouchableOpacity onPress={onPressResendCode}>
              <Text style={styles.bottomBtn}>Resend verification code</Text>
            </TouchableOpacity>
          </View>
        </View>
      </LinearGradient>
    </View>
  )
}

export default PhoneVerification
