import React from 'react'
import { StyleSheet, View } from 'react-native'
import { Dimensions, FontSize } from 'constants'
import { AppButton, AppText, AppImage } from 'components'
import Images from 'assets/images'
import { useDispatch } from 'react-redux'
import { skipFacebook } from './authSlice'
import { getFacebookGroups } from 'features/groups/groupSlice'
import facebookService from '../../services/facebook'

import RNUxcam from 'react-native-ux-cam'
RNUxcam.tagScreenName('FacebookIntegration')

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: Dimensions.Height,
    width: Dimensions.Width,
    alignItems: 'center',
    backgroundColor: '#e5e5e5',
  },
  skipButton: {
    marginTop: 40,
    backgroundColor: 'transparent',
    alignItems: 'flex-end',
    width: '100%',
  },
  mainImage: {
    marginVertical: 30,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 40,
    width: '90%',
    borderWidth: 1,
    borderColor: '#F9F9F9',
    backgroundColor: '#DCDCDC',
  },
})

const FacebookIntegration = () => {
  const dispatch = useDispatch()

  const skipOnPress = () => {
    dispatch(skipFacebook())
  }

  const buttonOnPress = async () => {
    const data = await facebookService.getFacebookUserData()
    dispatch(
      getFacebookGroups({ userId: data.userID, token: data.accessToken }),
    )
  }

  return (
    <View style={styles.container}>
      <View
        style={{
          flex: 1,
          width: '100%',
          paddingHorizontal: 30,
          alignItems: 'center',
        }}>
        <AppButton
          text="Skip"
          style={styles.skipButton}
          textStyle={{
            color: '#B9B9B9',
            fontSize: FontSize.xLarge,
          }}
          onPress={skipOnPress}
        />
        <AppImage
          width={'100%'}
          height={Dimensions.Height / 2.5}
          source={Images.facebookIntegration}
          style={styles.mainImage}
        />
        <AppText
          color="#181B41"
          fontSize={FontSize.xxxLarge}
          style={{ textAlign: 'center', width: '90%' }}>
          Ask your Facebook group members
        </AppText>
        <AppText
          color="#B9B9B9"
          fontSize={FontSize.large}
          style={{ textAlign: 'center', marginTop: 10 }}>
          Ask them anonymously or directly
        </AppText>
      </View>
      <AppButton
        text="Integrate with Facebook Groups"
        textStyle={{ color: 'black', fontSize: FontSize.large, marginLeft: 10 }}
        style={styles.button}
        image={Images.facebookIcon}
        onPress={buttonOnPress}
      />
    </View>
  )
}

export default FacebookIntegration
