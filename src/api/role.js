import request from '@/utils/request'

export function pageRole(query) {
  return request({
    url: '/role/list',
    method: 'get',
    params: query
  })
}

export function addRole(data) {
  return request({
    url: '/role',
    method: 'post',
    data
  })
}
