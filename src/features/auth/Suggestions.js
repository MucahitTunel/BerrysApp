import React, { useRef } from 'react'
import { useDispatch } from 'react-redux'
import { Animated, Keyboard, StatusBar, StyleSheet, View } from 'react-native'
import { Formik } from 'formik'
import * as yup from 'yup'
import KeyboardListener from 'react-native-keyboard-listener'

import Constants from 'constants'
import Fonts from 'assets/fonts'
import { AppButton, AppInput } from 'components'
import { setAskQuestion } from 'features/questions/askSlice'
import { hideKeyBoard, showKeyboard } from 'utils'
import { AppLink } from '../../components'
import * as NavigationService from 'services/navigation'

const styles = StyleSheet.create({
  container: {
    height: Constants.Dimensions.Height,
    width: Constants.Dimensions.Width,
    backgroundColor: Constants.Colors.grayLight,
    flex: 1,
  },
  input: {
    paddingTop: 14,
    paddingHorizontal: 20,
    marginBottom: 10,
    fontSize: Constants.Styles.FontSize.large,
    fontFamily: Fonts.latoRegular,
    height: 160,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: Constants.Colors.grayLight,
  },
})

const Suggestions = () => {
  let keyboardHeight = useRef(new Animated.Value(0))
  const dispatch = useDispatch()

  const onSubmit = (values, { setSubmitting, resetForm }) => {
    setSubmitting(true)
    const { question } = values
    dispatch(setAskQuestion(question))
    resetForm({})
    setSubmitting(false)
    NavigationService.navigate(Constants.Screens.SelectContacts)
    keyboardHeight.current = new Animated.Value(0)
    Keyboard.dismiss()
  }
  return (
    <Animated.View
      style={[styles.container, { paddingBottom: keyboardHeight.current }]}>
      <StatusBar barStyle="light-content" />
      <KeyboardListener
        onWillShow={(event) => showKeyboard(event, keyboardHeight.current)}
        onWillHide={(event) => hideKeyBoard(event, keyboardHeight.current)}
      />
      <Formik
        initialValues={{ question: '' }}
        onSubmit={onSubmit}
        validationSchema={yup.object().shape({
          question: yup.string().required(),
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
                multiline
                placeholder="Enter your question..."
                style={styles.input}
                onChange={handleChange('question')}
                value={values.question}
                error={errors.question}
              />
            </View>
            <View
              style={{
                padding: 16,
                backgroundColor: Constants.Colors.white,
              }}>
              <AppButton
                onPress={handleSubmit}
                isLoading={isSubmitting}
                text="Select Friends to Ask"
                backgroundColor={Constants.Colors.primary}
                color={Constants.Colors.white}
                borderRadius={Constants.Styles.BorderRadius.small}
                error={errors.question}
              />
              <View style={{ alignItems: 'center', marginTop: 16 }}>
                <AppLink
                  text="Skip"
                  color={Constants.Colors.primary}
                  onPress={() =>
                    NavigationService.navigate(Constants.Screens.Main)
                  }
                />
              </View>
            </View>
          </React.Fragment>
        )}
      </Formik>
    </Animated.View>
  )
}

export default Suggestions
