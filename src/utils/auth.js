import Cookies from 'js-cookie'

const TokenKey = 'vue_admin_template_token'

/**
 * token相关操作 - 获取.保存.删除
 * 将 token放入Cookie保存
 */

export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(token) {
  return Cookies.set(TokenKey, token)
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}
