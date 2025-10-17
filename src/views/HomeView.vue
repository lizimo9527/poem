<template>
  <div class="home-view">
    <div class="hero-section">
      <h1 class="main-title">诗歌精选</h1>
      <p class="welcome-text">欢迎来到诗歌世界，这里汇集了经典诗词作品</p>

      <SearchBar @search="handleSearch" />
    </div>

    <div class="quick-stats">
      <div class="stat-card">
        <h3>{{ poems.length }}</h3>
        <p>诗词总数</p>
      </div>
      <div class="stat-card">
        <h3>{{ authors.length }}</h3>
        <p>诗人数量</p>
      </div>
      <div class="stat-card">
        <h3>{{ uniqueDynasties.length }}</h3>
        <p>朝代数量</p>
      </div>
    </div>

    <div class="featured-section">
      <h2>精选推荐</h2>
      <div class="featured-poems">
        <div v-for="poem in featuredPoems" :key="poem.id" class="featured-poem">
          <div class="poem-content" @click="goToPoemDetail(poem.id)">
            <h3>{{ poem.title }}</h3>
            <p class="author">{{ poem.author }} · {{ poem.dynasty }}</p>
            <p class="poem-preview">{{ getFirstLine(poem.content) }}</p>
            <div class="tags">
              <span v-for="tag in poem.tags.slice(0, 2)" :key="tag" class="tag">{{ tag }}</span>
            </div>
          </div>
          <button class="favorite-btn" @click="handleFavoriteClick(poem)">
            {{ isFavorite(poem.id) ? '★ 已收藏' : '☆ 收藏' }}
          </button>
        </div>
      </div>
    </div>

    <div class="featured-section">
      <h2>经典名篇</h2>
      <div class="featured-poems">
        <div v-for="poem in classicPoems" :key="poem.id" class="featured-poem">
          <div class="poem-content" @click="goToPoemDetail(poem.id)">
            <h3>{{ poem.title }}</h3>
            <p class="author">{{ poem.author }} · {{ poem.dynasty }}</p>
            <p class="poem-preview">{{ getFirstLine(poem.content) }}</p>
            <div class="tags">
              <span v-for="tag in poem.tags.slice(0, 2)" :key="tag" class="tag">{{ tag }}</span>
            </div>
          </div>
          <button class="favorite-btn" @click="handleFavoriteClick(poem)">
            {{ isFavorite(poem.id) ? '★ 已收藏' : '☆ 收藏' }}
          </button>
        </div>
      </div>
    </div>

    <div class="featured-section">
      <h2>热门诗词</h2>
      <div class="featured-poems">
        <div v-for="poem in popularPoems" :key="poem.id" class="featured-poem">
          <div class="poem-content" @click="goToPoemDetail(poem.id)">
            <h3>{{ poem.title }}</h3>
            <p class="author">{{ poem.author }} · {{ poem.dynasty }}</p>
            <p class="poem-preview">{{ getFirstLine(poem.content) }}</p>
            <div class="tags">
              <span v-for="tag in poem.tags.slice(0, 2)" :key="tag" class="tag">{{ tag }}</span>
            </div>
          </div>
          <button class="favorite-btn" @click="handleFavoriteClick(poem)">
            {{ isFavorite(poem.id) ? '★ 已收藏' : '☆ 收藏' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import usePoems from '@/composables/usePoems'
import useFavorites from '@/composables/useFavorites'
import useAuth from '@/composables/useAuth'
import SearchBar from '@/components/SearchBar.vue'
import PoemCard from '@/components/PoemCard.vue'
import type { Poem } from '@/types/poem'

const router = useRouter()
const { poems, authors, loadPoems, loadAuthors, isLoading } = usePoems()
const { favoritePoems, toggleFavorite, loadFavorites, isFavorited } = useFavorites()
const { user, isAuthenticated } = useAuth()

interface Filters {
  dynasty: string
  tag: string
}

const searchQuery = ref('')
const filters = ref<Filters>({
  dynasty: '',
  tag: '',
})

// 计算属性
const uniqueDynasties = computed(() => {
  return [...new Set(poems.value.map((poem) => poem.dynasty))]
})

const featuredPoems = computed(() => {
  if (poems.value.length === 0) return []
  return poems.value.slice(0, 4) // 显示前4首作为精选
})

const classicPoems = computed(() => {
  if (poems.value.length === 0) return []
  // 选择一些经典名篇，比如李白、杜甫、苏轼的代表作
  const classicAuthors = ['李白', '杜甫', '苏轼', '李清照']
  return poems.value.filter((poem) => classicAuthors.includes(poem.author)).slice(0, 4)
})

const popularPoems = computed(() => {
  if (poems.value.length === 0) return []
  // 选择一些热门诗词，可以根据标签或内容判断
  const popularTags = ['思乡', '爱情', '爱国', '山水']
  return poems.value
    .filter((poem) => poem.tags.some((tag) => popularTags.includes(tag)))
    .slice(0, 4)
})

// 检查诗词是否被收藏
const isPoemFavorited = (poemId: number) => {
  return isFavorited(poemId)
}

onMounted(async () => {
  await loadPoems()
  await loadAuthors()

  // 初始化收藏状态
  const poemIds = poems.value.map((poem) => poem.id)
  if (poemIds.length > 0) {
    await loadFavorites()
  }
})

const handleSearch = (query: string, newFilters: Filters) => {
  searchQuery.value = query
  filters.value = newFilters

  if (query || newFilters.dynasty || newFilters.tag) {
    router.push('/poems')
  }
}

const goToPoemDetail = (poemId: number) => {
  router.push(`/poem/${poemId}`)
}

const getFirstLine = (content: string) => {
  return content.split(/\r?\n/)[0]
}

const handleFavoriteClick = async (poem: Poem) => {
  if (!isAuthenticated.value) {
    router.push('/login')
    return
  }

  try {
    await toggleFavorite(poem.id)
    // 重新加载收藏状态以确保UI正确更新
    await loadFavorites()
  } catch (error) {
    console.error('收藏操作失败:', error)
  }
}

const handleFavoriteChanged = async () => {
  // 重新加载收藏状态以确保UI正确更新
  await loadFavorites()
}

const isFavorite = (poemId: number) => {
  return isFavorited(poemId)
}
</script>

<style scoped>
.home-view {
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.hero-section {
  text-align: center;
  margin-bottom: 3rem;
}

.main-title {
  color: #8b0000;
  margin-bottom: 1rem;
  font-size: 2.5rem;
}

.welcome-text {
  color: #666;
  margin-bottom: 2rem;
  font-size: 1.1rem;
}

.quick-stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
  margin-bottom: 3rem;
}

.stat-card {
  background: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  text-align: center;
  transition: transform 0.3s ease;
}

.stat-card:hover {
  transform: translateY(-5px);
}

.stat-card h3 {
  font-size: 2.5rem;
  color: #8b0000;
  margin: 0 0 0.5rem;
}

.stat-card p {
  color: #666;
  margin: 0;
}

.featured-section {
  margin-bottom: 3rem;
}

.featured-section h2 {
  color: #8b0000;
  margin-bottom: 1.5rem;
  border-bottom: 2px solid #f0f0f0;
  padding-bottom: 0.5rem;
}

.featured-poems {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
}

.featured-poem {
  background: white;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  border-left: 4px solid #8b0000;
  cursor: pointer;
  transition: all 0.3s ease;
}

.featured-poem:hover {
  transform: translateY(-5px);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.15);
}

.featured-poem h3 {
  color: #8b0000;
  margin: 0 0 0.5rem;
}

.featured-poem .author {
  color: #666;
  font-size: 0.9rem;
  margin: 0 0 1rem;
}

.poem-preview {
  font-family: 'KaiTi', '楷体', serif;
  font-size: 1.1rem;
  line-height: 1.6;
  color: #333;
  margin: 0 0 1rem;
}

.tags {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.tag {
  background: #f0f0f0;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.8rem;
  color: #666;
}

.favorite-btn {
  background: none;
  border: 1px solid #8b0000;
  color: #8b0000;
  padding: 0.25rem 0.75rem;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9rem;
  margin-top: 1rem;
  transition: all 0.2s ease;
}

.favorite-btn:hover {
  background: #8b0000;
  color: white;
}

.recent-section h2 {
  color: #8b0000;
  margin-bottom: 1.5rem;
  border-bottom: 2px solid #f0f0f0;
  padding-bottom: 0.5rem;
}

.recent-poems {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 1.5rem;
}

@media (max-width: 768px) {
  .home-view {
    padding: 1rem;
  }

  .main-title {
    font-size: 2rem;
  }

  .quick-stats {
    grid-template-columns: 1fr;
  }

  .featured-poems,
  .recent-poems {
    grid-template-columns: 1fr;
  }
}
</style>
