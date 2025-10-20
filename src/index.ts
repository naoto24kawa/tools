import { Hono } from 'hono'
import { secureHeaders } from 'hono/secure-headers'
import { cors } from 'hono/cors'
import { compress } from 'hono/compress'

// 環境変数の型定義
type Bindings = {
  // 他のツールを追加する場合はここに型を追加

  IMAGE_GENERATE: Fetcher // BEGIN APP: image-generate
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

// ルートエンドポイント - 利用可能なツールの一覧を表示
app.get('/', (c) => {
  const html = `<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Tools - elchika</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 20px;
    }
    .container {
      background: white;
      border-radius: 16px;
      padding: 40px;
      max-width: 600px;
      width: 100%;
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
    }
    h1 {
      font-size: 2.5rem;
      color: #333;
      margin-bottom: 10px;
      text-align: center;
    }
    .subtitle {
      color: #666;
      text-align: center;
      margin-bottom: 40px;
      font-size: 1.1rem;
    }
    .tools-list {
      list-style: none;
    }
    .tool-item {
      margin-bottom: 16px;
    }
    .tool-link {
      display: block;
      padding: 20px 24px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      text-decoration: none;
      border-radius: 12px;
      transition: all 0.3s ease;
      box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
    }
    .tool-link:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 20px rgba(102, 126, 234, 0.6);
    }
    .tool-name {
      font-size: 1.3rem;
      font-weight: 600;
      margin-bottom: 6px;
    }
    .tool-description {
      font-size: 0.95rem;
      opacity: 0.9;
    }
    footer {
      margin-top: 40px;
      text-align: center;
      color: #999;
      font-size: 0.9rem;
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>🛠️ Tools</h1>
    <p class="subtitle">便利なツール集</p>

    <ul class="tools-list">
      <!-- BEGIN APP: image-crop -->
      <li class="tool-item">
        <a href="/image-crop/" class="tool-link">
          <div class="tool-name">📸 Image Crop</div>
          <div class="tool-description">画像のトリミング</div>
        </a>
      </li>
      <!-- END APP: image-crop -->
      <!-- BEGIN APP: image-generate -->
      <li class="tool-item">
        <a href="/image-generate/" class="tool-link">
          <div class="tool-name">🎨 Image Generate</div>
          <div class="tool-description">画像ファイルを生成します</div>
        </a>
      </li>
      <!-- END APP: image-generate -->
      <!-- 他のツールを追加する場合はここに追加 -->
    </ul>

    <footer>
      Powered by Cloudflare Workers + Pages
    </footer>
  </div>
</body>
</html>`

  return c.html(html)
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

    // HTMLの場合はアセットパスを書き換え
    const contentType = response.headers.get('content-type') || ''
    if (contentType.includes('text/html')) {
      const html = await response.text()
      // /assets/ を /image-crop/assets/ に書き換え
      const modifiedHtml = html.replace(
        /(src|href)="\/assets\//g,
        '$1="/image-crop/assets/'
      )
      return c.html(modifiedHtml)
    }

    // HTML以外はそのまま返す
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


// 画像ファイルを生成します へのルーティング // BEGIN APP: image-generate
app.all('/image-generate/*', async (c) => {
  try {
    const path = c.req.path.replace('/image-generate', '') || '/'
    const url = new URL(path, 'http://internal')

    const request = new Request(url, {
      method: c.req.method,
      headers: c.req.raw.headers,
      body: c.req.raw.body,
    })

    return await c.env.IMAGE_GENERATE.fetch(request)
  } catch (error) {
    console.error('Error proxying to image-generate:', error)
    return c.json({
      error: 'Service unavailable',
      message: '画像ファイルを生成しますへの接続に失敗しました'
    }, 503)
  }
}) // END APP: image-generate

// 404エラーハンドラー
app.notFound((c) => {
  return c.json({
    error: 'Not found',
    message: '指定されたパスは存在しません',
    availablePaths: ['/', '/health', '/image-crop' // BEGIN APP: image-crop
    , '/image-generate' // BEGIN APP: image-generate]
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
