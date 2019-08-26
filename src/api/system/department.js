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
