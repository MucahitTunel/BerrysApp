import { combineReducers } from '@reduxjs/toolkit'
import { authReducer } from 'features/auth/authSlice'
import { counterReducer } from 'features/counter/counterSlice'
import { questionsReducer } from 'features/questions/questionsSlice'
import { contactsReducer } from 'features/contacts/contactsSlice'
import { reportReducer } from 'features/report/reportSlice'
import { askReducer } from 'features/questions/askSlice'
import { questionReducer } from 'features/questions/questionSlice'
import { messagesReducer } from 'features/messages/messagesSlice'
import { groupReducer } from 'features/groups/groupSlice'

export default combineReducers({
  auth: authReducer,
  counter: counterReducer,
  questions: questionsReducer,
  contacts: contactsReducer,
  report: reportReducer,
  question: questionReducer,
  ask: askReducer,
  messages: messagesReducer,
  group: groupReducer,
})
