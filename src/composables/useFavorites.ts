import { ref, computed } from 'vue'
import FavoriteService from '@/services/favoriteService'
import type { Poem } from '@/types/poem'

// 收藏功能组合式函数
export function useFavorites() {
  const favoritePoems = ref<Poem[]>([])
  const favoriteStatus = ref<Map<number, boolean>>(new Map())
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  // 加载用户收藏的诗词
  const loadFavorites = async () => {
    try {
      isLoading.value = true
      error.value = null
      favoritePoems.value = await FavoriteService.getUserFavorites()
    } catch (err: any) {
      error.value = err.message || '加载收藏列表失败'
      console.error('加载收藏列表失败:', err)
    } finally {
      isLoading.value = false
    }
  }

  // 切换收藏状态
  const toggleFavorite = async (poemId: number) => {
    try {
      isLoading.value = true
      error.value = null
      const newStatus = await FavoriteService.toggleFavorite(poemId)

      // 更新本地状态
      favoriteStatus.value.set(poemId, newStatus)

      // 如果取消收藏，从本地列表中移除
      if (!newStatus) {
        favoritePoems.value = favoritePoems.value.filter((poem) => poem.id !== poemId)
      } else {
        // 如果添加收藏，需要重新加载收藏列表以确保数据完整
        await loadFavorites()
      }

      return newStatus
    } catch (err: any) {
      error.value = err.message || '切换收藏状态失败'
      console.error('切换收藏状态失败:', err)
      throw err
    } finally {
      isLoading.value = false
    }
  }

  // 检查单个诗词的收藏状态
  const checkFavoriteStatus = async (poemId: number) => {
    try {
      const status = await FavoriteService.isPoemFavorited(poemId)
      favoriteStatus.value.set(poemId, status)
      return status
    } catch (err: any) {
      console.error('检查收藏状态失败:', err)
      return false
    }
  }

  // 批量检查收藏状态
  const checkFavoritesStatus = async (poemIds: number[]) => {
    try {
      const statusMap = await FavoriteService.getFavoritesStatus(poemIds)
      favoriteStatus.value = statusMap
      return statusMap
    } catch (err: any) {
      console.error('批量检查收藏状态失败:', err)
      return new Map(poemIds.map((id) => [id, false]))
    }
  }

  // 获取诗词的收藏数量
  const getFavoriteCount = async (poemId: number) => {
    try {
      return await FavoriteService.getFavoriteCount(poemId)
    } catch (err: any) {
      console.error('获取收藏数量失败:', err)
      return 0
    }
  }

  // 检查是否已收藏
  const isFavorited = (poemId: number) => {
    return favoriteStatus.value.get(poemId) || false
  }

  // 清除错误
  const clearError = () => {
    error.value = null
  }

  return {
    // 响应式数据
    favoritePoems,
    favoriteStatus,
    isLoading,
    error,

    // 计算方法
    isFavorited,

    // 方法
    loadFavorites,
    toggleFavorite,
    checkFavoriteStatus,
    checkFavoritesStatus,
    getFavoriteCount,
    clearError,
  }
}

export default useFavorites
