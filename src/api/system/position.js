import { systemRequestApi } from '@/utils/requestUtil'

/**
 * 添加
 * @param {*} params 参数
 */
export function insertPosition(params) {
  return systemRequestApi('/position/add', 'POST', params)
}

/**
 * 新增职位
 * @param {*} params 参数
 */
export function queryPosition(params) {
  return systemRequestApi('/position/query', 'POST', params)
}

/**
 * 删除职位
 * @param {*} params 参数
 */
export function deletePosition(params) {
  return systemRequestApi('/position/delete', 'POST', params)
}

/**
 * 更新职位信息
 * @param {*} params 参数
 */
export function updatePosition(params) {
  return systemRequestApi('/position/update', 'POST', params)
}
