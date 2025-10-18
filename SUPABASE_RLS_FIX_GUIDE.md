# Supabase RLS权限修复指南

## 问题描述

Netlify部署后出现401错误，原因是Supabase数据库的RLS（行级安全）策略阻止了匿名用户访问数据。

## 解决方案

### 方法1：在Supabase仪表板执行SQL（推荐）

1. **登录Supabase控制台**
   - 访问 https://supabase.com/dashboard
   - 选择你的项目 `evyszkmytmlzysgdpxuf`

2. **进入SQL编辑器**
   - 在左侧菜单点击 **SQL Editor**
   - 点击 **New Query**

3. **执行修复脚本**
   - 复制 `fix_supabase_rls.sql` 文件中的内容
   - 粘贴到SQL编辑器中
   - 点击 **Run** 执行

4. **验证修复**
   - 脚本执行成功后，访问你的Netlify站点
   - 检查控制台是否还有401错误

### 方法2：手动配置RLS策略

如果SQL脚本执行失败，可以手动配置：

1. **进入Authentication设置**
   - 左侧菜单点击 **Authentication** > **Policies**

2. **检查诗词表策略**
   - 找到 `poems` 表
   - 确保有SELECT策略允许 `true` 条件

3. **检查作者表策略**
   - 找到 `authors` 表
   - 确保有SELECT策略允许 `true` 条件

4. **检查权限设置**
   - 进入 **Database** > **Roles**
   - 确保 `anon` 和 `authenticated` 角色有适当权限

## 验证修复

修复后，访问以下URL应该返回数据而不是401错误：

- `https://evyszkmytmlzysgdpxuf.supabase.co/rest/v1/poems?select=*`
- `https://evyszkmytmlzysgdpxuf.supabase.co/rest/v1/authors?select=*`

## 故障排除

如果仍然有401错误：

1. **检查环境变量**
   - 确保Netlify中的 `VITE_SUPABASE_URL` 和 `VITE_SUPABASE_ANON_KEY` 正确

2. **检查RLS策略**
   - 在Supabase仪表板的 **Table Editor** 中
   - 选择任意表，点击 **Policies** 标签
   - 确保有允许匿名访问的策略

3. **检查API权限**
   - 进入 **Settings** > **API**
   - 确保 **Enable anonymous access** 已启用

## 重要提示

- 执行SQL脚本前建议备份数据库
- 生产环境建议使用更严格的RLS策略
- 定期检查安全设置
