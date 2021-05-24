import { LoginManager, AccessToken } from 'react-native-fbsdk'

const logoutFacebook = () => {
  LoginManager.logOut()
}

const getFacebookUserData = async () => {
  LoginManager.logOut()
  // Attempt login with permissions
  const result = await LoginManager.logInWithPermissions([
    'email',
    'groups_access_member_info',
  ])

  if (result.isCancelled) return null

  // Once signed in, get the users AccesToken
  const data = await AccessToken.getCurrentAccessToken()

  if (!data) return null
  return data
}

export default {
  getFacebookUserData,
  logoutFacebook,
}
