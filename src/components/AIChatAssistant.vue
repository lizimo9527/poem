<template>
  <div class="ai-chat-assistant" :class="{ 'ai-chat-open': isOpen }">
    <!-- 悬浮按钮 -->
    <button class="ai-chat-button" @click="toggleChat">
      <span class="ai-icon">🤖</span>
      <span class="ai-label">AI助手</span>
    </button>

    <!-- 聊天窗口 -->
    <div v-if="isOpen" class="ai-chat-window">
      <div class="ai-chat-header">
        <h3>诗词AI助手</h3>
        <button class="close-button" @click="toggleChat">×</button>
      </div>

      <div class="ai-chat-messages">
        <div v-for="message in messages" :key="message.id" :class="['message', message.type]">
          <div class="message-content">
            {{ message.content }}
          </div>
          <div class="message-time">
            {{ formatTime(message.timestamp) }}
          </div>
        </div>
        <div v-if="isLoading" class="message ai">
          <div class="message-content">
            <div class="typing-indicator">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        </div>
      </div>

      <div class="ai-chat-input">
        <input
          v-model="inputMessage"
          @keyup.enter="sendMessage"
          placeholder="请输入关于诗词的问题..."
          :disabled="isLoading"
        />
        <button @click="sendMessage" :disabled="isLoading || !inputMessage.trim()">发送</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { AI_ASSISTANT_CONFIG } from '@/config/ai-assistant'

interface ChatMessage {
  id: number
  type: 'user' | 'ai'
  content: string
  timestamp: Date
}

const isOpen = ref(false)
const inputMessage = ref('')
const messages = ref<ChatMessage[]>([])
const isLoading = ref(false)
let messageId = 0

// 初始化欢迎消息
const initWelcomeMessage = () => {
  messages.value.push({
    id: messageId++,
    type: 'ai',
    content: '您好！我是诗词AI助手，可以帮您解答关于诗词的问题。请问有什么可以帮您的？',
    timestamp: new Date(),
  })
}

// 切换聊天窗口
const toggleChat = () => {
  isOpen.value = !isOpen.value
  if (isOpen.value && messages.value.length === 0) {
    initWelcomeMessage()
  }
}

// 发送消息
const sendMessage = async () => {
  if (!inputMessage.value.trim() || isLoading.value) return

  const userMessage = inputMessage.value.trim()
  inputMessage.value = ''

  // 添加用户消息
  messages.value.push({
    id: messageId++,
    type: 'user',
    content: userMessage,
    timestamp: new Date(),
  })

  isLoading.value = true

  try {
    // 调用实际的n8n工作流API
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), AI_ASSISTANT_CONFIG.TIMEOUT)

    try {
      const response = await fetch(AI_ASSISTANT_CONFIG.API_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: userMessage,
        }),
        signal: controller.signal,
      })

      clearTimeout(timeoutId)

      if (!response.ok) {
        throw new Error(`网络请求失败: ${response.status}`)
      }

      const data = await response.json()

      // 解析n8n响应格式 (output字段)
      const aiResponse =
        data.output || data.outputX || data.response || '抱歉，我暂时无法回答这个问题。'

      // 添加AI回复
      messages.value.push({
        id: messageId++,
        type: 'ai',
        content: aiResponse,
        timestamp: new Date(),
      })
    } finally {
      clearTimeout(timeoutId)
    }
  } catch (error) {
    console.error('AI助手请求失败:', error)

    const errorMessage =
      error.name === 'AbortError'
        ? '请求超时，请稍后重试。'
        : '抱歉，网络连接出现问题，请稍后重试。'

    messages.value.push({
      id: messageId++,
      type: 'ai',
      content: errorMessage,
      timestamp: new Date(),
    })
  } finally {
    isLoading.value = false

    // 限制消息历史记录数量
    if (messages.value.length > AI_ASSISTANT_CONFIG.MAX_MESSAGES) {
      messages.value = messages.value.slice(-AI_ASSISTANT_CONFIG.MAX_MESSAGES)
    }
  }
}

// 格式化时间
const formatTime = (date: Date) => {
  return date.toLocaleTimeString('zh-CN', {
    hour: '2-digit',
    minute: '2-digit',
  })
}

// 点击外部关闭聊天窗口
const handleClickOutside = (event: MouseEvent) => {
  const chatElement = document.querySelector('.ai-chat-assistant')
  if (chatElement && !chatElement.contains(event.target as Node)) {
    isOpen.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<style scoped>
.ai-chat-assistant {
  position: fixed;
  bottom: 20px;
  right: 20px;
  z-index: 1000;
}

.ai-chat-button {
  background: linear-gradient(135deg, #8b0000, #a52a2a);
  color: white;
  border: none;
  border-radius: 50px;
  padding: 12px 20px;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(139, 0, 0, 0.3);
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.3s ease;
}

.ai-chat-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(139, 0, 0, 0.4);
}

.ai-icon {
  font-size: 1.2rem;
}

.ai-label {
  font-weight: 600;
}

.ai-chat-window {
  position: absolute;
  bottom: 70px;
  right: 0;
  width: 350px;
  height: 500px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.ai-chat-header {
  background: #8b0000;
  color: white;
  padding: 15px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.ai-chat-header h3 {
  margin: 0;
  font-size: 1.1rem;
}

.close-button {
  background: none;
  border: none;
  color: white;
  font-size: 1.5rem;
  cursor: pointer;
  padding: 0;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.ai-chat-messages {
  flex: 1;
  padding: 15px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.message {
  display: flex;
  max-width: 80%;
}

.message.user {
  align-self: flex-end;
}

.message.ai {
  align-self: flex-start;
}

.message-content {
  padding: 10px 15px;
  border-radius: 18px;
  word-wrap: break-word;
}

.message.user .message-content {
  background: #8b0000;
  color: white;
  border-bottom-right-radius: 4px;
}

.message.ai .message-content {
  background: #f5f5f5;
  color: #333;
  border-bottom-left-radius: 4px;
}

.message-time {
  font-size: 0.7rem;
  color: #999;
  margin-top: 4px;
  text-align: right;
}

.message.ai .message-time {
  text-align: left;
}

.typing-indicator {
  display: flex;
  gap: 4px;
  padding: 10px 0;
}

.typing-indicator span {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #999;
  animation: typing 1.4s infinite ease-in-out;
}

.typing-indicator span:nth-child(1) {
  animation-delay: -0.32s;
}
.typing-indicator span:nth-child(2) {
  animation-delay: -0.16s;
}

@keyframes typing {
  0%,
  80%,
  100% {
    transform: scale(0.8);
    opacity: 0.5;
  }
  40% {
    transform: scale(1);
    opacity: 1;
  }
}

.ai-chat-input {
  padding: 15px;
  border-top: 1px solid #eee;
  display: flex;
  gap: 10px;
}

.ai-chat-input input {
  flex: 1;
  padding: 10px 15px;
  border: 1px solid #ddd;
  border-radius: 20px;
  outline: none;
  transition: border-color 0.3s;
}

.ai-chat-input input:focus {
  border-color: #8b0000;
}

.ai-chat-input button {
  background: #8b0000;
  color: white;
  border: none;
  border-radius: 20px;
  padding: 10px 20px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.ai-chat-input button:hover:not(:disabled) {
  background: #a52a2a;
}

.ai-chat-input button:disabled {
  background: #ccc;
  cursor: not-allowed;
}

@media (max-width: 768px) {
  .ai-chat-assistant {
    bottom: 10px;
    right: 10px;
  }

  .ai-chat-window {
    width: calc(100vw - 40px);
    height: 70vh;
    right: 10px;
  }
}
</style>
