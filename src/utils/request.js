import axios from 'axios'
import { MessageBox, Message } from 'element-ui'
import store from '@/store'
import { getToken } from '@/utils/auth'
import { code } from './code' // 响应码

/**
 * 这个文件封装了API请求
 * 项目中需要发送请求时,需要应用这个文件,引用格式如下
 * import request from '@/utils/request'
 */

// 创建一个 axios 实例
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  // withCredentials: true, // 跨域请求时发送cookie
  timeout: 5000 // request timeout
})

// 请求拦截器
service.interceptors.request.use(
  config => {
    // 在发送请求之前做一些事情

    if (store.getters.token) {
      // 让每个请求携带令牌
      // ['X-Token'] 是一个自定义的头部键值对
      // 请根据实际情况进行修改
      config.headers['X-Token'] = getToken()
    }
    return config
  },
  error => {
    // 在请求失败的时候做一些事情
    console.log(error) // 打印错误日志
    return Promise.reject(error)
  }
)

// 响应拦截器
service.interceptors.response.use(
  /**
   * 如果您想获取诸如标题或状态之类的http信息
   * 请返回  response => response
  */

  /**
   * 通过自定义代码确定请求状态
   * 这只是一个例子
   * 您还可以通过HTTP状态代码判断状态
   */
  response => {
    const res = response.data

    // 如果自定义代码不是20000，则判断为错误。
    if (res.code !== code.SUCCESS) {
      Message({
        message: res.message || 'Error',
        type: 'error',
        duration: 5 * 1000
      })

      // 50008：非法令牌; 50012：其他客户登录; 50014：令牌已过期;
      if (res.code === code.TOKEN_ILLEGAL || res.code === code.OTHER_LOGIN || res.code === code.TOKEN_TIMEOUT) {
        // to re-login
        MessageBox.confirm('You have been logged out, you can cancel to stay on this page, or log in again', 'Confirm logout', {
          confirmButtonText: 'Re-Login',
          cancelButtonText: 'Cancel',
          type: 'warning'
        }).then(() => {
          store.dispatch('user/resetToken').then(() => {
            location.reload()
          })
        })
      }
      return Promise.reject(new Error(res.message || 'Error'))
    } else {
      return res
    }
  },

  /**
   * 请求发生错误时响应的方法
   */
  error => {
    console.log('err' + error) // 打印错误日志
    Message({
      message: error.message,
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(error)
  }
)

export default service
