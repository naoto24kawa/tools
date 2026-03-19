import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { secureHeaders } from 'hono/secure-headers';
import { APPS_CONFIG, AVAILABLE_PATHS } from './config/apps';

type Bindings = Record<string, never>;

const app = new Hono<{ Bindings: Bindings }>();

app.use('*', secureHeaders());

app.use(
  '*',
  cors({
    origin: '*',
    allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    maxAge: 86400,
  })
);

// Health check
app.get('/health', (c) => {
  return c.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API: tool list
app.get('/api/tools', (c) => {
  return c.json({
    tools: APPS_CONFIG.map((app) => ({
      path: app.path,
      icon: app.icon,
      displayName: app.displayName,
      description: app.description,
      category: app.category,
    })),
    total: APPS_CONFIG.length,
  });
});

// 404 handler (unmatched requests that aren't static assets)
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
