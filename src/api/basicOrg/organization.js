import request from '@/utils/request'

// 查询党组织列表
export function listOrganization(query) {
  return request({
    url: '/system/organization/list',
    method: 'get',
    params: query
  })
}

// 查询党组织详细
export function getOrganization(orgId) {
  return request({
    url: '/system/organization/' + orgId,
    method: 'get'
  })
}

// 新增党组织
export function addOrganization(data) {
  return request({
    url: '/system/organization',
    method: 'post',
    data: data
  })
}

// 修改党组织
export function updateOrganization(data) {
  return request({
    url: '/system/organization',
    method: 'put',
    data: data
  })
}

// 删除党组织
export function delOrganization(orgId) {
  return request({
    url: '/system/organization/' + orgId,
    method: 'delete'
  })
}

// 导出党组织
export function exportOrganization(query) {
  return request({
    url: '/system/organization/export',
    method: 'get',
    params: query
  })
}

// 查询党组织下拉树结构
export function orgTreeSelect() {
  return request({
    url: '/system/organization/orgTreeSelect',
    method: 'get'
  })
}
