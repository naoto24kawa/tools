import { describe, expect, test } from 'vitest';
import { aesDecrypt, aesEncrypt, desDecrypt, desEncrypt } from '../des';

describe('des', () => {
  test('roundtrip encrypt/decrypt', () => {
    const plaintext = 'Hello, World!';
    const key = 'secret123';
    const encrypted = desEncrypt(plaintext, key);
    const decrypted = desDecrypt(encrypted, key);
    expect(decrypted).toBe(plaintext);
  });

  test('encrypted output is not plaintext', () => {
    const encrypted = desEncrypt('test', 'key');
    expect(encrypted).not.toBe('test');
    expect(encrypted.length).toBeGreaterThan(0);
  });

  test('wrong key fails', () => {
    const encrypted = desEncrypt('secret data', 'correct-key');
    expect(() => desDecrypt(encrypted, 'wrong-key')).toThrow();
  });
});

describe('AES-256-GCM', () => {
  test('encrypt and decrypt roundtrip', async () => {
    const plaintext = 'Hello, World!';
    const key = 'my-secret-key-123';
    const encrypted = await aesEncrypt(plaintext, key);
    const decrypted = await aesDecrypt(encrypted, key);
    expect(decrypted).toBe(plaintext);
  });

  test('wrong key fails to decrypt', async () => {
    const encrypted = await aesEncrypt('secret', 'key1');
    await expect(aesDecrypt(encrypted, 'key2')).rejects.toThrow();
  });

  test('empty string roundtrip', async () => {
    const encrypted = await aesEncrypt('', 'key');
    const decrypted = await aesDecrypt(encrypted, 'key');
    expect(decrypted).toBe('');
  });
});
