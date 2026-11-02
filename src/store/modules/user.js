import Cookies from 'js-cookie'
import router, { resetRouter } from '@/router'
import { isFatherAndSon } from '@/utils/index'
import { setToken, removeToken } from '@/utils/auth'
import { login, logout, getUserData, getUserMenu, getUserRoles, getNewMenu } from '@/api/user'

const state = {
    user: {},
    menu: [],
    roles: [],
    allMenu: []
}

const mutations = {
    SET_USER: (state, user) => {
        if (Object.prototype.toString.call(user) === '[object Object]') {
            state.user = user
        }
    },

    SET_MENU: (state, menu) => {
        if (Array.isArray(menu)) {
            state.menu = menu
        }
    },

    SET_ROLES: (state, roles) => {
        if (Array.isArray(roles)) {
            state.roles = roles
        }
    },

    SET_ALL_MENU: (state, allMenu) => {
        if (Array.isArray(allMenu)) {
            state.allMenu = allMenu
        }
    }
}

const actions = {
    login({ commit }, userInfo) {
        const { username, password } = userInfo
        return new Promise((resolve, reject) => {
            login({ username: username.trim(), password })
                .then(response => {
                    const { data } = response
                    setToken(true)
                    commit('SET_USER', data)
                    resolve()
                }).catch(error => {
                    reject(error)
                })

        })
    },

    logout({ commit }) {
        return new Promise((resolve, reject) => {
            logout()
                .then(response => {
                    commit('SET_USER', {})
                    commit('SET_MENU', [])
                    commit('SET_ROLES', [])
                    removeToken()
                    resetRouter()
                    resolve()
                })
                .catch(error => {
                    reject(error)
                })
        })
    },

    getUserInfo({ commit }, user) {
        return new Promise(async (resolve, reject) => {
            try {
                const { data: user } = await getUserData()
                const { data: menu } = await getUserMenu(user.userName)
                const { data: roles } = await getUserRoles(user.userName)
                const { data: allMenu } = await getNewMenu()

                commit('SET_ALL_MENU', allMenu)

                commit('SET_USER', user)
                commit('SET_MENU', isFatherAndSon(menu, 'menuId', 'parentMenuId'))
                commit('SET_ROLES', roles)

                resolve({ user, menu, roles, allMenu })
            } catch (error) {
                reject(error)
            }
        })
    },

    // remove token
    resetToken({ commit }) {
        return new Promise(resolve => {
            commit('SET_USER', {})
            commit('SET_MENU', [])
            commit('SET_ROLES', [])
            removeToken()
            // resetRouter()
            resolve()
        })
    },
}

export default {
    namespaced: true,
    state,
    mutations,
    actions
}
