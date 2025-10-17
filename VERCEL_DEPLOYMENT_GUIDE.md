# Vercel 部署配置指南 - AI助手功能

## 问题描述

当前AI助手功能使用的是本地地址 `http://localhost:5678/webhook/86681566-bb4e-4f95-a966-33ad7ad23a31`，在部署到Vercel后其他人无法访问。

## 解决方案

已将配置改为使用环境变量，支持本地开发和线上部署的自动切换。

## 配置步骤

### 1. 在Vercel中配置环境变量

登录Vercel控制台，进入你的项目设置：

1. 进入项目设置 (Project Settings)
2. 选择环境变量 (Environment Variables)
3. 添加以下环境变量：

```
VITE_AI_ASSISTANT_WEBHOOK_URL=你的实际webhook地址
```

### 2. 获取实际的webhook地址

你需要将n8n工作流部署到一个公开可访问的服务器上，例如：

- 将n8n部署到云服务器（AWS、Google Cloud、Azure等）
- 使用n8n.cloud服务
- 部署到Railway、Render、Heroku等平台

### 3. 推荐的部署方案

#### 方案一：使用n8n.cloud（推荐）

1. 注册 n8n.cloud 账户
2. 导入你的工作流
3. 获取公开的webhook URL
4. 在Vercel中配置环境变量

#### 方案二：部署到Railway

1. 在Railway创建新项目
2. 使用n8n Docker镜像部署
3. 配置域名和SSL证书
4. 获取webhook URL

#### 方案三：使用Supabase Edge Functions（替代方案）

如果n8n部署困难，可以考虑将AI逻辑迁移到Supabase Edge Functions。

### 4. 环境变量配置示例

在Vercel中配置：

```
VITE_AI_ASSISTANT_WEBHOOK_URL=https://your-n8n-instance.com/webhook/86681566-bb4e-4f95-a966-33ad7ad23a31
```

### 5. 测试部署

部署后测试AI助手功能：

1. 打开部署的网站
2. 点击右下角AI助手按钮
3. 发送测试消息
4. 确认能够正常收到回复

## 故障排除

### 常见问题

1. **CORS错误**：确保你的n8n实例配置了正确的CORS设置
2. **网络超时**：检查webhook服务的响应时间
3. **认证问题**：如果webhook需要认证，需要在请求头中添加

### 本地开发

本地开发时，环境变量会使用 `.env` 文件中的配置：

```
VITE_AI_ASSISTANT_WEBHOOK_URL=http://localhost:5678/webhook/86681566-bb4e-4f95-a966-33ad7ad23a31
```

### 备用方案

如果无法部署n8n实例，可以考虑：

1. 使用OpenAI API直接集成
2. 使用其他AI服务提供商
3. 暂时禁用AI助手功能

## 代码变更说明

已完成的修改：

1. **环境变量支持**：AI助手配置现在使用 `import.meta.env.VITE_AI_ASSISTANT_WEBHOOK_URL`
2. **错误处理优化**：改进了网络错误和CORS错误的处理
3. **备用响应**：当服务不可用时显示友好的错误信息

## 下一步

1. 选择一个n8n部署方案
2. 获取公开的webhook URL
3. 在Vercel中配置环境变量
4. 重新部署应用
5. 测试AI助手功能

如有问题，请参考项目中的 `AI_ASSISTANT_SETUP.md` 文件获取更多技术细节。
