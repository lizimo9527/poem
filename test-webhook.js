// Webhook测试脚本
const testWebhook = async () => {
  const webhookUrl = 'http://localhost:5678/webhook-test/86681566-bb4e-4f95-a966-33ad7ad23a31'

  console.log('正在测试webhook连接...')
  console.log('Webhook URL:', webhookUrl)

  try {
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: '测试webhook连接',
        timestamp: new Date().toISOString(),
      }),
    })

    if (response.ok) {
      const data = await response.json()
      console.log('✅ Webhook调用成功!')
      console.log('响应数据:', data)
    } else {
      console.log('❌ Webhook调用失败:', response.status, response.statusText)
      const errorText = await response.text()
      console.log('错误详情:', errorText)
    }
  } catch (error) {
    console.log('❌ 网络错误:', error.message)
    console.log('可能的原因:')
    console.log('1. n8n服务未启动')
    console.log('2. webhook URL不正确')
    console.log('3. 网络连接问题')
  }
}

// 测试备用webhook端点
const testAlternativeEndpoints = async () => {
  const endpoints = [
    'http://localhost:5678/webhook/86681566-bb4e-4f95-a966-33ad7ad23a31',
    'http://localhost:5678/webhook',
    'http://localhost:5678/api/webhook',
  ]

  for (const endpoint of endpoints) {
    console.log(`\n测试端点: ${endpoint}`)
    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ test: true }),
      })
      console.log(`状态: ${response.status}`)
    } catch (error) {
      console.log(`错误: ${error.message}`)
    }
  }
}

// 执行测试
testWebhook().then(() => {
  console.log('\n--- 测试完成 ---')
})
