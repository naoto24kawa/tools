import type { Context } from 'hono';

/**
 * プロキシ設定の型定義
 */
export interface ProxyConfig {
  basePath: string;
  targetUrl: string;
  serviceName: string;
}

/**
 * 共通プロキシハンドラーを生成
 *
 * @param config プロキシ設定
 * @returns プロキシハンドラー関数
 *
 * @example
 * ```typescript
 * app.all('/image-crop/*', createProxyHandler({
 *   basePath: '/image-crop',
 *   targetUrl: 'https://image-crop-3ch.pages.dev',
 *   serviceName: '画像のトリミング'
 * }));
 * ```
 */
export function createProxyHandler(config: ProxyConfig) {
  return async (c: Context) => {
    try {
      // パス処理: /image-crop/foo → /foo
      const path = c.req.path.replace(config.basePath, '') || '/';
      const targetUrl = new URL(path, config.targetUrl);

      // ヘッダー設定
      const headers = new Headers(c.req.raw.headers);
      headers.set('X-Forwarded-Host', c.req.header('host') || '');
      headers.set('X-Forwarded-Proto', 'https');

      // プロキシリクエスト
      const response = await fetch(targetUrl.toString(), {
        method: c.req.method,
        headers,
        body: c.req.raw.body,
      });

      // HTMLの場合はアセットパスを書き換え
      const contentType = response.headers.get('content-type') || '';
      if (contentType.includes('text/html')) {
        const html = await response.text();
        const modifiedHtml = html.replace(
          /(src|href)="\/assets\//g,
          `$1="${config.basePath}/assets/`
        );
        return c.html(modifiedHtml);
      }

      // HTML以外はそのまま返す
      return new Response(response.body, response);
    } catch (error) {
      console.error(`Error proxying to ${config.serviceName}:`, error);
      return c.json(
        {
          error: 'Service unavailable',
          message: `${config.serviceName}への接続に失敗しました`,
        },
        503
      );
    }
  };
}
