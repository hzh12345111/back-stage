import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import 'reset-css'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';

import instance from './http/index.js' //导入
Vue.prototype.$axios = instance      //挂载vue原型上面


Vue.use(ElementUI);
Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
