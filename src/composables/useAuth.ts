import { ref, computed } from 'vue'
import supabase from '@/utils/supabase'
import type { AuthError, AuthChangeEvent, Session } from '@supabase/supabase-js'

// 认证组合式函数
export function useAuth() {
  const user = ref<any>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  // 初始化时获取当前用户
  const init = async () => {
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession()
      user.value = session?.user || null
    } catch (err) {
      console.error('初始化认证失败:', err)
    }
  }

  // 监听认证状态变化（仅在Supabase配置时）
  if (supabase.auth.onAuthStateChange) {
    supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN') {
        user.value = session?.user || null
      } else if (event === 'SIGNED_OUT') {
        user.value = null
      }
    })
  }

  // 登录
  const login = async (email: string, password: string) => {
    try {
      isLoading.value = true
      error.value = null

      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (authError) {
        throw authError
      }

      user.value = data.user
      return true
    } catch (err: any) {
      // 改进错误提示，提供更友好的中文提示
      if (err.message?.includes('Invalid login credentials')) {
        error.value = '邮箱或密码错误，请重试'
      } else if (err.message?.includes('Email rate limit exceeded')) {
        error.value = '登录尝试过于频繁，请稍后再试'
      } else if (err.message?.includes('OAuth authorization request already approved')) {
        error.value = '授权请求已处理，请尝试重新登录或清除浏览器缓存'
      } else {
        error.value = err.message || '登录失败，请重试'
      }
      console.error('登录失败:', err)
      return false
    } finally {
      isLoading.value = false
    }
  }

  // 注册
  const register = async (email: string, password: string) => {
    try {
      isLoading.value = true
      error.value = null

      const { data, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          // 禁用邮箱确认，直接登录
          emailRedirectTo: window.location.origin,
        },
      })

      if (authError) {
        throw authError
      }

      // 注册成功后直接登录
      if (data.user) {
        user.value = data.user
        return true
      }

      return false
    } catch (err: any) {
      // 改进错误提示，提供更友好的中文提示
      if (err.message?.includes('User already registered')) {
        error.value = '该邮箱已被注册，请直接登录'
      } else if (err.message?.includes('Password should be at least')) {
        error.value = '密码长度不足，请使用至少6位密码'
      } else if (err.message?.includes('Invalid email')) {
        error.value = '邮箱格式不正确，请检查后重试'
      } else if (err.message?.includes('OAuth authorization request already approved')) {
        error.value = '授权请求已处理，请尝试重新注册或清除浏览器缓存'
      } else {
        error.value = err.message || '注册失败，请重试'
      }
      console.error('注册失败:', err)
      return false
    } finally {
      isLoading.value = false
    }
  }

  // 登出
  const logout = async () => {
    try {
      const { error: authError } = await supabase.auth.signOut()
      if (authError) {
        throw authError
      }
      user.value = null
    } catch (err: any) {
      error.value = err.message || '登出失败'
      console.error('登出失败:', err)
    }
  }

  // 获取当前用户
  const getCurrentUser = async () => {
    try {
      const {
        data: { user: currentUser },
      } = await supabase.auth.getUser()
      user.value = currentUser
      return currentUser
    } catch (err: any) {
      console.error('获取用户信息失败:', err)
      return null
    }
  }

  // 清除错误
  const clearError = () => {
    error.value = null
  }

  // 清除OAuth状态（用于解决授权请求已批准的错误）
  const clearOAuthState = () => {
    // 清除本地存储中的OAuth相关数据
    if (typeof window !== 'undefined') {
      const keys = Object.keys(localStorage)
      keys.forEach((key) => {
        if (key.includes('supabase.auth') || key.includes('oauth')) {
          localStorage.removeItem(key)
        }
      })
      // 清除sessionStorage
      sessionStorage.clear()
    }
  }

  // 初始化认证
  init()

  return {
    // 响应式数据
    user: computed(() => user.value),
    isLoading: computed(() => isLoading.value),
    error: computed(() => error.value),
    isAuthenticated: computed(() => !!user.value),

    // 方法
    login,
    register,
    logout,
    getCurrentUser,
    clearError,
    clearOAuthState,
  }
}

export default useAuth
