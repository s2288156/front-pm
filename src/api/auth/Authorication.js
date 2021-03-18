import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/ums/member/login',
    method: 'post',
    data
  })
}
