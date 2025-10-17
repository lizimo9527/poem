import supabase from '@/utils/supabase'
import type { Poem, Author } from '@/types/poem'

// 诗词服务类
export class PoemService {
  // 获取所有诗词
  static async getAllPoems(): Promise<Poem[]> {
    const { data, error } = await supabase
      .from('poems')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('获取诗词列表失败:', error)
      throw error
    }

    return data.map((poem) => ({
      id: poem.id,
      title: poem.title,
      author: poem.author,
      dynasty: poem.dynasty,
      content: poem.content,
      translation: poem.translation || undefined,
      explanation: poem.explanation || undefined,
      tags: poem.tags || [],
    }))
  }

  // 根据ID获取诗词详情
  static async getPoemById(id: number): Promise<Poem | null> {
    const { data, error } = await supabase.from('poems').select('*').eq('id', id).single()

    if (error) {
      console.error('获取诗词详情失败:', error)
      return null
    }

    return {
      id: data.id,
      title: data.title,
      author: data.author,
      dynasty: data.dynasty,
      content: data.content,
      translation: data.translation || undefined,
      explanation: data.explanation || undefined,
      tags: data.tags || [],
    }
  }

  // 搜索诗词
  static async searchPoems(query: string): Promise<Poem[]> {
    const { data, error } = await supabase
      .from('poems')
      .select('*')
      .or(`title.ilike.%${query}%,author.ilike.%${query}%,content.ilike.%${query}%`)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('搜索诗词失败:', error)
      throw error
    }

    return data.map((poem) => ({
      id: poem.id,
      title: poem.title,
      author: poem.author,
      dynasty: poem.dynasty,
      content: poem.content,
      translation: poem.translation || undefined,
      explanation: poem.explanation || undefined,
      tags: poem.tags || [],
    }))
  }

  // 根据作者获取诗词
  static async getPoemsByAuthor(authorName: string): Promise<Poem[]> {
    const { data, error } = await supabase
      .from('poems')
      .select('*')
      .eq('author', authorName)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('获取作者诗词失败:', error)
      throw error
    }

    return data.map((poem) => ({
      id: poem.id,
      title: poem.title,
      author: poem.author,
      dynasty: poem.dynasty,
      content: poem.content,
      translation: poem.translation || undefined,
      explanation: poem.explanation || undefined,
      tags: poem.tags || [],
    }))
  }

  // 获取所有作者
  static async getAllAuthors(): Promise<Author[]> {
    const { data, error } = await supabase
      .from('authors')
      .select('*')
      .order('poems_count', { ascending: false })

    if (error) {
      console.error('获取作者列表失败:', error)
      throw error
    }

    return data.map((author) => ({
      id: author.id,
      name: author.name,
      dynasty: author.dynasty,
      intro: author.intro,
      poemsCount: author.poems_count,
    }))
  }

  // 根据ID获取作者详情
  static async getAuthorById(id: number): Promise<Author | null> {
    const { data, error } = await supabase.from('authors').select('*').eq('id', id).single()

    if (error) {
      console.error('获取作者详情失败:', error)
      return null
    }

    return {
      id: data.id,
      name: data.name,
      dynasty: data.dynasty,
      intro: data.intro,
      poemsCount: data.poems_count,
    }
  }

  // 获取随机诗词
  static async getRandomPoem(): Promise<Poem | null> {
    const { data, error } = await supabase.rpc('get_random_poem')

    if (error) {
      console.error('获取随机诗词失败:', error)
      return null
    }

    if (!data) return null

    return {
      id: data.id,
      title: data.title,
      author: data.author,
      dynasty: data.dynasty,
      content: data.content,
      translation: data.translation || undefined,
      explanation: data.explanation || undefined,
      tags: data.tags || [],
    }
  }

  // 获取热门诗词（按收藏数排序）
  static async getPopularPoems(limit: number = 10): Promise<Poem[]> {
    const { data, error } = await supabase
      .from('poem_with_favorites')
      .select('*')
      .order('favorite_count', { ascending: false })
      .limit(limit)

    if (error) {
      console.error('获取热门诗词失败:', error)
      throw error
    }

    return data.map((poem) => ({
      id: poem.id,
      title: poem.title,
      author: poem.author,
      dynasty: poem.dynasty,
      content: poem.content,
      translation: poem.translation || undefined,
      explanation: poem.explanation || undefined,
      tags: poem.tags || [],
    }))
  }
}

// 创建获取随机诗词的函数（需要在数据库中创建）
const createRandomPoemFunction = `
CREATE OR REPLACE FUNCTION get_random_poem()
RETURNS SETOF poems AS $$
BEGIN
  RETURN QUERY
  SELECT * FROM poems 
  ORDER BY RANDOM() 
  LIMIT 1;
END;
$$ LANGUAGE plpgsql;
`

export default PoemService
