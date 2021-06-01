import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/user/login',
    method: 'post',
    data
  })
}

export function getInfo(token) {
  return request({
    url: '/user/info',
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

export function listUser(query) {
  return request({
    url: '/user/list',
    method: 'get',
    params: query
  })
}

export function registerUser(data) {
  return request({
    url: '/user/register',
    method: 'post',
    data
  })
}

export function setRoles(data) {
  return request({
    url: '/user/set_roles',
    method: 'post',
    data
  })
}
