import { permissionRequestApi } from '@/utils/requestUtil'
import request from '@/utils/request'

export function login(data) {
  const requestBody = {
    'head': {
    },
    'body': {
      'username': data.username,
      'companyId': 234,
      'companyName': '软件',
      'orgId': 456,
      'orgName': '博思'
    }
  }
  return request({
    url: '/boss/bes/permission/login',
    method: 'post',
    data: requestBody
  })
}

export function getInfo(token) {
  const body = {
    'username': '123',
    'companyId': 234,
    'companyName': '软件',
    'orgId': 456,
    'orgName': '博思'
  }
  return permissionRequestApi('/info', 'post', body)
}

export function logout() {
  const body = {
    'username': '123',
    'companyId': 234,
    'companyName': '软件',
    'orgId': 456,
    'orgName': '博思'
  }
  return permissionRequestApi('/logout', 'post', body)
}

// 可以删除
export function getMenu(token) {
  return permissionRequestApi('/menu', 'get', token)
}
