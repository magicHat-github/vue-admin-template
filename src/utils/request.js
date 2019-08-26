import axios from 'axios'
import { MessageBox, Message } from 'element-ui'
import store from '@/store'
import { code } from './code' // 响应码
import { getToken } from '@/utils/auth'

/**
 * 这个文件封装了API请求
 * 项目中需要发送请求时,需要应用这个文件,引用格式如下
 * import request from '@/utils/request'
 */

// 创建一个 axios 实例
const service = axios.create({
  baseURL: '', // url = base url + request url
  // withCredentials: true, // 跨域请求时发送cookie
  timeout: 5000 // request timeout
})

// 请求拦截器
service.interceptors.request.use(
  // 在发送请求之前做一些事情
  config => {
    if (store.getters.token) {
      config.headers['token'] = getToken()
    }
    return config
  },
  // 在请求失败的时候做一些事情
  error => {
    // 打印错误日志
    console.log(error)
    return Promise.reject(error)
  }
)
// 需要重新登录的异常码集合
const toLoginCode = [code.TOKEN_ILLEGAL, code.OTHER_LOGIN, code.TOKEN_TIMEOUT]

// 响应拦截器
service.interceptors.response.use(
  // 拦截全部的响应
  response => {
    const head = response.data.head
    if (head.code !== code.SUCCESS) {
      Message({
        message: head.msg || '错误',
        type: 'error',
        duration: 5 * 1000
      })
      if (toLoginCode.includes(head.code)) {
        MessageBox.confirm('您的账号已经注销，您可以点击取消继续留在当前页面，或者重新登录', '点击注销', {
          confirmButtonText: '重新登录',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => { store.dispatch('user/resetToken').then(() => { location.reload() }) })
      }
      return Promise.reject(new Error(head.msg || '错误'))
    } else {
      return response.data
    }
  },

  // 请求发生错误时响应的方法
  error => {
    // 打印错误日志
    console.log('err' + error)
    Message({
      message: error.message,
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(error)
  }
)

export default service
