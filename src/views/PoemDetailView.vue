<template>
  <div class="poem-detail">
    <div class="poem-header">
      <h1 class="poem-title">{{ poem.title }}</h1>
      <p class="poem-author">{{ poem.author }} · {{ poem.dynasty }}</p>
    </div>

    <div class="poem-content">
      <div class="original-poem">
        <h3>原文</h3>
        <div class="poem-text">
          <p v-for="(line, index) in poem.content.split('\n')" :key="index">{{ line }}</p>
        </div>
      </div>

      <div class="translation">
        <h3>译文</h3>
        <div class="translation-text">
          <p v-for="(line, index) in poem.translation.split('\n')" :key="index">{{ line }}</p>
        </div>
      </div>

      <div class="appreciation">
        <h3>赏析</h3>
        <div class="appreciation-text">
          <p>{{ poem.appreciation }}</p>
        </div>
      </div>
    </div>

    <div class="poem-footer">
      <button class="back-button" @click="$router.back()">返回</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'

interface Poem {
  id: number
  title: string
  author: string
  dynasty: string
  content: string
  translation: string
  appreciation: string
}

const route = useRoute()
const poem = ref<Poem>({
  id: 0,
  title: '',
  author: '',
  dynasty: '',
  content: '',
  translation: '',
  appreciation: ''
})

// 诗词数据
const poemsData: Poem[] = [
  {
    id: 1,
    title: '静夜思',
    author: '李白',
    dynasty: '唐代',
    content: '床前明月光\n疑是地上霜\n举头望明月\n低头思故乡',
    translation: '明亮的月光洒在床前的窗户纸上，\n好像地上泛起了一层霜。\n我禁不住抬起头来，看那天窗外空中的一轮明月，\n不由得低头沉思，想起远方的家乡。',
    appreciation: '这首诗写的是在寂静的月夜思念家乡的感受。诗的前两句，是写诗人在作客他乡的特定环境中一刹那间所产生的错觉。后两句通过动作神态的刻画，深化思乡之情。'
  },
  {
    id: 2,
    title: '春晓',
    author: '孟浩然',
    dynasty: '唐代',
    content: '春眠不觉晓\n处处闻啼鸟\n夜来风雨声\n花落知多少',
    translation: '春日里贪睡不知不觉天已破晓，\n搅乱我酣眠的是那啁啾的小鸟。\n昨天夜里风声雨声一直不断，\n那娇美的春花不知被吹落了多少？',
    appreciation: '这首诗是诗人隐居在鹿门山时所做，意境十分优美。诗人抓住春天的早晨刚刚醒来时的一瞬间展开描写和联想，生动地表达了诗人对春天的热爱和怜惜之情。'
  },
  {
    id: 3,
    title: '登鹳雀楼',
    author: '王之涣',
    dynasty: '唐代',
    content: '白日依山尽\n黄河入海流\n欲穷千里目\n更上一层楼',
    translation: '夕阳依傍着西山慢慢地沉没，\n滔滔黄河朝着东海汹涌奔流。\n若想把千里的风光景物看够，\n那就要登上更高的一层城楼。',
    appreciation: '这首诗写诗人在登高望远中表现出来的不凡的胸襟抱负，反映了盛唐时期人们积极向上的进取精神。前两句写所见，后两句写所想，把哲理与景物、情势溶化得天衣无缝。'
  }
]

onMounted(() => {
  const poemId = parseInt(route.params.id as string)
  const foundPoem = poemsData.find(p => p.id === poemId)
  if (foundPoem) {
    poem.value = foundPoem
  }
})
</script>

<style scoped>
.poem-detail {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
}

.poem-header {
  text-align: center;
  margin-bottom: 3rem;
}

.poem-title {
  color: #8b0000;
  font-size: 2.5rem;
  margin-bottom: 0.5rem;
}

.poem-author {
  color: #666;
  font-size: 1.2rem;
}

.poem-content {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.original-poem,
.translation,
.appreciation {
  background: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.original-poem h3,
.translation h3,
.appreciation h3 {
  color: #8b0000;
  margin-bottom: 1rem;
  border-bottom: 2px solid #f0f0f0;
  padding-bottom: 0.5rem;
}

.poem-text {
  font-family: "KaiTi", "楷体", serif;
  font-size: 1.3rem;
  line-height: 2;
  text-align: center;
}

.translation-text,
.appreciation-text {
  line-height: 1.8;
  color: #444;
}

.poem-footer {
  text-align: center;
  margin-top: 3rem;
}

.back-button {
  background: #8b0000;
  color: white;
  border: none;
  padding: 0.8rem 2rem;
  border-radius: 6px;
  cursor: pointer;
  font-size: 1rem;
  transition: background 0.3s;
}

.back-button:hover {
  background: #6a0000;
}
</style>