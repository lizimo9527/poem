<template>
  <div class="about fade-in">
    <!-- 页面标题 -->
    <div class="page-header">
      <h1 class="page-title">关于项目</h1>
      <p class="page-subtitle">了解这个 Vue 3 脚手架项目的详细信息</p>
    </div>

    <!-- 项目介绍 -->
    <section class="project-intro">
      <div class="container">
        <div class="row">
          <div class="col col-8">
            <div class="card">
              <h2 class="card-title">项目简介</h2>
              <div class="card-content">
                <p>
                  这是一个基于 Vue 3 + TypeScript + Vite 构建的现代化前端项目脚手架，
                  旨在为开发者提供一个快速启动项目的模板。
                </p>
                <p>
                  项目集成了当前最流行和最佳的前端开发技术栈，包括状态管理、路由管理、
                  代码规范检查、类型检查等功能，让开发者能够专注于业务逻辑的实现。
                </p>
                <p>
                  无论你是初学者还是经验丰富的开发者，这个脚手架都能帮助你快速构建
                  高质量的 Vue.js 应用程序。
                </p>
              </div>
            </div>
          </div>
          <div class="col col-4">
            <div class="card stats-card">
              <h3 class="card-title">项目统计</h3>
              <div class="stats">
                <div class="stat-item">
                  <div class="stat-value">{{ projectStats.components }}</div>
                  <div class="stat-label">组件数量</div>
                </div>
                <div class="stat-item">
                  <div class="stat-value">{{ projectStats.routes }}</div>
                  <div class="stat-label">路由页面</div>
                </div>
                <div class="stat-item">
                  <div class="stat-value">{{ projectStats.stores }}</div>
                  <div class="stat-label">状态管理</div>
                </div>
                <div class="stat-item">
                  <div class="stat-value">{{ projectStats.version }}</div>
                  <div class="stat-label">版本号</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 技术特性 -->
    <section class="features-detail">
      <div class="container">
        <h2 class="section-title">核心特性</h2>
        <div class="features-list">
          <div class="feature-item" v-for="feature in features" :key="feature.title">
            <div class="feature-header">
              <div class="feature-icon">{{ feature.icon }}</div>
              <h3>{{ feature.title }}</h3>
            </div>
            <p>{{ feature.description }}</p>
            <ul class="feature-points">
              <li v-for="point in feature.points" :key="point">{{ point }}</li>
            </ul>
          </div>
        </div>
      </div>
    </section>

    <!-- 开发团队 -->
    <section class="team">
      <div class="container">
        <h2 class="section-title">开发信息</h2>
        <div class="row">
          <div class="col col-6">
            <div class="card">
              <h3 class="card-title">开发环境</h3>
              <div class="env-info">
                <div class="env-item">
                  <strong>Node.js:</strong> {{ systemInfo.nodeVersion || '检测中...' }}
                </div>
                <div class="env-item">
                  <strong>npm:</strong> {{ systemInfo.npmVersion || '检测中...' }}
                </div>
                <div class="env-item">
                  <strong>浏览器:</strong> {{ systemInfo.browser }}
                </div>
                <div class="env-item">
                  <strong>操作系统:</strong> {{ systemInfo.platform }}
                </div>
                <div class="env-item">
                  <strong>屏幕分辨率:</strong> {{ systemInfo.screenResolution }}
                </div>
              </div>
            </div>
          </div>
          <div class="col col-6">
            <div class="card">
              <h3 class="card-title">项目配置</h3>
              <div class="config-info">
                <div class="config-item">
                  <strong>构建工具:</strong> Vite 5.0+
                </div>
                <div class="config-item">
                  <strong>框架版本:</strong> Vue 3.4+
                </div>
                <div class="config-item">
                  <strong>语言:</strong> TypeScript 5.3+
                </div>
                <div class="config-item">
                  <strong>状态管理:</strong> Pinia 2.1+
                </div>
                <div class="config-item">
                  <strong>路由管理:</strong> Vue Router 4.2+
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 联系信息 -->
    <section class="contact">
      <div class="container">
        <div class="card text-center">
          <h2 class="card-title">联系我们</h2>
          <p class="card-content">
            如果你在使用过程中遇到问题，或者有任何建议和反馈，欢迎联系我们！
          </p>
          <div class="contact-links">
            <a href="mailto:contact@example.com" class="btn">
              📧 发送邮件
            </a>
            <a href="https://github.com" target="_blank" class="btn btn-secondary">
              📱 GitHub
            </a>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

// 项目统计信息
const projectStats = ref({
  components: 5,
  routes: 3,
  stores: 2,
  version: '1.0.0'
})

// 系统信息
const systemInfo = ref({
  nodeVersion: '',
  npmVersion: '',
  browser: '',
  platform: '',
  screenResolution: ''
})

// 核心特性列表
const features = ref([
  {
    icon: '⚡',
    title: 'Vite 构建工具',
    description: '使用 Vite 作为构建工具，提供极速的开发体验和优化的生产构建。',
    points: [
      '极速的热模块替换 (HMR)',
      '原生 ES 模块支持',
      '优化的生产构建',
      '丰富的插件生态'
    ]
  },
  {
    icon: '🖖',
    title: 'Vue 3 Composition API',
    description: '采用 Vue 3 的 Composition API，提供更好的逻辑复用和类型推导。',
    points: [
      'setup 语法糖支持',
      '响应式系统优化',
      '更好的 TypeScript 集成',
      '组合式函数支持'
    ]
  },
  {
    icon: '📘',
    title: 'TypeScript 支持',
    description: '完整的 TypeScript 支持，提供类型安全和更好的开发体验。',
    points: [
      '严格的类型检查',
      '智能代码提示',
      '重构安全保障',
      '接口定义规范'
    ]
  },
  {
    icon: '🛣️',
    title: '路由管理',
    description: '使用 Vue Router 4 进行单页面应用路由管理，支持路由守卫和懒加载。',
    points: [
      '声明式路由配置',
      '路由懒加载',
      '导航守卫',
      '动态路由匹配'
    ]
  },
  {
    icon: '🍍',
    title: 'Pinia 状态管理',
    description: '使用 Pinia 作为状态管理库，提供简洁的 API 和完整的 TypeScript 支持。',
    points: [
      'Composition API 风格',
      '模块化状态管理',
      'DevTools 支持',
      '服务端渲染友好'
    ]
  },
  {
    icon: '🎨',
    title: '现代化 UI',
    description: '响应式设计和现代化的用户界面，适配各种设备和屏幕尺寸。',
    points: [
      '完全响应式布局',
      '现代化设计风格',
      '流畅的动画效果',
      '无障碍访问支持'
    ]
  }
])

// 获取系统信息
function getSystemInfo() {
  // 浏览器信息
  const ua = navigator.userAgent
  let browser = 'Unknown'
  if (ua.includes('Chrome')) {
    browser = 'Chrome'
  } else if (ua.includes('Firefox')) {
    browser = 'Firefox'
  } else if (ua.includes('Safari')) {
    browser = 'Safari'
  } else if (ua.includes('Edge')) {
    browser = 'Edge'
  }

  // 平台信息
  const platform = navigator.platform || 'Unknown'

  // 屏幕分辨率
  const screenResolution = `${window.screen.width} × ${window.screen.height}`

  systemInfo.value = {
    nodeVersion: 'Node.js 18+',
    npmVersion: 'npm 8+',
    browser,
    platform,
    screenResolution
  }
}

// 组件挂载时获取系统信息
onMounted(() => {
  getSystemInfo()
})
</script>

<style scoped>
.about {
  min-height: 100vh;
}

/* 页面头部 */
.page-header {
  background: linear-gradient(135deg, #42b883 0%, #35495e 100%);
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

/* 项目介绍 */
.project-intro {
  padding: 3rem 0;
  background: white;
}

.stats-card {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.stats {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
  margin-top: 1rem;
}

.stat-item {
  text-align: center;
}

.stat-value {
  font-size: 2rem;
  font-weight: bold;
  margin-bottom: 0.5rem;
}

.stat-label {
  font-size: 0.9rem;
  opacity: 0.9;
}

/* 特性详情 */
.features-detail {
  padding: 3rem 0;
  background-color: #f8f9fa;
}

.section-title {
  text-align: center;
  font-size: 2.5rem;
  font-weight: bold;
  margin-bottom: 3rem;
  color: #2c3e50;
}

.features-list {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 2rem;
}

.feature-item {
  background: white;
  border-radius: 1rem;
  padding: 2rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.feature-item:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

.feature-header {
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
}

.feature-icon {
  font-size: 2rem;
  margin-right: 1rem;
}

.feature-header h3 {
  font-size: 1.25rem;
  font-weight: bold;
  color: #2c3e50;
  margin: 0;
}

.feature-item p {
  color: #6c757d;
  line-height: 1.6;
  margin-bottom: 1rem;
}

.feature-points {
  list-style: none;
  padding: 0;
  margin: 0;
}

.feature-points li {
  padding: 0.25rem 0;
  color: #495057;
  position: relative;
  padding-left: 1.5rem;
}

.feature-points li::before {
  content: '✓';
  position: absolute;
  left: 0;
  color: #42b883;
  font-weight: bold;
}

/* 团队信息 */
.team {
  padding: 3rem 0;
  background: white;
}

.env-info,
.config-info {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.env-item,
.config-item {
  padding: 0.5rem 0;
  border-bottom: 1px solid #e9ecef;
}

.env-item:last-child,
.config-item:last-child {
  border-bottom: none;
}

/* 联系信息 */
.contact {
  padding: 3rem 0;
  background-color: #f8f9fa;
}

.contact-links {
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin-top: 2rem;
  flex-wrap: wrap;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .page-title {
    font-size: 2rem;
  }
  
  .features-list {
    grid-template-columns: 1fr;
  }
  
  .feature-header {
    flex-direction: column;
    align-items: flex-start;
    text-align: left;
  }
  
  .feature-icon {
    margin-right: 0;
    margin-bottom: 0.5rem;
  }
  
  .stats {
    grid-template-columns: 1fr;
  }
  
  .contact-links {
    flex-direction: column;
    align-items: center;
  }
}
</style>