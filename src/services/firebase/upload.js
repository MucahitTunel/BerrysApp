import storage from '@react-native-firebase/storage'

const uploadCompareImage = async (file, userPhoneNumber) => {
  const time = new Date().getTime()
  const reference = storage().ref(`compares/${userPhoneNumber}/${time}.jpg`)
  await reference.putFile(file)
  return reference.getDownloadURL()
}

export default {
  uploadCompareImage,
}
