import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { View, Text, TouchableOpacity } from 'react-native'
import { increment, decrement } from './counterSlice'

const Counter = () => {
  const dispatch = useDispatch()
  const counter = useSelector(state => state.counter)
  const onClickIncrease = () => dispatch(increment())
  const onClickDecrease = () => dispatch(decrement())
  return (
    <View>
      <View>
        <TouchableOpacity>
          <Text>{counter}</Text>
        </TouchableOpacity>
      </View>
      <View>
        <TouchableOpacity onPress={onClickIncrease}>
          <Text>Increase</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={onClickDecrease}>
          <Text>Decrease</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

export default Counter
