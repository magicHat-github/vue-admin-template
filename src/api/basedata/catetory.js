import { baseDataRequestApi } from '@/utils/requestUtil'

/**
 * 题目类别相关的api
 */

/**
 * 分页查询
 * @param {*} params 参数
 */
export function select(params) {
  console.log(123)
  return baseDataRequestApi('/category', 'get', params)
}

