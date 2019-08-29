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
