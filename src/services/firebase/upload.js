import storage from '@react-native-firebase/storage'

const uploadCompareImage = async (file, userPhoneNumber) => {
  const time = new Date().getTime()
  const reference = storage().ref(`compares/${userPhoneNumber}/${time}.jpg`)
  await reference.putFile(file)
  return reference.getDownloadURL()
}

const uploadQuestionImage = async (file, userPhoneNumber) => {
  const time = new Date().getTime()
  const reference = storage().ref(
    `questionImages/${userPhoneNumber}/${time}.jpg`,
  )
  await reference.putFile(file)
  return reference.getDownloadURL()
}

const uploadDMImage = async (file, roomId, userPhoneNumber) => {
  const time = new Date().getTime()
  const reference = storage().ref(
    `dmImages/${roomId}/${userPhoneNumber}/${time}.jpg`,
  )
  await reference.putFile(file)
  return reference.getDownloadURL()
}

const uploadCommentImage = async (file, questionId, userPhoneNumber) => {
  const time = new Date().getTime()
  const reference = storage().ref(
    `commentImages/${questionId}/${userPhoneNumber}/${time}.jpg`,
  )
  await reference.putFile(file)
  return reference.getDownloadURL()
}

const uploadProfilePicture = async (file, userPhoneNumber) => {
  const time = new Date().getTime()
  const reference = storage().ref(
    `profilePicture/${userPhoneNumber}/${time}.jpg`,
  )
  await reference.putFile(file)
  return reference.getDownloadURL()
}

const uploadGroupProfilePicture = async (file, groupId) => {
  const time = new Date().getTime()
  const reference = storage().ref(`groupProfilePicture/${groupId}/${time}.jpg`)
  await reference.putFile(file)
  return reference.getDownloadURL()
}

export default {
  uploadCompareImage,
  uploadQuestionImage,
  uploadDMImage,
  uploadCommentImage,
  uploadProfilePicture,
  uploadGroupProfilePicture,
}
