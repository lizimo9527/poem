# 认证系统设置指南

## 问题说明

当前注册后无法登录，提示"Email not confirmed"，这是因为Supabase默认启用了邮箱确认功能。

## 解决方案

### 方法1：在Supabase仪表板中禁用邮箱确认（推荐）

1. 登录您的Supabase项目控制台
2. 进入 **Authentication** > **Settings**
3. 在 **Auth Settings** 部分找到 **Enable email confirmations**
4. 将其设置为 **禁用** 状态
5. 保存设置

### 方法2：使用SQL命令（需要管理员权限）

在Supabase SQL编辑器中执行：

```sql
-- 禁用邮箱确认
UPDATE auth.config SET value = 'false' WHERE key = 'enable_email_confirmations';
```

### 方法3：临时解决方案 - 使用测试账户

我们已经在数据库中创建了测试用户，您可以直接使用以下账户登录：

- **邮箱**: test@example.com
- **密码**: 123456

## 配置说明

### 邮箱确认功能

- **启用**: 用户注册后需要点击邮箱中的确认链接才能登录
- **禁用**: 用户注册后可以直接登录（适合开发环境）

### 密码策略

- 最小长度: 6位
- 不需要特殊字符

## 测试账户

为了方便测试，系统已经预置了测试用户数据：

```sql
-- 测试用户ID: 11111111-1111-1111-1111-111111111111
-- 邮箱: test@example.com
-- 密码: 123456
```

## 下一步

1. 按照上述方法禁用邮箱确认功能
2. 重新测试注册和登录功能
3. 如果仍有问题，检查Supabase项目配置
