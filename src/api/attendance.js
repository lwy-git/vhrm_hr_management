import request from '@/utils/request'
// 获取考勤列表
export function getAttendanceList(params) {
  return request({
    url: '/attendance/list',
    params
  })
}
// 获取考勤详情
export function getAttendanceDetail(id) {
  return request({
    url: `/attendance/detail/${id}`
  })
}
export function updateAttendance(data) {
  return request({
    url: `/attendance/put/${data.id}`,
    method: 'put',
    data
  })
}
// 添加考勤记录addAttendance
export function addAttendance(data) {
  return request({
    url: '/attendance/add',
    method: 'post',
    data
  })
}
// 删除考勤记录deleteAttendance
export function deleteAttendance(id) {
  return request({
    method: 'delete',
    url: `/attendance/delete/${id}`
  })
}
// 修改考勤设置
export function attendanceSave(data) {
  return request({
    url: '/attendanceConfig/updateAllAttendance',
    method: 'post',
    data
  })
}
// 获取考勤设置/getAttendanceConfig
export function getAttendanceConfig() {
  return request({
    url: `/attendanceConfig/getAttendanceConfig`
  })
}
