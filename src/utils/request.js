import axios from 'axios'
import store from '@/store'
import { Message } from 'element-ui'
const service = axios.create({
  baseURL: '/api',
  timeout: 100000
})

service.interceptors.request.use(
  (config) => {
    if (store.getters.token) {
      config.headers.Authorization = `Bearer ${store.getters.token}`
    } return config
  }, (error) => {
    return Promise.reject(error)
  }
)
service.interceptors.response.use((response) => {
  const { data, message, success } = response.data
  if (success) {
    return data
  } else {
    Message({ type: 'error', message: message })
    return Promise.reject(new Error(message))
  }
},

(error) => {
  Message({ type: 'error', message: error.message })
  return Promise.reject(error)
})
export default service
