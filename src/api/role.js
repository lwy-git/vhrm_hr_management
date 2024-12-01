import request from '@/utils/request'
// 获取角色列表数据

export function getRoleList(params) {
  return request({
    url: '/sys/role',
    params
  })
}
