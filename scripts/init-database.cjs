// 数据库初始化脚本
// 用于在Supabase项目中插入初始数据

const { createClient } = require('@supabase/supabase-js')
const fs = require('fs')
const path = require('path')

// 从.env文件读取配置
const envFile = fs.readFileSync('.env', 'utf8')
const envVars = {}
envFile.split('\n').forEach(line => {
  const [key, value] = line.split('=')
  if (key && value) {
    envVars[key.trim()] = value.trim()
  }
})

const supabaseUrl = envVars.VITE_SUPABASE_URL
const supabaseServiceKey = envVars.SUPABASE_SERVICE_KEY || envVars.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('错误：缺少Supabase环境变量配置')
  console.error('请检查 .env 文件中的 VITE_SUPABASE_URL 和 VITE_SUPABASE_ANON_KEY 配置')
  process.exit(1)
}

// 创建Supabase客户端（使用服务密钥）
const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function initDatabase() {
  try {
    console.log('开始初始化数据库...')
    
    // 由于Supabase不再支持直接执行SQL，我们需要使用SQL编辑器或手动创建表
    // 这里我们直接插入数据，假设表已经存在或通过Supabase控制台创建
    
    console.log('检查表是否存在，如果不存在则跳过创建...')
    
    // 插入示例诗词数据
    console.log('插入示例诗词数据...')
    const samplePoems = [
      {
        title: '静夜思',
        author: '李白',
        dynasty: '唐',
        content: '床前明月光，疑是地上霜。\\n举头望明月，低头思故乡。',
        tags: ['思乡', '月亮'],
        translation: '明亮的月光洒在窗户纸上，好像地上泛起了一层霜。\\n我禁不住抬起头来，看那天窗外空中的一轮明月，\\n不由得低头沉思，想起远方的家乡。',
        explanation: '此诗描写了秋日夜晚，诗人于屋内抬头望月的所感。诗中运用比喻、衬托等手法，表达客居思乡之情。'
      },
      {
        title: '春晓',
        author: '孟浩然',
        dynasty: '唐',
        content: '春眠不觉晓，处处闻啼鸟。\\n夜来风雨声，花落知多少。',
        tags: ['春天', '田园'],
        translation: '春日里贪睡不知不觉天已破晓，\\n搅乱我酣眠的是那啁啾的小鸟。\\n昨天夜里风声雨声一直不断，\\n那娇美的春花不知被吹落了多少？',
        explanation: '诗人抓住春天的早晨刚刚醒来时的一瞬间展开描写和联想，生动地表达了诗人对春天的热爱和怜惜之情。'
      },
      {
        title: '登鹳雀楼',
        author: '王之涣',
        dynasty: '唐',
        content: '白日依山尽，黄河入海流。\\n欲穷千里目，更上一层楼。',
        tags: ['登高', '哲理'],
        translation: '夕阳依傍着西山慢慢地沉没，\\n滔滔黄河朝着东海汹涌奔流。\\n若想把千里的风光景物看够，\\n那就要登上更高的一层城楼。',
        explanation: '此诗前两句写所见，后两句写所感，把哲理与景物、情势溶化得天衣无缝，成为鹳雀楼上一首不朽的绝唱。'
      }
    ]
    
    for (const poem of samplePoems) {
      const { error: insertError } = await supabase
        .from('poems')
        .insert(poem)
      
      if (insertError) {
        if (insertError.code === 'PGRST301') {
          console.log(`表不存在，跳过插入诗词"${poem.title}"`)
        } else {
          console.error(`插入诗词"${poem.title}"失败:`, insertError)
        }
      } else {
        console.log(`✓ 插入诗词: ${poem.title}`)
      }
    }
    
    // 插入作者数据
    console.log('插入作者数据...')
    const sampleAuthors = [
      {
        name: '李白',
        dynasty: '唐',
        intro: '李白（701年－762年），字太白，号青莲居士，唐代伟大的浪漫主义诗人，被后人誉为"诗仙"。',
        poems_count: 987
      },
      {
        name: '孟浩然',
        dynasty: '唐',
        intro: '孟浩然（689年－740年），唐代著名的山水田园派诗人，与王维并称"王孟"。',
        poems_count: 321
      },
      {
        name: '王之涣',
        dynasty: '唐',
        intro: '王之涣（688年－742年），盛唐时期的著名诗人，以描写边塞风光著称。',
        poems_count: 6
      }
    ]
    
    for (const author of sampleAuthors) {
      const { error: insertError } = await supabase
        .from('authors')
        .insert(author)
      
      if (insertError) {
        if (insertError.code === 'PGRST301') {
          console.log(`表不存在，跳过插入作者"${author.name}"`)
        } else {
          console.error(`插入作者"${author.name}"失败:`, insertError)
        }
      } else {
        console.log(`✓ 插入作者: ${author.name}`)
      }
    }
    
    console.log('数据库初始化完成！')
    console.log('注意：如果表不存在，请先在Supabase控制台中手动创建表结构。')
    
  } catch (error) {
    console.error('数据库初始化失败:', error)
  }
}

initDatabase()