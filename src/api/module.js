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

export function listModuleVersions(query) {
  return request({
    url: '/module/version/list',
    method: 'get',
    params: query
  })
}

export function addVersion(data) {
  return request({
    url: '/module/version',
    method: 'post',
    data
  })
}

export function updateVersion(data) {
  return request({
    url: '/module/version',
    method: 'put',
    data
  })
}

export function deleteModuleVersion(data) {
  return request({
    url: '/module/version',
    method: 'delete',
    data
  })
}
