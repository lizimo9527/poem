<template>
  <button class="random-poem-btn" @click="goToRandomPoem">🎲 {{ buttonText }}</button>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import PoemService from '@/services/poemService'

const props = defineProps<{
  currentPoemId?: number
  buttonText?: string
}>()

const router = useRouter()

const goToRandomPoem = async () => {
  try {
    const randomPoem = await PoemService.getRandomPoem()
    if (randomPoem && randomPoem.id !== props.currentPoemId) {
      router.push(`/poem/${randomPoem.id}`)
    } else {
      // 如果随机诗词与当前诗词相同，重新获取
      await goToRandomPoem()
    }
  } catch (error) {
    console.error('获取随机诗词失败:', error)
    // 如果获取失败，使用备用方案：获取所有诗词然后随机选择
    try {
      const allPoems = await PoemService.getAllPoems()
      const availablePoems = props.currentPoemId
        ? allPoems.filter((p) => p.id !== props.currentPoemId)
        : allPoems

      if (availablePoems.length > 0) {
        const randomPoem = availablePoems[Math.floor(Math.random() * availablePoems.length)]
        router.push(`/poem/${randomPoem.id}`)
      }
    } catch (fallbackError) {
      console.error('备用随机诗词方案失败:', fallbackError)
    }
  }
}
</script>

<style scoped>
.random-poem-btn {
  background: #17a2b8;
  color: white;
  border: none;
  padding: 0.8rem 1.5rem;
  border-radius: 6px;
  cursor: pointer;
  font-size: 1rem;
  transition: all 0.3s ease;
}

.random-poem-btn:hover {
  background: #138496;
  transform: translateY(-2px);
}

@media (max-width: 768px) {
  .random-poem-btn {
    width: 100%;
    max-width: 200px;
  }
}
</style>
