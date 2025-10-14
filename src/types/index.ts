// 用户相关类型定义
export interface User {
  id: string
  name: string
  email: string
  avatar?: string
  role: 'admin' | 'user' | 'guest'
  createdAt: string
  updatedAt: string
}

// 通知消息类型
export interface Notification {
  id: string
  type: 'success' | 'error' | 'warning' | 'info'
  title: string
  message: string
  timestamp: number
  duration?: number
}

// API 响应类型
export interface ApiResponse<T = any> {
  success: boolean
  data: T
  message: string
  code: number
}

// 路由元信息类型
export interface RouteMeta {
  title?: string
  requiresAuth?: boolean
  roles?: string[]
  icon?: string
}

// 主题相关类型
export type ThemeMode = 'light' | 'dark' | 'auto'

// 组件 Props 基础类型
export interface BaseComponentProps {
  class?: string
  style?: string | Record<string, any>
}

// 表单验证规则类型
export interface ValidationRule {
  required?: boolean
  min?: number
  max?: number
  pattern?: RegExp
  message: string
  validator?: (value: any) => boolean | Promise<boolean>
}

// 分页相关类型
export interface Pagination {
  page: number
  pageSize: number
  total: number
  totalPages: number
}

// 排序类型
export interface SortOption {
  field: string
  order: 'asc' | 'desc'
}

// 筛选类型
export interface FilterOption {
  field: string
  operator: 'eq' | 'ne' | 'gt' | 'gte' | 'lt' | 'lte' | 'like' | 'in'
  value: any
}

// 表格列定义类型
export interface TableColumn {
  key: string
  title: string
  dataIndex: string
  width?: number
  sortable?: boolean
  filterable?: boolean
  render?: (value: any, record: any, index: number) => any
}

// 菜单项类型
export interface MenuItem {
  id: string
  title: string
  path?: string
  icon?: string
  children?: MenuItem[]
  meta?: RouteMeta
}

// 工具函数返回类型
export type AsyncReturnType<T extends (...args: any) => Promise<any>> = T extends (...args: any) => Promise<infer R> ? R : any