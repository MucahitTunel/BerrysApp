import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { View, StyleSheet } from 'react-native'
import { directMessage } from 'features/messages/messagesSlice'
import { Loading } from 'components'
import { Dimensions, Colors } from 'constants'
import PropTypes from 'prop-types'

import RNUxcam from 'react-native-ux-cam'
RNUxcam.tagScreenName('Direct Message')

const styles = StyleSheet.create({
  container: {
    height: Dimensions.Height,
    width: Dimensions.Width,
    backgroundColor: Colors.background,
    flex: 1,
    alignItems: 'center',
  },
})

const DirectMessage = ({ route }) => {
  const dispatch = useDispatch()
  useEffect(() => {
    if (route && route.params && route.params.userId) {
      dispatch(directMessage({ userId: route.params.userId, isFromLink: true }))
    }
  }, [route, dispatch])
  return (
    <View style={styles.container}>
      <View style={{ paddingTop: 100 }}>
        <Loading />
      </View>
    </View>
  )
}

DirectMessage.propTypes = {
  route: PropTypes.objectOf(PropTypes.any).isRequired,
}

export default DirectMessage
