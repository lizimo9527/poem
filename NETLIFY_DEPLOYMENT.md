# Netlify 部署指南

## 问题解决

已修复的MIME类型错误问题：

- 创建了 `netlify.toml` 配置文件，正确设置MIME类型
- 配置了构建命令和发布目录
- 设置了单页应用重定向规则

## 部署步骤

### 1. 在Netlify控制台部署

1. 登录 [Netlify](https://netlify.com)
2. 点击 "New site from Git"
3. 选择你的Git仓库
4. 配置构建设置：
   - Build command: `npm run build`
   - Publish directory: `dist`
5. 添加环境变量（在Site settings > Environment variables）：
   - `VITE_SUPABASE_URL`: `https://evyszkmytmlzysgdpxuf.supabase.co`
   - `VITE_SUPABASE_ANON_KEY`: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV2eXN6a215dG1senlzZ2RweHVmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA1MjI4MzUsImV4cCI6MjA3NjA5ODgzNX0.qiNy9N6Act3YZHkvc8fS_YzzV2AL61bnNcDUOao10K8`
   - `VITE_AI_ASSISTANT_API_ENDPOINT`: `https://lzm.app.n8n.cloud/webhook/86681566-bb4e-4f95-a966-33ad7ad23a31`
   - `VITE_APP_TITLE`: `Vue Demo应用`
   - `VITE_APP_DESCRIPTION`: `基于Vue 3的现代化Web应用`

### 2. 使用Netlify CLI部署（可选）

```bash
# 安装Netlify CLI
npm install -g netlify-cli

# 登录Netlify
netlify login

# 初始化部署
netlify init

# 部署站点
netlify deploy --prod
```

## 配置文件说明

### netlify.toml

- 设置构建命令和发布目录
- 配置正确的MIME类型头信息
- 单页应用重定向规则

### .env.netlify

- Netlify部署专用的环境变量文件
- 包含所有必要的环境变量配置

## 验证部署

部署完成后，访问Netlify提供的域名，检查：

1. 页面是否能正常加载
2. JavaScript模块是否正确加载
3. 应用功能是否正常工作

## 故障排除

如果仍然遇到MIME类型错误：

1. 检查Netlify的环境变量是否正确设置
2. 确认构建过程没有错误
3. 清除浏览器缓存重新测试
4. 检查Netlify的部署日志

## 注意事项

- 确保Git仓库中包含所有必要的文件
- 构建前确保所有依赖已正确安装
- 定期更新环境变量中的敏感信息
