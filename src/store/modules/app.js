import Cookies from 'js-cookie'

const state = {
    headerFlag: Cookies.get('headerStatus') ? !!+Cookies.get('headerStatus') : true,
    sidebarFlag: Cookies.get('sidebarStatus') ? !!+Cookies.get('sidebarStatus') : true,
    size: Cookies.get('size') || 'mini'
}

const mutations = {

    SHOW_HEADER: (state) => {
        state.headerFlag = true
        Cookies.set('headerStatus', 1)
    },

    HIDE_HEADER: (state) => {
        state.headerFlag = false
        Cookies.set('headerStatus', 0)
    },

    SHOW_SIDEBAR: (state) => {
        state.sidebarFlag = true
        Cookies.set('sidebarStatus', 1)
    },

    HIDE_SIDEBAR: (state) => {
        state.sidebarFlag = false
        Cookies.set('sidebarStatus', 0)
    },

    SET_SIZE: (state, size) => {
        state.size = size
        Cookies.set('size', size)
    }
}

const actions = {
    setHeaderOrSidebar({ commit }, flag) {
        if(!!flag) {
            commit('SHOW_HEADER')
            commit('SHOW_SIDEBAR')
        } else {
            commit('HIDE_HEADER')
            commit('HIDE_SIDEBAR')
        }
    },

    setHeader({ commit }, flag) {
        if(!!flag) commit('SHOW_HEADER')
        else commit('HIDE_HEADER')

    },

    setSidebar({ commit }, flag) {
        if(!!flag) commit('SHOW_SIDEBAR')
        else commit('HIDE_SIDEBAR')
    },

    setSize({ commit }, size) {
        commit('SET_SIZE', size)
    }
}

export default {
    namespaced: true,
    state,
    mutations,
    actions
}
