import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: '/permission/page',
    method: 'get',
    params: query
  })
}

export function fetchPermission(id) {
  return request({
    url: `/psermission/${id}`,
    method: 'get'
  })
}

export function createPermission(data) {
  return request({
    url: '/permission',
    method: 'post',
    data
  })
}

export function updatePermission(data) {
  return request({
    url: '/permission/update',
    method: 'put',
    data
  })
}

export function fetchPermissionByName(query) {
  return request({
    url: `/permission/role/permission`,
    method: 'get',
    params: query
  })
}

export function deletePermission(id) {
  return request({
    url: `/permission/${id}`,
    method: 'delete'
  })
}
