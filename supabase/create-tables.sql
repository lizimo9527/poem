-- 创建诗词表
CREATE TABLE IF NOT EXISTS poems (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  author VARCHAR(100) NOT NULL,
  dynasty VARCHAR(50) NOT NULL,
  content TEXT NOT NULL,
  tags TEXT[] DEFAULT '{}',
  translation TEXT,
  explanation TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- 创建作者表
CREATE TABLE IF NOT EXISTS authors (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE,
  dynasty VARCHAR(50) NOT NULL,
  intro TEXT,
  poems_count INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);

-- 创建收藏表
CREATE TABLE IF NOT EXISTS favorites (
  id SERIAL PRIMARY KEY,
  poem_id INTEGER REFERENCES poems(id),
  user_id UUID,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(poem_id, user_id)
);