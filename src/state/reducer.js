import { combineReducers } from 'redux'
import { counterReducer } from 'features/counter/counterSlice'

export default combineReducers({
  counter: counterReducer,
})
