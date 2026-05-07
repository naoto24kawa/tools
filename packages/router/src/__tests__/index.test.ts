import { describe, test, expect } from 'vitest';
import app from '../index';

const mockAssets = {
  fetch: async (request: Request) => {
    const url = new URL(request.url);
    if (url.pathname === '/text-counter/' || url.pathname === '/text-counter') {
      return new Response('<html><body>text-counter</body></html>', {
        status: 200,
        headers: { 'content-type': 'text/html' },
      });
    }
    return new Response('Not found', { status: 404 });
  },
};

describe('Router - Main Application', () => {
  describe('GET /health', () => {
    test('should return health status', async () => {
      const res = await app.request('/health', {}, { ASSETS: mockAssets });
      expect(res.status).toBe(200);

      const json = await res.json();
      expect(json).toHaveProperty('status', 'ok');
      expect(json).toHaveProperty('timestamp');
    });
  });

  describe('Static Assets', () => {
    test('should serve static files via ASSETS binding', async () => {
      const res = await app.request('/text-counter/', {}, { ASSETS: mockAssets });
      expect(res.status).toBe(200);
    });

    test('should return 404 for unknown paths', async () => {
      const res = await app.request('/unknown-path', {}, { ASSETS: mockAssets });
      expect(res.status).toBe(404);

      const json = await res.json();
      expect(json).toHaveProperty('error', 'Not found');
    });
  });

  describe('CORS Headers', () => {
    test('should include CORS headers on OPTIONS preflight', async () => {
      const res = await app.request('/health', { method: 'OPTIONS' }, { ASSETS: mockAssets });
      expect(res.headers.get('access-control-allow-origin')).toBe('*');
      expect(res.headers.get('access-control-allow-methods')).toContain('GET');
    });

    test('should include CORS headers on GET', async () => {
      const res = await app.request('/health', {}, { ASSETS: mockAssets });
      expect(res.headers.get('access-control-allow-origin')).toBe('*');
    });
  });

  describe('Security Headers', () => {
    test('should include x-content-type-options: nosniff', async () => {
      const res = await app.request('/health', {}, { ASSETS: mockAssets });
      expect(res.headers.get('x-content-type-options')).toBe('nosniff');
    });

    test('should include x-frame-options', async () => {
      const res = await app.request('/health', {}, { ASSETS: mockAssets });
      const xfo = res.headers.get('x-frame-options');
      expect(['DENY', 'SAMEORIGIN']).toContain(xfo);
    });

    test('should apply security headers to static file responses', async () => {
      const res = await app.request('/text-counter/', {}, { ASSETS: mockAssets });
      expect(res.headers.get('x-content-type-options')).toBe('nosniff');
    });
  });
});
