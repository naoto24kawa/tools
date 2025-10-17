import { Hono } from 'hono'
import { secureHeaders } from 'hono/secure-headers'
import { cors } from 'hono/cors'
import { compress } from 'hono/compress'

// 環境変数の型定義
type Bindings = {
  // 他のツールを追加する場合はここに型を追加
}

// Pages デプロイメントのURL
const IMAGE_CROP_URL = 'https://image-crop-3ch.pages.dev' // BEGIN APP: image-crop

const app = new Hono<{ Bindings: Bindings }>()

// ミドルウェアの適用
// app.use('*', compress()) // レスポンスの圧縮 - 一時的に無効化
app.use('*', secureHeaders()) // セキュリティヘッダーの追加

// CORS設定（必要に応じて調整）
app.use('*', cors({
  origin: '*', // 本番環境では具体的なオリジンを指定することを推奨
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  maxAge: 86400,
}))

// ルートエンドポイント - 利用可能なツールの一覧を返す
app.get('/', (c) => {
  return c.json({
    message: 'Tools Router',
    version: '1.0.0',
    availableApps: [
      {
        name: 'image-crop',
        path: '/image-crop',
        description: '画像のトリミング'
      }, // BEGIN APP: image-crop
      // 他のツールを追加する場合はここに追加
    ]
  })
})

// ヘルスチェックエンドポイント
app.get('/health', (c) => {
  return c.json({ status: 'ok', timestamp: new Date().toISOString() })
})

// 画像のトリミング へのプロキシ // BEGIN APP: image-crop
app.all('/image-crop/*', async (c) => {
  try {
    const path = c.req.path.replace('/image-crop', '') || '/'
    const targetUrl = new URL(path, IMAGE_CROP_URL)

    const headers = new Headers(c.req.raw.headers)
    headers.set('X-Forwarded-Host', c.req.header('host') || '')
    headers.set('X-Forwarded-Proto', 'https')

    const response = await fetch(targetUrl.toString(), {
      method: c.req.method,
      headers: headers,
      body: c.req.raw.body,
    })

    // レスポンスヘッダーをコピー（必要に応じて調整）
    const newResponse = new Response(response.body, response)
    return newResponse
  } catch (error) {
    console.error('Error proxying to image-crop:', error)
    return c.json({
      error: 'Service unavailable',
      message: '画像のトリミングへの接続に失敗しました'
    }, 503)
  }
}) // END APP: image-crop

// 404エラーハンドラー
app.notFound((c) => {
  return c.json({
    error: 'Not found',
    message: '指定されたパスは存在しません',
    availablePaths: ['/', '/health', '/image-crop' // BEGIN APP: image-crop
    ]
  }, 404)
})

// エラーハンドラー
app.onError((err, c) => {
  console.error('Router error:', err)
  return c.json({
    error: 'Internal server error',
    message: 'サーバーエラーが発生しました'
  }, 500)
})

export default app
