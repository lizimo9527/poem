-- 在Supabase仪表板的SQL编辑器中执行此脚本
-- 修复匿名用户访问权限问题

-- 1. 首先删除现有的策略
DROP POLICY IF EXISTS "诗词公开可读" ON poems;
DROP POLICY IF EXISTS "作者公开可读" ON authors;
DROP POLICY IF EXISTS "用户资料公开可读" ON profiles;

-- 2. 重新创建策略，确保匿名用户可以访问
CREATE POLICY "诗词公开可读" ON poems 
  FOR SELECT USING (true);

CREATE POLICY "作者公开可读" ON authors 
  FOR SELECT USING (true);

CREATE POLICY "用户资料公开可读" ON profiles 
  FOR SELECT USING (true);

-- 3. 确保权限正确设置
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO anon, authenticated;
GRANT SELECT ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;

-- 4. 为视图和函数添加权限
GRANT SELECT ON poem_with_favorites TO anon, authenticated;
GRANT EXECUTE ON FUNCTION get_random_poem() TO anon, authenticated;
GRANT EXECUTE ON FUNCTION get_favorite_poems(UUID) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION toggle_favorite(BIGINT) TO anon, authenticated;

-- 5. 验证策略是否生效
SELECT schemaname, tablename, policyname, permissive, roles, cmd 
FROM pg_policies 
WHERE tablename IN ('poems', 'authors', 'profiles');