import request from '@/utils/request'

export function pageRole(query) {
  return request({
    url: '/role/list',
    method: 'get',
    params: query
  })
}

