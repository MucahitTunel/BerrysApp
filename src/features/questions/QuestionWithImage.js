import React from 'react'
import {
  Image,
  View,
  SafeAreaView,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from 'react-native'
import { AppInput, AppButton } from 'components'
import { Dimensions, Colors, FontSize, Screens } from 'constants'
import { launchImageLibrary } from 'react-native-image-picker'
import { useDispatch, useSelector } from 'react-redux'
import AppText from '../../components/AppText'
import { setAskQuestion, setQuestionImage } from 'features/questions/askSlice'
import * as NavigationService from '../../services/navigation'

import RNUxcam from 'react-native-ux-cam'
RNUxcam.tagScreenName('Question With Image')

const styles = StyleSheet.create({
  container: {
    height: Dimensions.Height,
    width: Dimensions.Width,
    backgroundColor: Colors.white,
    flex: 1,
  },
  inputs: {
    padding: 16,
    paddingBottom: 10,
    backgroundColor: Colors.white,
    flexDirection: 'row',
    alignItems: 'center',
  },
  textInput: {
    height: 48,
    borderRadius: 24,
    marginLeft: 10,
    flex: 1,
    borderWidth: 1,
    borderColor: Colors.grayLight,
    color: Colors.text,
    fontSize: FontSize.large,
    paddingVertical: 14,
    paddingHorizontal: 16,
    marginRight: 10,
  },
})

const QuestionWithImage = () => {
  const dispatch = useDispatch()
  const question = useSelector((state) => state.ask.question)
  const questionImage = useSelector((state) => state.ask.questionImage)

  const questionOnChange = (value) => {
    dispatch(
      setAskQuestion(value !== '' ? value : 'What do you think about this?'),
    )
  }

  const pickImage = () => {
    dispatch(setQuestionImage(null))
    launchImageLibrary(
      {
        mediaType: 'photo',
        quality: 0.1,
      },
      (response) => {
        if (response.didCancel) return
        if (response.errorCode) return
        dispatch(setQuestionImage(response.uri))
      },
    )
  }

  const onPress = () => {
    if (!questionImage) {
      return alert('You have to select an image to continue!')
    }
    NavigationService.navigate(Screens.SelectContacts)
  }

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : null}
        keyboardVerticalOffset={100}>
        <View
          style={{
            flex: 1,
            justifyContent: questionImage ? null : 'center',
            alignItems: questionImage ? null : 'center',
          }}>
          {questionImage ? (
            <Image source={{ uri: questionImage }} style={{ flex: 1 }} />
          ) : (
            <AppText>Select an image to continue!</AppText>
          )}
        </View>
        <View style={styles.inputs}>
          <AppButton
            icon="image"
            iconSize={16}
            style={{ width: 40, height: 40 }}
            onPress={pickImage}
          />
          <AppInput
            style={styles.textInput}
            placeholder="Add a question..."
            placeholderTextColor={Colors.gray}
            value={question}
            onChange={questionOnChange}
          />
          <AppButton
            icon="send"
            iconSize={16}
            style={{ width: 40, height: 40 }}
            onPress={onPress}
          />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

export default QuestionWithImage
