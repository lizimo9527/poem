import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'
import { supabase } from '@/utils/supabase'

// 路由组件懒加载
const Home = () => import('../views/HomeView.vue')
const Poems = () => import('../views/PoemsView.vue')
const Authors = () => import('../views/AuthorsView.vue')
const Favorites = () => import('../views/FavoritesView.vue')
const PoemDetail = () => import('../views/PoemDetailView.vue')
const Statistics = () => import('../views/StatisticsView.vue')
const Login = () => import('../views/LoginView.vue')
const User = () => import('../views/UserView.vue')

// 路由配置
const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    meta: {
      title: '诗词首页',
    },
  },
  {
    path: '/poems',
    name: 'Poems',
    component: Poems,
    meta: {
      title: '诗词浏览',
    },
  },
  {
    path: '/authors',
    name: 'Authors',
    component: Authors,
    meta: {
      title: '诗人列表',
    },
  },
  {
    path: '/favorites',
    name: 'Favorites',
    component: Favorites,
    meta: {
      title: '我的收藏',
      requiresAuth: true,
    },
  },
  {
    path: '/login',
    name: 'Login',
    component: Login,
    meta: {
      title: '登录',
    },
  },
  {
    path: '/user',
    name: 'User',
    component: User,
    meta: {
      title: '用户中心',
      requiresAuth: true,
    },
  },
  {
    path: '/poem/:id',
    name: 'PoemDetail',
    component: PoemDetail,
    meta: {
      title: '诗词详情',
    },
  },
  {
    path: '/statistics',
    name: 'Statistics',
    component: Statistics,
    meta: {
      title: '诗词统计',
    },
  },

  {
    // 404 页面重定向
    path: '/:pathMatch(.*)*',
    redirect: '/',
  },
]

// 创建路由实例
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0 }
    }
  },
})

// 全局前置守卫
router.beforeEach(async (to, from, next) => {
  // 设置页面标题
  if (to.meta?.title) {
    document.title = `${to.meta.title} - 古诗词赏析`
  }

  // 检查是否需要认证
  if (to.meta?.requiresAuth) {
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession()
      if (!session) {
        next('/login')
        return
      }
    } catch (error) {
      console.error('认证检查失败:', error)
      next('/login')
      return
    }
  }

  // 如果已登录，重定向登录页面到首页
  if (to.path === '/login') {
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession()
      if (session) {
        next('/')
        return
      }
    } catch (error) {
      console.error('认证检查失败:', error)
    }
  }

  next()
})

export default router
