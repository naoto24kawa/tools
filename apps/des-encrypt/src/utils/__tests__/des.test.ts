import { describe, expect, test } from 'vitest';
import { desDecrypt, desEncrypt } from '../des';

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
