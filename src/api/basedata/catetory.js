import { baseDataRequestApi } from '@/utils/requestUtil'

/**
 * 题目类别相关的api
 */

/**
 * 分页查询
 * @param {*} params 参数
 */
export function select(params) {
  return baseDataRequestApi('/categories', 'post', params)
}

export function selectByName(params) {
  return baseDataRequestApi('/category/searchByName', 'post', params)
}

export function deleteList(params) {
  return baseDataRequestApi('/category', 'delete', params)
}
