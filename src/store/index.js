import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    token: localStorage.getItem('token') || '' //有token就取 取不到说明没登陆过 给一个'' 
  },
  mutations: {
    SET_TOKEN(state, token) {
      state.token = token
      localStorage.setItem('token', token)     //登录成功token就存进去了
    }
  },
  actions: {
  },
  modules: {
  }
})
