import { describe, expect, test } from 'vitest';
import { aesDecrypt, aesEncrypt } from '../aes';

describe('aes', () => {
  test('roundtrip encrypt/decrypt', async () => {
    const plaintext = 'Hello, World!';
    const password = 'secret123';
    const encrypted = await aesEncrypt(plaintext, password);
    const decrypted = await aesDecrypt(encrypted, password);
    expect(decrypted).toBe(plaintext);
  });

  test('encrypted output is valid base64', async () => {
    const encrypted = await aesEncrypt('test', 'pass');
    expect(() => atob(encrypted)).not.toThrow();
  });

  test('different encryptions produce different output', async () => {
    const e1 = await aesEncrypt('test', 'pass');
    const e2 = await aesEncrypt('test', 'pass');
    expect(e1).not.toBe(e2);
  });

  test('wrong password fails', async () => {
    const encrypted = await aesEncrypt('test', 'correct');
    await expect(aesDecrypt(encrypted, 'wrong')).rejects.toThrow();
  });

  test('empty plaintext roundtrip', async () => {
    const encrypted = await aesEncrypt('', 'pass');
    const decrypted = await aesDecrypt(encrypted, 'pass');
    expect(decrypted).toBe('');
  });

  test('multibyte characters roundtrip', async () => {
    const plaintext = '日本語テスト🔐';
    const encrypted = await aesEncrypt(plaintext, 'pass');
    const decrypted = await aesDecrypt(encrypted, 'pass');
    expect(decrypted).toBe(plaintext);
  });
});
