
import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../views/Login'
import params from "../views/goods/params"
import store from '../store/index.js'  //在js文件获取不到$store 所以需要获取store
Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Index',
    redirect: {
      name: 'Users'
    }
  },
  {
    path: '/home',
    name: 'Home',
    component: () => import(/* webpackChunkName: "home" */ '../views/Home.vue'),
    children: [
      {
        path: 'users',
        name: 'Users',
        component: () => import(/* webpackChunkName: "Users" */ '../views/users/users.vue')
      },
      {
        path: 'roles',
        name: 'Roles',
        component: () => import(/* webpackChunkName: "roles" */ '../views/roles/roles.vue')
      },
      {
        path: 'rights',
        name: 'Rights',
        component: () => import(/* webpackChunkName: "rights" */ '../views/roles/rights.vue')
      },
      {
        path: 'goods',
        name: 'Goods',
        component: () => import(/* webpackChunkName: "goods" */ '../views/goods/goods.vue')
      },
      {
        path: 'params',
        name: 'Params',
        component: params
      },
      {
        path: 'categories',
        name: 'Categories',
        component: () => import(/* webpackChunkName: "categories" */ '../views/goods/categories.vue')
      },
      {
        path: 'orders',
        name: 'Orders',
        component: () => import(/* webpackChunkName: "orders" */ '../views/orders/orders.vue')
      },
      {
        path: 'reports',
        name: 'Reports',
        component: () => import(/* webpackChunkName: "reports" */ '../views/reports/reports.vue')
      }
    ]
  },
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  // {
  //   path: '/home',
  //   name: 'Home',
  //   component: () => import(/* webpackChunkName: "home" */ '../views/Home.vue'),

  // }
  // {
  //   path: '/login',
  //   name: 'Login',
  //   component: () => import(/* webpackChunkName: "login" */ '../views/Login.vue')
  // }
]

const router = new VueRouter({
  routes
})
router.beforeEach((to, from, next) => {//前置由守卫
  if (to.name === 'Login') { //将要跳转到页面是不是登录 
    next() //如果是登录页的话就继续往下执行
  } else { //如果不是登录页的话
    if (store.state.token) { //判断vuex里的页面token有没有 (登录页以外的)
      next()  //如果有token说明你登录了 然后继续执行
    } else { //说明你不是登录页 也没有token 就不让你跳转这个页面
      next({
        name: 'Login'
      })
    }
  }
})

export default router
