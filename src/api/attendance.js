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
// 修改考勤时间设置
export function attendanceSave(data) {
  return request({
    url: '/attendanceConfig/updateAllAttendance',
    method: 'post',
    data
  })
}
// 获取考勤时间设置/getAttendanceConfig
export function getAttendanceConfig() {
  return request({
    url: `/attendanceConfig/getAttendanceConfig`
  })
}
// 获取扣款数据getstateData
export function getstateData() {
  return request({
    url: `/attendanceConfig/getAttendanceConfigList`
  })
}
// 保存扣款数据deductionsSave
export function deductionsSave(data) {
  return request({
    url: '/attendanceConfig/updateAttendanceConfig',
    method: 'post',
    data
  })
}
// 计算每月扣款/calculateDeduction
export function calculateDeduction(params) {
  return request({
    url: `/attendanceConfig/calculateDeduction`,
    params
  })
}
