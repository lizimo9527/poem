-- 禁用邮箱确认功能
-- 在Supabase仪表板中执行以下操作：
-- 1. 进入 Authentication > Settings
-- 2. 在 "Auth Settings" 中禁用 "Enable email confirmations"
-- 3. 或者执行以下SQL（如果支持）：

-- 注意：以下SQL可能需要管理员权限，建议在Supabase仪表板中操作
-- UPDATE auth.config SET value = 'false' WHERE key = 'enable_email_confirmations';

-- 或者创建自定义配置（如果上述方法不可用）：
INSERT INTO auth.config (key, value) 
VALUES ('enable_email_confirmations', 'false')
ON CONFLICT (key) DO UPDATE SET value = 'false';

-- 同时设置密码最小长度为6位
UPDATE auth.config 
SET value = '6' 
WHERE key = 'password_min_length';