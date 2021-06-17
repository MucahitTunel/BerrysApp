import axios from 'axios'
import { Alert } from 'react-native'
import Config from 'react-native-config'

const requestConfig = {
  baseURL: Config.API_URL,
  validateStatus: (status) => status < 400,
}

const instance = axios.create(requestConfig)

// instance.interceptors.request.use()
// instance.interceptors.response.use()

const handleError = (e) => {
  let error = e
  if (
    e &&
    e.response &&
    e.response.data &&
    e.response.data.error &&
    typeof e.response.data.error === 'string'
  ) {
    error = new Error(e.response.data.error)
  }
  Alert.alert('Error', error.message)
  console.log(e.toJSON())
  throw error
}

const request = async ({ url, method, data, params, headers }) => {
  try {
    const res = await instance.request({
      method,
      url,
      data,
      params,
      headers,
    })
    return res
  } catch (e) {
    handleError(e)
  }
}

export default request
