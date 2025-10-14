import { ref } from 'vue'
import { defineStore } from 'pinia'

/**
 * 应用全局状态 Store
 */
export const useAppStore = defineStore('app', () => {
  // 应用主题
  const theme = ref<'light' | 'dark'>('light')
  
  // 加载状态
  const isLoading = ref(false)
  
  // 用户信息
  const user = ref<{
    name: string
    email: string
    avatar?: string
  } | null>(null)
  
  // 通知消息
  const notifications = ref<Array<{
    id: string
    type: 'success' | 'error' | 'warning' | 'info'
    title: string
    message: string
    timestamp: number
  }>>([])

  // 切换主题
  function toggleTheme() {
    theme.value = theme.value === 'light' ? 'dark' : 'light'
    // 可以在这里添加主题切换的副作用，比如更新 CSS 变量
    document.documentElement.setAttribute('data-theme', theme.value)
  }

  // 设置加载状态
  function setLoading(loading: boolean) {
    isLoading.value = loading
  }

  // 设置用户信息
  function setUser(userData: typeof user.value) {
    user.value = userData
  }

  // 添加通知
  function addNotification(notification: Omit<typeof notifications.value[0], 'id' | 'timestamp'>) {
    const id = Date.now().toString()
    const timestamp = Date.now()
    
    notifications.value.push({
      ...notification,
      id,
      timestamp
    })

    // 自动清除通知（5秒后）
    setTimeout(() => {
      removeNotification(id)
    }, 5000)
  }

  // 移除通知
  function removeNotification(id: string) {
    const index = notifications.value.findIndex(n => n.id === id)
    if (index > -1) {
      notifications.value.splice(index, 1)
    }
  }

  // 清空所有通知
  function clearAllNotifications() {
    notifications.value = []
  }

  return {
    // 状态
    theme,
    isLoading,
    user,
    notifications,
    
    // 方法
    toggleTheme,
    setLoading,
    setUser,
    addNotification,
    removeNotification,
    clearAllNotifications
  }
})