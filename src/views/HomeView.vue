<template>
  <div class="home-view">
    <h1 class="main-title">诗歌精选</h1>
    <p class="welcome-text">欢迎来到诗歌世界，这里汇集了经典诗词作品</p>
    
    <div class="simple-poems">
      <div class="poem-item" @click="goToPoemDetail(1)">
        <h3>静夜思</h3>
        <p class="author">李白 · 唐代</p>
        <p class="poem-line">床前明月光，疑是地上霜。</p>
        <div class="click-hint">点击查看全文</div>
      </div>
      <div class="poem-item" @click="goToPoemDetail(2)">
        <h3>春晓</h3>
        <p class="author">孟浩然 · 唐代</p>
        <p class="poem-line">春眠不觉晓，处处闻啼鸟。</p>
        <div class="click-hint">点击查看全文</div>
      </div>
      <div class="poem-item" @click="goToPoemDetail(3)">
        <h3>登鹳雀楼</h3>
        <p class="author">王之涣 · 唐代</p>
        <p class="poem-line">白日依山尽，黄河入海流。</p>
        <div class="click-hint">点击查看全文</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

const goToPoemDetail = (poemId: number) => {
  router.push(`/poem/${poemId}`)
}
</script>

<style scoped>
.home-view {
  padding: 2rem;
  max-width: 800px;
  margin: 0 auto;
}

.main-title {
  text-align: center;
  color: #8b0000;
  margin-bottom: 1rem;
}

.welcome-text {
  text-align: center;
  color: #666;
  margin-bottom: 2rem;
  font-size: 1.1rem;
}

.simple-poems {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.poem-item {
  background: white;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  border-left: 4px solid #8b0000;
}

.poem-item h3 {
  color: #8b0000;
  margin: 0 0 0.5rem;
}

.author {
  color: #666;
  font-size: 0.9rem;
  margin: 0 0 1rem;
}

.poem-item {
  cursor: pointer;
  transition: all 0.3s ease;
}

.poem-item:hover {
  transform: translateY(-5px);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.15);
}

.poem-line {
  font-family: "KaiTi", "楷体", serif;
  font-size: 1.1rem;
  line-height: 1.6;
  color: #333;
  margin: 0;
}

.click-hint {
  text-align: center;
  color: #8b0000;
  font-size: 0.9rem;
  margin-top: 1rem;
  padding-top: 0.5rem;
  border-top: 1px dashed #e8e8e8;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.poem-item:hover .click-hint {
  opacity: 1;
}
</style>