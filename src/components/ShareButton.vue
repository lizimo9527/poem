<template>
  <div class="share-button">
    <button class="share-btn" @click="toggleShareMenu">
      📤 分享
    </button>
    
    <div v-if="showShareMenu" class="share-menu">
      <button class="share-option" @click="copyLink">
        🔗 复制链接
      </button>
      <button class="share-option" @click="shareToWeChat">
        💬 分享到微信
      </button>
      <button class="share-option" @click="downloadAsImage">
        📷 保存为图片
      </button>
    </div>
    
    <div v-if="showCopiedMessage" class="copied-message">
      链接已复制到剪贴板！
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useNotification } from '@/composables/useNotification'

const props = defineProps<{
  poemId: number
  poemTitle: string
  poemAuthor: string
}>()

const showShareMenu = ref(false)
const showCopiedMessage = ref(false)
const { success, error, info } = useNotification()

const toggleShareMenu = () => {
  showShareMenu.value = !showShareMenu.value
}

const copyLink = async () => {
  const url = `${window.location.origin}/poem/${props.poemId}`
  try {
    await navigator.clipboard.writeText(url)
    showCopiedMessage.value = true
    success('分享', '链接已复制到剪贴板！')
    
    setTimeout(() => {
      showCopiedMessage.value = false
      showShareMenu.value = false
    }, 2000)
  } catch (err) {
    error('分享', '复制失败，请手动复制链接')
  }
}

const shareToWeChat = () => {
  const url = `${window.location.origin}/poem/${props.poemId}`
  const title = `${props.poemTitle} - ${props.poemAuthor}`
  const text = `分享诗词: ${title}`
  
  if (navigator.share) {
    navigator.share({
      title: title,
      text: text,
      url: url
    })
  } else {
    copyLink()
  }
}

const downloadAsImage = () => {
  info('分享', '图片下载功能开发中...')
}
</script>

<style scoped>
.share-button {
  position: relative;
  display: inline-block;
}

.share-btn {
  background: #28a745;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: background-color 0.3s ease;
}

.share-btn:hover {
  background: #218838;
}

.share-menu {
  position: absolute;
  top: 100%;
  left: 0;
  background: white;
  border: 1px solid #ddd;
  border-radius: 4px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  min-width: 150px;
}

.share-option {
  display: block;
  width: 100%;
  background: none;
  border: none;
  padding: 0.75rem 1rem;
  text-align: left;
  cursor: pointer;
  font-size: 0.9rem;
  transition: background-color 0.2s ease;
}

.share-option:hover {
  background: #f8f9fa;
}

.copied-message {
  position: fixed;
  top: 20px;
  right: 20px;
  background: #28a745;
  color: white;
  padding: 0.75rem 1rem;
  border-radius: 4px;
  z-index: 1001;
  animation: slideIn 0.3s ease;
}

@keyframes slideIn {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

@media (max-width: 768px) {
  .share-menu {
    right: 0;
    left: auto;
  }
}
</style>