import request from '@/utils/request'

export function listModules(query) {
  return request({
    url: '/module/list',
    method: 'get',
    params: query
  })
}

export function addModule(data) {
  return request({
    url: '/module/one',
    method: 'post',
    data
  })
}
