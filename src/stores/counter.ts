import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

/**
 * 计数器 Store
 * 使用 Composition API 风格定义
 */
export const useCounterStore = defineStore('counter', () => {
  // 状态 (state)
  const count = ref(0)
  const history = ref<number[]>([])

  // 计算属性 (getters)
  const doubleCount = computed(() => count.value * 2)
  const isEven = computed(() => count.value % 2 === 0)
  const isPositive = computed(() => count.value > 0)
  
  // 获取历史记录统计信息
  const historyStats = computed(() => {
    if (history.value.length === 0) return null
    
    const max = Math.max(...history.value)
    const min = Math.min(...history.value)
    const avg = history.value.reduce((sum, val) => sum + val, 0) / history.value.length
    
    return {
      max,
      min,
      avg: Math.round(avg * 100) / 100,
      total: history.value.length
    }
  })

  // 动作 (actions)
  function increment() {
    count.value++
    addToHistory(count.value)
  }

  function decrement() {
    count.value--
    addToHistory(count.value)
  }

  function incrementBy(amount: number) {
    count.value += amount
    addToHistory(count.value)
  }

  function reset() {
    count.value = 0
    addToHistory(count.value)
  }

  function setCount(newCount: number) {
    count.value = newCount
    addToHistory(count.value)
  }

  // 添加到历史记录
  function addToHistory(value: number) {
    history.value.push(value)
    // 限制历史记录长度，避免内存泄漏
    if (history.value.length > 100) {
      history.value = history.value.slice(-50)
    }
  }

  // 清空历史记录
  function clearHistory() {
    history.value = []
  }

  // 返回需要暴露的状态和方法
  return {
    // 状态
    count,
    history,
    
    // 计算属性
    doubleCount,
    isEven,
    isPositive,
    historyStats,
    
    // 方法
    increment,
    decrement,
    incrementBy,
    reset,
    setCount,
    clearHistory
  }
})