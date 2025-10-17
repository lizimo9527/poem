import { ref, computed } from 'vue'
import PoemService from '@/services/poemService'
import type { Poem, Author } from '@/types/poem'

// 诗词数据管理组合式函数
export function usePoems() {
  const poems = ref<Poem[]>([])
  const authors = ref<Author[]>([])
  const currentPoem = ref<Poem | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  // 加载所有诗词
  const loadPoems = async () => {
    try {
      isLoading.value = true
      error.value = null
      poems.value = await PoemService.getAllPoems()
    } catch (err: any) {
      error.value = err.message || '加载诗词数据失败'
      console.error('加载诗词数据失败:', err)
    } finally {
      isLoading.value = false
    }
  }

  // 加载所有作者
  const loadAuthors = async () => {
    try {
      isLoading.value = true
      error.value = null
      authors.value = await PoemService.getAllAuthors()
    } catch (err: any) {
      error.value = err.message || '加载作者数据失败'
      console.error('加载作者数据失败:', err)
    } finally {
      isLoading.value = false
    }
  }

  // 根据ID加载诗词详情
  const loadPoemById = async (id: number) => {
    try {
      isLoading.value = true
      error.value = null
      currentPoem.value = await PoemService.getPoemById(id)
    } catch (err: any) {
      error.value = err.message || '加载诗词详情失败'
      console.error('加载诗词详情失败:', err)
    } finally {
      isLoading.value = false
    }
  }

  // 搜索诗词
  const search = async (query: string) => {
    try {
      isLoading.value = true
      error.value = null
      poems.value = await PoemService.searchPoems(query)
    } catch (err: any) {
      error.value = err.message || '搜索诗词失败'
      console.error('搜索诗词失败:', err)
    } finally {
      isLoading.value = false
    }
  }

  // 获取随机诗词
  const getRandom = async () => {
    try {
      isLoading.value = true
      error.value = null
      currentPoem.value = await PoemService.getRandomPoem()
    } catch (err: any) {
      error.value = err.message || '获取随机诗词失败'
      console.error('获取随机诗词失败:', err)
    } finally {
      isLoading.value = false
    }
  }

  // 根据作者筛选诗词
  const poemsByAuthor = computed(() => (authorName: string) => {
    return poems.value.filter((poem) => poem.author === authorName)
  })

  // 根据朝代筛选诗词
  const poemsByDynasty = computed(() => (dynasty: string) => {
    return poems.value.filter((poem) => poem.dynasty === dynasty)
  })

  // 根据标签筛选诗词
  const poemsByTag = computed(() => (tag: string) => {
    return poems.value.filter((poem) => poem.tags.includes(tag))
  })

  // 清除错误
  const clearError = () => {
    error.value = null
  }

  return {
    // 响应式数据
    poems,
    authors,
    currentPoem,
    isLoading,
    error,

    // 计算方法
    poemsByAuthor,
    poemsByDynasty,
    poemsByTag,

    // 方法
    loadPoems,
    loadAuthors,
    loadPoemById,
    search,
    getRandom,
    clearError,
  }
}

export default usePoems
