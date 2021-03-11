import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import {
  StatusBar,
  StyleSheet,
  View,
  SafeAreaView,
  ScrollView,
} from 'react-native'
import { Dimensions, Colors, FontSize, Screens } from 'constants'
import * as NavigationService from 'services/navigation'
import { setAskQuestion } from '../askSlice'
import { setCompareImages } from '../questionSlice'
import { launchImageLibrary } from 'react-native-image-picker'

import { CompareItem, AppButton, AppText, AppInput } from 'components'

const styles = StyleSheet.create({
  container: {
    height: Dimensions.Height,
    width: Dimensions.Width,
    backgroundColor: Colors.white,
    flex: 1,
  },
  questionInput: {
    fontSize: FontSize.xxxLarge,
    height: 100,
    color: 'black',
    marginTop: 10,
  },
  imageContainer: {
    flex: 1,
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  versus: {
    position: 'absolute',
    backgroundColor: 'white',
    height: 60,
    width: 60,
    borderRadius: 30,
    left: Dimensions.Width / 2.37,
    top: Dimensions.Height / 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
})

const CreateCompare = () => {
  const dispatch = useDispatch()

  const [question, setQuestion] = useState(null)
  const [firstImage, setFirstImage] = useState(null)
  const [secondImage, setSecondImage] = useState(null)

  const buttonOnPress = () => {
    if (!firstImage || !secondImage) {
      return alert('You have to add the images to continue!')
    }
    dispatch(setCompareImages([firstImage, secondImage]))
    dispatch(setAskQuestion(question))
    NavigationService.navigate(Screens.SelectContacts, {
      compare: true,
    })
  }

  const questionOnChange = (value) => {
    const text = value !== '' ? value : null
    setQuestion(text)
  }

  const imageOnPress = (index) => {
    launchImageLibrary(
      {
        mediaType: 'photo',
        quality: 0.1,
      },
      (response) => {
        if (response.didCancel) return
        if (response.errorCode) return
        index === 0 ? setFirstImage(response.uri) : setSecondImage(response.uri)
      },
    )
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <ScrollView>
        <AppInput
          style={styles.questionInput}
          multiline
          onChange={questionOnChange}
          value={question}
          placeholder="What do you want to ask to People?"
        />
        <View style={styles.imageContainer}>
          <CompareItem image={firstImage} onPress={() => imageOnPress(0)} />
          <CompareItem image={secondImage} onPress={() => imageOnPress(1)} />
          <View style={styles.versus}>
            <AppText
              fontSize={FontSize.xxxLarge}
              weight="bold"
              color={Colors.primary}>
              VS
            </AppText>
          </View>
        </View>
        <AppButton style={{ margin: 20 }} onPress={buttonOnPress} text="Post" />
      </ScrollView>
    </SafeAreaView>
  )
}

CreateCompare.propTypes = {}

export default CreateCompare
