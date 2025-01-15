import request from '@/utils/request'

export function getApprovalList(params) {
  return request({
    url: '/approval/list',
    params
  })
}
export function approveApplication(data) {
  return request({
    url: `/approval/put/approve/${data.id}`,
    method: 'put',
    data
  })
}
export function rejectApplication(data) {
  return request({
    url: `/approval/put/reject/${data.id}`,
    method: 'put',
    data
  })
}
export function delApproval(id) {
  return request({
    method: 'delete',
    url: `/approval/delete/${id}`
  })
}
export function getApprovalDetail(id) {
  return request({
    url: `/approval/detail/${id}`
  })
}
