import { systemRequestApi } from '@/utils/requestUtil'
/**
 * 资源管理的相关API
 */

/**
 * 新增资源
 * @param {*} params 参数
 */
export function addResource(params) {
  return systemRequestApi('/resource', 'POST', params)
}

/**
 * 查询资源管理界面要显示的信息
 * @param {*} params 查询的VO
 */
export function fetchResource(params) {
  return systemRequestApi('/resource/info', 'POST', params)
}

/**
 * 删除选定资源
 * @param {*} params
 */
export function dropResource(params) {
  return systemRequestApi('/resource', 'DELETE', params)
}

/**
 * 修改选定资源信息
 * @param {*} params
 */
export function updateResource(params) {
  return systemRequestApi('/resource', 'PUT', params)
}
