import React from 'react'
import { View, StyleSheet } from 'react-native'
import { Dimensions, Colors, FontSize, Screens } from 'constants'
import { AppButton, AppText, AppInput, AppIcon } from 'components'
import { setAskQuestion } from 'features/questions/askSlice'
import { useDispatch } from 'react-redux'
import * as NavigationService from 'services/navigation'

import RNUxcam from 'react-native-ux-cam'
RNUxcam.tagScreenName('Main Screen')

const styles = StyleSheet.create({
  container: {
    height: Dimensions.Height - 145,
    width: Dimensions.Width,
    backgroundColor: Colors.purple,
  },
  inputContainer: {
    height: 200,
    marginHorizontal: 30,
    backgroundColor: 'white',
    borderRadius: 30,
    marginTop: 20,
    paddingHorizontal: 10,
    paddingBottom: 10,
  },
})

const Extension = () => {
  const dispatch = useDispatch()

  return (
    <View style={styles.container}>
      <AppText
        weight="bold"
        fontSize={FontSize.xxxLarge}
        color="white"
        style={{ marginTop: 10, marginHorizontal: 25, textAlign: 'center' }}>
        What problem are u dealing with today? No, really
      </AppText>
      <View style={styles.inputContainer}>
        <AppInput
          placeholder="Share it anonymously or Openly. Get a help from like-minded people..."
          placeholderTextColor={Colors.gray}
          style={{
            fontSize: 16,
            marginTop: 10,
            height: 90,
            width: Dimensions.Width - 80,
            color: Colors.purpleText,
          }}
          onChange={(value) =>
            dispatch(setAskQuestion(value === '' ? null : value))
          }
          multiline
        />
        <View style={{ flex: 1 }} />
        {/* <AppButton
          shadow={false}
          icon="image"
          iconSize={20}
          iconColor={Colors.purple}
          style={{ backgroundColor: Colors.background }}
          onPress={() =>
            NavigationService.navigate(Screens.QuestionTypeSelection, {
              selectedTab: 'image',
            })
          }
        /> */}
      </View>
      <AppButton
        text="Continue"
        style={{
          backgroundColor: Colors.background,
          marginHorizontal: 30,
          marginTop: 20,
        }}
        textStyle={{ color: Colors.purpleText }}
        onPress={() =>
          NavigationService.navigate(Screens.QuestionTypeSelection, {
            selectedTab: 'pencil',
          })
        }
      />
      <View style={{ flex: 1 }} />
      <View style={{ alignSelf: 'center', marginBottom: 60 }}>
        <AppText color="white">Swipe for more</AppText>
        <View
          style={{
            alignItems: 'center',
            transform: [{ rotate: '270deg' }],
            marginTop: 10,
          }}>
          <AppIcon name="chevron-left" color={Colors.white} size={30} />
        </View>
      </View>
    </View>
  )
}

export default Extension
