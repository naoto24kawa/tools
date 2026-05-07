import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { secureHeaders } from 'hono/secure-headers';

interface Env {
  ASSETS: Fetcher;
}

const app = new Hono<{ Bindings: Env }>();

app.use('*', secureHeaders());

app.use(
  '*',
  cors({
    origin: '*',
    allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    maxAge: 86400,
  })
);

app.get('/health', (c) => {
  return c.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// 静的ファイルを ASSETS バインディング経由で配信（secureHeaders・cors が全レスポンスに適用される）
app.all('*', async (c) => {
  const response = await c.env.ASSETS.fetch(c.req.raw);
  if (response.status === 404) {
    return c.json({ error: 'Not found', message: '指定されたパスは存在しません' }, 404);
  }
  return response;
});

app.onError((err, c) => {
  console.error('Router error:', err);
  return c.json({ error: 'Internal server error', message: 'サーバーエラーが発生しました' }, 500);
});

export default app;
