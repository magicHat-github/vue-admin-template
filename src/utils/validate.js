/**
 * 校验数据格式的工具类
 */

/**
 * @param {string} path
 * @returns {Boolean}
 */
export function isExternal(path) {
  return /^(https?:|mailto:|tel:)/.test(path)
}

/**
 * @param {string} str
 * @returns {Boolean}
 */
export function validUsername(str) {
  const valid_map = ['admin', 'root']
  return valid_map.indexOf(str.trim()) >= 0
}

export function isNumber(rule, value, callback) {
  if (!value) {
    return callback(new Error('不能为空'))
  }
  if (!Number.isInteger(value)) {
    callback(new Error('请输入数字值'))
  } else {
    callback()
  }
}
