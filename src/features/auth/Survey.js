import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { StatusBar, StyleSheet, TouchableOpacity, View } from 'react-native'
import { AppButton, AppIcon, AppText } from 'components'
import Constants from 'constants'
import { loadContacts } from 'features/contacts/contactsSlice'
import { submitSurvey } from 'features/auth/authSlice'

const styles = StyleSheet.create({
  container: {
    height: Constants.Dimensions.Height,
    width: Constants.Dimensions.Width,
    backgroundColor: Constants.Colors.white,
    flex: 1,
    paddingHorizontal: 16,
  },
  titleView: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
  },
  surveyItem: {
    borderWidth: 1,
    borderColor: Constants.Colors.grayLight,
    borderRadius: 8,
    marginBottom: 6,
    width: (Constants.Dimensions.Width - 44) / 3,
    height: (Constants.Dimensions.Width - 44) / 3,
    alignItems: 'center',
    padding: 12,
  },
  surveyItemActive: {
    borderColor: Constants.Colors.primary,
    backgroundColor: Constants.Colors.primary,
  },
  surveyList: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
  },
  surveyItemText: {
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 5,
  },
})

const surveysList = [
  {
    id: 1,
    icon: 'opinion',
    name: 'Opinion',
    value: 'Opinion',
    size: 40,
    marginBottom: 10,
  },
  {
    id: 2,
    icon: 'recommendation',
    name: 'Recommen-dation',
    value: 'Recommendation',
    size: 40,
    marginBottom: 10,
  },
  {
    id: 3,
    icon: 'advice',
    name: 'Advice',
    value: 'Advice',
    size: 40,
    marginBottom: 10,
  },
  {
    id: 4,
    icon: 'about-someone',
    name: 'About Someone',
    value: 'About Someone',
    size: 40,
    marginBottom: 10,
  },
  // {
  //   id: 5,
  //   icon: 'about-something',
  //   name: 'About Something',
  //   value: 'About Something',
  // },
  {
    id: 6,
    icon: 'how-to',
    name: 'How-to',
    value: 'How-to',
    size: 50,
    marginBottom: 0,
  },
  {
    id: 8,
    icon: 'taboo',
    name: 'Taboo',
    value: 'Taboo',
    size: 30,
    marginBottom: 10,
  },
  {
    id: 9,
    icon: 'political',
    name: 'Political',
    value: 'Political',
    size: 30,
    marginBottom: 10,
  },
  {
    id: 10,
    icon: 'financial',
    name: 'Financial',
    value: 'Financial',
    size: 30,
    marginBottom: 10,
  },
  {
    id: 7,
    icon: 'others',
    name: 'Other',
    value: 'Other',
    size: 40,
    marginBottom: 0,
  },
]

const Survey = () => {
  const dispatch = useDispatch()
  const [option, setOption] = useState(null)
  useEffect(() => {
    dispatch(loadContacts())
  }, [dispatch])
  const onSelectItem = (value) => setOption(value)
  const onPressContinue = () => dispatch(submitSurvey({ value: option }))
  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <View style={styles.titleView}>
        <AppText
          text="What would you like to ask?"
          fontSize={24}
          style={{ fontWeight: 'bold' }}
        />
      </View>
      <View style={styles.surveyList}>
        {surveysList.map((item) => {
          return (
            <TouchableOpacity
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
                  color={
                    option === item.value
                      ? Constants.Colors.WHITE
                      : Constants.Colors.text
                  }
                />
              </View>
              <AppText
                text={item.name.toUpperCase()}
                fontSize={12}
                style={[
                  styles.surveyItemText,
                  {
                    color:
                      option === item.value
                        ? Constants.Colors.WHITE
                        : Constants.Colors.text,
                  },
                ]}
              />
            </TouchableOpacity>
          )
        })}
      </View>
      <View style={{ marginTop: 40 }}>
        <AppButton
          backgroundColor={
            option ? Constants.Colors.primary : Constants.Colors.gray
          }
          color={Constants.Colors.white}
          onPress={onPressContinue}
          text="Pick 1 to continue"
          activeOpacity={option ? 0.2 : 1}
        />
      </View>
    </View>
  )
}

export default Survey
