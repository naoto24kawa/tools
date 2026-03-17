import { describe, expect, test } from 'vitest';
import { generateHtpasswd } from '../htpasswd';

describe('htpasswd', () => {
  test('generates bcrypt format', async () => {
    const result = await generateHtpasswd('admin', 'pass', 'bcrypt');
    expect(result).toMatch(/^admin:\$2[aby]?\$/);
  });
  test('generates SHA1 format', async () => {
    const result = await generateHtpasswd('admin', 'pass', 'sha1');
    expect(result).toMatch(/^admin:\{SHA\}/);
  });
  test('generates plain format', async () => {
    const result = await generateHtpasswd('admin', 'pass', 'plain');
    expect(result).toBe('admin:pass');
  });
  test('generates MD5 (SHA-256) format', async () => {
    const result = await generateHtpasswd('admin', 'pass', 'md5');
    expect(result).toMatch(/^admin:\{SHA256\}[0-9a-f]+$/);
  });
});
