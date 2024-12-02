import request from '@/utils/request'
// 获取员工列表数据

export function getEmployeeList(params) {
  return request({
    url: '/sys/user',
    params // 地址参数 查询参数
  })
}
// 员工导出

export function exportEmployee() {
  return request({
    url: '/sys/user/export',
    responseType: 'blob' // 使用blob接收二进制文件流
  })
}
// 下载导入模板
export function getExportTemplate() {
  return request({
    url: '/sys/user/import/template',
    responseType: 'blob'
  })
}

// 员工导入

export function uploadExcel(data) {
  return request({
    url: '/sys/user/import',
    method: 'post',
    data // form-data类型 因为要上传文件类型
  })
}

// 删除员工
export function delEmployee(id) {
  return request({
    method: 'delete',
    url: `/sys/user/${id}`
  })
}
