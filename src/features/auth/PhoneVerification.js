import React from 'react'
import { View, TouchableOpacity, ActivityIndicator } from 'react-native'
import { Formik } from 'formik'
import LinearGradient from 'react-native-linear-gradient'
import { useDispatch } from 'react-redux'
import { AppInput, AppButton, AppText, AppLink } from 'components'
import { Colors, Dimensions, Styles } from 'constants'
import { verifyPhoneNumber, resendVerifyCode } from 'features/auth/authSlice'
import Fonts from 'assets/fonts'

const linearGradientColors = [Colors.primary, Colors.primaryLight]

const styles = {
  modalView: {
    margin: 0,
    width: Dimensions.Width,
    height: Dimensions.Height,
  },
  modalInnerView: {
    height: Dimensions.Height,
  },
  header: {
    color: Colors.white,
    fontSize: 18,
    textAlign: 'center',
    marginTop: 20,
  },
  form: {
    marginTop: 40,
    marginBottom: 20,
  },
  input: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 16,
    borderRightWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  bottomView: {
    marginTop: 24,
    alignItems: 'center',
    justifyContent: 'center',
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
          <AppText
            fontSize={28}
            fontFamily={Fonts.euclidCircularASemiBold}
            color={Colors.white}>
            Verification
          </AppText>
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
                <AppButton
                  text={!isSubmitting && 'Submit'}
                  style={{ backgroundColor: Colors.white }}
                  textStyle={{ color: Colors.primary }}
                  disabled={isSubmitting || !values.verifyCode}
                  onPress={() => !isSubmitting && handleSubmit()}>
                  {isSubmitting && <ActivityIndicator />}
                </AppButton>
              </React.Fragment>
            )}
          </Formik>

          <View style={styles.bottomView}>
            <AppLink
              text="Resend verification code"
              color={Colors.white}
              textStyle={{ fontSize: Styles.FontSize.large }}
              onPress={onPressResendCode}
            />
          </View>
        </View>
      </LinearGradient>
    </View>
  )
}

export default PhoneVerification
