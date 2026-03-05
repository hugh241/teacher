const state = {
    type: ''
  }
  
  const mutations = {
    ADD_TYPE: (state, payload) => {
      state.type = payload;
      console.log('文档文档', state.type);
    },
  
  }
  const actions = {
    saveTableData({ commit }, payload) {
      commit('ADD_TYPE', payload)
    },
  }
  
  export default {
    namespaced: true,
    state,
    mutations,
    actions
  }
  