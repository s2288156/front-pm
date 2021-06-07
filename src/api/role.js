import request from '@/utils/request'

export function pageRole(query) {
  return request({
    url: '/role/list',
    method: 'get',
    params: query
  })
}

export function listRoleByUid(query) {
  return request({
    url: '/role/list/by_uid',
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

export function deleteRole(id) {
  return request({
    url: '/role',
    method: 'delete',
    params: id
  })
}

export function setResource(data) {
  return request({
    url: '/role/resource',
    method: 'post',
    data
  })
}
