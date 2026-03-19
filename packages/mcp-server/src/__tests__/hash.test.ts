import { describe, test, expect } from 'vitest';
import { callTool } from './test-helpers';

describe('hash tools', () => {
  test('hash_md5', async () => {
    const result = await callTool('hash_md5', { text: 'Hello' });
    expect(result.content).toEqual([{ type: 'text', text: '8b1a9953c4611296a827abf8c47804d7' }]);
  });

  test('hash_crc32', async () => {
    const result = await callTool('hash_crc32', { text: 'Hello' });
    const text = (result.content as Array<{ type: string; text: string }>)[0].text;
    expect(text).toMatch(/^[0-9a-f]{8}$/);
  });

  test('hash_sha1', async () => {
    const result = await callTool('hash_sha1', { text: 'Hello' });
    const text = (result.content as Array<{ type: string; text: string }>)[0].text;
    // SHA-1 produces 40 hex chars
    expect(text).toMatch(/^[0-9a-f]{40}$/);
  });

  test('hash_sha SHA-256', async () => {
    const result = await callTool('hash_sha', { text: 'Hello', algorithm: 'SHA-256' });
    const text = (result.content as Array<{ type: string; text: string }>)[0].text;
    // SHA-256 produces 64 hex chars
    expect(text).toMatch(/^[0-9a-f]{64}$/);
  });

  test('hash_sha SHA-384', async () => {
    const result = await callTool('hash_sha', { text: 'Hello', algorithm: 'SHA-384' });
    const text = (result.content as Array<{ type: string; text: string }>)[0].text;
    // SHA-384 produces 96 hex chars
    expect(text).toMatch(/^[0-9a-f]{96}$/);
  });

  test('hash_sha SHA-512', async () => {
    const result = await callTool('hash_sha', { text: 'Hello', algorithm: 'SHA-512' });
    const text = (result.content as Array<{ type: string; text: string }>)[0].text;
    // SHA-512 produces 128 hex chars
    expect(text).toMatch(/^[0-9a-f]{128}$/);
  });

  test('hash_hmac SHA-256', async () => {
    const result = await callTool('hash_hmac', {
      message: 'Hello',
      secret: 'secret',
      algorithm: 'SHA-256',
    });
    const text = (result.content as Array<{ type: string; text: string }>)[0].text;
    // HMAC-SHA256 produces 64 hex chars
    expect(text).toMatch(/^[0-9a-f]{64}$/);
  });

  test('hash_hmac SHA-1', async () => {
    const result = await callTool('hash_hmac', {
      message: 'Hello',
      secret: 'key',
      algorithm: 'SHA-1',
    });
    const text = (result.content as Array<{ type: string; text: string }>)[0].text;
    // HMAC-SHA1 produces 40 hex chars
    expect(text).toMatch(/^[0-9a-f]{40}$/);
  });
});
