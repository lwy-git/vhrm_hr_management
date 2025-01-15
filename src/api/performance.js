import request from '@/utils/request'

export function getPerformanceList(params) {
  return request({
    url: '/performance/list',
    params
  })
}

export function addPerformance(data) {
  return request({
    url: '/performance/add',
    method: 'post',
    data
  })
}

export function updatePerformance(data) {
  return request({
    url: `/performance/put/${data.id}`,
    method: 'put',
    data
  })
}

export function delPerformance(id) {
  return request({
    method: 'delete',
    url: `/performance/delete/${id}`
  })
}

export function getPerformanceDetail(id) {
  return request({
    url: `/performance/detail/${id}`
  })
}
