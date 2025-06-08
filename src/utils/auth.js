import Cookies from 'js-cookie'

const TokenKey = 'vue_admin_template_token'

export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(token) {
  return Cookies.set(TokenKey, token)
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}
const RoleKey = 'vue_admin_template_role'

export function getRole() {
  return Cookies.get(RoleKey)
}

export function setRole(role) {
  return Cookies.set(RoleKey, role)
}

export function removeRole() {
  return Cookies.remove(RoleKey)
}
const RoutesKey = 'vue_admin_template_routes'

// 获取路由信息的函数
export function getMenus() {
  const routesStr = Cookies.get(RoutesKey)
  // 如果能获取到路由信息的字符串，将其解析为 JavaScript 对象
  return routesStr ? JSON.parse(routesStr) : null
}

// 设置路由信息的函数
export function setMenus(routes) {
  // 将路由信息对象转换为 JSON 字符串存储到 Cookie 中
  const routesStr = JSON.stringify(routes)
  return Cookies.set(RoutesKey, routesStr)
}

// 移除路由信息的函数
export function removeMenus() {
  return Cookies.remove(RoutesKey)
}
// 定义存储用户信息的 Cookie 键名
const UserInfoKey = 'vue_admin_template_user_info'

// 获取用户信息的函数
export function getUserInfos() {
  const userInfoStr = Cookies.get(UserInfoKey)
  // 如果能获取到用户信息的字符串，将其解析为 JavaScript 对象
  return userInfoStr ? JSON.parse(userInfoStr) : null
}

// 设置用户信息的函数
export function setUserInfo(userInfo) {
  // 将用户信息对象转换为 JSON 字符串存储到 Cookie 中
  const userInfoStr = JSON.stringify(userInfo)
  return Cookies.set(UserInfoKey, userInfoStr)
}

// 移除用户信息的函数
export function removeUserInfo() {
  return Cookies.remove(UserInfoKey)
}
