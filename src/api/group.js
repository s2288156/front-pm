import request from '@/utils/request'

export function list(query) {
  return request({
    url: '/group/list',
    method: 'get',
    params: query
  })
}
