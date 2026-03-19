import { describe, it, expect } from 'vitest';
import { generateNginxConfig, defaultConfig } from '../nginxGenerator';

describe('generateNginxConfig', () => {
  it('generates reverse proxy config', () => {
    const config = { ...defaultConfig, preset: 'reverse-proxy' as const };
    const result = generateNginxConfig(config);
    expect(result).toContain('proxy_pass http://localhost:3000');
    expect(result).toContain('proxy_set_header Host $host');
    expect(result).toContain('server_name example.com');
  });

  it('generates static file config', () => {
    const config = { ...defaultConfig, preset: 'static' as const };
    const result = generateNginxConfig(config);
    expect(result).toContain('root /var/www/html');
    expect(result).toContain('try_files $uri $uri/ =404');
    expect(result).toContain('index index.html index.htm');
  });

  it('generates SPA config', () => {
    const config = { ...defaultConfig, preset: 'spa' as const };
    const result = generateNginxConfig(config);
    expect(result).toContain('try_files $uri $uri/ /index.html');
    expect(result).toContain('root /usr/share/nginx/html');
  });

  it('includes SSL config when enabled', () => {
    const config = { ...defaultConfig, enableSsl: true, listenPort: 443 };
    const result = generateNginxConfig(config);
    expect(result).toContain('listen 443 ssl');
    expect(result).toContain('ssl_certificate');
    expect(result).toContain('ssl_protocols TLSv1.2 TLSv1.3');
  });

  it('includes gzip config when enabled', () => {
    const config = { ...defaultConfig, enableGzip: true };
    const result = generateNginxConfig(config);
    expect(result).toContain('gzip on');
    expect(result).toContain('gzip_types');
  });

  it('excludes gzip when disabled', () => {
    const config = { ...defaultConfig, enableGzip: false };
    const result = generateNginxConfig(config);
    expect(result).not.toContain('gzip on');
  });

  it('includes CORS headers when enabled', () => {
    const config = { ...defaultConfig, enableCors: true, corsOrigin: 'https://example.com' };
    const result = generateNginxConfig(config);
    expect(result).toContain('Access-Control-Allow-Origin');
    expect(result).toContain('https://example.com');
  });

  it('includes websocket support', () => {
    const config = { ...defaultConfig, proxyWebsocket: true };
    const result = generateNginxConfig(config);
    expect(result).toContain('proxy_http_version 1.1');
    expect(result).toContain('Upgrade $http_upgrade');
  });

  it('includes custom headers', () => {
    const config = {
      ...defaultConfig,
      customHeaders: [{ name: 'X-Custom', value: 'test' }],
    };
    const result = generateNginxConfig(config);
    expect(result).toContain('add_header X-Custom "test"');
  });

  it('includes client_max_body_size', () => {
    const config = { ...defaultConfig, clientMaxBodySize: '50m' };
    const result = generateNginxConfig(config);
    expect(result).toContain('client_max_body_size 50m');
  });
});
