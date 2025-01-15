import request from '@/utils/request'

export function getSalaryList(params) {
  return request({
    url: '/salary/list',
    params
  })
}

export function addSalary(data) {
  return request({
    url: '/salary/add',
    method: 'post',
    data
  })
}

export function updateSalary(data) {
  return request({
    url: `/salary/put/${data.id}`,
    method: 'put',
    data
  })
}

export function deleteSalary(id) {
  return request({
    method: 'delete',
    url: `/salary/delete/${id}`
  })
}

export function getSalaryDetail(id) {
  return request({
    url: `/salary/detail/${id}`
  })
}
