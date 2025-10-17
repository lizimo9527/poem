// AI助手配置
export const AI_ASSISTANT_CONFIG = {
  // n8n工作流webhook地址
  API_ENDPOINT: 'https://lzm.app.n8n.cloud/webhook/86681566-bb4e-4f95-a966-33ad7ad23a31',

  // 备用响应（当API不可用时使用）
  FALLBACK_RESPONSES: [
    '我是诗词AI助手，目前正在维护中，请稍后再试。',
    '抱歉，我暂时无法连接到服务器。',
    '网络连接出现问题，请检查您的网络设置。',
  ],

  // 超时设置（毫秒）
  TIMEOUT: 30000,

  // 最大消息历史记录
  MAX_MESSAGES: 50,
}
