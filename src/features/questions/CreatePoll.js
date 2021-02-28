import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { useDispatch, useSelector } from 'react-redux'
import {
  StatusBar,
  StyleSheet,
  View,
  SafeAreaView,
  ScrollView,
} from 'react-native'
import * as NavigationService from 'services/navigation'
import { Dimensions, Colors, Screens, FontSize } from 'constants'

import { PollItem, AppButton, AppText, AppInput } from 'components'

const styles = StyleSheet.create({
  container: {
    height: Dimensions.Height,
    width: Dimensions.Width,
    backgroundColor: Colors.white,
    flex: 1,
  },
  itemSizeContainer: {
    marginBottom: 10,
    alignItems: 'flex-end',
    paddingRight: 10,
  },
  addOptionButton: {
    paddingLeft: 10,
    marginHorizontal: 10,
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: Colors.grayLight,
  },
  questionInput: { fontSize: FontSize.xxxLarge, height: 100, color: 'black' },
})

export const CreatePoll = () => {
  const dispatch = useDispatch()
  const user = useSelector((state) => state.auth.user)

  const [question, setQuestion] = useState(null)
  const [options, setOptions] = useState([{ value: null }, { value: null }])

  const changeOptionValue = (index, value) => {
    setOptions(
      options.map((o, idx) => {
        if (idx === index) return { value }
        return o
      }),
    )
  }

  const renderOption = (item, index) => {
    const onChange = (value) => {
      let text = value !== '' ? value : null
      changeOptionValue(index, text)
    }

    return (
      <PollItem
        onChange={onChange}
        selected
        itemIndex={index + 1}
        style={{ marginBottom: 10 }}
        text={item.value}
      />
    )
  }

  const addOptionOnPress = () => {
    setOptions([...options, { value: null }])
  }

  const questionOnChange = (value) => {
    const text = value !== '' ? value : null
    setQuestion(text)
  }

  const continueOnPress = () => {
    if (!question) {
      return alert('You have to write a question to continue')
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <ScrollView contentContainerStyle={{ paddingBottom: 10, paddingTop: 10 }}>
        <AppInput
          style={styles.questionInput}
          multiline
          onChange={questionOnChange}
          value={question}
          placeholder="What do you want to ask to People?"
        />
        <View style={styles.itemSizeContainer}>
          <AppText color={Colors.gray} weight="medium">
            {`${options.length} / 10`}
          </AppText>
        </View>
        {options.map((o, idx) => renderOption(o, idx))}
        {options.length < 10 && (
          <AppButton
            style={styles.addOptionButton}
            leftAlign
            onPress={addOptionOnPress}
            text="+ Add option"
            textStyle={{ color: Colors.primary }}
          />
        )}
      </ScrollView>
      {options.filter((o) => o.value === null).length === 0 && (
        <AppButton
          style={{ margin: 20 }}
          onPress={continueOnPress}
          text="Continue"
        />
      )}
    </SafeAreaView>
  )
}

CreatePoll.propTypes = {}

export default CreatePoll
