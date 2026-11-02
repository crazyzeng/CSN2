import defaultSettings from '@/settings'

const state = {
    theme: defaultSettings.theme.blue,
    themeType: defaultSettings.themeType
}

const mutations = {
    SET_THEME: (state, data) => {
        state.theme = data
    },

    SET_THEMETYPE: (state, type) => {
        state.themeType = type
    }
}

const actions = {
    replaceTheme({ commit, state }, type) {

        const themeAll = defaultSettings.theme[type]

        if(Object.prototype.toString.call(themeAll) === '[object Object]') {


            document.querySelector('body').className = `${type}-theme`

            // commit('SET_THEME', theme)
            // commit('SET_ELEMENTTHEME', elementTheme)
            commit('SET_THEMETYPE', type)
        }
    }
}

export default {
    namespaced: true,
    state,
    mutations,
    actions
}
