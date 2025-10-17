import { ref } from 'vue'
import { supabase } from '../utils/supabase'

// Supabase 组合式函数
export function useSupabase() {
  const loading = ref(false)
  const error = ref<string | null>(null)

  // 设置错误
  const setError = (err: any) => {
    error.value = err.message || '发生未知错误'
    console.error('Supabase 错误:', err)
  }

  // 清除错误
  const clearError = () => {
    error.value = null
  }

  // 获取当前用户
  const getCurrentUser = async () => {
    try {
      loading.value = true
      clearError()
      
      const { data: { user }, error: userError } = await supabase.auth.getUser()
      
      if (userError) throw userError
      return user
    } catch (err) {
      setError(err)
      return null
    } finally {
      loading.value = false
    }
  }

  // 登录
  const signIn = async (email: string, password: string) => {
    try {
      loading.value = true
      clearError()
      
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password
      })
      
      if (signInError) throw signInError
      return data
    } catch (err) {
      setError(err)
      return null
    } finally {
      loading.value = false
    }
  }

  // 注册
  const signUp = async (email: string, password: string) => {
    try {
      loading.value = true
      clearError()
      
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password
      })
      
      if (signUpError) throw signUpError
      return data
    } catch (err) {
      setError(err)
      return null
    } finally {
      loading.value = false
    }
  }

  // 登出
  const signOut = async () => {
    try {
      loading.value = true
      clearError()
      
      const { error: signOutError } = await supabase.auth.signOut()
      
      if (signOutError) throw signOutError
      return true
    } catch (err) {
      setError(err)
      return false
    } finally {
      loading.value = false
    }
  }

  return {
    loading,
    error,
    clearError,
    getCurrentUser,
    signIn,
    signUp,
    signOut
  }
}