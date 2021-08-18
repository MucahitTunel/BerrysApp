import React, { useEffect } from 'react'
import { View, FlatList, StyleSheet, SafeAreaView } from 'react-native'
import { Layout } from 'components'
import { Dimensions } from 'constants'
import { getMyEngaged } from 'features/questions/questionsSlice'
import { useDispatch, useSelector } from 'react-redux'
import { RenderCompare, QuestionItem, RenderPoll } from '../questions/Main'

import RNUxcam from 'react-native-ux-cam'
RNUxcam.tagScreenName('My Engaged Posts')

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

const MyEngaged = () => {
  const dispatch = useDispatch()

  const myEngagedQuestions = useSelector(
    (state) => state.questions.myEngagedQuestions,
  )
  const myEngagedPolls = useSelector((state) => state.questions.myEngagedPolls)
  const myEngagedCompares = useSelector(
    (state) => state.questions.myEngagedCompares,
  )

  const getPosts = () => {
    if (myEngagedQuestions && myEngagedPolls && myEngagedCompares) {
      return [
        ...myEngagedQuestions,
        ...myEngagedPolls,
        ...myEngagedCompares,
      ].sort((a, b) => b.createdAt - a.createdAt)
    } else return []
  }

  const getQuestionType = (item) => {
    if (item.type.includes('question'))
      return (
        <QuestionItem
          question={item}
          isPopular={item.type.includes('popular')}
        />
      )
    if (item.type.includes('poll'))
      return (
        <RenderPoll poll={item} isPopular={item.type.includes('popular')} />
      )
    if (item.type.includes('compare'))
      return (
        <RenderCompare
          compare={item}
          isPopular={item.type.includes('popular')}
        />
      )
    return <></>
  }

  const renderMyEngaged = ({ item, index }) => {
    return <View style={styles.item}>{getQuestionType(item)}</View>
  }

  useEffect(() => {
    dispatch(getMyEngaged())
  }, [dispatch])

  return (
    <Layout>
      <SafeAreaView style={styles.container}>
        <View style={{ height: '100%' }}>
          <FlatList
            data={getPosts()}
            renderItem={renderMyEngaged}
            style={styles.flatlist}
          />
        </View>
      </SafeAreaView>
    </Layout>
  )
}

export default MyEngaged
