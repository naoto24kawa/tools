import { describe, test, expect } from 'vitest';
import { generateHtaccess, defaultConfig, type HtaccessConfig } from '../htaccessGenerator';

describe('generateHtaccess', () => {
  test('should return comment when no rules configured', () => {
    const result = generateHtaccess({ ...defaultConfig });
    expect(result).toContain('No rules configured');
  });

  test('should generate HTTPS force redirect', () => {
    const config: HtaccessConfig = { ...defaultConfig, enableHttpsForce: true };
    const result = generateHtaccess(config);
    expect(result).toContain('Force HTTPS');
    expect(result).toContain('RewriteEngine On');
    expect(result).toContain('RewriteCond %{HTTPS} off');
    expect(result).toContain('R=301');
  });

  test('should generate www redirect (add www)', () => {
    const config: HtaccessConfig = {
      ...defaultConfig,
      enableWwwRedirect: true,
      wwwRedirectType: 'add-www',
    };
    const result = generateHtaccess(config);
    expect(result).toContain('Redirect to www');
    expect(result).toContain('!^www');
  });

  test('should generate www redirect (remove www)', () => {
    const config: HtaccessConfig = {
      ...defaultConfig,
      enableWwwRedirect: true,
      wwwRedirectType: 'remove-www',
    };
    const result = generateHtaccess(config);
    expect(result).toContain('Redirect to non-www');
    expect(result).toContain('^www');
  });

  test('should generate 301/302 redirects', () => {
    const config: HtaccessConfig = {
      ...defaultConfig,
      redirects: [
        { type: '301', from: '/old', to: '/new' },
        { type: '302', from: '/temp', to: '/other' },
      ],
    };
    const result = generateHtaccess(config);
    expect(result).toContain('Redirect 301 /old /new');
    expect(result).toContain('Redirect 302 /temp /other');
  });

  test('should skip empty redirect rules', () => {
    const config: HtaccessConfig = {
      ...defaultConfig,
      redirects: [{ type: '301', from: '', to: '' }],
    };
    const result = generateHtaccess(config);
    expect(result).not.toContain('Redirect 301');
  });

  test('should generate CORS headers', () => {
    const config: HtaccessConfig = {
      ...defaultConfig,
      enableCors: true,
      corsOrigin: 'https://example.com',
    };
    const result = generateHtaccess(config);
    expect(result).toContain('CORS Headers');
    expect(result).toContain('Access-Control-Allow-Origin');
    expect(result).toContain('https://example.com');
  });

  test('should generate cache control', () => {
    const config: HtaccessConfig = {
      ...defaultConfig,
      enableCacheControl: true,
      cacheDuration: '3600',
    };
    const result = generateHtaccess(config);
    expect(result).toContain('Cache Control');
    expect(result).toContain('ExpiresActive On');
    expect(result).toContain('3600 seconds');
  });

  test('should generate gzip compression', () => {
    const config: HtaccessConfig = { ...defaultConfig, enableGzip: true };
    const result = generateHtaccess(config);
    expect(result).toContain('Gzip Compression');
    expect(result).toContain('AddOutputFilterByType DEFLATE');
  });

  test('should generate custom error pages', () => {
    const config: HtaccessConfig = {
      ...defaultConfig,
      errorPages: [
        { code: '404', path: '/404.html' },
        { code: '500', path: '/500.html' },
      ],
    };
    const result = generateHtaccess(config);
    expect(result).toContain('ErrorDocument 404 /404.html');
    expect(result).toContain('ErrorDocument 500 /500.html');
  });

  test('should generate IP blocking', () => {
    const config: HtaccessConfig = {
      ...defaultConfig,
      blockedIps: ['192.168.1.1', '10.0.0.1'],
    };
    const result = generateHtaccess(config);
    expect(result).toContain('IP Blocking');
    expect(result).toContain('Require not ip 192.168.1.1');
    expect(result).toContain('Require not ip 10.0.0.1');
  });

  test('should skip empty blocked IPs', () => {
    const config: HtaccessConfig = {
      ...defaultConfig,
      blockedIps: ['', '  '],
    };
    const result = generateHtaccess(config);
    expect(result).not.toContain('Require not ip');
  });

  test('should combine multiple sections', () => {
    const config: HtaccessConfig = {
      ...defaultConfig,
      enableHttpsForce: true,
      enableGzip: true,
      enableCors: true,
    };
    const result = generateHtaccess(config);
    expect(result).toContain('Force HTTPS');
    expect(result).toContain('CORS Headers');
    expect(result).toContain('Gzip Compression');
  });
});
