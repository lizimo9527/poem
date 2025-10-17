import { defineStore } from 'pinia'
import { ref } from 'vue'
import { supabase } from '../utils/supabase'
import type { User } from '@supabase/supabase-js'

export const useSupabaseStore = defineStore('supabase', () => {
  const user = ref<User | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  // 初始化用户状态
  const initUser = async () => {
    try {
      isLoading.value = true
      error.value = null
      
      const { data: { user: currentUser }, error: userError } = await supabase.auth.getUser()
      
      if (userError) throw userError
      user.value = currentUser
      
      // 监听认证状态变化
      supabase.auth.onAuthStateChange((event, session) => {
        user.value = session?.user ?? null
      })
    } catch (err: any) {
      error.value = err.message || '初始化用户失败'
      console.error('Supabase 初始化错误:', err)
    } finally {
      isLoading.value = false
    }
  }

  // 登录
  const signIn = async (email: string, password: string) => {
    try {
      isLoading.value = true
      error.value = null
      
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password
      })
      
      if (signInError) throw signInError
      user.value = data.user
      return data
    } catch (err: any) {
      error.value = err.message || '登录失败'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  // 注册
  const signUp = async (email: string, password: string) => {
    try {
      isLoading.value = true
      error.value = null
      
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password
      })
      
      if (signUpError) throw signUpError
      return data
    } catch (err: any) {
      error.value = err.message || '注册失败'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  // 登出
  const signOut = async () => {
    try {
      isLoading.value = true
      error.value = null
      
      const { error: signOutError } = await supabase.auth.signOut()
      
      if (signOutError) throw signOutError
      user.value = null
    } catch (err: any) {
      error.value = err.message || '登出失败'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  // 清除错误
  const clearError = () => {
    error.value = null
  }

  return {
    user,
    isLoading,
    error,
    initUser,
    signIn,
    signUp,
    signOut,
    clearError
  }
})