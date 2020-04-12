import axios from 'axios'
import Config from 'react-native-config'

const requestConfig = {
  baseURL: Config.API_URL,
  timeout: 15000,
  validateStatus: status => status < 400,
}

const instance = axios.create(requestConfig)

// instance.interceptors.request.use()
// instance.interceptors.response.use()

const Api = ({ url, method, data, params }) =>
  instance.request({
    method,
    url,
    data,
    params,
  })

export default Api
