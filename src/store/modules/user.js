import { login, logout, getMenu } from '@/api/permission/user'
import { getToken, setToken, removeToken, setCookies, getCookies, removeCookies } from '@/utils/auth'
import { saveHead } from '@/utils/requestUtil'
import { resetRouter } from '@/router'

const state = {
  token: getToken(),
  name: '',
  avatar: ''
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
    // return new Promise((resolve, reject) => {
    //   getInfo(state.token).then(response => {
    //     const data = response.body
    //     commit('SET_NAME', 'Super Admin')
    //     commit('SET_AVATAR', 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif')
    //     resolve(data)
    //   }).catch(error => {
    //     reject(error)
    //   })
    // })
  },

  // 获取用户菜单
  getMenu({ commit, state }) {
    return new Promise((resolve, reject) => {
      getMenu(state.token).then(response => {
        const data = response.body

        if (!data) {
          reject('Verification failed, please Login again.')
        }

        const { name, avatar } = data

        commit('SET_NAME', name)
        commit('SET_AVATAR', avatar)
        resolve(data)
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

