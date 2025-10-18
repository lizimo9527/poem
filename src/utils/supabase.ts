import { createClient } from '@supabase/supabase-js'
import type { Database } from '../types/supabase'
import type { SupabaseClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

let supabase: SupabaseClient<Database>

// 检查环境变量，提供更友好的错误处理
if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('缺少 Supabase 环境变量配置，应用将以降级模式运行')

  // 创建一个模拟的Supabase客户端，避免应用崩溃
  const mockSupabase = {
    auth: {
      getUser: () => Promise.resolve({ data: { user: null }, error: null }),
      signInWithPassword: () => Promise.resolve({ data: null, error: new Error('Supabase未配置') }),
      signUp: () => Promise.resolve({ data: null, error: new Error('Supabase未配置') }),
      signOut: () => Promise.resolve({ error: null }),
      onAuthStateChange: () => ({
        data: { subscription: { unsubscribe: () => {} } },
      }),
    },
    from: () => ({
      select: () => ({
        eq: () => Promise.resolve({ data: [], error: new Error('Supabase未配置') }),
      }),
      insert: () => Promise.resolve({ data: null, error: new Error('Supabase未配置') }),
      update: () => Promise.resolve({ data: null, error: new Error('Supabase未配置') }),
      delete: () => Promise.resolve({ data: null, error: new Error('Supabase未配置') }),
    }),
  }

  // @ts-ignore - 模拟客户端类型不完整
  supabase = mockSupabase as unknown as SupabaseClient<Database>
} else {
  // 创建真实的 Supabase 客户端
  supabase = createClient<Database>(supabaseUrl, supabaseAnonKey)
}

export { supabase }
export default supabase
