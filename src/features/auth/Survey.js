import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { StatusBar, StyleSheet, View, SafeAreaView } from 'react-native'
import { AppButton, AppText, ScaleTouchable, Layout } from 'components'
import { Dimensions, Colors } from 'constants'
import { loadContacts } from 'features/contacts/contactsSlice'
import { submitSurvey } from 'features/auth/authSlice'

const styles = StyleSheet.create({
  container: {
    height: Dimensions.Height,
    width: Dimensions.Width,
    flex: 1,
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

const Survey = () => {
  const dispatch = useDispatch()

  const [option, setOption] = useState('introvert')

  useEffect(() => {
    dispatch(loadContacts())
  }, [dispatch])

  const onSelectItem = (value) => setOption(value)

  const onPressContinue = () => dispatch(submitSurvey({ value: option }))

  return (
    <Layout>
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" />
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
            <AppText fontSize={80} style={[styles.surveyItemText]}>
              🤓
            </AppText>
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
            <AppText fontSize={80} style={[styles.surveyItemText]}>
              🥳
            </AppText>
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
          <AppButton text="Continue" onPress={onPressContinue} />
        </View>
      </SafeAreaView>
    </Layout>
  )
}

export default Survey
