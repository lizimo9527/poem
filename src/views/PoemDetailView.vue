<template>
  <div class="poem-detail">
    <div class="poem-header">
      <h1 class="poem-title">{{ poem.title }}</h1>
      <p class="poem-author">{{ poem.author }} · {{ poem.dynasty }}</p>
    </div>

    <div class="poem-content">
      <div class="original-poem">
        <h3>原文</h3>
        <div class="poem-text">
          <p v-for="(line, index) in poem.content.split(/\r?\n/)" :key="index">{{ line }}</p>
        </div>
      </div>

      <div class="translation" v-if="poem.translation">
        <h3>译文</h3>
        <div class="translation-text">
          <p v-for="(line, index) in poem.translation.split(/\r?\n/)" :key="index">{{ line }}</p>
        </div>
      </div>

      <div class="explanation">
        <h3>赏析</h3>
        <div class="explanation-text">
          <p>{{ poem.explanation }}</p>
        </div>
      </div>

      <div class="poem-tags">
        <h3>标签</h3>
        <div class="tags-container">
          <span v-for="tag in poem.tags" :key="tag" class="tag">{{ tag }}</span>
        </div>
      </div>
    </div>

    <div class="poem-footer">
      <div class="footer-actions">
        <button class="favorite-btn" @click="handleToggleFavorite">
          {{ isFavorite ? '★ 已收藏' : '☆ 收藏' }}
        </button>
        <ShareButton :poem-id="poem.id" :poem-title="poem.title" :poem-author="poem.author" />
        <RandomPoemButton :current-poem-id="poem.id" button-text="随机一首" />
        <button class="back-button" @click="goBack">返回</button>
        <button class="browse-button" @click="goToPoems">浏览更多</button>
      </div>
    </div>

    <div v-if="relatedPoems.length > 0" class="related-poems">
      <h3>相关推荐</h3>
      <div class="related-list">
        <div
          v-for="relatedPoem in relatedPoems"
          :key="relatedPoem.id"
          class="related-poem"
          @click="goToPoemDetail(relatedPoem.id)"
        >
          <h4>{{ relatedPoem.title }}</h4>
          <p class="author">{{ relatedPoem.author }} · {{ relatedPoem.dynasty }}</p>
          <p class="preview">{{ getFirstLine(relatedPoem.content) }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import usePoems from '@/composables/usePoems'
import useFavorites from '@/composables/useFavorites'

import ShareButton from '@/components/ShareButton.vue'
import RandomPoemButton from '@/components/RandomPoemButton.vue'
import type { Poem } from '@/types/poem'

const route = useRoute()
const router = useRouter()
const { poems, currentPoem, loadPoemById, loadPoems, isLoading, error } = usePoems()
const { isFavorited, toggleFavorite, checkFavoriteStatus } = useFavorites()

const poem = computed(
  () =>
    currentPoem.value || {
      id: 0,
      title: '',
      author: '',
      dynasty: '',
      content: '',
      tags: [],
      translation: '',
      explanation: '',
    }
)

const isFavorite = computed(() => {
  return isFavorited(poem.value.id)
})

const handleToggleFavorite = async () => {
  try {
    const newStatus = await toggleFavorite(poem.value.id)
    // 立即更新本地状态
    // 这里不需要手动更新，因为 useFavorites 中的 toggleFavorite 已经更新了 favoriteStatus
  } catch (error) {
    console.error('切换收藏状态失败:', error)
  }
}

const goBack = () => {
  router.back()
}

const goToPoems = () => {
  router.push('/poems')
}

const goToPoemDetail = (poemId: number) => {
  router.push(`/poem/${poemId}`)
}

const getFirstLine = (content: string) => {
  return content.split(/\r?\n/)[0]
}

const relatedPoems = computed(() => {
  if (!poem.value.id) return []

  return poems.value
    .filter((p) => p.id !== poem.value.id)
    .filter(
      (p) =>
        p.author === poem.value.author ||
        p.dynasty === poem.value.dynasty ||
        p.tags.some((tag) => poem.value.tags.includes(tag))
    )
    .slice(0, 3)
})

onMounted(async () => {
  const poemId = parseInt(route.params.id as string)

  try {
    // 加载诗词详情
    await loadPoemById(poemId)
    // 检查收藏状态
    await checkFavoriteStatus(poemId)

    // 加载诗词列表用于相关推荐
    await loadPoems()
  } catch (error) {
    console.error('加载诗词详情失败:', error)
  }
})
</script>

<style scoped>
.poem-detail {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
}

.poem-header {
  text-align: center;
  margin-bottom: 3rem;
}

.poem-title {
  color: #8b0000;
  font-size: 2.5rem;
  margin-bottom: 0.5rem;
}

.poem-author {
  color: #666;
  font-size: 1.2rem;
}

.poem-content {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.original-poem,
.translation,
.explanation,
.poem-tags {
  background: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.original-poem h3,
.translation h3,
.explanation h3,
.poem-tags h3 {
  color: #8b0000;
  margin-bottom: 1rem;
  border-bottom: 2px solid #f0f0f0;
  padding-bottom: 0.5rem;
}

.poem-text {
  font-family: 'KaiTi', '楷体', serif;
  font-size: 1.3rem;
  line-height: 2;
  text-align: center;
}

.translation-text,
.explanation-text {
  line-height: 1.8;
  color: #444;
}

.tags-container {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.tag {
  background: #f0f0f0;
  padding: 0.25rem 0.75rem;
  border-radius: 4px;
  font-size: 0.9rem;
  color: #666;
}

.poem-footer {
  text-align: center;
  margin-top: 3rem;
}

.footer-actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
  align-items: center;
}

.favorite-btn,
.back-button,
.browse-button {
  border: none;
  padding: 0.8rem 1.5rem;
  border-radius: 6px;
  cursor: pointer;
  font-size: 1rem;
  transition: all 0.3s;
}

.favorite-btn {
  background: #f8f9fa;
  color: #8b0000;
  border: 1px solid #8b0000;
}

.favorite-btn:hover {
  background: #8b0000;
  color: white;
}

.back-button {
  background: #6c757d;
  color: white;
}

.back-button:hover {
  background: #5a6268;
}

.browse-button {
  background: #8b0000;
  color: white;
}

.browse-button:hover {
  background: #6a0000;
}

.related-poems {
  margin-top: 3rem;
  padding-top: 2rem;
  border-top: 1px solid #f0f0f0;
}

.related-poems h3 {
  color: #8b0000;
  margin-bottom: 1.5rem;
  text-align: center;
}

.related-list {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1rem;
}

.related-poem {
  background: white;
  padding: 1rem;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: all 0.3s ease;
  border-left: 3px solid #8b0000;
}

.related-poem:hover {
  transform: translateY(-3px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.related-poem h4 {
  color: #8b0000;
  margin: 0 0 0.5rem;
  font-size: 1.1rem;
}

.related-poem .author {
  color: #666;
  font-size: 0.9rem;
  margin: 0 0 0.5rem;
}

.related-poem .preview {
  font-family: 'KaiTi', '楷体', serif;
  font-size: 1rem;
  color: #333;
  margin: 0;
  line-height: 1.4;
}

@media (max-width: 768px) {
  .poem-detail {
    padding: 1rem;
  }

  .footer-actions {
    flex-direction: column;
    align-items: center;
  }

  .favorite-btn,
  .back-button,
  .browse-button {
    width: 100%;
    max-width: 200px;
  }

  .related-list {
    grid-template-columns: 1fr;
  }
}
</style>
