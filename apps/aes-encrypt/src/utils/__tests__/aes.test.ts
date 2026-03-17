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

  test('encrypted output is base64', async () => {
    const encrypted = await aesEncrypt('test', 'pass');
    expect(encrypted).toMatch(/^[A-Za-z0-9+/]+=*$/);
  });

  test('different encryptions produce different output', async () => {
    const e1 = await aesEncrypt('test', 'pass');
    const e2 = await aesEncrypt('test', 'pass');
    expect(e1).not.toBe(e2); // random salt/iv
  });

  test('wrong password fails', async () => {
    const encrypted = await aesEncrypt('test', 'correct');
    await expect(aesDecrypt(encrypted, 'wrong')).rejects.toThrow();
  });
});
