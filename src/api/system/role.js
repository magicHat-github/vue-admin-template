import { systemRequestApi } from '@/utils/requestUtil'
/**
 * 角色管理的相关API
 */

/**
 * 新增角色
 * @param {*} params 参数
 */
export function addRole(params) {
  return systemRequestApi('/role', 'POST', params)
}

/**
 * 查询角色管理界面要显示的信息
 * @param {*} params 查询的VO
 */
export function fetchRole(params) {
  return systemRequestApi('/role/info', 'POST', params)
}

/**
 * 查询角色增加/修改界面要显示的信息
 * @param {*} params 查询的VO
 */
export function fetchRoleBeforeModify(params) {
  return systemRequestApi('/role/modification', 'POST', params)
}

/**
 * 删除选定角色
 * @param {*} params
 */
export function dropRole(params) {
  return systemRequestApi('/role', 'DELETE', params)
}

/**
 * 修改选定角色信息
 * @param {*} params
 */
export function updateRole(params) {
  return systemRequestApi('/role', 'PUT', params)
}
