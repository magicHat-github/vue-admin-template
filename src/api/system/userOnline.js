import { systemRequestApi } from '@/utils/requestUtil'
/**
 * 参数管理的相关API
 */
/**
 * 分页查询，主要页面打开时渲染数据和执行查询操作时渲染新的数据
 * @param {*} params 参数
*/
export function select(params) {
  return systemRequestApi('/userOnline/queryRecord', 'post', params)
}

export function forceOffline(params) {
  return systemRequestApi('/userOnline/forceOffline', 'post', params)
}
