import request from '@/utils/request'
// 登录
export function login(data) {
  return request({
    url: '/login',
    method: 'post',
    data
  })
}
export function register(data) {
  return request({
    url: '/register',
    method: 'post',
    data
  })
}
// 获取个人信息
export function getUserInfo() {
  return request({
    url: '/profile'
  })
}
// 修改用户密码
export function updatePass(data, id) {
  return request({
    url: `/sys/user/updatePass/${id}`,
    method: 'put',
    data
  })
}
