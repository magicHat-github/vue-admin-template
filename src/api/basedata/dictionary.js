import { baseDataRequestApi } from '@/utils/requestUtil'

/**
 * 数据字典相关的api
 */

/**
 * 分页查询，主要页面打开时渲染数据和执行查询操作时渲染新的数据
 * @param {*} params 参数
*/
export function select(params) {
  return baseDataRequestApi('/dictionary/queryRecord', 'post', params)
}

/**
 * 删除操作，可以删除一条到多条
 * @param {*} params 参数
 */
export function deleteList(params) {
  return baseDataRequestApi('/dictionary/deleteRecord', 'delete', params)
}

/**
 * 添加一条记录
 * @param {*} params 参数
 */
export function insert(params) {
  return baseDataRequestApi('/dictioanry/addRecord', 'post', params)
}

/**
 * 按照字典的id查询一条记录，是为了便于执行更新操作时从后台拿到数据先渲染出来再修改
 * @param {*} params 参数
 */
export function searchItem(params) {
  return baseDataRequestApi('/dictionary/searchById', 'post', params)
}

/**
 * 更新一条记录
 * @param {*} params 参数
 */
export function updateItem(params) {
  return baseDataRequestApi('/dictionary/updateRecord', 'put', params)
}
