import request from '@/utils/request'

export function list(query) {
  return request({
    url: '/project/list',
    method: 'get',
    params: query
  })
}

export function listForGroup(query) {
  return request({
    url: '/project/list/for_group',
    method: 'get',
    params: query
  })
}

export function add(data) {
  return request({
    url: '/project/one',
    method: 'post',
    data
  })
}
