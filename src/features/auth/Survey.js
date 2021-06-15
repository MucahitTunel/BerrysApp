/* eslint-disable */
import React, { useEffect, useState, useLayoutEffect } from 'react'
import { useDispatch } from 'react-redux'
import { StatusBar, StyleSheet, View, SafeAreaView, Image, ScrollView } from 'react-native'
import { AppButton, AppText, ScaleTouchable, AppInput, SimpleHeader } from 'components'
import { Dimensions, Colors, Screens } from 'constants'
import Images from 'assets/images'
import { loadContacts } from 'features/contacts/contactsSlice'
import * as NavigationService from 'services/navigation'

const styles = StyleSheet.create({
  container: {
    height: Dimensions.Height,
    width: Dimensions.Width,
    flex: 1,
    backgroundColor: 'white'
  },
  surveyItem: {
    borderWidth: 1,
    borderColor: Colors.grayLight,
    borderRadius: 15,
    alignItems: 'center',
    paddingVertical: 30,
    paddingHorizontal: 35,
    backgroundColor: 'white',
  },
  surveyItemActive: {
    borderColor: Colors.purple,
    backgroundColor: Colors.purple,
  },
  surveyItemText: {
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 5,
  },
})

const Survey = ({ navigation }) => {
  const dispatch = useDispatch()

  const [option, setOption] = useState('introvert')
  const [hometown, setHometown] = useState(null)

  useEffect(() => {
    dispatch(loadContacts())
  }, [dispatch])

  const onSelectItem = (value) => setOption(value)

  const onPressContinue = () => {
    if(!hometown) {
      return alert('Please enter your hometown to continue!')
    }

    NavigationService.navigate(Screens.Interests, {
      value: option, data: { hometown }
    })
  }

  const onChangeHometown = (value) => {
    setHometown(value === '' ? null : value)
  }

  useLayoutEffect(() => {
    navigation.setOptions({
      header: () => (
        <SimpleHeader title="About Me" />
      ),
    })
  }, [navigation])

  return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" />
        <ScrollView contentContainerStyle={{ flex: 1}}>
        <View style={{
          width: Dimensions.Width, height: 250,
          padding: 10,
          paddingHorizontal: 20,
          borderRadius: 10,
        }}>
          <Image source={Images.onboarding3} style={{
            width: '100%', flex: 1,
            borderRadius: 10
          }} />
          <AppInput
          placeholder="Hometown"
          placeholderTextColor={Colors.gray}
          // value={searchText}
          style={{
            backgroundColor: 'white',
            fontSize: 15,
            // fontFamily: Fonts.euclidCircularAMedium,
            color: Colors.text,
            position: 'absolute',
            alignSelf: 'center',
            width: '90%',
            top: 100
          }}
          onChange={onChangeHometown}
        />
        </View>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingHorizontal: 30,
          }}>
          <ScaleTouchable
            onPress={() => onSelectItem('introvert')}
            style={[
              styles.surveyItem,
              option === 'introvert' && styles.surveyItemActive,
            ]}>
            <Image
              source={Images.introvert}
              style={{ resizeMode: 'contain', height: 50, width: 50}}
            />
            <AppText
              fontSize={18}
              style={[
                styles.surveyItemText,
                {
                  color: option === 'introvert' ? 'white' : Colors.purpleText,
                },
              ]}>
              Introvert
            </AppText>
          </ScaleTouchable>
          <ScaleTouchable
            onPress={() => onSelectItem('extravert')}
            style={[
              styles.surveyItem,
              option === 'extravert' && styles.surveyItemActive,
            ]}>
            <Image
              source={Images.extrovert}
              style={{ resizeMode: 'contain', height: 50, width: 50}}
            />
            <AppText
              fontSize={18}
              style={[
                styles.surveyItemText,
                {
                  color: option === 'extravert' ? 'white' : Colors.purpleText,
                },
              ]}>
              Extravert
            </AppText>
          </ScaleTouchable>
        </View>
        <View
          style={{
            marginTop: 10,
            marginBottom: 16,
            paddingHorizontal: 16,
            flex: 1,
            justifyContent: 'flex-end',
          }}>
          <AppButton text="Next" onPress={onPressContinue} />
        </View>
        </ScrollView>
      </SafeAreaView>
  )
}

export default Survey
