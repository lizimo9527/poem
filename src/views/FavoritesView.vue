<template>
  <div class="favorites-view">
    <div class="favorites-header">
      <h1 class="page-title">我的收藏</h1>
      <p class="page-description">这里展示您收藏的所有诗词作品</p>
    </div>

    <!-- 未登录状态 -->
    <div v-if="!user" class="login-prompt">
      <div class="login-icon">🔐</div>
      <h3>请先登录</h3>
      <p>查看收藏功能需要登录账户</p>
      <button @click="goToLogin" class="login-btn">立即登录</button>
    </div>

    <!-- 已登录状态 -->
    <div v-else>
      <div class="user-info">
        <span>欢迎，{{ user.email }}</span>
        <button @click="handleLogout" class="logout-btn">退出</button>
      </div>

      <div v-if="isLoading" class="loading">
        <p>正在加载收藏列表...</p>
      </div>

      <div v-else-if="error" class="error">
        <p>加载失败: {{ error }}</p>
        <button @click="loadFavorites" class="retry-btn">重试</button>
      </div>

      <div v-else>
        <div class="favorites-stats">
          <span class="stat-item">共收藏 {{ favoritePoems.length }} 首诗词</span>
        </div>

        <div v-if="favoritePoems.length === 0" class="empty-state">
          <div class="empty-icon">📚</div>
          <h3>暂无收藏</h3>
          <p>您还没有收藏任何诗词，快去诗词浏览页面发现喜欢的作品吧！</p>
          <RouterLink to="/poems" class="browse-link">浏览诗词</RouterLink>
        </div>

        <div v-else class="favorites-grid">
          <PoemCard
            v-for="poem in favoritePoems"
            :key="poem.id"
            :poem="poem"
            :is-favorite="true"
            @favorite-changed="loadFavorites"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import PoemCard from '@/components/PoemCard.vue'
import useFavorites from '@/composables/useFavorites'
import useAuth from '@/composables/useAuth'
import type { Poem } from '@/types/poem'

const router = useRouter()
const { user, logout } = useAuth()
const { favoritePoems, loadFavorites, isLoading, error, favoriteStatus } = useFavorites()

// 跳转到登录页面
const goToLogin = () => {
  router.push('/login')
}

// 处理退出
const handleLogout = async () => {
  await logout()
}

onMounted(async () => {
  // 检查当前用户状态
  if (user.value) {
    await loadFavorites()
    // 初始化收藏状态 - 收藏页面中的所有诗词都应该是已收藏状态
    if (favoritePoems.value.length > 0) {
      const poemIds = favoritePoems.value.map((poem) => poem.id)
      const statusMap = new Map(poemIds.map((id) => [id, true]))
      // 直接设置收藏状态为true，因为收藏页面中的所有诗词都是已收藏的
      favoriteStatus.value = statusMap
    }
  }
})

// 监听用户状态变化
watch(user, async (newUser) => {
  if (newUser) {
    await loadFavorites()
    // 初始化收藏状态 - 收藏页面中的所有诗词都应该是已收藏状态
    if (favoritePoems.value.length > 0) {
      const poemIds = favoritePoems.value.map((poem) => poem.id)
      const statusMap = new Map(poemIds.map((id) => [id, true]))
      // 直接设置收藏状态为true，因为收藏页面中的所有诗词都是已收藏的
      favoriteStatus.value = statusMap
    }
  } else {
    favoritePoems.value = []
  }
})
</script>

<style scoped>
.favorites-view {
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.login-prompt {
  text-align: center;
  padding: 4rem 2rem;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.login-icon {
  font-size: 4rem;
  margin-bottom: 1rem;
}

.login-prompt h3 {
  color: #495057;
  margin-bottom: 1rem;
}

.login-prompt p {
  color: #6c757d;
  margin-bottom: 2rem;
  line-height: 1.6;
}

.login-btn {
  background: #8b0000;
  color: white;
  padding: 0.75rem 1.5rem;
  border-radius: 6px;
  border: none;
  cursor: pointer;
  font-size: 1rem;
}

.login-btn:hover {
  background: #6a0000;
}

.user-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #f8f9fa;
  padding: 1rem;
  border-radius: 8px;
  margin-bottom: 2rem;
}

.logout-btn {
  background: #6c757d;
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  border: none;
  cursor: pointer;
}

.logout-btn:hover {
  background: #5a6268;
}

.loading {
  text-align: center;
  padding: 3rem;
  color: #666;
}

.error {
  text-align: center;
  padding: 3rem;
  color: #d32f2f;
}

.retry-btn {
  margin-top: 1rem;
  padding: 0.5rem 1rem;
  background: #8b0000;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.retry-btn:hover {
  background: #6a0000;
}

.favorites-header {
  text-align: center;
  margin-bottom: 3rem;
}

.page-title {
  color: #8b0000;
  margin-bottom: 0.5rem;
}

.page-description {
  color: #666;
  margin-bottom: 1.5rem;
  font-size: 1.1rem;
}

.favorites-stats {
  background: #f8f9fa;
  padding: 1rem;
  border-radius: 8px;
  display: inline-block;
  margin-bottom: 2rem;
}

.stat-item {
  color: #495057;
  font-weight: 500;
}

.empty-state {
  text-align: center;
  padding: 4rem 2rem;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.empty-icon {
  font-size: 4rem;
  margin-bottom: 1rem;
}

.empty-state h3 {
  color: #495057;
  margin-bottom: 1rem;
}

.empty-state p {
  color: #6c757d;
  margin-bottom: 2rem;
  line-height: 1.6;
}

.browse-link {
  background: #8b0000;
  color: white;
  padding: 0.75rem 1.5rem;
  border-radius: 6px;
  text-decoration: none;
  transition: background 0.3s;
}

.browse-link:hover {
  background: #6a0000;
}

.favorites-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 1.5rem;
}

@media (max-width: 768px) {
  .favorites-grid {
    grid-template-columns: 1fr;
  }

  .favorites-view {
    padding: 1rem;
  }

  .user-info {
    flex-direction: column;
    gap: 1rem;
    text-align: center;
  }
}
</style>
