import { createRouter, createWebHistory } from 'vue-router'

// 注册登录路由
import Auth from '@/views/Auth/index.vue'
import Login from '@/views/Auth/Login/LoginPage.vue'
import Register from '@/views/Auth/Register/RegisterPage.vue'

// 主页路由
import HomePage from '@/views/Home/HomePage.vue'

import { useAuthStore } from '@/stores/auth'



const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {path: '/', redirect: '/auth/login'},
    {path: '/auth',
      component: Auth,
      children: [
      {path: 'login', component: Login},
      {path: 'register', component: Register}
    ]
  },
    {path: '/home',
    component: HomePage,
    // 🔥 关键点：加个 meta 属性，标记这个页面"需要登录"
    meta: {
      requiresAuth: true
    }}
  ],
})

// 路由守卫
router.beforeEach ((to, form, next) => {
  // 1. 获取 store (必须在 beforeEach 内部获取，因为路由初始化时 Pinia 可能还没挂载)
  const authStore = useAuthStore()
  // 2. 判断是否需要去需要登录后才可以进入的页面
  if (to.meta.requiresAuth) {
    if (authStore.isLoggedIn) {
      next()
    }else {
      next('/auth/login')
    }
  }else {
    next ()
  }
  // 3.防止用户贱兮兮的登录以后还要回去登录页
  if (to.path === '/auth/login' && authStore.isLoggedIn) {
    return next('/auth/home')
  }
})



export default router
