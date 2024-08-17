import { getToken, setToken, removeToken } from '@/utils/auth'
const state = {
  token: getToken()// 从缓存读取token初始值
}
const mutations = {
  setToken(state, token) {
    state.token = token
    setToken(token)// 获取的token同步到缓存
  },
  removeToken() {
    state.token = null// 删除vuex中的token
    removeToken()// 退出时从缓存删除token
  }
}
const actions = {
  login(context, data) {
    console.log(data)
    // todo 调用接口返回token
    context.commit('setToken', '123456')
  }

}
export default {
  namespaced: true,
  state,
  mutations,
  actions
}
