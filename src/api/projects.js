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

export function dependAdd(data) {
  return request({
    url: '/project/depend',
    method: 'post',
    data
  })
}

export function listDepend(query) {
  return request({
    url: '/project/depend/list',
    method: 'get',
    params: query
  })
}

export function deleteDepend(id) {
  return request({
    url: '/project/depend/' + id,
    method: 'delete'
  })
}
