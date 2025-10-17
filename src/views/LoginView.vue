<template>
  <div class="login-view">
    <div class="login-container">
      <div class="login-card">
        <h1 class="login-title">登录</h1>
        <p class="login-subtitle">登录后即可使用收藏功能</p>

        <form @submit.prevent="handleLogin" class="login-form">
          <div class="form-group">
            <label for="email">邮箱地址</label>
            <input
              id="email"
              v-model="loginForm.email"
              type="email"
              required
              placeholder="请输入邮箱地址"
              class="form-input"
            />
          </div>

          <div class="form-group">
            <label for="password">密码</label>
            <input
              id="password"
              v-model="loginForm.password"
              type="password"
              required
              placeholder="请输入密码"
              class="form-input"
            />
          </div>

          <button type="submit" :disabled="isLoading" class="login-button">
            {{ isLoading ? '登录中...' : '登录' }}
          </button>
        </form>

        <div class="login-links">
          <p>还没有账号？<a href="#" @click.prevent="showRegister = true">立即注册</a></p>
        </div>

        <div v-if="showRegister" class="register-section">
          <h2>注册新账号</h2>
          <form @submit.prevent="handleRegister" class="register-form">
            <div class="form-group">
              <label for="register-email">邮箱地址</label>
              <input
                id="register-email"
                v-model="registerForm.email"
                type="email"
                required
                placeholder="请输入邮箱地址"
                class="form-input"
              />
            </div>

            <div class="form-group">
              <label for="register-password">密码</label>
              <input
                id="register-password"
                v-model="registerForm.password"
                type="password"
                required
                placeholder="请输入密码（至少6位）"
                class="form-input"
              />
            </div>

            <div class="form-group">
              <label for="confirm-password">确认密码</label>
              <input
                id="confirm-password"
                v-model="registerForm.confirmPassword"
                type="password"
                required
                placeholder="请再次输入密码"
                class="form-input"
              />
            </div>

            <button type="submit" :disabled="isLoading" class="register-button">
              {{ isLoading ? '注册中...' : '注册' }}
            </button>
          </form>
        </div>

        <div v-if="error" class="error-message">
          {{ error }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '@/composables/useAuth'

const router = useRouter()
const { user, login, register, isLoading, error } = useAuth()

const showRegister = ref(false)

const loginForm = reactive({
  email: '',
  password: '',
})

const registerForm = reactive({
  email: '',
  password: '',
  confirmPassword: '',
})

const handleLogin = async () => {
  const success = await login(loginForm.email, loginForm.password)
  if (success) {
    router.push('/')
  }
}

const handleRegister = async () => {
  if (registerForm.password !== registerForm.confirmPassword) {
    error.value = '两次输入的密码不一致'
    return
  }

  if (registerForm.password.length < 6) {
    error.value = '密码长度至少6位'
    return
  }

  const success = await register(registerForm.email, registerForm.password)
  if (success) {
    showRegister.value = false
    // 注册成功后直接登录并跳转到首页
    router.push('/')
  }
}
</script>

<style scoped>
.login-view {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 2rem;
}

.login-container {
  width: 100%;
  max-width: 400px;
}

.login-card {
  background: white;
  border-radius: 1rem;
  padding: 2rem;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
}

.login-title {
  text-align: center;
  color: #333;
  margin-bottom: 0.5rem;
  font-size: 2rem;
  font-weight: 600;
}

.login-subtitle {
  text-align: center;
  color: #666;
  margin-bottom: 2rem;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  color: #333;
  font-weight: 500;
}

.form-input {
  width: 100%;
  padding: 0.75rem;
  border: 2px solid #e1e5e9;
  border-radius: 0.5rem;
  font-size: 1rem;
  transition: border-color 0.3s ease;
}

.form-input:focus {
  outline: none;
  border-color: #667eea;
}

.login-button {
  width: 100%;
  padding: 0.75rem;
  background: #667eea;
  color: white;
  border: none;
  border-radius: 0.5rem;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.login-button:hover:not(:disabled) {
  background: #5a6fd8;
}

.login-button:disabled {
  background: #ccc;
  cursor: not-allowed;
}

.register-button {
  width: 100%;
  padding: 0.75rem;
  background: #764ba2;
  color: white;
  border: none;
  border-radius: 0.5rem;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.register-button:hover:not(:disabled) {
  background: #6a4190;
}

.login-links {
  text-align: center;
  margin-top: 1.5rem;
  color: #666;
}

.login-links a {
  color: #667eea;
  text-decoration: none;
}

.login-links a:hover {
  text-decoration: underline;
}

.register-section {
  margin-top: 2rem;
  padding-top: 2rem;
  border-top: 1px solid #e1e5e9;
}

.register-section h2 {
  color: #333;
  margin-bottom: 1.5rem;
  font-size: 1.5rem;
}

.demo-info {
  background: #f0f8ff;
  border: 1px solid #b3d9ff;
  border-radius: 0.5rem;
  padding: 1rem;
  margin-top: 1.5rem;
  text-align: center;
}

.demo-info p {
  margin: 0;
  color: #0066cc;
  font-size: 0.9rem;
}

.error-message {
  background: #fee;
  color: #c33;
  padding: 0.75rem;
  border-radius: 0.5rem;
  margin-top: 1rem;
  text-align: center;
}

@media (max-width: 480px) {
  .login-view {
    padding: 1rem;
  }

  .login-card {
    padding: 1.5rem;
  }
}
</style>
