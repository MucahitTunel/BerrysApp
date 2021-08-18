import React, { useEffect } from 'react'
import { View, FlatList, StyleSheet, SafeAreaView } from 'react-native'
import { Layout } from 'components'
import { Dimensions } from 'constants'
import { getMySkipped } from 'features/questions/questionsSlice'
import { useDispatch, useSelector } from 'react-redux'
import { RenderCompare, QuestionItem, RenderPoll } from '../questions/Main'

import RNUxcam from 'react-native-ux-cam'
RNUxcam.tagScreenName('My Skipped Posts')

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: Dimensions.Height,
    width: Dimensions.Width,
  },
  flatlist: {
    paddingHorizontal: 30,
  },
  item: {
    marginBottom: 15,
  },
})

const MySkipped = () => {
  const dispatch = useDispatch()

  const mySkippedQuestions = useSelector(
    (state) => state.questions.mySkippedQuestions,
  )
  const mySkippedPolls = useSelector((state) => state.questions.mySkippedPolls)
  const mySkippedCompares = useSelector(
    (state) => state.questions.mySkippedCompares,
  )

  const getPosts = () => {
    if (mySkippedCompares && mySkippedPolls && mySkippedQuestions) {
      return [
        ...mySkippedQuestions,
        ...mySkippedPolls,
        ...mySkippedCompares,
      ].sort((a, b) => b.createdAt - a.createdAt)
    } else return []
  }

  const getQuestionType = (item) => {
    switch (item.type) {
      case 'question':
        return <QuestionItem question={item} />
      case 'poll':
        return <RenderPoll poll={item} />
      case 'compare':
        return <RenderCompare compare={item} />
    }
    return <></>
  }

  const renderMySkipped = ({ item, index }) => {
    return <View style={styles.item}>{getQuestionType(item)}</View>
  }

  useEffect(() => {
    dispatch(getMySkipped())
  }, [dispatch])

  return (
    <Layout>
      <SafeAreaView style={styles.container}>
        <View style={{ height: '100%' }}>
          <FlatList
            data={getPosts()}
            renderItem={renderMySkipped}
            style={styles.flatlist}
          />
        </View>
      </SafeAreaView>
    </Layout>
  )
}

export default MySkipped
