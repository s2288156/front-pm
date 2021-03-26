import request from '@/utils/request'

export function listProjects(query) {
  return request({
    url: '/project/list',
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