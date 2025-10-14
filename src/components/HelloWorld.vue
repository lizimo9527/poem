<template>
  <div class="hello-world">
    <h2>{{ msg }}</h2>
    <p class="description">
      这是一个示例组件，展示了 Vue 3 的基本组件结构和 TypeScript 支持。
    </p>
    
    <div class="demo-section">
      <h3>响应式数据示例</h3>
      <p>点击次数: <strong>{{ clickCount }}</strong></p>
      <button @click="handleClick" class="btn">
        点击我 {{ clickCount > 0 ? '👍' : '👋' }}
      </button>
    </div>

    <div class="demo-section">
      <h3>计算属性示例</h3>
      <p>{{ computedMessage }}</p>
    </div>

    <div class="demo-section">
      <h3>条件渲染示例</h3>
      <div class="toggle-demo">
        <button @click="showDetails = !showDetails" class="btn btn-secondary">
          {{ showDetails ? '隐藏' : '显示' }}详情
        </button>
        <div v-if="showDetails" class="details-panel">
          <h4>组件详情</h4>
          <ul>
            <li>使用 Vue 3 Composition API</li>
            <li>支持 TypeScript 类型检查</li>
            <li>响应式数据绑定</li>
            <li>事件处理</li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

// 定义 props
interface Props {
  msg: string
}

const props = withDefaults(defineProps<Props>(), {
  msg: 'Hello World!'
})

// 响应式数据
const clickCount = ref(0)
const showDetails = ref(false)

// 计算属性
const computedMessage = computed(() => {
  if (clickCount.value === 0) {
    return '还没有点击过按钮'
  } else if (clickCount.value < 5) {
    return `已经点击了 ${clickCount.value} 次`
  } else {
    return `哇！已经点击了 ${clickCount.value} 次了！`
  }
})

// 事件处理
function handleClick() {
  clickCount.value++
}
</script>

<style scoped>
.hello-world {
  padding: 2rem;
  text-align: center;
}

.hello-world h2 {
  color: #42b883;
  font-size: 2rem;
  margin-bottom: 1rem;
}

.description {
  color: #6c757d;
  font-size: 1.1rem;
  margin-bottom: 2rem;
  line-height: 1.6;
}

.demo-section {
  margin: 2rem 0;
  padding: 1.5rem;
  border: 2px solid #e9ecef;
  border-radius: 0.5rem;
  background: #f8f9fa;
}

.demo-section h3 {
  color: #2c3e50;
  margin-bottom: 1rem;
}

.toggle-demo {
  margin-top: 1rem;
}

.details-panel {
  margin-top: 1rem;
  padding: 1rem;
  background: white;
  border-radius: 0.5rem;
  text-align: left;
}

.details-panel h4 {
  color: #2c3e50;
  margin-bottom: 0.5rem;
}

.details-panel ul {
  margin: 0;
  padding-left: 1.5rem;
}

.details-panel li {
  margin: 0.25rem 0;
  color: #495057;
}

.btn-sm {
  padding: 0.375rem 0.75rem;
  font-size: 0.875rem;
}
</style>