/**
 * 工具类
 */

/**
 * Parse the time to string
 * @param {(Object|string|number)} time
 * @param {string} cFormat
 * @returns {string}
 */
export function parseTime(time, cFormat) {
  if (arguments.length === 0) {
    return null
  }
  const format = cFormat || '{y}-{m}-{d} {h}:{i}:{s}'
  let date
  if (typeof time === 'object') {
    date = time
  } else {
    if ((typeof time === 'string') && (/^[0-9]+$/.test(time))) {
      time = parseInt(time)
    }
    if ((typeof time === 'number') && (time.toString().length === 10)) {
      time = time * 1000
    }
    date = new Date(time)
  }
  const formatObj = {
    y: date.getFullYear(),
    m: date.getMonth() + 1,
    d: date.getDate(),
    h: date.getHours(),
    i: date.getMinutes(),
    s: date.getSeconds(),
    a: date.getDay()
  }
  const time_str = format.replace(/{(y|m|d|h|i|s|a)+}/g, (result, key) => {
    let value = formatObj[key]
    // Note: getDay() returns 0 on Sunday
    if (key === 'a') { return ['日', '一', '二', '三', '四', '五', '六'][value ] }
    if (result.length > 0 && value < 10) {
      value = '0' + value
    }
    return value || 0
  })
  return time_str
}

/**
 * 时间格式化 - 历史时间中文化
 * @param {number} time
 * @param {string} option
 * @returns {string}
 */
export function formatTime(time, option) {
  if (('' + time).length === 10) {
    time = parseInt(time) * 1000
  } else {
    time = +time
  }
  const d = new Date(time)
  const now = Date.now()

  const diff = (now - d) / 1000

  if (diff < 30) {
    return '刚刚'
  } else if (diff < 3600) {
    // less 1 hour
    return Math.ceil(diff / 60) + '分钟前'
  } else if (diff < 3600 * 24) {
    return Math.ceil(diff / 3600) + '小时前'
  } else if (diff < 3600 * 24 * 2) {
    return '1天前'
  }
  if (option) {
    return parseTime(time, option)
  } else {
    return (
      d.getMonth() +
      1 +
      '月' +
      d.getDate() +
      '日' +
      d.getHours() +
      '时' +
      d.getMinutes() +
      '分'
    )
  }
}

/**
 * 参数转换成 JSON对象
 * @param {string} url
 * @returns {Object}
 */
export function param2Obj(url) {
  const search = url.split('?')[1]
  if (!search) {
    return {}
  }
  return JSON.parse(
    '{"' +
      decodeURIComponent(search)
        .replace(/"/g, '\\"')
        .replace(/&/g, '","')
        .replace(/=/g, '":"')
        .replace(/\+/g, ' ') +
      '"}'
  )
}

/**
 * id转value
 * @param target
 * @param targetList
 * @returns {*}
 */
export function idToValueConversionFilter(target, targetList) {
  let result = null
  targetList.forEach(item => {
    if (item.id === target) {
      result = item.value
    }
  })
  return result
}

/**
 * id转name
 * @param target
 * @param targetList
 * @returns {*}
 */
export function idToNameConversionFilter(target, targetList) {
  let result = null
  targetList.forEach(item => {
    if (item.id === target) {
      result = item.name
    }
  })
  return result
}

/**
 * 根据value和集合获取对应的ID
 * @param list 集合
 * @param value 值
 * @returns {*}
 */
export function getIdByValue(list, value) {
  let result = null
  list.forEach(item => {
    if (item.value === value) {
      result = item.id
    }
  })
  return result
}

export const optionList = ['A', 'B', 'C', 'D', 'E', 'F', 'G']

export const constants = {
  paperType: 'paperType',
  paperDifficult: 'paperDifficult',
  subjectDifficult: '题目难度'
}

/**
 * 遍历树，获取树的列表集合
 * @param list
 * @param treeList
 */
export function getTreeList(list, treeList) {
  list.forEach(item => {
    treeList.push({
      id: item.id,
      value: item.label
    })
    if (item.children.length > 0) {
      getTreeList(item.children, treeList)
    }
  })
}
