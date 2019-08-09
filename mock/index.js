import Mock from 'mockjs'
import { param2Obj } from '../src/utils'

import user from './user'
import table from './table'
import paper from './paper'

const mocks = [
  ...user,
  ...table,
  ...paper
]

// 前端的响应模拟 （ mock ）
// 请谨慎使用它，它将重新定义XMLHttpRequest，
// 这将导致许多第三方库失效（如进度条事件）。
export function mockXHR() {
  // mock 补丁修复
  // https://github.com/nuysoft/Mock/issues/300
  Mock.XHR.prototype.proxy_send = Mock.XHR.prototype.send
  Mock.XHR.prototype.send = function() {
    if (this.custom.xhr) {
      this.custom.xhr.withCredentials = this.withCredentials || false

      if (this.responseType) {
        this.custom.xhr.responseType = this.responseType
      }
    }
    this.proxy_send(...arguments)
  }

  /**
   * 绑定响应的执行方法，返回值为响应的参数
   * @param {*} respond 响应方法
   */
  function XHR2ExpressReqWrap(respond) {
    return function(options) {
      let result = null
      if (respond instanceof Function) {
        const { body, type, url } = options
        // https://expressjs.com/en/4x/api.html#req
        result = respond({
          method: type,
          body: JSON.parse(body),
          query: param2Obj(url)
        })
      } else {
        result = respond
      }
      return Mock.mock(result)
    }
  }

  /**
   * 遍历模拟响应的集合，添加至 Mock中
   * 记录用于生成响应数据的函数。
   * 当拦截到匹配 rurl 和 rtype 的 Ajax 请求时，
   * 函数 function(options) 将被执行，并把执行结果作为响应数据返回。
   */
  for (const i of mocks) {
    // console.log('URL: ' + i.url + ' TYPE: ' + i.type)
    Mock.mock(new RegExp(i.url), i.type || 'get', XHR2ExpressReqWrap(i.response))
  }
}

// for mock server
const responseFake = (url, type, respond) => {
  return {
    /**
     * 匹配请求的 URL,请求的路径中包含 /mock + url则匹配
     */
    // url: new RegExp(`/mock${url}`),
    url: new RegExp(url),
    type: type || 'get',
    response(req, res) {
      res.json(Mock.mock(respond instanceof Function ? respond(req, res) : respond))
    }
  }
}

export default mocks.map(route => {
  return responseFake(route.url, route.type, route.response)
})
