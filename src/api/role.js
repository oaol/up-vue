import request from '@/utils/request'

export function getRoutes() {
  return request({
    url: '/routes',
    method: 'get'
  })
}

export function getRoles() {
  return request({
    url: '/roles',
    method: 'get'
  })
}

export function addRole(data) {
  return request({
    url: '/role',
    method: 'post',
    data
  })
}

export function updateRole(id, data) {
  return request({
    url: `/role/${id}`,
    method: 'put',
    data
  })
}

export function deleteRole(id) {
  return request({
    url: `/role/${id}`,
    method: 'delete'
  })
}

export function fetchList(query) {
  return request({
    url: '/role/page',
    method: 'get',
    params: query
  })
}

export function fetchRole(id) {
  return request({
    url: `/role/${id}`,
    method: 'get'
  })
}

export function createRolePermission(data) {
  return request({
    url: `/role/permission`,
    method: 'post',
    data
  })
}
