import { combineReducers } from 'redux'
import { counterReducer } from 'features/counter/counterSlice'
import { authReducer } from 'features/auth/authSlice'
import { questionsReducer } from 'features/questions/questionsSlice'

export default combineReducers({
  counter: counterReducer,
  auth: authReducer,
  questions: questionsReducer,
})
