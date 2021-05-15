import React, { useEffect } from 'react'
import { View, FlatList, StyleSheet, SafeAreaView } from 'react-native'
import { Layout } from 'components'
import { Dimensions } from 'constants'
import { getMyPosts } from 'features/questions/questionsSlice'
import { useDispatch, useSelector } from 'react-redux'
import { RenderCompare, QuestionItem, RenderPoll } from '../questions/Main'

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

const MyPosts = () => {
  const dispatch = useDispatch()

  const myQuestions = useSelector((state) => state.questions.myQuestions)
  const myPolls = useSelector((state) => state.questions.myPolls)
  const myCompares = useSelector((state) => state.questions.myCompares)

  const getQuestionType = (item) => {
    if (item.type === 'question') return <QuestionItem question={item} />
    if (item.type === 'poll') return <RenderPoll poll={item} />
    if (item.type === 'compare') return <RenderCompare compare={item} />
  }

  const renderMyPosts = ({ item, index }) => {
    return <View style={styles.item}>{getQuestionType(item)}</View>
  }

  useEffect(() => {
    dispatch(getMyPosts())
  }, [dispatch])

  return (
    <Layout>
      <SafeAreaView style={styles.container}>
        <View style={{ height: '100%' }}>
          <FlatList
            data={[...myQuestions, ...myPolls, ...myCompares]}
            renderItem={renderMyPosts}
            style={styles.flatlist}
          />
        </View>
      </SafeAreaView>
    </Layout>
  )
}

export default MyPosts
