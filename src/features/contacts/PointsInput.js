import React, { useState } from 'react'
import {
  View,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native'
import { Dimensions, FontSize, Colors } from 'constants'
import { Layout, AppText, AppButton, AppInput } from 'components'
import { useSelector, useDispatch } from 'react-redux'
import { updateSelectedPoints } from 'features/auth/authSlice'

const styles = StyleSheet.create({
  container: {
    height: Dimensions.Height,
    width: Dimensions.Width,
    flex: 1,
    backgroundColor: 'transparent',
  },
  content: {
    paddingHorizontal: 20,
  },
  input: {
    marginTop: 20,
    backgroundColor: 'white',
    borderRadius: 15,
    fontSize: FontSize.large,
    color: Colors.purpleText,
  },
  buttonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  button: {
    marginTop: 20,
    backgroundColor: 'white',
    borderRadius: 15,
    width: '47%',
  },
  buttonSelected: {
    backgroundColor: Colors.purple,
  },
  buttonText: {
    color: Colors.purpleText,
    fontWeight: 'normal',
  },
  buttonTextSelected: {
    color: 'white',
  },
})

const PointsInput = () => {
  const dispatch = useDispatch()
  const user = useSelector((state) => state.auth.user)

  const [questionPoints, setQuestionPoints] = useState(user.selectedPoints)
  const [callPoints, setCallPoints] = useState(
    user.selectedCallPoints ? user.selectedCallPoints : 0,
  )

  const onSubmit = () => {
    dispatch(updateSelectedPoints({ questionPoints, callPoints }))
  }

  const questionPointsOnChange = (value) => {
    setQuestionPoints(value === '' ? 0 : parseInt(value).toFixed(0))
  }

  const callPointsOnChange = (value) => {
    setCallPoints(value === '' ? 0 : parseInt(value).toFixed(0))
  }

  return (
    <Layout>
      <View style={styles.container}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : null}
          keyboardVerticalOffset={140}
          style={{ flex: 1 }}>
          <ScrollView contentContainerStyle={styles.content}>
            <AppText style={{ color: Colors.purpleText }}>
              Points for answering each question:{' '}
              <AppText weight="bold" style={{ color: Colors.purpleText }}>
                {questionPoints}
              </AppText>
            </AppText>
            <AppInput
              placeholder="Input number of points"
              style={styles.input}
              numeric
              onChange={questionPointsOnChange}
              value={questionPoints}
            />
            <View style={styles.buttonContainer}>
              <AppButton
                text="Free"
                textStyle={[
                  styles.buttonText,
                  questionPoints === 0 && styles.buttonTextSelected,
                ]}
                style={[
                  styles.button,
                  questionPoints === 0 && styles.buttonSelected,
                ]}
                onPress={() => setQuestionPoints(0)}
              />
              <AppButton
                text="10 Points"
                textStyle={[
                  styles.buttonText,
                  questionPoints === 10 && styles.buttonTextSelected,
                ]}
                style={[
                  styles.button,
                  questionPoints === 10 && styles.buttonSelected,
                ]}
                onPress={() => setQuestionPoints(10)}
              />
            </View>
            <View style={styles.buttonContainer}>
              <AppButton
                text="20 Points"
                textStyle={[
                  styles.buttonText,
                  questionPoints === 20 && styles.buttonTextSelected,
                ]}
                style={[
                  styles.button,
                  questionPoints === 20 && styles.buttonSelected,
                ]}
                onPress={() => setQuestionPoints(20)}
              />
              <AppButton
                text="50 Points"
                textStyle={[
                  styles.buttonText,
                  questionPoints === 50 && styles.buttonTextSelected,
                ]}
                style={[
                  styles.button,
                  questionPoints === 50 && styles.buttonSelected,
                ]}
                onPress={() => setQuestionPoints(50)}
              />
            </View>
            <AppText style={{ color: Colors.purpleText, marginTop: 30 }}>
              Points for answering calls:{' '}
              <AppText weight="bold" style={{ color: Colors.purpleText }}>
                {callPoints}
              </AppText>
            </AppText>
            <AppInput
              placeholder="Input number of points"
              style={styles.input}
              numeric
              onChange={callPointsOnChange}
              value={callPoints}
            />
            <View style={styles.buttonContainer}>
              <AppButton
                text="Free"
                textStyle={[
                  styles.buttonText,
                  callPoints === 0 && styles.buttonTextSelected,
                ]}
                style={[
                  styles.button,
                  callPoints === 0 && styles.buttonSelected,
                ]}
                onPress={() => setCallPoints(0)}
              />
              <AppButton
                text="100 Points"
                textStyle={[
                  styles.buttonText,
                  callPoints === 100 && styles.buttonTextSelected,
                ]}
                style={[
                  styles.button,
                  callPoints === 100 && styles.buttonSelected,
                ]}
                onPress={() => setCallPoints(100)}
              />
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
        <AppButton
          text="Update Account"
          style={{ marginBottom: 20, marginHorizontal: 20 }}
          onPress={onSubmit}
        />
      </View>
    </Layout>
  )
}

export default PointsInput
