import * as React from 'react'
import { Keyboard } from 'react-native'
import { StackActions } from '@react-navigation/native'

export const navigationRef = React.createRef()

export function navigate(name, params) {
  Keyboard.dismiss()
  navigationRef.current?.navigate(name, params)
}

export function push(...args) {
  navigationRef.current?.dispatch(StackActions.push(...args))
}

export function getCurrentRoute() {
  return navigationRef.current?.getCurrentRoute()
}

export function goBack() {
  return navigationRef.current?.goBack()
}

export function updateParams(params) {
  return navigationRef.current?.setParams(params)
}
