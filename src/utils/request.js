import axios from 'axios'
import store from '@/store'
import { Message } from 'element-ui'
import router from '@/router'
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API,
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

async(error) => {
  if (error.response.status === 401) {
    Message({ type: 'warning', message: '身份过期，请重新登录' })

    await store.dispatch('user/logout') // 调用action,退出登录
    router.push('/login')
    return Promise.reject(error)
  }
  Message({ type: 'error', message: error.message })
  return Promise.reject(error)
})
export default service
