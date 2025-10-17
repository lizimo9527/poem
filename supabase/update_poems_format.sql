-- 更新诗词数据，删除content和translation字段中的换行符
UPDATE poems SET 
  content = REPLACE(content, E'\n', ''),
  translation = REPLACE(translation, E'\n', '')
WHERE content LIKE '%\n%' OR translation LIKE '%\n%';

-- 验证更新结果
SELECT id, title, content, translation FROM poems WHERE content NOT LIKE '%\n%' AND translation NOT LIKE '%\n%' LIMIT 5;