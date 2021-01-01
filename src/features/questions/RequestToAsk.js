/* eslint-disable react/prop-types */
import React, { useLayoutEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  View,
} from 'react-native'
import moment from 'moment'
import { Colors, Dimensions, FontSize } from 'constants'
import { AppButton, AppText, Header, Loading } from 'components'
import { BackButton } from 'components/NavButton'
import AskMyQuestionModal from './AskMyQuestionModal'
import { Avatar } from '../../components'

const styles = StyleSheet.create({
  container: {
    height: Dimensions.Height,
    width: Dimensions.Width,
    backgroundColor: Colors.white,
    flex: 1,
  },
  requestItem: {
    padding: 16,
    backgroundColor: Colors.white,
    borderBottomWidth: 4,
    borderColor: Colors.background,
  },
  requestItemHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  requestItemBody: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 18,
    marginBottom: 14,
  },
  requestItemFooter: {
    alignItems: 'flex-end',
  },
  modalBackdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    height: '100%',
    width: '100%',
  },
  modalInnerView: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  askBtn: {
    padding: 10,
    backgroundColor: Colors.white,
  },
})

const RequestToAsk = ({ navigation, route }) => {
  const [showAskingModal, setShowAskingModal] = useState(false)
  const loading = useSelector((state) => state.question.loading)
  const { requests } = route.params
  const [requestSelected, setRequestSelected] = useState(requests[0])

  const askMyQuestion = (request) => {
    setShowAskingModal(true)
    setRequestSelected(request)
  }

  useLayoutEffect(() => {
    // Have to move this logic here because
    // https://reactnavigation.org/docs/troubleshooting/#i-get-the-warning-non-serializable-values-were-found-in-the-navigation-state
    // eslint-disable-next-line react/prop-types
    navigation.setOptions({
      header: () => (
        <Header
          title="Invitations"
          headerLeft={<BackButton navigation={navigation} />}
        />
      ),
    })
  }, [navigation])

  if (loading) return <Loading />
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <ScrollView style={{ flex: 1 }}>
        {requests.map((request) => {
          return (
            <View key={request._id} style={styles.requestItem}>
              <View style={styles.requestItemHeader}>
                <AppText weight="medium" style={{ marginRight: 10 }}>
                  {request.requester}
                  <AppText
                    weight="medium"
                    color={Colors.gray}>{` invited you ask`}</AppText>
                </AppText>
                <AppText color={Colors.gray} fontSize={FontSize.normal}>
                  {moment(request.createdAt).fromNow()}
                </AppText>
              </View>
              <View style={styles.requestItemBody}>
                <Avatar size={54} />
                <AppText
                  color={Colors.gray}
                  style={{ marginLeft: 12, flex: 1 }}>
                  Ask the person who have invited you personally
                </AppText>
              </View>
              <View style={styles.requestItemFooter}>
                <AppButton
                  text="Ask My Question"
                  textStyle={{ fontSize: FontSize.normal }}
                  style={{ height: 40, width: 136, borderRadius: 5 }}
                  onPress={() => askMyQuestion(request)}
                />
              </View>
            </View>
          )
        })}
      </ScrollView>

      {/*AskMyQuestion Modal*/}
      <AskMyQuestionModal
        request={requestSelected}
        isModalVisible={showAskingModal}
        setModalVisible={(value) => setShowAskingModal(value)}
      />
    </SafeAreaView>
  )
}

export default RequestToAsk
