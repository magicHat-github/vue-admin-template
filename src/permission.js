import router from './router'
import store from './store'
import { Message } from 'element-ui'
import NProgress from 'nprogress' // 浏览器顶部进度条
import 'nprogress/nprogress.css' // 进度条样式
import { getToken } from '@/utils/auth' // 从cookie获取令牌
import getPageTitle from '@/utils/get-page-title'

NProgress.configure({ showSpinner: false }) // 进度条配置

const whiteList = ['/login'] // 没有重定向白名单

/**
 * 权限验证
 * 每次页面跳转或者请求，被拦截
 * 负责验证 token
 * 登录成功之后获取用户权限菜单可由此调用
 */
router.beforeEach(async(to, from, next) => {
  // 进度条开始加载
  NProgress.start()

  // 设置页面的标题 title
  document.title = getPageTitle(to.meta.title)

  // 确定用户是否已登录
  const hasToken = getToken()

  if (hasToken) {
    if (to.path === '/login') {
      // 如果已登录, 想去登录页面, 则重定向到主页
      next({ path: '/' })
      NProgress.done()
    } else {
      // 确定用户是否通过getInfo获取了他的权限角色
      const hasGetUserInfo = store.getters.name
      if (hasGetUserInfo) {
        next()
      } else {
        try {
          // 获取用户信息
          await store.dispatch('user/getInfo')
          // 获取菜单
          // const menu = await store.dispatch('user/getMenu')
          // router.addRoutes(menu)

          next()
        } catch (error) {
          // 删除令牌并转到登录页面重新登录
          await store.dispatch('user/resetToken')
          Message.error(error || 'Has Error')
          next(`/login?redirect=${to.path}`)
          NProgress.done()
        }
      }
    }
  } else {
    /* 没有令牌 */

    if (whiteList.indexOf(to.path) !== -1) {
      // 在免费登录白名单中，直接进入
      next()
    } else {
      // 其他无权访问的页面将重定向到登录页面。
      next(`/login?redirect=${to.path}`)
      NProgress.done()
    }
  }
})

router.afterEach(() => {
  // 完成进度条加载
  NProgress.done()
})
