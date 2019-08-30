import { systemRequestApi } from '@/utils/requestUtil'
/**
 * 公司管理的相关API
 */

/**
 * 新增公司
 * @param {*} params 参数
 */
export function addCompany(params) {
  return systemRequestApi('/company', 'POST', params)
}

/**
 * 查询公司管理界面要显示的信息
 * @param {*} params 查询的VO
 */
export function fetchCompany(params) {
  return systemRequestApi('/company/info', 'POST', params)
}

/**
 * 删除选定公司
 * @param {*} params
 */
export function deleteCompany(params) {
  return systemRequestApi('/company', 'DELETE', params)
}
