import defaultSettings from '@/settings'

const title = defaultSettings.title || '博思考试系统'

/**
 * 这里是获取页面标题
 * 用于 permission.js 中设置页面标题
 * @param {*} pageTitle 页面标题
 */

export default function getPageTitle(pageTitle) {
  if (pageTitle) {
    return `${pageTitle} - ${title}`
  }
  return `${title}`
}
