import request from '@/utils/request'

export function pageResource(query) {
  return request({
    url: '/resource/list',
    method: 'get',
    params: query
  })
}

export function addResource(data) {
  return request({
    url: '/resource',
    method: 'post',
    data
  })
}

export function deleteResource(id) {
  return request({
    url: '/resource',
    method: 'delete',
    params: id
  })
}
