import { baseDataRequestApi } from '@/utils/requestUtil'

/**
 * 组卷配置相关API
 */

/**
 * 查询配置项集合
 * @param {*} params 参数
 */
export function selectConfigs(params) {
  return baseDataRequestApi('/paper/configs', 'post', params)
}

/**
 * 根据ID查询配置项详情集合
 * @param {*} params 参数
 */
export function selectItemsByConfigId(params) {
  return baseDataRequestApi('/paper/items', 'post', params)
}
