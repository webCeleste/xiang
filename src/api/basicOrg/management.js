import request from '@/utils/request'

// 查询换届管理列表
export function listManagement(query) {
  return request({
    url: '/basicOrg/management/list',
    method: 'get',
    params: query
  })
}

// 查询换届管理详细
export function getManagement(id) {
  return request({
    url: '/basicOrg/management/' + id,
    method: 'get'
  })
}

// 新增换届管理
export function addManagement(data) {
  return request({
    url: '/basicOrg/management',
    method: 'post',
    data: data
  })
}

// 修改换届管理
export function updateManagement(data) {
  return request({
    url: '/basicOrg/management',
    method: 'put',
    data: data
  })
}

// 删除换届管理
export function delManagement(id) {
  return request({
    url: '/basicOrg/management/' + id,
    method: 'delete'
  })
}

// 导出换届管理
export function exportManagement(query) {
  return request({
    url: '/basicOrg/management/export',
    method: 'get',
    params: query
  })
}