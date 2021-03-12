import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { View, StyleSheet } from 'react-native'
import { joinGroupByLink } from './groupSlice'
import { Loading } from 'components'
import { Dimensions, Colors } from 'constants'
import PropTypes from 'prop-types'

const styles = StyleSheet.create({
  container: {
    height: Dimensions.Height,
    width: Dimensions.Width,
    backgroundColor: Colors.grayLight,
    flex: 1,
    alignItems: 'center',
  },
})

const JoinGroupByLink = ({ route }) => {
  const dispatch = useDispatch()
  useEffect(() => {
    console.log(route.params)
    if (route && route.params && route.params.groupId) {
      dispatch(joinGroupByLink({ groupId: route.params.groupId }))
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

JoinGroupByLink.propTypes = {
  route: PropTypes.objectOf(PropTypes.any).isRequired,
}

export default JoinGroupByLink
