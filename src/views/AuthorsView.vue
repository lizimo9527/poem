<template>
  <div class="authors-view">
    <h1 class="page-title">著名诗人</h1>
    <p class="page-description">这里汇集了中国历史上最杰出的诗人</p>

    <div v-if="isLoading" class="loading">
      <p>正在加载作者数据...</p>
    </div>

    <div v-else-if="error" class="error">
      <p>加载失败: {{ error }}</p>
      <button @click="loadAuthors" class="retry-btn">重试</button>
    </div>

    <div v-else-if="authors.length === 0" class="empty-state">
      <div class="empty-icon">👤</div>
      <h3>暂无作者数据</h3>
      <p>暂时没有找到作者信息</p>
    </div>

    <div v-else class="authors-grid">
      <div v-for="author in authors" :key="author.id" class="author-card">
        <div class="author-avatar">
          {{ author.name.charAt(0) }}
        </div>
        <div class="author-info">
          <h3>{{ author.name }}</h3>
          <p class="dynasty">{{ author.dynasty }}</p>
          <p class="intro">{{ author.intro }}</p>
          <p class="poems-count">作品数量: {{ author.poemsCount }} 首</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import usePoems from '@/composables/usePoems'
import type { Author } from '@/types/poem'

const { authors, loadAuthors, isLoading, error } = usePoems()

onMounted(async () => {
  await loadAuthors()
})
</script>

<style scoped>
.authors-view {
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
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
  background: #0066cc;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.retry-btn:hover {
  background: #0052a3;
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

.page-title {
  text-align: center;
  color: #0066cc;
  margin-bottom: 1rem;
}

.page-description {
  text-align: center;
  color: #666;
  margin-bottom: 3rem;
  font-size: 1.1rem;
}

.authors-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 2rem;
}

.author-card {
  background: white;
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  transition: transform 0.3s ease;
}

.author-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.15);
}

.author-avatar {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: #0066cc;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  font-weight: bold;
  flex-shrink: 0;
}

.author-info {
  flex: 1;
}

.author-info h3 {
  color: #0066cc;
  margin: 0 0 0.5rem;
  font-size: 1.3rem;
}

.dynasty {
  color: #666;
  font-size: 0.9rem;
  margin: 0 0 1rem;
}

.intro {
  line-height: 1.6;
  color: #444;
  margin: 0 0 1rem;
}

.poems-count {
  color: #888;
  font-size: 0.9rem;
  margin: 0;
}
</style>
