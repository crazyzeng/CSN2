const state = {
  dots: [],
  station: {},
  updateDataPermission:false
}

const mutations = {
  SET_DOTS: (state, dots) => {
    if (Object.prototype.toString.call(dots) === '[object Object]') {
      state.dots.push(dots)
    }
  },

  RESET_DOTS: (state) => {
    state.dots.length = 0
    // state.dots = [];
  },
  Set_Station: (state, station) => {
    state.station = station
    // console.log(station)
  },
  updatePermission:(state, permission)=>{
    state.updateDataPermission = permission
    console.log(permission)
  }
}

const actions = {
  setDots: ({ commit }, dots) => {
    if (Object.keys(dots).length > 0) {
      commit('RESET_DOTS')
      for (const key in dots) {
        if (dots.hasOwnProperty(key)) {
          commit('SET_DOTS', { pointId: key, value: dots[key] })
        }
      }
    }
  },

  resetDots: ({ commit }) => {
    commit('RESET_DOTS')
  },
  //站名相关信息
  setStation: ({ commit }, station) => {
    commit('Set_Station', station)
  },
  //用户权限更新
  updateUserPermission:({commit},permission)=>{
    commit('updatePermission',permission)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
