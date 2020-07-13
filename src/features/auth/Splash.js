import React, { useEffect } from 'react'
import { View } from 'react-native'
import { useDispatch } from 'react-redux'
import LinearGradient from 'react-native-linear-gradient'
import { AppImage } from 'components'
import Constants from 'constants'
import Images from 'assets/images'
import { authBoot } from 'features/auth/authSlice'

const linearGradient = [Constants.Colors.primary, Constants.Colors.primaryLight]

const Splash = () => {
  const dispatch = useDispatch()
  useEffect(() => {
    dispatch(authBoot())
  }, [dispatch])
  return (
    <LinearGradient
      style={{ flex: 1 }}
      colors={linearGradient}
      start={{ x: 0.5, y: 0.25 }}
      end={{ x: 0.5, y: 0.75 }}>
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <AppImage source={Images.logoWhite} width={120} height={140} />
      </View>
    </LinearGradient>
  )
}

export default Splash
