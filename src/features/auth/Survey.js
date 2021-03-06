import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import {
  StatusBar,
  StyleSheet,
  View,
  SafeAreaView,
  ScrollView,
} from 'react-native'
import { AppButton, AppIcon, AppText, ScaleTouchable } from 'components'
import { Dimensions, Colors, FontSize } from 'constants'
import { loadContacts } from 'features/contacts/contactsSlice'
import { submitSurvey } from 'features/auth/authSlice'
import surveysList from './surveysList'

const styles = StyleSheet.create({
  container: {
    height: Dimensions.Height,
    width: Dimensions.Width,
    backgroundColor: Colors.white,
    flex: 1,
  },
  titleView: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
  },
  surveyItem: {
    borderWidth: 1,
    borderColor: Colors.grayLight,
    borderRadius: 8,
    marginBottom: 6,
    width: (Dimensions.Width - 44) / 3,
    height: (Dimensions.Width - 44) / 3,
    alignItems: 'center',
    padding: 12,
  },
  surveyItemActive: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primary,
  },
  surveyList: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    paddingHorizontal: 16,
  },
  surveyItemText: {
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 5,
  },
})

const Survey = () => {
  const dispatch = useDispatch()
  const [option, setOption] = useState(null)
  useEffect(() => {
    dispatch(loadContacts())
  }, [dispatch])
  const onSelectItem = (value) => setOption(value)
  const onPressContinue = () => dispatch(submitSurvey({ value: option }))
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <View style={styles.titleView}>
        <AppText fontSize={FontSize.xxLarge} weight="medium">
          What would you like to ask?
        </AppText>
      </View>
      <ScrollView contentContainerStyle={styles.surveyList}>
        {surveysList.map((item) => {
          return (
            <ScaleTouchable
              onPress={() => onSelectItem(item.value)}
              key={item.id}
              style={[
                styles.surveyItem,
                option === item.value && styles.surveyItemActive,
              ]}>
              <View style={{ marginBottom: item.marginBottom }}>
                <AppIcon
                  name={item.icon}
                  size={item.size}
                  color={option === item.value ? Colors.white : Colors.text}
                />
              </View>
              <AppText
                fontSize={12}
                style={[
                  styles.surveyItemText,
                  {
                    color: option === item.value ? Colors.white : Colors.text,
                  },
                ]}>
                {item.name.toUpperCase()}
              </AppText>
            </ScaleTouchable>
          )
        })}
      </ScrollView>
      <View style={{ marginTop: 10, marginBottom: 16, paddingHorizontal: 16 }}>
        <AppButton
          text="Pick 1 to continue"
          onPress={onPressContinue}
          disabled={!option}
        />
      </View>
    </SafeAreaView>
  )
}

export default Survey
