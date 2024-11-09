import request from '@/utils/request'
// 登录
export function login(data) {
  return request({
    url: '/sys/login',
    method: 'post',
    data
  })
}
// 获取个人信息
export function getUserInfo() {
  return request({
    url: '/sys/profile'
  })
}
// 修改用户密码
export function updatePass(data) {
  return request({
    url: '/sys/user/updatePass',
    method: 'put',
    data
  })
}
