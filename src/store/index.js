import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

function initiaState() {
  return {
    token: localStorage.getItem("token") || "",
    username: localStorage.getItem("username") || ""
  }
}

export default new Vuex.Store({
  state: {
    username: localStorage.getItem("username") || "",
    token: localStorage.getItem('token') || '' //有token就取 取不到说明没登陆过 给一个'' 
  },
  mutations: {
    SET_TOKEN(state, token) {
      state.token = token
      localStorage.setItem('token', token)     //登录成功token就存进去了
    },
    setUsername(state, data) {
      state.username = data;
      localStorage.setItem("username", data) 
    },
    //重置state(用于退出登陆效果)
    resetState(state) {
      Object.assign(state, initiaState())
    }
  },
  actions: {
  },
  modules: {
  }
})
