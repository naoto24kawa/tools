import { describe, expect, test, beforeEach, afterEach, vi } from 'vitest';
import { createProxyHandler } from '../proxy';
import type { Context } from 'hono';

describe('createProxyHandler', () => {
  const originalFetch = global.fetch;
  const mockFetch = vi.fn();

  beforeEach(() => {
    global.fetch = mockFetch;
  });

  afterEach(() => {
    global.fetch = originalFetch;
    mockFetch.mockReset();
  });

  const config = {
    basePath: '/app',
    targetUrl: 'https://app.example.com',
    serviceName: 'Test App',
  };

  const createMockContext = (path: string, method: string = 'GET', headers: Record<string, string> = {}) => {
    return {
      req: {
        path,
        method,
        header: (name: string) => headers[name.toLowerCase()],
        raw: {
          headers: new Headers(headers),
          body: null,
        },
      },
      html: vi.fn((html) => html),
      json: vi.fn((data, status) => ({ data, status })),
    } as unknown as Context;
  };

  test('should proxy request to target url', async () => {
    mockFetch.mockResolvedValue(new Response('ok', { status: 200 }));
    const handler = createProxyHandler(config);
    const c = createMockContext('/app/foo');

    await handler(c);

    expect(mockFetch).toHaveBeenCalledTimes(1);
    const url = mockFetch.mock.calls[0][0];
    expect(url).toBe('https://app.example.com/foo');
  });

  test('should rewrite html assets', async () => {
    const html = '<html><head><link href="/assets/style.css"></head><body><img src="/assets/img.png"></body></html>';
    mockFetch.mockResolvedValue(new Response(html, { 
      headers: { 'content-type': 'text/html' } 
    }));
    const handler = createProxyHandler(config);
    const c = createMockContext('/app/');

    const result = await handler(c);

    expect(c.html).toHaveBeenCalled();
    expect(result).toContain('href="/app/assets/style.css"');
    expect(result).toContain('src="/app/assets/img.png"');
  });

  test('should handle fetch error', async () => {
    mockFetch.mockRejectedValue(new Error('Network error'));
    const handler = createProxyHandler(config);
    const c = createMockContext('/app/');

    const result = await handler(c);

    expect(c.json).toHaveBeenCalledWith(
      expect.objectContaining({ error: 'Service unavailable' }),
      503
    );
  });
});
