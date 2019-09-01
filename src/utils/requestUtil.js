import axios from 'axios'
import request from '@/utils/request'
import { getCookies, setCookies } from '@/utils/auth'

/**
 * 请求封装的工具类
 * commonRequestUtil: 封装commonRequest（不能被外部引用）
 * saveHead: 保存公用head信息到cookie
 * systemRequestApi: 系统API统一请求格式
 * baseDataRequestApi: 基础数据API统一请求格式
 * paperRequestApi: 试卷API统一请求格式
 * examRequestApi: 考试API统一请求格式
 * permissionRequestApi: 权限认证API统一请求格式
 * normalRequest: 通用请求方法
 * cancel: 取消请求的方法，需要传取消请求的ID（new）
 *
 * 使用说明：
 *  外部直接import该文件的某个方法，直接使用即可
 *
 *  新增了可以取消请求的方法，只需在API方法中传第四个参数，
 *  用于识别当前请求的取消方法，传一个当前< 时间戳 > 即可
 *  然后在外部直接调用cancel方法进行取消，
 *  注意，请求发送的一分钟后自动清楚缓存中的该条请求数据，无法继续进行cancel
 */

const CancelToken = axios.CancelToken
// 缓存取消请求的数据
const cancelCache = []
/**
 * common request util
 * 从cookies 获取公共数据
 * @param params
 * @returns {{head: {deviceType, crypt, businessType, version, deviceId, token}, body: *}}
 */
function commonRequestUtil(params) {
  const head = JSON.parse(getCookies('head') || null)
  return {
    head: {
      version: head.version,
      businessType: head.businessType,
      deviceId: head.deviceId,
      deviceType: head.deviceType,
      crypt: head.crypt
    },
    body: params
  }
}

/**
 * 保存公用数据至cookie
 * @param version
 * @param businessType
 * @param deviceId
 * @param deviceType
 * @param crypt
 */
export function saveHead(version, businessType, deviceId, deviceType, crypt) {
  const head = {
    version: version,
    businessType: businessType,
    deviceId: deviceId,
    deviceType: deviceType,
    crypt: crypt
  }
  setCookies('head', JSON.stringify(head))
}

/**
 * 系统API统一请求格式
 * @param url API业务路径
 * @param method 请求类型（GET、POST、PUT、DELETE）
 * @param params 放在自定义body里面的数据
 * @param cancel 取消发送请求的数据
 * @returns {AxiosPromise}
 */
export function systemRequestApi(url, method, params, cancel) {
  return normalRequest('/boss/bes/system' + url, method, params, cancel)
}

/**
 * 基础数据API统一请求格式
 * @param url API业务路径
 * @param method 请求类型（GET、POST、PUT、DELETE）
 * @param params 放在自定义body里面的数据
 * @param cancel 取消发送请求的数据
 * @returns {AxiosPromise}
 */
export function baseDataRequestApi(url, method, params, cancel) {
  return normalRequest('/boss/bes/basedata' + url, method, params, cancel)
}

/**
 * 试卷API统一请求格式
 * @param url API业务路径
 * @param method 请求类型（GET、POST、PUT、DELETE）
 * @param params 放在自定义body里面的数据
 * @param cancel 取消发送请求的数据
 * @returns {AxiosPromise}
 */
export function paperRequestApi(url, method, params, cancel) {
  return normalRequest('/boss/bes/paper' + url, method, params, cancel)
}

/**
 * 考试API统一请求格式
 * @param url API业务路径
 * @param method 请求类型（GET、POST、PUT、DELETE）
 * @param params 放在自定义body里面的数据
 * @param cancel 取消发送请求的数据
 * @returns {AxiosPromise}
 */
export function examRequestApi(url, method, params, cancel) {
  return normalRequest('/boss/bes/exam' + url, method, params, cancel)
}

/**
 * 权限认证API统一请求格式
 * @param url API业务路径
 * @param method 请求类型（GET、POST、PUT、DELETE）
 * @param params 放在自定义body里面的数据
 * @param cancel 取消发送请求的数据
 * @returns {AxiosPromise}
 */
export function permissionRequestApi(url, method, params, cancel) {
  return normalRequest('/boss/bes/permission' + url, method, params, cancel)
}

/**
 * 通用请求方法
 * @param url API业务路径
 * @param method 请求类型（GET、POST、PUT、DELETE）
 * @param params 放在自定义body里面的数据
 * @param cancel 取消发送请求的数据
 * @returns {AxiosPromise}
 */
export function normalRequest(url, method, params, cancel) {
  const source = CancelToken.source()
  if (cancel) {
    cancelCache.push({
      id: cancel,
      fun: source
    })
    // 一分钟之后自动清楚取消缓存中的数据
    setTimeout(() => {
      cancelCache.forEach((item, index) => {
        if (item.id === cancel.id) {
          cancelCache.splice(index, 1)
        }
      })
    }, 60000)
  }
  return request({
    url: url,
    method: method,
    data: commonRequestUtil(params),
    cancelToken: source.token
  })
}

/**
 * 根据请求的编号，取消发送的请求
 * @param cancelId 取消请求的编号
 * @param message 取消请求的提示消息
 */
export function cancel(cancelId, message) {
  if (message == null) {
    message = '发送的请求已取消！'
  }
  cancelCache.forEach((item, index) => {
    if (item.id === cancelId) {
      item.fun.cancel(message)
      // 取消完消息之后删除缓存
      cancelCache.splice(index, 1)
    }
  })
}
