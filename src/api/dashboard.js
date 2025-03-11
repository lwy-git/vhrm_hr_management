import request from '@/utils/request'

// 获取首页数据

export function getHomeData() {
  return request({
    url: '/sys/dashboard'
  })
}
// 获取消息
export function getMessageList() {
  return request({
    url: '/home/notice'
  })
}
