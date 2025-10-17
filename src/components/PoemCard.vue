<template>
  <div class="poem-card">
    <div class="poem-header">
      <h3 class="poem-title">{{ poem.title }}</h3>
      <span class="poem-author">{{ poem.author }} · {{ poem.dynasty }}</span>
    </div>
    <div class="poem-content">
      <p v-for="(line, index) in poem.content.split('\n')" :key="index">{{ line }}</p>
    </div>
    <div class="poem-footer">
      <button class="favorite-btn" @click="handleToggleFavorite">
        {{ isFavorite ? '★ 已收藏' : '☆ 收藏' }}
      </button>
      <div class="poem-tags">
        <span v-for="tag in poem.tags" :key="tag" class="tag">{{ tag }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { supabase } from '@/utils/supabase'
import useFavorites from '@/composables/useFavorites'
import type { Poem } from '@/types/poem'

const props = defineProps<{
  poem: Poem
  isFavorite?: boolean
}>()

const emit = defineEmits<{
  (e: 'favorite-changed'): void
}>()

const router = useRouter()
const { toggleFavorite, isFavorited, favoriteStatus } = useFavorites()

const isFavorite = computed(() =>
  props.isFavorite !== undefined ? props.isFavorite : isFavorited(props.poem.id)
)

const handleToggleFavorite = async () => {
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    // 用户未登录，跳转到登录页面
    router.push('/login')
    return
  }

  try {
    const newStatus = await toggleFavorite(props.poem.id)
    // 立即更新本地状态
    favoriteStatus.value.set(props.poem.id, newStatus)
    // 触发收藏状态更新
    emit('favorite-changed')
  } catch (error) {
    console.error('收藏操作失败:', error)
  }
}
</script>

<style scoped>
.poem-card {
  background: white;
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  margin-bottom: 1.5rem;
}

.poem-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.poem-header {
  margin-bottom: 1rem;
  border-bottom: 1px solid #eee;
  padding-bottom: 0.5rem;
}

.poem-title {
  font-size: 1.25rem;
  margin: 0;
  color: #8b0000;
}

.poem-author {
  font-size: 0.9rem;
  color: #666;
}

.poem-content {
  font-family: 'KaiTi', '楷体', serif;
  font-size: 1.1rem;
  line-height: 1.8;
  margin-bottom: 1rem;
}

.poem-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.favorite-btn {
  background: none;
  border: 1px solid #8b0000;
  color: #8b0000;
  padding: 0.25rem 0.75rem;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.favorite-btn:hover {
  background: #8b0000;
  color: white;
}

.poem-tags {
  display: flex;
  gap: 0.5rem;
}

.tag {
  background: #f0f0f0;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.8rem;
  color: #666;
}
</style>
