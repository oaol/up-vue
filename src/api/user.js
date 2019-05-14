import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/sso/login',
    method: 'post',
    data
  })
}

export function getInfo(token) {
  return request({
    url: `/user/role/${token}`,
    method: 'get'
  })
}

export function logout() {
  return request({
    url: '/sso/logout',
    method: 'post'
  })
}

export function getUserByPage(query) {
  return request({
    url: '/user/page',
    method: 'get',
    query
  })
}

