import request from '@/utils/request'
// 获取权限列表数据

export function getPermissionList(params) {
  return request({
    url: '/permission/list',
    params
  })
}
// 新增权限
export function addPermission(data) {
  return request({
    url: '/permission/add',
    method: 'post',
    data
  })
}

// 更新权限
export function updatePermission(data) {
  return request({
    url: `/permission/put/${data.id}`,
    method: 'put',
    data
  })
}

// 删除权限
export function delPermission(id) {
  return request({
    url: `/permission/delete/${id}`,
    method: 'delete'
  })
}
// 获取权限详情
export function getPermissionDetail(id) {
  return request({
    url: `/permission/detail/${id}`
  })
}

