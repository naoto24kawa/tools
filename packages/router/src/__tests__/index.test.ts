import { describe, test, expect } from 'vitest';
import app from '../index';

describe('Router', () => {
  describe('GET /health', () => {
    test('should return health status', async () => {
      const res = await app.request('/health');
      expect(res.status).toBe(200);

      const json = await res.json();
      expect(json).toHaveProperty('status', 'ok');
      expect(json).toHaveProperty('timestamp');
    });
  });

  describe('GET /api/tools', () => {
    test('should return tool list', async () => {
      const res = await app.request('/api/tools');
      expect(res.status).toBe(200);

      const json = await res.json();
      expect(json).toHaveProperty('tools');
      expect(json).toHaveProperty('total');
      expect(json.tools.length).toBeGreaterThan(0);
      expect(json.tools[0]).toHaveProperty('path');
      expect(json.tools[0]).toHaveProperty('displayName');
      expect(json.tools[0]).toHaveProperty('category');
    });
  });

  describe('404 Not Found', () => {
    test('should return 404 for unknown paths', async () => {
      const res = await app.request('/unknown-path');
      expect(res.status).toBe(404);

      const json = await res.json();
      expect(json).toHaveProperty('error', 'Not found');
      expect(json).toHaveProperty('availablePaths');
    });
  });

  describe('CORS Headers', () => {
    test('should include CORS headers', async () => {
      const res = await app.request('/health', { method: 'OPTIONS' });
      expect(res.headers.get('access-control-allow-origin')).toBe('*');
      expect(res.headers.get('access-control-allow-methods')).toContain('GET');
    });
  });

  describe('Security Headers', () => {
    test('should include security headers', async () => {
      const res = await app.request('/health');
      expect(res.headers.get('x-content-type-options')).toBeTruthy();
      expect(res.headers.get('x-frame-options')).toBeTruthy();
    });
  });
});
