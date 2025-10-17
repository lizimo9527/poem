-- 创建古诗词赏析应用数据库表结构

-- 启用 UUID 扩展
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 创建朝代枚举类型
CREATE TYPE poem_dynasty AS ENUM (
  '唐', '宋', '元', '明', '清', '先秦', '汉', '魏晋', '南北朝', '五代十国'
);

-- 创建诗词表
CREATE TABLE IF NOT EXISTS poems (
  id BIGSERIAL PRIMARY KEY,
  title VARCHAR(100) NOT NULL,
  author VARCHAR(50) NOT NULL,
  dynasty poem_dynasty NOT NULL,
  content TEXT NOT NULL,
  translation TEXT,
  explanation TEXT,
  tags TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 创建作者表
CREATE TABLE IF NOT EXISTS authors (
  id BIGSERIAL PRIMARY KEY,
  name VARCHAR(50) NOT NULL,
  dynasty poem_dynasty NOT NULL,
  intro TEXT NOT NULL,
  poems_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 创建用户收藏表
CREATE TABLE IF NOT EXISTS user_favorites (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  poem_id BIGINT NOT NULL REFERENCES poems(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, poem_id)
);

-- 创建用户资料表
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username VARCHAR(50),
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 创建索引以提高查询性能
CREATE INDEX IF NOT EXISTS idx_poems_author ON poems(author);
CREATE INDEX IF NOT EXISTS idx_poems_dynasty ON poems(dynasty);
CREATE INDEX IF NOT EXISTS idx_poems_tags ON poems USING GIN(tags);
CREATE INDEX IF NOT EXISTS idx_authors_dynasty ON authors(dynasty);
CREATE INDEX IF NOT EXISTS idx_user_favorites_user_id ON user_favorites(user_id);
CREATE INDEX IF NOT EXISTS idx_user_favorites_poem_id ON user_favorites(poem_id);

-- 创建诗词收藏视图
CREATE OR REPLACE VIEW poem_with_favorites AS
SELECT 
  p.*,
  EXISTS(
    SELECT 1 FROM user_favorites uf 
    WHERE uf.poem_id = p.id AND uf.user_id = auth.uid()
  ) as is_favorited,
  (
    SELECT COUNT(*) FROM user_favorites uf 
    WHERE uf.poem_id = p.id
  ) as favorite_count
FROM poems p;

-- 创建收藏切换函数
CREATE OR REPLACE FUNCTION toggle_favorite(poem_id BIGINT)
RETURNS BOOLEAN AS $$
DECLARE
  is_favorited BOOLEAN;
BEGIN
  -- 检查是否已收藏
  SELECT EXISTS(
    SELECT 1 FROM user_favorites 
    WHERE user_id = auth.uid() AND poem_id = $1
  ) INTO is_favorited;
  
  IF is_favorited THEN
    -- 取消收藏
    DELETE FROM user_favorites 
    WHERE user_id = auth.uid() AND poem_id = $1;
    RETURN false;
  ELSE
    -- 添加收藏
    INSERT INTO user_favorites (user_id, poem_id) 
    VALUES (auth.uid(), $1);
    RETURN true;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 创建获取用户收藏诗词函数
CREATE OR REPLACE FUNCTION get_favorite_poems(user_id UUID)
RETURNS TABLE (
  id BIGINT,
  title VARCHAR(100),
  author VARCHAR(50),
  dynasty poem_dynasty,
  content TEXT,
  translation TEXT,
  explanation TEXT,
  tags TEXT[]
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    p.id, p.title, p.author, p.dynasty, p.content, 
    p.translation, p.explanation, p.tags
  FROM poems p
  INNER JOIN user_favorites uf ON p.id = uf.poem_id
  WHERE uf.user_id = $1
  ORDER BY uf.created_at DESC;
END;
$$ LANGUAGE plpgsql;

-- 启用行级安全策略
ALTER TABLE poems ENABLE ROW LEVEL SECURITY;
ALTER TABLE authors ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- 创建安全策略

-- 诗词表策略：所有用户可读
CREATE POLICY "诗词公开可读" ON poems FOR SELECT USING (true);

-- 作者表策略：所有用户可读
CREATE POLICY "作者公开可读" ON authors FOR SELECT USING (true);

-- 用户收藏表策略：用户只能操作自己的收藏
CREATE POLICY "用户管理自己的收藏" ON user_favorites 
  FOR ALL USING (auth.uid() = user_id);

-- 用户资料表策略：用户只能查看公开资料
CREATE POLICY "用户资料公开可读" ON profiles FOR SELECT USING (true);
CREATE POLICY "用户管理自己的资料" ON profiles 
  FOR ALL USING (auth.uid() = id);

-- 创建更新时间的触发器函数
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 为需要更新时间的表创建触发器
CREATE TRIGGER update_poems_updated_at 
  BEFORE UPDATE ON poems 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_profiles_updated_at 
  BEFORE UPDATE ON profiles 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();