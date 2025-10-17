<template>
  <nav class="navigation">
    <div class="nav-container">
      <RouterLink to="/" class="nav-logo"> 📚 古诗词赏析 </RouterLink>

      <div class="nav-links">
        <RouterLink to="/" class="nav-link">首页</RouterLink>
        <RouterLink to="/poems" class="nav-link">诗词浏览</RouterLink>
        <RouterLink to="/authors" class="nav-link">诗人列表</RouterLink>
        <RouterLink to="/statistics" class="nav-link">诗词统计</RouterLink>
        <RouterLink to="/favorites" class="nav-link">我的收藏</RouterLink>
      </div>

      <div class="nav-auth">
        <template v-if="user">
          <RouterLink to="/user" class="user-link"> 👤 {{ user.email }} </RouterLink>
          <button @click="handleLogout" class="logout-btn">退出</button>
        </template>
        <template v-else>
          <RouterLink to="/login" class="login-link">登录</RouterLink>
        </template>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router'
import useAuth from '@/composables/useAuth'

const { user, logout } = useAuth()

const handleLogout = async () => {
  await logout()
}
</script>

<style scoped>
.navigation {
  background: #8b0000;
  color: white;
  padding: 0;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.nav-container {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 1rem;
  height: 60px;
}

.nav-logo {
  font-size: 1.5rem;
  font-weight: bold;
  color: white;
  text-decoration: none;
}

.nav-links {
  display: flex;
  gap: 2rem;
}

.nav-link {
  color: white;
  text-decoration: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  transition: background-color 0.3s;
}

.nav-link:hover {
  background: rgba(255, 255, 255, 0.1);
}

.nav-link.router-link-active {
  background: rgba(255, 255, 255, 0.2);
}

.nav-auth {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.user-link {
  color: white;
  text-decoration: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  background: rgba(255, 255, 255, 0.1);
}

.login-link {
  color: white;
  text-decoration: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  background: rgba(255, 255, 255, 0.1);
  transition: background-color 0.3s;
}

.login-link:hover {
  background: rgba(255, 255, 255, 0.2);
}

.logout-btn {
  background: rgba(255, 255, 255, 0.1);
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.logout-btn:hover {
  background: rgba(255, 255, 255, 0.2);
}

@media (max-width: 768px) {
  .nav-container {
    flex-direction: column;
    height: auto;
    padding: 1rem;
    gap: 1rem;
  }

  .nav-links {
    gap: 1rem;
  }

  .nav-auth {
    gap: 0.5rem;
  }
}
</style>
