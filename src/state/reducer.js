import { combineReducers } from 'redux'
import { counterReducer } from 'features/counter/counterSlice'
import { authReducer } from 'features/auth/authSlice'
import { questionsReducer } from 'features/questions/questionsSlice'
import { contactsReducer } from 'features/contacts/contactsSlice'
import { reportReducer } from 'features/report/reportSlice'
import { askReducer } from 'features/questions/askSlice'
import { questionReducer } from 'features/questions/questionSlice'
import { messagesReducer } from 'features/messages/messagesSlice'

export default combineReducers({
  counter: counterReducer,
  auth: authReducer,
  questions: questionsReducer,
  contacts: contactsReducer,
  report: reportReducer,
  question: questionReducer,
  ask: askReducer,
  messages: messagesReducer,
})
