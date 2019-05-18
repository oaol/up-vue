import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: '/role/permission/page',
    method: 'get',
    params: query
  })
}
