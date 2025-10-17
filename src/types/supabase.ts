// Supabase 数据库类型定义
// 古诗词赏析应用数据库结构

export interface Database {
  public: {
    Tables: {
      poems: {
        Row: {
          id: number
          title: string
          author: string
          dynasty: string
          content: string
          translation: string | null
          explanation: string | null
          tags: string[]
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: number
          title: string
          author: string
          dynasty: string
          content: string
          translation?: string | null
          explanation?: string | null
          tags?: string[]
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: number
          title?: string
          author?: string
          dynasty?: string
          content?: string
          translation?: string | null
          explanation?: string | null
          tags?: string[]
          created_at?: string
          updated_at?: string
        }
      }
      authors: {
        Row: {
          id: number
          name: string
          dynasty: string
          intro: string
          poems_count: number
          created_at: string
        }
        Insert: {
          id?: number
          name: string
          dynasty: string
          intro: string
          poems_count?: number
          created_at?: string
        }
        Update: {
          id?: number
          name?: string
          dynasty?: string
          intro?: string
          poems_count?: number
          created_at?: string
        }
      }
      user_favorites: {
        Row: {
          id: string
          user_id: string
          poem_id: number
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          poem_id: number
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          poem_id?: number
          created_at?: string
        }
      }
      profiles: {
        Row: {
          id: string
          username: string | null
          avatar_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          username?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          username?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      poem_with_favorites: {
        Row: {
          id: number
          title: string
          author: string
          dynasty: string
          content: string
          translation: string | null
          explanation: string | null
          tags: string[]
          is_favorited: boolean
          favorite_count: number
        }
      }
    }
    Functions: {
      toggle_favorite: {
        Args: { poem_id: number }
        Returns: boolean
      }
      get_favorite_poems: {
        Args: { user_id: string }
        Returns: {
          id: number
          title: string
          author: string
          dynasty: string
          content: string
          translation: string | null
          explanation: string | null
          tags: string[]
        }[]
      }
    }
    Enums: {
      poem_dynasty: ['唐', '宋', '元', '明', '清', '先秦', '汉', '魏晋', '南北朝', '五代十国']
    }
  }
}