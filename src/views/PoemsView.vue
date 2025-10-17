<template>
  <div class="poems-view">
    <h2>诗词浏览</h2>

    <SearchBar @search="handleSearch" />

    <div v-if="isLoading" class="loading">
      <p>正在加载诗词数据...</p>
    </div>

    <div v-else-if="error" class="error">
      <p>加载失败: {{ error }}</p>
      <button @click="loadPoems" class="retry-btn">重试</button>
    </div>

    <div v-else>
      <div class="stats">
        <span class="stat-item">共 {{ filteredPoems.length }} 首诗词</span>
        <span v-if="searchQuery" class="stat-item">搜索: "{{ searchQuery }}"</span>
        <span v-if="filters.dynasty" class="stat-item">朝代: {{ filters.dynasty }}</span>
        <span v-if="filters.tag" class="stat-item">标签: {{ filters.tag }}</span>
      </div>

      <div v-if="filteredPoems.length === 0" class="no-results">
        <p>没有找到匹配的诗词</p>
        <button @click="clearSearch" class="clear-search-btn">显示全部诗词</button>
      </div>

      <div v-else class="poem-list">
        <PoemCard
          v-for="poem in filteredPoems"
          :key="poem.id"
          :poem="poem"
          :is-favorite="isPoemFavorited(poem.id)"
          @favorite-changed="handleFavoriteChanged"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import usePoems from '@/composables/usePoems'
import useFavorites from '@/composables/useFavorites'
import PoemCard from '@/components/PoemCard.vue'
import SearchBar from '@/components/SearchBar.vue'
import type { Poem } from '@/types/poem'

interface Filters {
  dynasty: string
  tag: string
}

const { poems, authors, loadPoems, search, isLoading, error } = usePoems()
const { checkFavoritesStatus, favoriteStatus } = useFavorites()

const searchQuery = ref('')
const filters = ref<Filters>({
  dynasty: '',
  tag: '',
})

const filteredPoems = computed(() => {
  return poems.value.filter((poem) => {
    // 筛选条件
    const matchesDynasty = !filters.value.dynasty || poem.dynasty === filters.value.dynasty
    const matchesTag = !filters.value.tag || poem.tags.includes(filters.value.tag)

    return matchesDynasty && matchesTag
  })
})

// 检查诗词是否被收藏
const isPoemFavorited = (poemId: number) => {
  return favoriteStatus.value.get(poemId) || false
}

// 处理收藏状态改变
const handleFavoriteChanged = async () => {
  // 重新检查所有诗词的收藏状态
  const poemIds = poems.value.map((poem) => poem.id)
  if (poemIds.length > 0) {
    await checkFavoritesStatus(poemIds)
  }
}

const handleSearch = async (query: string, newFilters: Filters) => {
  searchQuery.value = query
  filters.value = newFilters

  if (query) {
    await search(query)
  } else {
    await loadPoems()
  }

  // 更新收藏状态
  const poemIds = poems.value.map((poem) => poem.id)
  if (poemIds.length > 0) {
    await checkFavoritesStatus(poemIds)
  }
}

const clearSearch = async () => {
  searchQuery.value = ''
  filters.value = { dynasty: '', tag: '' }
  await loadPoems()

  // 更新收藏状态
  const poemIds = poems.value.map((poem) => poem.id)
  if (poemIds.length > 0) {
    await checkFavoritesStatus(poemIds)
  }
}

onMounted(async () => {
  await loadPoems()

  // 初始化收藏状态
  const poemIds = poems.value.map((poem) => poem.id)
  if (poemIds.length > 0) {
    await checkFavoritesStatus(poemIds)
  }
})
</script>

<style scoped>
.poems-view {
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
  background: #8b0000;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.retry-btn:hover {
  background: #6a0000;
}

.stats {
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;
  align-items: center;
}

.stat-item {
  background: #f0f0f0;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.9rem;
  color: #666;
}

.no-results {
  text-align: center;
  padding: 3rem;
  color: #666;
}

.clear-search-btn {
  margin-top: 1rem;
  padding: 0.5rem 1rem;
  background: #8b0000;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.clear-search-btn:hover {
  background: #6a0000;
}

.poem-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 1.5rem;
  margin-top: 2rem;
}

@media (max-width: 768px) {
  .poems-view {
    padding: 1rem;
  }

  .poem-list {
    grid-template-columns: 1fr;
  }

  .stats {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>
