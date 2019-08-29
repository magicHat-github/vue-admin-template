import request from '@/utils/request'
import { systemRequestApi } from '@/utils/requestUtil'
/**
 * 用户管理的相关API
 */

/**
 * 对用户分页查询
 * @param {*} params 参数
 */
export function selectTable(params) {
  return systemRequestApi('/system/user', 'get', params)
}

/**
 * 根据试卷配置项编号获取配置项详情
 * @param params
 * @returns {AxiosPromise}
 */
export function selectConfigItemById(params) {
  return systemRequestApi('/paper/config/item', 'get', params)
}

/**
 * 添加
 * @param {*} params 参数
 */
export function save(params) {
  // console.log(params)
  return request({
    url: '/paper/composition',
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
    url: '/paper/composition',
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
    url: '/paper/composition',
    method: 'delete',
    data: ids
  })
}

/**
 * 禁用
 * @param {*} id 禁用编号
 */
export function disable(id) {
  // console.log(id)
  return request({
    url: '/paper/composition/status',
    method: 'put',
    data: id
  })
}
