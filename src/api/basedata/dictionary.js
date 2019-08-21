import { baseDataRequestApi } from '@/utils/requestUtil'
import request from '@/utils/request'

/**
 * 数据字典相关的api
 */

/**
 * 分页查询
 * @param {*} params 参数
*/
export function select(params) {
  return baseDataRequestApi('/basedata/dictionary', 'get', params)
}

/**
 * 添加
 * @param {*} params 参数
 */
export function save(params) {
  // console.log(params)
  return request({
    url: '/basedata/dictionary',
    method: 'post',
    data: params
  })
}

/**
 * 修改
 * @param {*} params 参数
 */
export function update(params) {
  // console.log(params)
  return request({
    url: '/basedata/dictionary',
    method: 'put',
    data: params
  })
}

/**
 * 删除
 * @param {*} ids 删除编号的集合
 */
export function remove(ids) {
  // console.log(ids)
  return request({
    url: '/basedata/dictionary',
    method: 'delete',
    data: ids
  })
}

