import { systemRequestApi } from '@/utils/requestUtil'
/**
 * 组织管理的相关API
 */

/**
 * 新增组织
 * @param {*} params 参数
 */
export function queryOrg(params) {
  return systemRequestApi('/org/info', 'POST', params)
}

/**
 * 新增组织
 * @param {*} params 参数
 */
export function addOrg(params) {
  return systemRequestApi('/org/add', 'POST', params)
}

/**
 * 新增组织
 * @param {*} params 参数
 */
export function updateOrg(params) {
  return systemRequestApi('/org/update', 'POST', params)
}

/**
 * 删除
 * @param {*} params 参数
 */
export function deleteOrg(params) {
  return systemRequestApi('/org/delete', 'POST', params)
}
