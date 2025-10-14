<template>
  <div id="app">
    <!-- 顶部标题 -->
    <header class="app-header">
      <h1 class="app-title">古诗词赏析</h1>
      <p class="app-subtitle">传承中华文化 · 品味诗词之美</p>
    </header>

    <!-- 导航栏 -->
    <nav class="nav-menu">
      <RouterLink to="/" class="nav-link">首页</RouterLink>
      <RouterLink to="/poems" class="nav-link">诗词浏览</RouterLink>
      <RouterLink to="/authors" class="nav-link">诗人列表</RouterLink>
      <RouterLink to="/favorites" class="nav-link">我的收藏</RouterLink>
    </nav>

    <!-- 主要内容区 -->
    <main class="main-content">
      <RouterView />
    </main>

    <!-- 页脚 -->
    <footer class="app-footer">
      <p>© 2024 古诗词赏析 · 数据来源于公开古籍</p>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
</script>

<style scoped>
#app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: #f9f5e9;
  color: #333;
  font-family: "SimSun", "宋体", serif;
}

.app-header {
  text-align: center;
  padding: 2rem 0;
  background: linear-gradient(135deg, #f9f5e9 0%, #f0e6d6 100%);
  border-bottom: 1px solid #d9c7a7;
}

.app-title {
  font-size: 2.5rem;
  margin: 0;
  color: #8b0000;
  font-weight: normal;
}

.app-subtitle {
  font-size: 1rem;
  color: #666;
  margin: 0.5rem 0 0;
}

.nav-menu {
  display: flex;
  justify-content: center;
  gap: 2rem;
  padding: 1rem;
  background-color: #fff;
  border-bottom: 1px solid #e8e8e8;
}

.nav-link {
  color: #333;
  text-decoration: none;
  padding: 0.5rem 1rem;
  position: relative;
}

.nav-link:hover {
  color: #8b0000;
}

.nav-link.router-link-active {
  color: #8b0000;
}

.nav-link.router-link-active::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 2px;
  background-color: #8b0000;
}

.main-content {
  flex: 1;
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
}

.app-footer {
  text-align: center;
  padding: 1rem;
  font-size: 0.9rem;
  color: #666;
  border-top: 1px solid #e8e8e8;
}

@media (max-width: 768px) {
  .nav-menu {
    flex-wrap: wrap;
    gap: 1rem;
  }
  
  .app-title {
    font-size: 2rem;
  }
}
</style>

