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
 * 根据试卷ID集合删除试卷
 * @param params
 * @returns {AxiosPromise}
 */
export function deletePaperRequest(params) {
  return paperRequestApi('/maintain/papers', 'delete', params)
}

/**
 * 维护试卷，包括试卷本体加上试题和答案
 * @param params
 * @returns {AxiosPromise}
 */
export function maintainPaperRequest(params) {
  return paperRequestApi('/maintain/paper', 'put', params)
}
