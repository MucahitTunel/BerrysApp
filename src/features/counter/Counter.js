import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { View, Text } from 'react-native'
import AppButton from 'components/AppButton'
import { increment, decrement } from './counterSlice'
import CenteredView from '../../components/CenteredView'

const Counter = () => {
  const dispatch = useDispatch()
  const counter = useSelector((state) => state.counter)
  const onClickIncrease = () => dispatch(increment())
  const onClickDecrease = () => dispatch(decrement())
  return (
    <CenteredView>
      <View>
        <Text style={{ fontSize: 50, textAlign: 'center' }}>{counter}</Text>
      </View>
      <View>
        <AppButton
          style={{ margin: 15 }}
          onPress={onClickIncrease}
          text="Increase"
        />
        <AppButton
          style={{ margin: 15 }}
          onPress={onClickDecrease}
          text="Decrease"
        />
      </View>
    </CenteredView>
  )
}

export default Counter
