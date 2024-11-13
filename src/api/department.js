import request from '@/utils/request'
// 获取部门列表
export function getDepartment() {
  return request({
    url: '/company/department'
  })
}
