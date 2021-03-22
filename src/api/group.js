import request from '@/utils/request'

export function list(query) {
  return request({
    url: '/group/list',
    method: 'get',
    params: query
  })
}

export function add(data) {
  return request({
    url: '/group/add',
    method: 'post',
    data
  })
}
