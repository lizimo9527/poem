import { ref, computed } from 'vue'
import { useAppStore } from '@/stores/app'

/**
 * 主题管理组合式函数
 */
export function useTheme() {
  const appStore = useAppStore()
  
  // 当前主题
  const currentTheme = computed(() => appStore.theme)
  
  // 是否为暗色主题
  const isDark = computed(() => currentTheme.value === 'dark')
  
  // 切换主题
  const toggleTheme = () => {
    appStore.toggleTheme()
  }
  
  // 设置主题
  const setTheme = (theme: 'light' | 'dark') => {
    if (theme !== currentTheme.value) {
      appStore.toggleTheme()
    }
  }
  
  // 应用主题到文档
  const applyTheme = () => {
    document.documentElement.setAttribute('data-theme', currentTheme.value)
    
    // 更新 meta theme-color
    const themeColorMeta = document.querySelector('meta[name="theme-color"]')
    if (themeColorMeta) {
      themeColorMeta.setAttribute('content', isDark.value ? '#1a1a1a' : '#ffffff')
    }
  }
  
  return {
    currentTheme,
    isDark,
    toggleTheme,
    setTheme,
    applyTheme
  }
}