import { getToken, setToken, removeToken } from '@/utils/auth'
import { login, getUserInfo } from '@/api/user'
import { constantRoutes } from '@/router'
import { resetRouter } from '@/router'
const state = {
  token: getToken(), // 从缓存读取token初始值
  userInfo: {},
  menus: [],
  routes: constantRoutes // 静态路由的数组
}
const mutations = {
  setToken(state, token) {
    state.token = token
    setToken(token)// 获取的token同步到缓存
  },
  removeToken(state) {
    state.token = null// 删除vuex中的token
    removeToken()// 退出时从缓存删除token
  },
  setUserInfo(state, userInfo) {
    state.userInfo = userInfo
  },
  setMenus(state, menus) {
    state.menus = menus
  },
  // 添加动态路由，菜单未显示
  // 动态添加路由,不具备响应式，使用vuex共享路由信息
  // 使用setRoutes更新state的routes来渲染菜单
  setRoutes(state, asyncRoutes) {
    console.log('asyncRoutes', asyncRoutes)
    state.routes = [...constantRoutes, ...asyncRoutes] // 静态路由 + 动态路由
  }
}
const actions = {
  async login(context, data) {
    console.log(data)
    // todo 调用接口返回token
    const token = await login(data)
    console.log('token: ', token.jwt)
    console.log('emp: ', token.emp)
    context.commit('setToken', token.jwt)
    context.commit('setUserInfo', token.emp)
    context.commit('setMenus', token.menus)
  },
  async getUserInfo(context) {
    const res = await getUserInfo()
    context.commit('setUserInfo', res)
    return res // 返回数据
  },
  logout(context) {
    context.commit('removeToken')
    context.commit('setUserInfo', {})
    context.commit('setMenus', {})
    // 重置路由,防止上个用户的权限遗留在新登录的用户上
    resetRouter()
  }
}
export default {
  namespaced: true,
  state,
  mutations,
  actions
}
