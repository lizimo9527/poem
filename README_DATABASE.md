# 数据库配置指南

## 概述
本项目使用 Supabase 作为后端数据库服务。以下是配置和使用数据库的完整指南。

## 环境变量配置

在 `.env` 文件中配置以下环境变量：

```env
# Supabase 配置
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# 数据库初始化（可选，用于脚本）
SUPABASE_SERVICE_KEY=your_supabase_service_key
```

## 获取 Supabase 配置信息

1. 访问 [Supabase](https://supabase.com) 并创建新项目
2. 在项目设置中获取以下信息：
   - **Project URL**: 在项目设置中的 "API" 部分
   - **anon public key**: 在项目设置中的 "API" 部分
   - **service_role key**: 在项目设置中的 "API" 部分（用于数据库初始化）

## 数据库初始化

### 方法一：使用 Supabase Dashboard（推荐）

1. 登录 Supabase Dashboard
2. 进入 SQL 编辑器
3. 复制 `supabase/migrations/001_create_tables.sql` 内容并执行
4. 复制 `supabase/seed_data.sql` 内容并执行

### 方法二：使用初始化脚本

1. 配置环境变量：
```bash
export VITE_SUPABASE_URL=your_project_url
export SUPABASE_SERVICE_KEY=your_service_key
```

2. 运行初始化脚本：
```bash
node scripts/init-database.js
```

### 方法三：使用 Supabase CLI

1. 安装 Supabase CLI：
```bash
npm install -g supabase
```

2. 登录并链接项目：
```bash
supabase login
supabase link --project-ref your_project_ref
```

3. 应用迁移：
```bash
supabase db push
```

## 数据库表结构

### 主要表

1. **poems** - 诗词表
   - id: 主键
   - title: 诗词标题
   - author: 作者
   - dynasty: 朝代
   - content: 诗词内容
   - translation: 译文
   - explanation: 赏析
   - tags: 标签数组

2. **authors** - 作者表
   - id: 主键
   - name: 作者姓名
   - dynasty: 朝代
   - intro: 作者简介
   - poems_count: 诗词数量

3. **user_favorites** - 用户收藏表
   - id: UUID 主键
   - user_id: 用户ID（关联 auth.users）
   - poem_id: 诗词ID
   - created_at: 创建时间

4. **profiles** - 用户资料表
   - id: 用户ID（关联 auth.users）
   - username: 用户名
   - avatar_url: 头像URL
   - created_at/updated_at: 时间戳

### 视图和函数

1. **poem_with_favorites** - 包含收藏状态的诗词视图
2. **toggle_favorite()** - 切换收藏状态的函数
3. **get_favorite_poems()** - 获取用户收藏诗词的函数

## 安全策略

数据库启用了行级安全策略（RLS）：
- 诗词和作者表：所有用户可读
- 用户收藏表：用户只能操作自己的数据
- 用户资料表：公开可读，用户可管理自己的资料

## 数据备份和恢复

### 导出数据
```sql
-- 导出诗词数据
COPY poems TO '/path/to/poems.csv' WITH CSV HEADER;

-- 导出作者数据  
COPY authors TO '/path/to/authors.csv' WITH CSV HEADER;
```

### 导入数据
```sql
-- 导入诗词数据
COPY poems FROM '/path/to/poems.csv' WITH CSV HEADER;

-- 导入作者数据
COPY authors FROM '/path/to/authors.csv' WITH CSV HEADER;
```

## 常见问题

### Q: 数据库连接失败怎么办？
A: 检查环境变量配置是否正确，确保 Supabase 项目处于运行状态。

### Q: 如何添加新的诗词数据？
A: 可以通过 Supabase Dashboard 的表格编辑器直接添加，或使用 SQL 插入语句。

### Q: 收藏功能不工作？
A: 确保用户已登录，检查 RLS 策略是否正确配置。

### Q: 如何扩展数据库结构？
A: 在 `supabase/migrations/` 目录下创建新的迁移文件，然后应用迁移。

## 性能优化建议

1. 为常用查询字段创建索引
2. 使用分页查询大量数据
3. 启用数据库连接池
4. 定期清理过期数据

## 监控和维护

- 监控数据库性能指标
- 定期备份重要数据
- 更新数据库索引统计信息
- 清理无用数据