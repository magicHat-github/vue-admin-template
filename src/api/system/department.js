import { systemRequestApi } from '@/utils/requestUtil'
/**
 * 部门管理的相关API
 */

/**
 * 对公司-部门树进行查询
 * @param {*} params 参数
 */
export function queryAsideTree(params) {
  return systemRequestApi('/department', 'GET', params)
}

/**
 * 对部门数据进行查询
 * @param {*} params 参数
 */
export function queryDepartment(params) {
  return systemRequestApi('/department/department', 'POST', params)
}

/**
 * 对部门进行新增操作
 * @param {*} params 参数
 */
export function addDepartment(params) {
  return systemRequestApi('/department/add', 'POST', params)
}

/**
 * 对部门进行新增操作
 * @param {*} params 参数
 */
export function deleteDepartment(params) {
  return systemRequestApi('/department/delete', 'POST', params)
}

/**
 * 对部门进行新增操作
 * @param {*} params 参数
 */
export function updateDepartment(params) {
  return systemRequestApi('/department/update', 'POST', params)
}
