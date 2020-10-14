import request from '@/utils/request'

// 查询先进基层党组织列表
export function listBase(query) {
  return request({
    url: '/basicOrg/base/list',
    method: 'get',
    params: query
  })
}

// 查询先进基层党组织详细
export function getBase(baseId) {
  return request({
    url: '/basicOrg/base/' + baseId,
    method: 'get'
  })
}

// 新增先进基层党组织
export function addBase(data) {
  return request({
    url: '/basicOrg/base',
    method: 'post',
    data: data
  })
}

// 修改先进基层党组织
export function updateBase(data) {
  return request({
    url: '/basicOrg/base',
    method: 'put',
    data: data
  })
}

// 删除先进基层党组织
export function delBase(baseId) {
  return request({
    url: '/basicOrg/base/' + baseId,
    method: 'delete'
  })
}

// 导出先进基层党组织
export function exportBase(query) {
  return request({
    url: '/basicOrg/base/export',
    method: 'get',
    params: query
  })
}