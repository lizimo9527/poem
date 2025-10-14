import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'

// 路由组件懒加载
const Home = () => import('../views/HomeView.vue')
const Poems = () => import('../views/PoemsView.vue')
const Authors = () => import('../views/AuthorsView.vue')
const Favorites = () => import('../views/FavoritesView.vue')
const PoemDetail = () => import('../views/PoemDetailView.vue')

// 路由配置
const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    meta: {
      title: '诗词首页'
    }
  },
  {
    path: '/poems',
    name: 'Poems',
    component: Poems,
    meta: {
      title: '诗词浏览'
    }
  },
  {
    path: '/authors',
    name: 'Authors',
    component: Authors,
    meta: {
      title: '诗人列表'
    }
  },
  {
    path: '/favorites',
    name: 'Favorites',
    component: Favorites,
    meta: {
      title: '我的收藏'
    }
  },
  {
    path: '/poem/:id',
    name: 'PoemDetail',
    component: PoemDetail,
    meta: {
      title: '诗词详情'
    }
  },
  {
    // 404 页面重定向
    path: '/:pathMatch(.*)*',
    redirect: '/'
  }
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
  }
})

// 全局前置守卫
router.beforeEach((to, from, next) => {
  if (to.meta?.title) {
    document.title = `${to.meta.title} - 古诗词赏析`
  }
  next()
})

export default router