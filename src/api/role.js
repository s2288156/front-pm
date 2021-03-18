import request from '@/utils/request'

export function listFor(uid) {
  return request({
    url: '/role/list/' + uid,
    method: 'get'
  })
}

export function listAll() {
  return request({
    url: '/role/list_all',
    method: 'get'
  })
}

export function assign(data) {
  return request({
    url: '/role/assign',
    method: 'post',
    data
  })
}
