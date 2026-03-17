import { describe, test, expect } from 'vitest';
import { APPS_CONFIG, SYSTEM_PATHS, AVAILABLE_PATHS } from '../config/apps';

describe('Router - Apps Configuration', () => {
  describe('APPS_CONFIG', () => {
    test('should have valid structure', () => {
      expect(APPS_CONFIG).toBeInstanceOf(Array);
      expect(APPS_CONFIG.length).toBeGreaterThan(0);
    });

    test('each app should have required fields', () => {
      APPS_CONFIG.forEach((app) => {
        expect(app).toHaveProperty('path');
        expect(app).toHaveProperty('url');
        expect(app).toHaveProperty('name');
        expect(app).toHaveProperty('icon');
        expect(app).toHaveProperty('displayName');
        expect(app).toHaveProperty('description');
      });
    });

    test('paths should start with /', () => {
      APPS_CONFIG.forEach((app) => {
        expect(app.path).toMatch(/^\//);
      });
    });

    test('URLs should be valid HTTPS URLs', () => {
      APPS_CONFIG.forEach((app) => {
        expect(app.url).toMatch(/^https:\/\//);
        expect(() => new URL(app.url)).not.toThrow();
      });
    });

    test('should not have duplicate paths', () => {
      const paths = APPS_CONFIG.map((app) => app.path);
      const uniquePaths = new Set(paths);
      expect(paths.length).toBe(uniquePaths.size);
    });
  });

  describe('SYSTEM_PATHS', () => {
    test('should include root and health paths', () => {
      expect(SYSTEM_PATHS).toContain('/');
      expect(SYSTEM_PATHS).toContain('/health');
    });
  });

  describe('AVAILABLE_PATHS', () => {
    test('should include system paths and app paths', () => {
      expect(AVAILABLE_PATHS).toContain('/');
      expect(AVAILABLE_PATHS).toContain('/health');
      
      APPS_CONFIG.forEach((app) => {
        expect(AVAILABLE_PATHS).toContain(app.path);
      });
    });

    test('should not have duplicates', () => {
      const uniquePaths = new Set(AVAILABLE_PATHS);
      expect(AVAILABLE_PATHS.length).toBe(uniquePaths.size);
    });
  });
});
