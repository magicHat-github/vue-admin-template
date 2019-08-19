import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/**
 * Note: 子菜单仅在路由children.length> = 1时出现
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   如果设置为true，则项目不会显示在侧栏中（默认为false）
 * alwaysShow: true               如果设置为true，将始终显示根菜单
 *                                如果没有设置alwaysShow，当item有多个子路径时，
 *                                它将成为嵌套模式，否则不会显示根菜单
 * redirect: noRedirect           如果设置noRedirect将不会在面包屑中重定向
 * name:'router-name'             该名称由<keep-alive>使用（必须设置!!!）
 * meta : {
    roles: ['admin','editor']    控制页面角色（可以设置多个角色）
    title: 'title'               侧边栏和面包屑中显示的名称（推荐集）
    icon: 'svg-name'             侧边栏中的图标显示
    breadcrumb: false            如果设置为false，该项将隐藏在痕迹中（默认为true）
    affix: true                  如果设置为true，则标记将固定在tags-view中,建议所有的菜单栏中必须有一个,或者固定在首页
    activeMenu: '/example/list'  如果设置路径，侧边栏将突出显示您设置的路径
  }
 */

/**
 * constantRoutes
 * 没有权限要求的基础页面,
 * 所有的角色都能访问
 *
 * 路由需要注意的点:
 * 1.meta里面的属性 affix: true,固定该页面在顶部导航
 * 2.菜单中根路径的 component 必须为 Layout
 * 3.菜单中根路径的 redirect 需要有准确的路径(建议为子模块的第一个),不然会导航至404页面
 */
export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },

  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },

  {
    path: '/',
    component: Layout,
    redirect: '/welcome',
    children: [
      {
        path: 'welcome',
        name: 'Welcome',
        component: () => import('@/views/welcome'),
        meta: { title: '首页', icon: 'tree', affix: true }
      }
    ]
  },
  /**
   * 基础数据管理
   */
  {
    path: '/basedata',
    component: Layout,
    redirect: '/basedata/dictionary',
    name: 'Basedata',
    meta: { title: '基础数据管理', icon: 'example' },
    children: [
      {
        path: 'dictionary',
        name: 'Dictionary',
        component: () => import('@/views/basedata/dictionary/index'),
        meta: { title: '数据字典管理', icon: 'tree' }
      },
      {
        path: 'add',
        name: 'AddDictionary',
        hidden: true,
        component: () => import('@/views/basedata/dictionary/addDictionary'),
        meta: { title: '新增数据字典' }
      },
      {
        path: 'update',
        name: 'UpdateDictionary',
        hidden: true,
        component: () => import('@/views/basedata/dictionary/updateDictionary'),
        meta: { title: '修改数据字典' }
      },
      {
        path: 'category',
        name: 'Category',
        component: () => import('@/views/basedata/category/index'),
        meta: { title: '题目类别管理', icon: 'tree' }
      },
      {
        path: 'type',
        name: 'Type',
        component: () => import('@/views/basedata/type/index'),
        meta: { title: '题型管理', icon: 'tree' }
      },
      {
        path: 'subject',
        name: 'Subject',
        component: () => import('@/views/basedata/subject/index'),
        meta: { title: '题目管理', icon: 'tree' }
      },
      {
        path: 'config',
        name: 'Config',
        component: () => import('@/views/basedata/config/index'),
        meta: { title: '组卷配置管理', icon: 'tree' }
      }

    ]
  },

  /**
   * 系统管理管理
   */
  {
    path: '/system',
    component: Layout,
    redirect: '/system/position',
    name: 'System',
    meta: { title: '系统管理', icon: 'example' },
    children: [
      {
        path: 'org',
        name: 'org',
        component: () => import('@/views/system/organization/organization'),
        meta: { title: '组织管理', icon: 'tree' }
      },
      {
        path: 'company',
        name: 'Company',
        component: () => import('@/views/system/company/company'),
        meta: { title: '公司管理', icon: 'tree' }
      },
      {
        path: 'addCompany',
        name: 'AddCompany',
        hidden: true,
        component: () => import('@/views/system/company/addCompany'),
        meta: { title: '新增公司' }
      },
      {
        path: 'department',
        name: 'Department',
        component: () => import('@/views/system/department/department'),
        meta: { title: '部门管理', icon: 'tree' }
      },
      {
        path: 'resource',
        name: 'Resource',
        component: () => import('@/views/system/resource/resource'),
        meta: { title: '资源管理', icon: 'tree' }
      },
      {
        path: 'role',
        name: 'Role',
        component: () => import('@/views/system/role/role'),
        meta: { title: '角色管理', icon: 'tree' }
      },
      {
        path: 'distributeUser',
        name: 'DistributeUser',
        hidden: true,
        component: () => import('@/views/system/role/distributeUser'),
        meta: { title: '为角色分配用户' }
      },
      {
        path: 'position',
        name: 'position',
        component: () => import('@/views/system/position/position'),
        meta: { title: '职位管理', icon: 'tree' }
      },
      {
        path: 'add',
        name: 'Add',
        hidden: true,
        component: () => import('@/views/system/position/addposition'),
        meta: { title: '职位增加' }
      },
      {
        path: 'update',
        name: 'update',
        hidden: true,
        component: () => import('@/views/system/position/updateposition'),
        meta: { title: '职位修改' }
      },
      {
        path: 'user',
        name: 'User',
        component: () => import('@/views/system/user/user'),
        meta: { title: '用户管理', icon: 'tree' }
      },
      {
        path: 'addUser',
        name: 'AddUser',
        hidden: true,
        component: () => import('@/views/system/user/addUser'),
        meta: { title: '新增用户' }
      },
      {
        path: 'updateUser',
        name: 'UpdateUser',
        hidden: true,
        component: () => import('@/views/system/user/updateUser'),
        meta: { title: '修改用户' }
      },
      {
        path: 'param',
        name: 'Param',
        component: () => import('@/views/system/param/index'),
        meta: { title: '参数管理', icon: 'tree' }
      },
      {
        path: 'addParam',
        name: 'AddParam',
        hidden: true,
        component: () => import('@/views/system/param/addParam'),
        meta: { title: '添加系统参数', icon: 'tree' }
      },
      {
        path: 'updateParam',
        name: 'UpdateParam',
        hidden: true,
        component: () => import('@/views/system/param/updateParam'),
        meta: { title: '修改系统参数', icon: 'tree' }
      },
      {
        path: 'online',
        name: 'Online',
        component: () => import('@/views/system/online/index'),
        meta: { title: '在线用户情况', icon: 'tree' }
      }
    ]
  },

  /**
   * 考卷管理
   */
  {
    path: '/paper',
    component: Layout,
    redirect: '/paper/composition',
    name: 'Paper',
    meta: { title: '考卷管理', icon: 'example' },
    children: [
      {
        path: 'composition',
        name: 'Composition',
        component: () => import('@/views/paper/composition/index'),
        meta: { title: '组卷', icon: 'tree' }
      },
      {
        path: 'upload',
        name: 'Upload',
        component: () => import('@/views/paper/upload/index'),
        meta: { title: '上传试卷', icon: 'table' }
      },
      {
        path: 'download',
        name: 'Download',
        component: () => import('@/views/paper/download/index'),
        meta: { title: '下载试卷', icon: 'tree' }
      },
      {
        path: 'maintenance',
        name: 'Maintenance',
        component: () => import('@/views/paper/maintenance/index'),
        meta: { title: '维护试卷', icon: 'tree' }
      },
      {
        path: 'template',
        name: 'Template',
        component: () => import('@/views/paper/template/index'),
        meta: { title: '试卷模板管理', icon: 'tree' }
      }
    ]
  },

  // 404 页面必须放在最后 !!!
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
