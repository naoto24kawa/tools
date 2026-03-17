import { describe, expect, test } from 'bun:test';
import { generateHMAC } from '../hmac';

describe('generateHMAC', () => {
  test('SHA-256 produces 64 char hex', async () => {
    const result = await generateHMAC('hello', 'secret', 'SHA-256');
    expect(result).toMatch(/^[0-9a-f]{64}$/);
  });

  test('SHA-512 produces 128 char hex', async () => {
    const result = await generateHMAC('hello', 'secret', 'SHA-512');
    expect(result).toMatch(/^[0-9a-f]{128}$/);
  });

  test('consistent output', async () => {
    const r1 = await generateHMAC('msg', 'key', 'SHA-256');
    const r2 = await generateHMAC('msg', 'key', 'SHA-256');
    expect(r1).toBe(r2);
  });

  test('different key different output', async () => {
    const r1 = await generateHMAC('msg', 'key1', 'SHA-256');
    const r2 = await generateHMAC('msg', 'key2', 'SHA-256');
    expect(r1).not.toBe(r2);
  });

  test('different message different output', async () => {
    const r1 = await generateHMAC('msg1', 'key', 'SHA-256');
    const r2 = await generateHMAC('msg2', 'key', 'SHA-256');
    expect(r1).not.toBe(r2);
  });
});
