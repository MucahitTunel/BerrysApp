import React from 'react'
import { useDispatch } from 'react-redux'
import { View, StatusBar, StyleSheet } from 'react-native'
import { Formik } from 'formik'
import * as yup from 'yup'
import Constants from 'constants'
import Fonts from 'assets/fonts'
import { AppInput, AppButton } from 'components'
import { submitReport } from 'features/report/reportSlice'

const styles = StyleSheet.create({
  container: {
    height: Constants.Dimensions.Height,
    width: Constants.Dimensions.Width,
    backgroundColor: Constants.Colors.grayLight,
    flex: 1,
  },
  input: {
    paddingHorizontal: 20,
    marginBottom: 10,
    fontSize: Constants.Styles.FontSize.large,
    fontFamily: Fonts.latoRegular,
    height: 50,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: Constants.Colors.grayLight,
  },
})

const Report = () => {
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
  }
  return (
    <View style={[styles.container]}>
      <StatusBar barStyle="light-content" />
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
                backgroundColor: Constants.Colors.white,
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
                backgroundColor: Constants.Colors.white,
              }}>
              <AppButton
                onPress={handleSubmit}
                isLoading={isSubmitting}
                text="Submit"
                backgroundColor={Constants.Colors.primary}
                color={Constants.Colors.white}
                borderRadius={Constants.Styles.BorderRadius.small}
                error={errors.email || errors.message}
              />
            </View>
          </React.Fragment>
        )}
      </Formik>
    </View>
  )
}

export default Report
