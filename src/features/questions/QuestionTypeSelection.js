import React, { useState, useLayoutEffect } from 'react'
import {
  StyleSheet,
  SafeAreaView,
  View,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Image,
} from 'react-native'
import {
  Layout,
  AppButton,
  AppInput,
  AppText,
  PollInput,
  CompareItem,
  Header,
} from 'components'
import { BackButton } from 'components/NavButton'
import { Dimensions, Colors, FontSize, Screens } from 'constants'
import { launchImageLibrary } from 'react-native-image-picker'
import { useDispatch, useSelector } from 'react-redux'
import { setAskQuestion, setQuestionImage } from 'features/questions/askSlice'
import {
  setPollOptions as setPollOptionsRedux,
  setCompareImages,
} from 'features/questions/questionSlice'
import * as NavigationService from 'services/navigation'
import PropTypes from 'prop-types'

const styles = StyleSheet.create({
  container: {
    height: Dimensions.Height,
    width: Dimensions.Width,
    flex: 1,
  },
  typeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    marginBottom: 20,
  },
  messageInput: {
    color: Colors.purpleText,
    paddingTop: 15,
    paddingBottom: 15,
    paddingHorizontal: 20,
    height: undefined,
    minHeight: 100,
    maxHeight: 180,
    backgroundColor: 'white',
    borderRadius: 20,
  },
  scrollView: {
    paddingHorizontal: 30,
    paddingVertical: 20,
    paddingTop: 0,
  },
  pollContainer: {
    marginTop: 20,
  },
  compareContainer: {
    marginTop: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  versus: {
    position: 'absolute',
    backgroundColor: Colors.primary,
    height: 50,
    width: 50,
    borderRadius: 25,
    alignSelf: 'center',
    left: '42.5%',
    justifyContent: 'center',
    alignItems: 'center',
  },
})

const QuestionTypeSelection = ({ navigation }) => {
  const dispatch = useDispatch()
  const questionImage = useSelector((state) => state.ask.questionImage)

  const [selected, setSelected] = useState('pencil')
  const [message, setMessage] = useState(null)
  const [pollOptions, setPollOptions] = useState([
    { value: null },
    { value: null },
  ])
  const [firstCompareImage, setFirstCompareImage] = useState(null)
  const [secondCompareImage, setSecondCompareImage] = useState(null)

  const getTitle = () => {
    switch (selected) {
      case 'pencil':
        return 'Post Question'
      case 'image':
        return 'Post Image'
      case 'poll':
        return 'Create Poll'
      case 'versus':
        return 'Create Compare'
    }
  }

  useLayoutEffect(() => {
    navigation.setOptions({
      header: () => (
        <Header
          title={getTitle()}
          headerLeft={<BackButton navigation={navigation} />}
        />
      ),
    })
    // eslint-disable-next-line
      }, [navigation, selected])

  const renderType = (type) => {
    return (
      <AppButton
        shadow={false}
        icon={type}
        iconSize={20}
        iconColor={selected === type ? 'white' : Colors.purple}
        style={{ backgroundColor: selected === type ? Colors.purple : 'white' }}
        onPress={() => {
          dispatch(setQuestionImage(null))
          setMessage(null)
          setPollOptions([{ value: null }, { value: null }])
          setFirstCompareImage(null)
          setSecondCompareImage(null)
          setSelected(type)
        }}
      />
    )
  }

  const messageOnChange = (value) => {
    setMessage(value === '' ? null : value)
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

  const renderPoll = () => {
    const renderOption = (item, index) => {
      const changeOptionValue = (index, value) => {
        setPollOptions(
          pollOptions.map((o, idx) => {
            if (idx === index) return { value }
            return o
          }),
        )
      }

      const onChange = (value) => {
        let text = value !== '' ? value : null
        changeOptionValue(index, text)
      }

      return (
        <PollInput
          key={index}
          onChange={onChange}
          selected
          itemIndex={index + 1}
          style={{ marginBottom: 10 }}
          text={item.value}
        />
      )
    }

    const addOptionOnPress = () => {
      setPollOptions([...pollOptions, { value: null }])
    }

    return (
      <View style={styles.pollContainer}>
        <AppText style={{ marginBottom: 10 }}>
          Option {pollOptions.length}/4
        </AppText>
        {pollOptions.map((o, idx) => renderOption(o, idx))}
        {pollOptions.length < 4 && (
          <AppButton
            style={{
              backgroundColor: Colors.purpleLight,
              alignItems: 'center',
              marginTop: 10,
            }}
            leftAlign
            onPress={addOptionOnPress}
            text="+ Add option"
            textStyle={{ color: Colors.purple }}
          />
        )}
      </View>
    )
  }

  const renderCompare = () => {
    const imageOnPress = (index) => {
      launchImageLibrary(
        {
          mediaType: 'photo',
          quality: 0.1,
        },
        (response) => {
          if (response.didCancel) return
          if (response.errorCode) return
          index === 0
            ? setFirstCompareImage(response.uri)
            : setSecondCompareImage(response.uri)
        },
      )
    }

    return (
      <View style={styles.compareContainer}>
        <CompareItem
          image={firstCompareImage}
          onPress={() => imageOnPress(0)}
          left
        />
        <CompareItem
          image={secondCompareImage}
          onPress={() => imageOnPress(1)}
        />
        <View style={styles.versus}>
          <AppText fontSize={FontSize.xLarge} weight="bold" color="white">
            VS
          </AppText>
        </View>
      </View>
    )
  }

  const submitOnPress = () => {
    dispatch(setAskQuestion(message))
    switch (selected) {
      case 'pencil':
        if (!message) return alert('Please write a question to continue!')
        NavigationService.navigate(Screens.PostQuestion, {
          question: true,
        })
        break
      case 'image':
        if (!questionImage) return alert('Please add an image to continue!')
        NavigationService.navigate(Screens.PostQuestion, {
          question: true,
        })
        break
      case 'poll':
        if (!message) return alert('Please write a question to continue!')
        if (pollOptions.filter((p) => p.value === null).length > 0)
          return alert('Please fill every option to continue!')
        dispatch(setPollOptionsRedux(pollOptions))
        NavigationService.navigate(Screens.PostQuestion, {
          poll: true,
        })
        break
      case 'versus':
        if (!firstCompareImage || !secondCompareImage)
          return alert('Please add images to continue!')
        dispatch(setCompareImages([firstCompareImage, secondCompareImage]))
        NavigationService.navigate(Screens.PostQuestion, {
          compare: true,
        })
        break
    }
  }

  return (
    <Layout>
      <SafeAreaView style={styles.container}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : null}
          keyboardVerticalOffset={150}
          style={{ flex: 1 }}>
          <ScrollView contentContainerStyle={styles.scrollView}>
            <View style={styles.typeContainer}>
              {renderType('pencil')}
              {renderType('image')}
              {renderType('poll')}
              {renderType('versus')}
            </View>
            <View
              style={{
                flexDirection: selected === 'image' ? 'row' : 'column',
              }}>
              {selected === 'image' && (
                <AppButton
                  shadow={false}
                  icon="image"
                  iconSize={20}
                  iconColor={Colors.backgroundDarker}
                  style={{
                    backgroundColor: 'white',
                    marginRight: 10,
                    borderRadius: 15,
                  }}
                  onPress={pickImage}
                />
              )}
              <AppInput
                placeholder="Type you message..."
                value={message}
                onChange={messageOnChange}
                placeholderTextColor={Colors.gray}
                style={[
                  styles.messageInput,
                  {
                    flex: selected === 'image' ? 1 : null,
                  },
                ]}
                multiline
              />
            </View>
            {selected === 'image' && questionImage && (
              <View
                style={{
                  marginTop: 20,
                  flex: 1,
                  height: Dimensions.Height / 2,
                  justifyContent: questionImage ? null : 'center',
                  alignItems: questionImage ? null : 'center',
                }}>
                <Image
                  source={{ uri: questionImage }}
                  style={{ flex: 1, borderRadius: 25 }}
                />
              </View>
            )}
            {selected === 'poll' && renderPoll()}
            {selected === 'versus' && renderCompare()}
          </ScrollView>
        </KeyboardAvoidingView>
        <AppButton
          text="Continue"
          style={{ marginHorizontal: 30, marginBottom: 30 }}
          onPress={submitOnPress}
        />
      </SafeAreaView>
    </Layout>
  )
}

QuestionTypeSelection.propTypes = {
  navigation: PropTypes.object,
}

export default QuestionTypeSelection
