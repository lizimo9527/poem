<template>
  <div id="app">
    <!-- 顶部导航栏 -->
    <Navigation />

    <!-- 主要内容区 -->
    <main class="main-content">
      <RouterView />
    </main>

    <!-- AI聊天助手 -->
    <AIChatAssistant />

    <!-- 页脚 -->
    <footer class="app-footer">
      <p>© 2024 古诗词赏析 · 数据来源于公开古籍</p>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { RouterView } from 'vue-router'
import Navigation from '@/components/Navigation.vue'
import AIChatAssistant from '@/components/AIChatAssistant.vue'
</script>

<style scoped>
#app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: #f9f5e9;
  color: #333;
  font-family: 'SimSun', '宋体', serif;
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
</style>
