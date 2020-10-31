import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { View, Text, StyleSheet } from 'react-native'
import { directMessage } from 'features/messages/messagesSlice'
import Constants from 'constants'
import PropTypes from 'prop-types'

const styles = StyleSheet.create({
  container: {
    height: Constants.Dimensions.Height,
    width: Constants.Dimensions.Width,
    backgroundColor: Constants.Colors.grayLight,
    flex: 1,
    alignItems: 'center',
  },
})

const DirectMessage = ({ route }) => {
  const dispatch = useDispatch()
  useEffect(() => {
    if (route && route.params && route.params.userId) {
      dispatch(directMessage({ userId: route.params.userId }))
    }
  }, [route, dispatch])
  return (
    <View style={styles.container}>
      <Text style={{ padding: 50 }}>
        Navigating to conversation with user "
        {route && route.params && route.params.userId}" ...
      </Text>
    </View>
  )
}

DirectMessage.propTypes = {
  route: PropTypes.objectOf(PropTypes.any).isRequired,
}

export default DirectMessage
