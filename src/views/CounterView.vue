<template>
  <div class="counter-view fade-in">
    <!-- 页面标题 -->
    <div class="page-header">
      <h1 class="page-title">计数器示例</h1>
      <p class="page-subtitle">体验 Vue 3 Composition API 和 Pinia 状态管理</p>
    </div>

    <!-- 计数器主体 -->
    <div class="counter-container">
      <div class="container">
        <div class="row">
          <!-- 主计数器 -->
          <div class="col col-8">
            <div class="card counter-main">
              <h2 class="card-title text-center">当前计数</h2>
              <div class="counter-display">
                <div class="counter-value" :class="{ 'positive': count > 0, 'negative': count < 0 }">
                  {{ count }}
                </div>
                <div class="counter-info">
                  <span class="info-item">
                    <strong>双倍值:</strong> {{ doubleCount }}
                  </span>
                  <span class="info-item">
                    <strong>类型:</strong> {{ isEven ? '偶数' : '奇数' }}
                  </span>
                  <span class="info-item">
                    <strong>状态:</strong> {{ isPositive ? '正数' : count === 0 ? '零' : '负数' }}
                  </span>
                </div>
              </div>

              <!-- 操作按钮 -->
              <div class="counter-actions">
                <div class="action-group">
                  <button @click="decrement" class="btn btn-danger">➖ 减 1</button>
                  <button @click="increment" class="btn">➕ 加 1</button>
                </div>
                
                <div class="action-group">
                  <button @click="incrementBy(5)" class="btn btn-secondary">+5</button>
                  <button @click="incrementBy(10)" class="btn btn-secondary">+10</button>
                  <button @click="incrementBy(-5)" class="btn btn-secondary">-5</button>
                </div>

                <div class="action-group">
                  <button @click="reset" class="btn btn-secondary">🔄 重置</button>
                  <button @click="setRandomValue" class="btn btn-secondary">🎲 随机</button>
                </div>
              </div>

              <!-- 自定义输入 -->
              <div class="custom-input">
                <div class="form-group">
                  <label class="form-label">设置自定义值：</label>
                  <div class="input-group">
                    <input 
                      v-model.number="customValue" 
                      type="number" 
                      class="form-control"
                      placeholder="输入数字"
                      @keyup.enter="setCustomValue"
                    >
                    <button @click="setCustomValue" class="btn">设置</button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- 统计信息 -->
          <div class="col col-4">
            <div class="card stats-panel">
              <h3 class="card-title">统计信息</h3>
              <div class="stats-content">
                <div class="stat-item">
                  <div class="stat-label">历史记录</div>
                  <div class="stat-value">{{ history.length }} 次操作</div>
                </div>
                
                <div v-if="historyStats" class="stats-detail">
                  <div class="stat-item">
                    <div class="stat-label">最大值</div>
                    <div class="stat-value">{{ historyStats.max }}</div>
                  </div>
                  <div class="stat-item">
                    <div class="stat-label">最小值</div>
                    <div class="stat-value">{{ historyStats.min }}</div>
                  </div>
                  <div class="stat-item">
                    <div class="stat-label">平均值</div>
                    <div class="stat-value">{{ historyStats.avg }}</div>
                  </div>
                </div>

                <button @click="clearHistory" class="btn btn-secondary btn-sm mt-3">
                  清空历史
                </button>
              </div>
            </div>

            <!-- 历史记录 -->
            <div class="card history-panel mt-3">
              <h3 class="card-title">操作历史</h3>
              <div class="history-list">
                <div 
                  v-for="(value, index) in history.slice(-10)" 
                  :key="index"
                  class="history-item"
                  :class="{ 'current': index === history.length - 1 }"
                >
                  <span class="history-index">{{ history.length - 10 + index + 1 }}</span>
                  <span class="history-value">{{ value }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useCounterStore } from '@/stores/counter'

// 使用计数器 store
const counterStore = useCounterStore()
const { count, doubleCount, isEven, isPositive, history, historyStats } = storeToRefs(counterStore)
const { increment, decrement, incrementBy, reset, setCount, clearHistory } = counterStore

// 自定义值输入
const customValue = ref<number>(0)

// 设置自定义值
function setCustomValue() {
  if (typeof customValue.value === 'number' && !isNaN(customValue.value)) {
    setCount(customValue.value)
    customValue.value = 0
  }
}

// 设置随机值
function setRandomValue() {
  const randomValue = Math.floor(Math.random() * 201) - 100 // -100 到 100
  setCount(randomValue)
}
</script>

<style scoped>
.counter-view {
  min-height: 100vh;
}

/* 页面头部 */
.page-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 3rem 2rem;
  text-align: center;
}

.page-title {
  font-size: 2.5rem;
  font-weight: bold;
  margin-bottom: 1rem;
}

.page-subtitle {
  font-size: 1.2rem;
  opacity: 0.9;
}

/* 计数器容器 */
.counter-container {
  padding: 3rem 0;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  min-height: calc(100vh - 200px);
}

/* 主计数器 */
.counter-main {
  text-align: center;
}

.counter-display {
  margin: 2rem 0;
}

.counter-value {
  font-size: 4rem;
  font-weight: bold;
  margin-bottom: 1rem;
  transition: all 0.3s ease;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1);
}

.counter-value.positive {
  color: #28a745;
}

.counter-value.negative {
  color: #dc3545;
}

.counter-info {
  display: flex;
  justify-content: space-around;
  flex-wrap: wrap;
  gap: 1rem;
  margin-bottom: 2rem;
}

.info-item {
  padding: 0.5rem 1rem;
  background: rgba(255, 255, 255, 0.8);
  border-radius: 2rem;
  font-size: 0.9rem;
  color: #495057;
}

/* 操作按钮 */
.counter-actions {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin: 2rem 0;
}

.action-group {
  display: flex;
  justify-content: center;
  gap: 0.5rem;
  flex-wrap: wrap;
}

/* 自定义输入 */
.custom-input {
  margin-top: 2rem;
}

.input-group {
  display: flex;
  gap: 0.5rem;
  justify-content: center;
  align-items: end;
}

.input-group .form-control {
  max-width: 150px;
}

/* 统计面板 */
.stats-panel,
.history-panel {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.stats-content {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.stat-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
}

.stat-item:last-child {
  border-bottom: none;
}

.stat-label {
  font-size: 0.9rem;
  opacity: 0.9;
}

.stat-value {
  font-weight: bold;
  font-size: 1.1rem;
}

.stats-detail {
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid rgba(255, 255, 255, 0.2);
}

/* 历史记录 */
.history-list {
  max-height: 300px;
  overflow-y: auto;
  margin-top: 1rem;
}

.history-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem;
  margin: 0.25rem 0;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 0.25rem;
  transition: all 0.2s ease;
}

.history-item:hover {
  background: rgba(255, 255, 255, 0.2);
}

.history-item.current {
  background: rgba(255, 255, 255, 0.3);
  font-weight: bold;
}

.history-index {
  font-size: 0.8rem;
  opacity: 0.8;
  min-width: 30px;
}

.history-value {
  font-weight: 500;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .page-title {
    font-size: 2rem;
  }
  
  .counter-value {
    font-size: 3rem;
  }
  
  .counter-info {
    flex-direction: column;
    align-items: center;
  }
  
  .action-group {
    flex-direction: column;
  }
  
  .input-group {
    flex-direction: column;
    align-items: stretch;
  }
  
  .input-group .form-control {
    max-width: none;
  }
  
  .counter-container {
    padding: 2rem 0;
  }
}
</style>