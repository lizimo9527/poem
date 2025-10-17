<template>
  <div class="statistics-view">
    <h2>诗词统计</h2>

    <div class="stats-overview">
      <div class="stat-card">
        <h3>{{ totalPoems }}</h3>
        <p>诗词总数</p>
      </div>
      <div class="stat-card">
        <h3>{{ totalAuthors }}</h3>
        <p>诗人数量</p>
      </div>
      <div class="stat-card">
        <h3>{{ totalDynasties }}</h3>
        <p>朝代数量</p>
      </div>
      <div class="stat-card">
        <h3>{{ totalTags }}</h3>
        <p>标签数量</p>
      </div>
    </div>

    <div class="charts-section">
      <div class="chart-container">
        <h3>朝代分布</h3>
        <div class="dynasty-chart">
          <div
            v-for="dynasty in dynastyStats"
            :key="dynasty.name"
            class="dynasty-bar"
            :style="{ width: `${dynasty.percentage}%` }"
            :title="`${dynasty.name}: ${dynasty.count}首`"
          >
            <span class="dynasty-name">{{ dynasty.name }}</span>
            <span class="dynasty-count">{{ dynasty.count }}</span>
          </div>
        </div>
      </div>

      <div class="chart-container">
        <h3>热门标签</h3>
        <div class="tags-cloud">
          <span
            v-for="tag in popularTags"
            :key="tag.name"
            class="tag-item"
            :style="{ fontSize: `${tag.size}px`, opacity: tag.opacity }"
            @click="searchByTag(tag.name)"
          >
            {{ tag.name }}
          </span>
        </div>
      </div>
    </div>

    <div class="author-ranking">
      <h3>诗人作品数量排行</h3>
      <div class="ranking-list">
        <div v-for="(author, index) in authorRanking" :key="author.name" class="ranking-item">
          <span class="rank">{{ index + 1 }}</span>
          <span class="author-name">{{ author.name }}</span>
          <span class="poem-count">{{ author.count }} 首</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import PoemService from '@/services/poemService'
import type { Poem, Author } from '@/types/poem'

const router = useRouter()

const poems = ref<Poem[]>([])
const authors = ref<Author[]>([])
const isLoading = ref(true)

// 加载数据
const loadData = async () => {
  try {
    isLoading.value = true
    poems.value = await PoemService.getAllPoems()
    authors.value = await PoemService.getAllAuthors()
  } catch (error) {
    console.error('加载统计数据失败:', error)
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  loadData()
})

// 基础统计
const totalPoems = computed(() => poems.value.length)
const totalAuthors = computed(() => authors.value.length)
const totalDynasties = computed(() => {
  return new Set(poems.value.map((poem) => poem.dynasty)).size
})
const totalTags = computed(() => {
  const allTags = poems.value.flatMap((poem) => poem.tags)
  return new Set(allTags).size
})

// 朝代统计
const dynastyStats = computed(() => {
  const dynastyCount: Record<string, number> = {}
  poems.value.forEach((poem) => {
    dynastyCount[poem.dynasty] = (dynastyCount[poem.dynasty] || 0) + 1
  })

  const total = poems.value.length
  return Object.entries(dynastyCount)
    .map(([name, count]) => ({
      name,
      count,
      percentage: (count / total) * 100,
    }))
    .sort((a, b) => b.count - a.count)
})

// 热门标签
const popularTags = computed(() => {
  const tagCount: Record<string, number> = {}
  poems.value.forEach((poem) => {
    poem.tags.forEach((tag) => {
      tagCount[tag] = (tagCount[tag] || 0) + 1
    })
  })

  const maxCount = Math.max(...Object.values(tagCount))
  return Object.entries(tagCount)
    .map(([name, count]) => ({
      name,
      count,
      size: 14 + (count / maxCount) * 16, // 字体大小范围 14-30px
      opacity: 0.6 + (count / maxCount) * 0.4, // 透明度范围 0.6-1.0
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 15) // 显示前15个热门标签
})

// 诗人排行
const authorRanking = computed(() => {
  const authorCount: Record<string, number> = {}
  poems.value.forEach((poem) => {
    authorCount[poem.author] = (authorCount[poem.author] || 0) + 1
  })

  return Object.entries(authorCount)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10) // 显示前10名诗人
})

const searchByTag = (tag: string) => {
  router.push(`/poems?tag=${tag}`)
}
</script>

<style scoped>
.statistics-view {
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.stats-overview {
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

.charts-section {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 2rem;
  margin-bottom: 3rem;
}

.chart-container {
  background: white;
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.chart-container h3 {
  color: #8b0000;
  margin-bottom: 1rem;
}

.dynasty-chart {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.dynasty-bar {
  background: linear-gradient(90deg, #8b0000, #d9534f);
  color: white;
  padding: 0.5rem;
  border-radius: 4px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: all 0.3s ease;
  min-height: 40px;
}

.dynasty-bar:hover {
  transform: scale(1.02);
}

.dynasty-name {
  font-weight: 600;
}

.tags-cloud {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  align-items: center;
  justify-content: center;
  min-height: 200px;
}

.tag-item {
  background: #f0f0f0;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  cursor: pointer;
  transition: all 0.3s ease;
  color: #333;
}

.tag-item:hover {
  background: #8b0000;
  color: white;
  transform: scale(1.1);
}

.author-ranking {
  background: white;
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.author-ranking h3 {
  color: #8b0000;
  margin-bottom: 1rem;
}

.ranking-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.ranking-item {
  display: flex;
  align-items: center;
  padding: 0.75rem;
  background: #f8f9fa;
  border-radius: 6px;
  transition: background-color 0.3s ease;
}

.ranking-item:hover {
  background: #e9ecef;
}

.rank {
  background: #8b0000;
  color: white;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  margin-right: 1rem;
}

.author-name {
  flex: 1;
  font-weight: 500;
}

.poem-count {
  color: #666;
  font-size: 0.9rem;
}

@media (max-width: 768px) {
  .statistics-view {
    padding: 1rem;
  }

  .stats-overview {
    grid-template-columns: 1fr;
  }

  .charts-section {
    grid-template-columns: 1fr;
  }

  .chart-container {
    padding: 1rem;
  }

  .tags-cloud {
    min-height: 150px;
  }
}
</style>
