-- 修复匿名用户访问权限
-- 确保匿名用户（使用anon key）可以读取公开数据

-- 为匿名用户添加诗词表的SELECT权限
DROP POLICY IF EXISTS "诗词公开可读" ON poems;
CREATE POLICY "诗词公开可读" ON poems 
  FOR SELECT USING (true);

-- 为匿名用户添加作者表的SELECT权限  
DROP POLICY IF EXISTS "作者公开可读" ON authors;
CREATE POLICY "作者公开可读" ON authors 
  FOR SELECT USING (true);

-- 为匿名用户添加用户资料表的SELECT权限
DROP POLICY IF EXISTS "用户资料公开可读" ON profiles;
CREATE POLICY "用户资料公开可读" ON profiles 
  FOR SELECT USING (true);

-- 确保服务角色（service role key）有完全访问权限
-- 这通常由Supabase自动处理，但明确设置更安全
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO anon, authenticated;
GRANT SELECT ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;

-- 为诗词视图添加权限
GRANT SELECT ON poem_with_favorites TO anon, authenticated;

-- 确保函数对匿名用户可访问
GRANT EXECUTE ON FUNCTION get_random_poem() TO anon, authenticated;
GRANT EXECUTE ON FUNCTION get_favorite_poems(UUID) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION toggle_favorite(BIGINT) TO anon, authenticated;