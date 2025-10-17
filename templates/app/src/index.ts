import { Hono } from 'hono'

// 必要に応じてバインディングの型を定義
// type Bindings = {
//   STORAGE: R2Bucket
//   METADATA: KVNamespace
// }

const app = new Hono()

// ミドルウェア: リクエストのロギングとメトリクス収集
app.use('*', async (c, next) => {
  const start = Date.now()
  await next()
  const duration = Date.now() - start

  // メトリクスをログに出力
  console.log({
    timestamp: new Date().toISOString(),
    path: c.req.path,
    method: c.req.method,
    status: c.res.status,
    duration: `${duration}ms`,
  })
})

// ルートエンドポイント
app.get('/', (c) => {
  return c.json({
    name: '{{APP_DESCRIPTION}}',
    version: '1.0.0',
    description: '{{APP_DESCRIPTION}}',
    endpoints: {
      health: '/health',
      // 他のエンドポイントをここに追加
    }
  })
})

// ヘルスチェックエンドポイント
app.get('/health', (c) => {
  return c.json({
    status: 'ok',
    service: '{{APP_NAME}}',
    timestamp: new Date().toISOString()
  })
})

// TODO: アプリケーション固有のエンドポイントを実装
// 例:
// app.post('/process', async (c) => {
//   try {
//     // 処理ロジックをここに実装
//     return c.json({ message: 'Success' })
//   } catch (error) {
//     console.error('Error:', error)
//     return c.json({ error: 'Internal server error' }, 500)
//   }
// })

// 404エラーハンドラー
app.notFound((c) => {
  return c.json({
    error: 'Not found',
    message: '指定されたエンドポイントは存在しません'
  }, 404)
})

// エラーハンドラー
app.onError((err, c) => {
  console.error('Application error:', err)
  return c.json({
    error: 'Internal server error',
    message: 'サーバーエラーが発生しました'
  }, 500)
})

export default app
