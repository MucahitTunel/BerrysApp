import React, { useLayoutEffect, useState, useEffect } from 'react'
import {
  View,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
} from 'react-native'
import {
  AppButton,
  AppText,
  Header,
  Layout,
  AppIcon,
  AppInput,
} from 'components'
import { CloseButton } from 'components/NavButton'
import { Dimensions, Colors } from 'constants'
import { useDispatch, useSelector } from 'react-redux'
import PropTypes from 'prop-types'
import request from 'services/api'
import countryData from 'utils/countries.json'
import shuffleArray from 'utils/shuffleArray'
import { setTargetedCountries, setTargetedInterests } from './askSlice'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: Dimensions.Height,
    width: Dimensions.Width,
  },
  inputStyle: {
    backgroundColor: 'white',
    marginHorizontal: 20,
    // paddingVertical: 25,
    borderRadius: 20,
    marginTop: 5,
    color: 'black',
  },
  selectedItem: {
    backgroundColor: 'white',
    flexDirection: 'row',
    alignItems: 'center',
    height: 50,
    paddingHorizontal: 10,
    borderRadius: 15,
    marginRight: 10,
    marginBottom: 10,
  },
  suggestionItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  plusContainer: {
    height: 60,
    width: 60,
    borderRadius: 30,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
})

const SelectTargetedUsers = ({ navigation }) => {
  const dispatch = useDispatch()
  const targetedInterests = useSelector((state) => state.ask.targetedInterests)
  const targetedCountries = useSelector((state) => state.ask.targetedCountries)

  useLayoutEffect(() => {
    navigation.setOptions({
      header: () => (
        <Header headerRight={<CloseButton navigation={navigation} />} />
      ),
    })
  }, [navigation, dispatch])

  // const [interests, setInterests] = useState([])
  const [selectedInterests, setSelectedInterests] = useState(targetedInterests)
  const [selectedCountries, setSelectedCountries] = useState(targetedCountries)
  const [input, setInput] = useState('')
  const [suggestions, setSuggestions] = useState([])

  const getInterests = async () => {
    const { data } = await request({
      method: 'GET',
      url: 'interests',
    })
    const { interests } = data
    // setSuggestions(shuffleArray([...suggestions, ...interests]))
    return interests
  }

  useEffect(() => {
    // setTimeout(() => setSuggestions(shuffleArray([...suggestions, ...countryData])), 1000)
    getInterests().then((data) => {
      // const rand = Math.floor(Math.random() * 33) + 12
      setSuggestions(
        shuffleArray([
          .../* shuffleArray( */ countryData /*) .slice(0, rand) */,
          ...data,
        ]),
      )
    })
  }, [])

  const inputOnChange = (value) => {
    setInput(value)
  }

  const selectSuggestion = (item) => {
    if (selectedInterests.length + selectedCountries.length === 3) return
    if (item._id) {
      if (!selectedInterests.find((i) => i._id === item._id))
        setSelectedInterests([...selectedInterests, item])
    } else {
      if (!selectedCountries.find((c) => c.name === item.name))
        setSelectedCountries([...selectedCountries, item])
    }
  }

  const removeSuggestion = (item) => {
    if (item._id)
      setSelectedInterests(selectedInterests.filter((i) => i._id !== item._id))
    else
      setSelectedCountries(
        selectedCountries.filter((c) => c.name !== item.name),
      )
  }

  const nextOnPress = () => {
    dispatch(setTargetedInterests(selectedInterests))
    dispatch(setTargetedCountries(selectedCountries))
    navigation.goBack()
  }

  return (
    <Layout>
      <SafeAreaView style={styles.container}>
        <ScrollView scrollEnabled={false} contentContainerStyle={{ flex: 1 }}>
          <AppText
            color="black"
            style={{ alignSelf: 'center', marginHorizontal: 20 }}>
            Characteristics, which users need to have to answer your post.
            Select up to 3
          </AppText>
          <View
            style={{
              flexDirection: 'row',
              marginTop: 15,
              paddingHorizontal: 20,
              flexWrap: 'wrap',
            }}>
            {[...selectedCountries, ...selectedInterests].map((item) => {
              return (
                <TouchableOpacity
                  style={styles.selectedItem}
                  onPress={() => removeSuggestion(item)}>
                  <AppText color="black" style={{ marginRight: 10 }}>
                    {item.name
                      .split(' ')
                      .map((i) => i.charAt(0).toUpperCase() + i.slice(1))
                      .join(' ')}
                  </AppText>
                  <AppIcon name="close" size={12} color="black" />
                </TouchableOpacity>
              )
            })}
          </View>
          <AppInput
            placeholder="Write something..."
            value={input}
            onChange={inputOnChange}
            placeholderTextColor={Colors.gray}
            style={styles.inputStyle}
          />
          <ScrollView
            style={{ flex: 1 }}
            contentContainerStyle={{ paddingBottom: 20 }}>
            {suggestions
              .filter((item) => new RegExp(input, 'gmi').test(item.name))
              .map((item) => {
                return (
                  <View
                    style={{
                      flexDirection: 'row',
                      marginTop: 15,
                      paddingHorizontal: 20,
                    }}>
                    <TouchableOpacity
                      style={styles.suggestionItem}
                      onPress={() => selectSuggestion(item)}>
                      <View style={styles.plusContainer}>
                        <AppIcon
                          name="plus"
                          size={30}
                          color={Colors.grayLight}
                        />
                      </View>
                      <View>
                        <AppText
                          color="black"
                          style={{ marginRight: 10 }}
                          weight="bold">
                          {item.name
                            .split(' ')
                            .map((i) => i.charAt(0).toUpperCase() + i.slice(1))
                            .join(' ')}
                        </AppText>
                        <AppText
                          color={Colors.gray}
                          style={{ marginRight: 10 }}>
                          {item._id ? 'Interest' : 'Country'}
                        </AppText>
                      </View>
                    </TouchableOpacity>
                  </View>
                )
              })}
          </ScrollView>
          <AppButton
            text="Next"
            style={{ marginBottom: 20, marginHorizontal: 20 }}
            onPress={nextOnPress}
          />
        </ScrollView>
      </SafeAreaView>
    </Layout>
  )
}

SelectTargetedUsers.propTypes = {
  navigation: PropTypes.object,
}

export default SelectTargetedUsers
