import request from '@/utils/request'
import { paperRequestApi } from '@/utils/requestUtil'
/**
 * 组卷管理的相关API
 */

/**
 * 分页查询
 * @param params 参数
 * @param cancel 取消请求的方法
 * @returns {AxiosPromise}
 */
export function select(params, cancel) {
  return paperRequestApi('/composition/papers', 'post', params, cancel)
}

/**
 * 上传试卷为模板
 * @param params 参数
 * @returns {AxiosPromise}
 */
export function uploadPaper(params) {
  return paperRequestApi('/upload/template', 'post', params)
}

/**
 * 下载模板为试卷
 * @param params 参数
 * @returns {AxiosPromise}
 */
export function downloadPaper(params) {
  return paperRequestApi('/download/paper', 'post', params)
}

/**
 * 快速组卷
 * @param params 参数
 * @param cancel 取消请求的方法
 * @returns {AxiosPromise}
 */
export function startCompositionRequest(params, cancel) {
  return paperRequestApi('/composition/quick', 'post', params, cancel)
}

/**
 * 标准组卷
 * @param params 参数
 * @param cancel 取消请求的方法
 * @returns {AxiosPromise}
 */
export function normalCompositionRequest(params, cancel) {
  return paperRequestApi('/composition/normal', 'post', params, cancel)
}

/**
 * 试卷预览
 * @param params 参数
 * @returns {AxiosPromise}
 */
export function previewRequest(params) {
  return paperRequestApi('/composition/preview', 'post', params)
}

/**
 * 分页查询
 * @param {*} params 参数
 */
export function selectConfigList(params) {
  return paperRequestApi('/paper/config/list', 'get', params)
}

/**
 * 根据试卷配置项编号获取配置项详情
 * @param params
 * @returns {AxiosPromise}
 */
export function selectConfigItemById(params) {
  return paperRequestApi('/paper/config/item', 'get', params)
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
