<template>
  <div class="search-bar">
    <div class="search-container">
      <input
        v-model="searchQuery"
        type="text"
        placeholder="搜索诗词、作者、朝代或标签..."
        class="search-input"
        @input="handleSearch"
      />
      <button class="search-btn" @click="handleSearch">
        🔍
      </button>
    </div>
    
    <div v-if="showFilters" class="filters">
      <div class="filter-group">
        <label>朝代:</label>
        <select v-model="filters.dynasty" @change="handleSearch">
          <option value="">全部</option>
          <option v-for="dynasty in dynasties" :key="dynasty" :value="dynasty">
            {{ dynasty }}
          </option>
        </select>
      </div>
      
      <div class="filter-group">
        <label>标签:</label>
        <select v-model="filters.tag" @change="handleSearch">
          <option value="">全部</option>
          <option v-for="tag in allTags" :key="tag" :value="tag">
            {{ tag }}
          </option>
        </select>
      </div>
      
      <button class="clear-filters" @click="clearFilters">清除筛选</button>
    </div>
    
    <button class="toggle-filters" @click="toggleFilters">
      {{ showFilters ? '隐藏筛选' : '显示筛选' }}
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { poems } from '@/data/poems'

interface Filters {
  dynasty: string
  tag: string
}

const emit = defineEmits<{
  search: [query: string, filters: Filters]
}>()

const searchQuery = ref('')
const showFilters = ref(false)
const filters = ref<Filters>({
  dynasty: '',
  tag: ''
})

// 获取所有朝代和标签
const dynasties = computed(() => {
  return [...new Set(poems.map(poem => poem.dynasty))].sort()
})

const allTags = computed(() => {
  const tags = poems.flatMap(poem => poem.tags)
  return [...new Set(tags)].sort()
})

const handleSearch = () => {
  emit('search', searchQuery.value, filters.value)
}

const clearFilters = () => {
  filters.value = { dynasty: '', tag: '' }
  handleSearch()
}

const toggleFilters = () => {
  showFilters.value = !showFilters.value
}
</script>

<style scoped>
.search-bar {
  margin-bottom: 2rem;
}

.search-container {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.search-input {
  flex: 1;
  padding: 0.75rem 1rem;
  border: 2px solid #e8e8e8;
  border-radius: 8px;
  font-size: 1rem;
  transition: border-color 0.3s ease;
}

.search-input:focus {
  outline: none;
  border-color: #8b0000;
}

.search-btn {
  padding: 0.75rem 1.5rem;
  background: #8b0000;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1.1rem;
  transition: background-color 0.3s ease;
}

.search-btn:hover {
  background: #6a0000;
}

.filters {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 1rem;
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 8px;
}

.filter-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.filter-group label {
  font-weight: 600;
  color: #333;
}

.filter-group select {
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  background: white;
}

.clear-filters {
  padding: 0.5rem 1rem;
  background: #6c757d;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  align-self: end;
}

.toggle-filters {
  padding: 0.5rem 1rem;
  background: none;
  border: 1px solid #8b0000;
  color: #8b0000;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9rem;
}

.toggle-filters:hover {
  background: #8b0000;
  color: white;
}

@media (max-width: 768px) {
  .filters {
    grid-template-columns: 1fr;
  }
  
  .search-container {
    flex-direction: column;
  }
}
</style>