import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { secureHeaders } from 'hono/secure-headers';
import { APPS_CONFIG, AVAILABLE_PATHS } from './config/apps';
import { createProxyHandler } from './utils/proxy';

// 環境変数の型定義（将来の拡張用）
type Bindings = Record<string, never>;

const app = new Hono<{ Bindings: Bindings }>();

// ミドルウェアの適用
app.use('*', secureHeaders()); // セキュリティヘッダーの追加

// CORS設定
app.use(
  '*',
  cors({
    origin: '*', // 本番環境では具体的なオリジンを指定することを推奨
    allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    maxAge: 86400,
  })
);

// ルートエンドポイント - homeアプリへプロキシ
const HOME_URL = 'https://tools-home.elchika.app';
app.all('/', createProxyHandler({ basePath: '', targetUrl: HOME_URL, serviceName: 'Home' }));
app.all('/assets/*', createProxyHandler({ basePath: '', targetUrl: HOME_URL, serviceName: 'Home' }));

// ヘルスチェックエンドポイント
app.get('/health', (c) => {
  return c.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// 各アプリケーションへのプロキシを自動登録
APPS_CONFIG.forEach((appConfig) => {
  app.all(
    `${appConfig.path}/*`,
    createProxyHandler({
      basePath: appConfig.path,
      targetUrl: appConfig.url,
      serviceName: appConfig.displayName,
    })
  );
});





// 404エラーハンドラー
app.notFound((c) => {
  return c.json(
    {
      error: 'Not found',
      message: '指定されたパスは存在しません',
      availablePaths: AVAILABLE_PATHS,
    },
    404
  );
});

// エラーハンドラー
app.onError((err, c) => {
  console.error('Router error:', err);
  return c.json(
    {
      error: 'Internal server error',
      message: 'サーバーエラーが発生しました',
    },
    500
  );
});

export default app;
