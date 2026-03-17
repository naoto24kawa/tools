import { describe, expect, test } from 'bun:test';
import { generateHtpasswd, validateUsername } from '../htpasswd';

describe('generateHtpasswd', () => {
  test('sha1 format', async () => {
    const result = await generateHtpasswd('admin', 'password', 'sha1');
    expect(result).toMatch(/^admin:\{SHA\}.+$/);
  });

  test('plain format', async () => {
    const result = await generateHtpasswd('admin', 'password', 'plain');
    expect(result).toBe('admin:password');
  });

  test('empty username returns empty', async () => {
    expect(await generateHtpasswd('', 'pass', 'sha1')).toBe('');
  });

  test('empty password returns empty', async () => {
    expect(await generateHtpasswd('user', '', 'sha1')).toBe('');
  });

  test('sha1 produces consistent hash', async () => {
    const r1 = await generateHtpasswd('test', 'pass', 'sha1');
    const r2 = await generateHtpasswd('test', 'pass', 'sha1');
    expect(r1).toBe(r2);
  });
});

describe('validateUsername', () => {
  test('valid username', () => {
    expect(validateUsername('admin')).toBeNull();
  });
  test('valid with dots/dashes', () => {
    expect(validateUsername('user.name-1')).toBeNull();
  });
  test('empty', () => {
    expect(validateUsername('')).not.toBeNull();
  });
  test('colon rejected', () => {
    expect(validateUsername('user:name')).not.toBeNull();
  });
  test('spaces rejected', () => {
    expect(validateUsername('user name')).not.toBeNull();
  });
});
