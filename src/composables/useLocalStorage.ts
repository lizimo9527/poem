import { ref, watch, Ref } from 'vue'

/**
 * LocalStorage 组合式函数
 */
export function useLocalStorage<T>(
  key: string,
  defaultValue: T
): [Ref<T>, (value: T) => void, () => void] {
  
  // 读取存储的值
  const read = (): T => {
    if (typeof window === 'undefined') return defaultValue
    try {
      const item = localStorage.getItem(key)
      if (item === null) return defaultValue
      return JSON.parse(item)
    } catch (error) {
      console.error(`读取 localStorage 键 "${key}" 失败:`, error)
      return defaultValue
    }
  }
  
  // 创建响应式引用
  const storedValue = ref<T>(read()) as Ref<T>
  
  // 写入值到 localStorage
  const setValue = (value: T) => {
    if (typeof window === 'undefined') return
    try {
      storedValue.value = value
      localStorage.setItem(key, JSON.stringify(value))
    } catch (error) {
      console.error(`写入 localStorage 键 "${key}" 失败:`, error)
    }
  }
  
  // 移除值
  const removeValue = () => {
    if (typeof window === 'undefined') return
    try {
      localStorage.removeItem(key)
      storedValue.value = defaultValue
    } catch (error) {
      console.error(`移除 localStorage 键 "${key}" 失败:`, error)
    }
  }
  
  // 监听值变化并同步到 localStorage
  watch(
    storedValue,
    (newValue) => {
      if (typeof window === 'undefined') return
      try {
        localStorage.setItem(key, JSON.stringify(newValue))
      } catch (error) {
        console.error(`同步 localStorage 键 "${key}" 失败:`, error)
      }
    },
    { deep: true }
  )
  
  // 监听其他标签页的变化
  const handleStorageChange = (e: StorageEvent) => {
    if (e.key === key && e.newValue !== null) {
      try {
        storedValue.value = JSON.parse(e.newValue)
      } catch (error) {
        console.error(`解析 localStorage 变化失败:`, error)
      }
    }
  }
  
  if (typeof window !== 'undefined') {
    window.addEventListener('storage', handleStorageChange)
  }
  
  return [storedValue, setValue, removeValue]
}

/**
 * SessionStorage 组合式函数
 */
export function useSessionStorage<T>(
  key: string,
  defaultValue: T
): [Ref<T>, (value: T) => void, () => void] {
  
  // 读取存储的值
  const read = (): T => {
    if (typeof window === 'undefined') return defaultValue
    try {
      const item = sessionStorage.getItem(key)
      if (item === null) return defaultValue
      return JSON.parse(item)
    } catch (error) {
      console.error(`读取 sessionStorage 键 "${key}" 失败:`, error)
      return defaultValue
    }
  }
  
  // 创建响应式引用
  const storedValue = ref<T>(read()) as Ref<T>
  
  // 写入值到 sessionStorage
  const setValue = (value: T) => {
    if (typeof window === 'undefined') return
    try {
      storedValue.value = value
      sessionStorage.setItem(key, JSON.stringify(value))
    } catch (error) {
      console.error(`写入 sessionStorage 键 "${key}" 失败:`, error)
    }
  }
  
  // 移除值
  const removeValue = () => {
    if (typeof window === 'undefined') return
    try {
      sessionStorage.removeItem(key)
      storedValue.value = defaultValue
    } catch (error) {
      console.error(`移除 sessionStorage 键 "${key}" 失败:`, error)
    }
  }
  
  // 监听值变化并同步到 sessionStorage
  watch(
    storedValue,
    (newValue) => {
      if (typeof window === 'undefined') return
      try {
        sessionStorage.setItem(key, JSON.stringify(newValue))
      } catch (error) {
        console.error(`同步 sessionStorage 键 "${key}" 失败:`, error)
      }
    },
    { deep: true }
  )
  
  return [storedValue, setValue, removeValue]
}