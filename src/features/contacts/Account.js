import React, { useState, useEffect } from 'react'
import { View, StyleSheet } from 'react-native'
import { AppButton, AppInput, AppText } from 'components'
import { Colors, FontSize } from 'constants'
import { useDispatch, useSelector } from 'react-redux'
import Picker from '../../components/Picker'
import { updateName, updateSelectedPoints } from 'features/auth/authSlice'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingBottom: 30,
  },
  infoContainer: {
    flex: 1,
    paddingHorizontal: 10,
  },
})

const POINTS = [
  { label: 'Free', value: 0 },
  { label: '10', value: 10 },
  { label: '20', value: 20 },
]

const Account = () => {
  const dispatch = useDispatch()
  const user = useSelector((state) => state.auth.user)
  const [name, setName] = useState('')
  const [points, setPoints] = useState(0)
  const [showPoints, setShowPoints] = useState(false)

  useEffect(() => {
    setName(user?.name ? user.name : '')
  }, [user])

  useEffect(() => {
    if (user?.selectedPoints) setPoints(user.selectedPoints)
  }, [user?.selectedPoints])

  useEffect(() => {
    setTimeout(() => {
      setShowPoints(true)
    }, 50)
  }, [])

  const onSubmit = () => {
    dispatch(updateName({ name }))
    dispatch(updateSelectedPoints(points))
  }

  return (
    <View style={styles.container}>
      <View style={styles.infoContainer}>
        <AppText
          fontSize={FontSize.large}
          weight="italic"
          style={{
            color: Colors.primary,
            marginLeft: 5,
            marginTop: 20,
            marginBottom: 10,
          }}>
          Enter your name:
        </AppText>
        <AppInput
          style={{
            paddingHorizontal: 20,
            marginBottom: 10,
            borderWidth: 1,
            borderColor: Colors.grayLight,
            color: Colors.text,
          }}
          placeholder={user?.name ? user.name : 'Type your name'}
          onChange={(value) => setName(value)}
          value={name}
        />
        <AppText
          fontSize={FontSize.large}
          weight="italic"
          style={{ color: Colors.primary, marginLeft: 5, marginTop: 20 }}>
          Points for Answering Each Question:
        </AppText>
        {showPoints && (
          <Picker
            items={POINTS}
            selectedValue={points}
            onChange={(value) => {
              setPoints(value)
            }}
          />
        )}
      </View>
      <AppButton
        text="Update account"
        onPress={onSubmit}
        style={{ marginHorizontal: 15 }}
      />
    </View>
  )
}

export default Account
