import { useAppStore } from '@/stores/app'
import type { Notification } from '@/types'

/**
 * 通知管理组合式函数
 */
export function useNotification() {
  const appStore = useAppStore()
  
  // 显示成功通知
  const success = (title: string, message: string) => {
    appStore.addNotification({
      type: 'success',
      title,
      message
    })
  }
  
  // 显示错误通知
  const error = (title: string, message: string) => {
    appStore.addNotification({
      type: 'error',
      title,
      message
    })
  }
  
  // 显示警告通知
  const warning = (title: string, message: string) => {
    appStore.addNotification({
      type: 'warning',
      title,
      message
    })
  }
  
  // 显示信息通知
  const info = (title: string, message: string) => {
    appStore.addNotification({
      type: 'info',
      title,
      message
    })
  }
  
  // 显示自定义通知
  const notify = (notification: Omit<Notification, 'id' | 'timestamp'>) => {
    appStore.addNotification(notification)
  }
  
  // 移除通知
  const remove = (id: string) => {
    appStore.removeNotification(id)
  }
  
  // 清空所有通知
  const clear = () => {
    appStore.clearAllNotifications()
  }
  
  return {
    success,
    error,
    warning,
    info,
    notify,
    remove,
    clear
  }
}