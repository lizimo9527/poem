// 模拟webhook服务器用于测试 (CommonJS版本)
const http = require('http')

const server = http.createServer((req, res) => {
  console.log(`收到请求: ${req.method} ${req.url}`)

  // 设置CORS头
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') {
    res.writeHead(200)
    res.end()
    return
  }

  if (req.method === 'POST' && req.url === '/webhook-test/mock') {
    let body = ''
    req.on('data', (chunk) => {
      body += chunk.toString()
    })

    req.on('end', () => {
      try {
        const data = JSON.parse(body)
        console.log('收到的消息:', data.message)

        // 模拟AI响应
        const responses = {
          你好: '您好！我是模拟AI助手，可以帮您解答问题。',
          介绍: '我是模拟的诗词AI助手，可以帮您分析古诗词。',
          李白: '李白是唐代著名诗人，被誉为"诗仙"。',
          测试: '测试成功！webhook模拟服务器正常工作。',
        }

        const responseText =
          responses[data.message] || `收到您的消息: "${data.message}"。这是模拟AI助手的响应。`

        const response = {
          success: true,
          response: responseText,
          timestamp: new Date().toISOString(),
        }

        res.writeHead(200, { 'Content-Type': 'application/json' })
        res.end(JSON.stringify(response))
        console.log('发送响应:', response)
      } catch (error) {
        res.writeHead(400, { 'Content-Type': 'application/json' })
        res.end(JSON.stringify({ error: '无效的JSON数据' }))
      }
    })
  } else {
    res.writeHead(404, { 'Content-Type': 'application/json' })
    res.end(JSON.stringify({ error: '端点未找到' }))
  }
})

const PORT = 5679
server.listen(PORT, () => {
  console.log(`模拟webhook服务器运行在 http://localhost:${PORT}`)
  console.log('可用端点: POST /webhook-test/mock')
})
