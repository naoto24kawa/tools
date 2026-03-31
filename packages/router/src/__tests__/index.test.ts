import { describe, test, expect } from 'vitest';
import app from '../index';

describe('Router - Main Application', () => {
  describe('GET /health', () => {
    test('should return health status', async () => {
      const res = await app.request('/health');
      expect(res.status).toBe(200);

      const json = await res.json();
      expect(json).toHaveProperty('status', 'ok');
      expect(json).toHaveProperty('timestamp');
    });
  });

  describe('GET /', () => {
    test('should proxy to home app (returns 503 in test env since external URL is not reachable)', async () => {
      const res = await app.request('/');
      // In test environment, proxy will fail since external URL is not reachable
      expect(res.status).toBe(503);
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
      const res = await app.request('/health', {
        method: 'OPTIONS',
      });

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
