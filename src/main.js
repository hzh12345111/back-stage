import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import 'reset-css'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';

import BreadCrumb from "./components/BreadCrumb.vue"; //<!-- 面包屑 --> 全局注册组件
Vue.component('bread-crumb', BreadCrumb)

import instance from './http/index.js' //导入
Vue.prototype.$axios = instance      //挂载vue原型上面


Vue.use(ElementUI);
Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
