import supabase from '@/utils/supabase'
import type { Poem } from '@/types/poem'

// 收藏服务类
export class FavoriteService {
  // 切换收藏状态
  static async toggleFavorite(poemId: number): Promise<boolean> {
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      throw new Error('用户未登录')
    }

    try {
      // 使用upsert操作避免竞态条件
      const { data, error } = await supabase.rpc('toggle_favorite', {
        p_user_id: user.id,
        p_poem_id: poemId,
      })

      if (error) {
        console.error('切换收藏状态失败:', error)
        throw error
      }

      return data === true
    } catch (error) {
      // 如果RPC调用失败，回退到直接操作
      console.warn('RPC调用失败，使用直接操作:', error)

      // 直接删除或插入，让数据库约束处理重复问题
      const { error: deleteError } = await supabase
        .from('user_favorites')
        .delete()
        .eq('user_id', user.id)
        .eq('poem_id', poemId)

      if (deleteError && deleteError.code !== 'PGRST116') {
        // 如果删除失败且不是"未找到记录"错误，尝试插入
        const { error: insertError } = await supabase
          .from('user_favorites')
          .insert({ user_id: user.id, poem_id: poemId })
          .select()

        if (insertError) {
          console.error('添加收藏失败:', insertError)
          throw insertError
        }
        return true
      }

      // 如果删除成功或记录不存在，返回false表示已取消收藏
      return false
    }
  }

  // 获取用户收藏的诗词
  static async getUserFavorites(): Promise<Poem[]> {
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return []
    }

    const { data, error } = await supabase
      .from('user_favorites')
      .select(
        `
        poems (
          id,
          title,
          author,
          dynasty,
          content,
          translation,
          explanation,
          tags
        )
      `
      )
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('获取用户收藏失败:', error)
      throw error
    }

    return (data as any[]).map((item: any) => ({
      id: item.poems.id,
      title: item.poems.title,
      author: item.poems.author,
      dynasty: item.poems.dynasty,
      content: item.poems.content,
      translation: item.poems.translation || undefined,
      explanation: item.poems.explanation || undefined,
      tags: item.poems.tags || [],
    }))
  }

  // 检查诗词是否被收藏
  static async isPoemFavorited(poemId: number): Promise<boolean> {
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return false
    }

    const { data, error } = await supabase
      .from('user_favorites')
      .select('id')
      .eq('user_id', user.id)
      .eq('poem_id', poemId)
      .single()

    if (error && error.code !== 'PGRST116') {
      // PGRST116 表示没有找到记录
      console.error('检查收藏状态失败:', error)
      throw error
    }

    return !!data
  }

  // 获取诗词的收藏数量
  static async getFavoriteCount(poemId: number): Promise<number> {
    const { count, error } = await supabase
      .from('user_favorites')
      .select('*', { count: 'exact', head: true })
      .eq('poem_id', poemId)

    if (error) {
      console.error('获取收藏数量失败:', error)
      throw error
    }

    return count || 0
  }

  // 批量获取诗词的收藏状态
  static async getFavoritesStatus(poemIds: number[]): Promise<Map<number, boolean>> {
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return new Map(poemIds.map((id) => [id, false]))
    }

    const { data, error } = await supabase
      .from('user_favorites')
      .select('poem_id')
      .eq('user_id', user.id)
      .in('poem_id', poemIds)

    if (error) {
      console.error('批量获取收藏状态失败:', error)
      throw error
    }

    const favoriteMap = new Map<number, boolean>()
    poemIds.forEach((id) => favoriteMap.set(id, false))
    ;(data as Array<{ poem_id: number }>)?.forEach((item) => {
      favoriteMap.set(item.poem_id, true)
    })

    return favoriteMap
  }
}

export default FavoriteService
