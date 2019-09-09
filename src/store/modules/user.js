import { login, logout, getMenu } from '@/api/permission/user'
import { getToken, setToken, removeToken, setCookies, getCookies, removeCookies } from '@/utils/auth'
import { saveHead } from '@/utils/requestUtil'
import router, { resetRouter } from '@/router'

const state = {
  token: getToken(),
  name: '',
  avatar: '',
  routers: []
}

const mutations = {
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  },
  SET_ROUTERS: (state, avatar) => {
    state.routers = avatar
  }
}

const actions = {
  // 用户登录
  login({ commit }, userInfo) {
    const { username, password } = userInfo
    return new Promise((resolve, reject) => {
      login({ username: username.trim(), password: password }).then(result => {
        const data = result.body
        commit('SET_TOKEN', data.token)
        commit('SET_NAME', data.name)
        commit('SET_AVATAR', data.avatar)
        // 将用户信息放入cookies中，防止页面刷新无法加载
        const userInfo = {
          name: data.name,
          avatar: data.avatar
        }
        setCookies('userInfo', JSON.stringify(userInfo))
        setToken(data.token)
        saveHead(data.version, data.businessType, data.deviceId, data.deviceType, data.crypt)
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // 获取用户基础信息
  getInfo({ commit, state }) {
    const info = JSON.parse(getCookies('userInfo'))
    commit('SET_NAME', info.name)
    commit('SET_AVATAR', info.avatar)
  },

  // 获取用户菜单
  getMenu({ commit, state }) {
    return new Promise((resolve, reject) => {
      getMenu(state.token).then(response => {
        const data = response.body
        if (!data) {
          reject('权限获取失败, 请联系管理员重新登录！')
        }
        // 在这里进行路由转换

        // 重新设置路由
        resetRouter()
        router.options.routes = data
        router.addRoutes(data)
        commit('SET_ROUTERS', data)
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // 用户退出
  logout({ commit, state }) {
    return new Promise((resolve, reject) => {
      logout(state.token).then(() => {
        commit('SET_TOKEN', '')
        removeCookies('userInfo')
        removeToken()
        resetRouter()
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // 删除 token
  resetToken({ commit }) {
    return new Promise(resolve => {
      commit('SET_TOKEN', '')
      removeToken()
      resolve()
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

