import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/admin/login',
    method: 'post',
    data
  })
}

export function getInfo(token) {
  return request({
    url: '/admin/user/info',
    method: 'get',
    params: { token }
  })
}

export function logout() {
  return request({
    url: '/admin/logout',
    method: 'post'
  })
}

export function getList(query) {
  return request({
    url: '/admin/list',
    params: query
  })
}

export function update(data) {
  return request({
    url: '/admin/update',
    method: 'post',
    data
  })
}

export function addUser(data) {
  return request({
    url: '/admin/add',
    method: 'post',
    data
  })
}
