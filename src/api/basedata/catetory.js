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

export function deleteList(params) {
  return baseDataRequestApi('/category', 'delete', params)
}

export function searchTree() {
  return baseDataRequestApi('/category/searchTree', 'get')
}

export function insert(params) {
  return baseDataRequestApi('/category', 'post', params)
}

export function searchItem(params) {
  return baseDataRequestApi('/category/searchById', 'post', params)
}

export function updateItem(params) {
  return baseDataRequestApi('/category', 'put', params)
}
