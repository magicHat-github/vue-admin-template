import { systemRequestApi } from '@/utils/requestUtil'
/**
 * 用户管理的相关API
 */

/**
 * 新增用户
 * @param {*} params 参数
 */
export function addUser(params) {
  return systemRequestApi('/user', 'POST', params)
}

/**
 * 查询用户管理界面要显示的信息
 * @param {*} params 查询的VO
 */
export function fetchUser(params) {
  return systemRequestApi('/user/info', 'POST', params)
}

/**
 * 删除选定用户
 * @param {*} params
 */
export function dropUser(params) {
  return systemRequestApi('/user', 'DELETE', params)
}

/**
 * 修改选定用户信息
 * @param {*} params
 */
export function updateUser(params) {
  return systemRequestApi('/user', 'PUT', params)
}
