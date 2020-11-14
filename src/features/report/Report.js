import React, { useRef } from 'react'
import { useDispatch } from 'react-redux'
import {
  View,
  StatusBar,
  StyleSheet,
  Animated,
  Keyboard,
  SafeAreaView,
} from 'react-native'
import { Formik } from 'formik'
import * as yup from 'yup'
import KeyboardListener from 'react-native-keyboard-listener'

import { Dimensions, Colors } from 'constants'
import { AppInput, AppButton } from 'components'
import { submitReport } from 'features/report/reportSlice'
import { showKeyboard, hideKeyBoard } from 'utils'

const styles = StyleSheet.create({
  container: {
    height: Dimensions.Height,
    width: Dimensions.Width,
    backgroundColor: Colors.white,
    flex: 1,
  },
  input: {
    paddingHorizontal: 20,
    marginTop: 16,
    height: 50,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: Colors.grayLight,
    color: Colors.gray,
  },
})

const Report = () => {
  let keyboardHeight = useRef(new Animated.Value(0))
  const dispatch = useDispatch()

  const onSubmit = (values, { setSubmitting, resetForm }) => {
    setSubmitting(true)
    const { email, message } = values
    const payload = {
      email,
      message,
    }
    dispatch(submitReport(payload))
    resetForm({})
    setSubmitting(false)
    keyboardHeight.current = new Animated.Value(0)
    Keyboard.dismiss()
  }
  return (
    <SafeAreaView style={styles.container}>
      <Animated.View style={{ flex: 1, paddingBottom: keyboardHeight.current }}>
        <StatusBar barStyle="light-content" />
        <KeyboardListener
          onWillShow={(event) => showKeyboard(event, keyboardHeight.current)}
          onWillHide={(event) => hideKeyBoard(event, keyboardHeight.current)}
        />
        <Formik
          initialValues={{ email: '', message: '' }}
          onSubmit={onSubmit}
          validationSchema={yup.object().shape({
            email: yup.string().email().required(),
            message: yup.string().required(),
          })}>
          {({ values, handleChange, handleSubmit, isSubmitting, errors }) => (
            <React.Fragment>
              <View
                style={{
                  flex: 1,
                  backgroundColor: Colors.white,
                  padding: 16,
                }}>
                <AppInput
                  secondary
                  placeholder="Your email"
                  style={styles.input}
                  onChange={handleChange('email')}
                  value={values.email}
                  error={errors.email}
                />
                <AppInput
                  secondary
                  placeholder="Your message"
                  multiline
                  style={[styles.input, { height: 100 }]}
                  onChange={handleChange('message')}
                  value={values.message}
                  error={errors.message}
                />
              </View>
              <View
                style={{
                  padding: 10,
                  backgroundColor: Colors.white,
                }}>
                <AppButton
                  onPress={handleSubmit}
                  isLoading={isSubmitting}
                  text="Submit"
                  disabled={!values.email || !values.message}
                />
              </View>
            </React.Fragment>
          )}
        </Formik>
      </Animated.View>
    </SafeAreaView>
  )
}

export default Report
