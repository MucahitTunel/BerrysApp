import { combineReducers } from 'redux'
import { counterReducer } from 'features/counter/counterSlice'
import { authReducer } from 'features/auth/authSlice'

export default combineReducers({
  counter: counterReducer,
  auth: authReducer,
})
