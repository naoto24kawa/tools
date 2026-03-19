import { describe, expect, it } from 'vitest';
import { decrypt, encrypt } from '../textEncryption';

describe('encrypt and decrypt', () => {
  it('encrypts and decrypts text correctly', async () => {
    const text = 'Hello, World!';
    const passphrase = 'my-secret-passphrase';

    const encrypted = await encrypt(text, passphrase);
    expect(encrypted).toBeTruthy();
    expect(encrypted).not.toBe(text);

    const decrypted = await decrypt(encrypted, passphrase);
    expect(decrypted).toBe(text);
  });

  it('encrypts and decrypts Japanese text', async () => {
    const text = 'こんにちは世界';
    const passphrase = 'パスワード123';

    const encrypted = await encrypt(text, passphrase);
    const decrypted = await decrypt(encrypted, passphrase);
    expect(decrypted).toBe(text);
  });

  it('produces different ciphertexts for same input (random salt/iv)', async () => {
    const text = 'Same text';
    const passphrase = 'same-pass';

    const encrypted1 = await encrypt(text, passphrase);
    const encrypted2 = await encrypt(text, passphrase);
    expect(encrypted1).not.toBe(encrypted2);
  });

  it('fails to decrypt with wrong passphrase', async () => {
    const text = 'Secret message';
    const encrypted = await encrypt(text, 'correct-pass');

    await expect(decrypt(encrypted, 'wrong-pass')).rejects.toThrow();
  });

  it('throws on empty text', async () => {
    await expect(encrypt('', 'pass')).rejects.toThrow('Text is required');
  });

  it('throws on empty passphrase', async () => {
    await expect(encrypt('text', '')).rejects.toThrow('Passphrase is required');
  });

  it('handles long text', async () => {
    const text = 'A'.repeat(10000);
    const passphrase = 'long-text-pass';

    const encrypted = await encrypt(text, passphrase);
    const decrypted = await decrypt(encrypted, passphrase);
    expect(decrypted).toBe(text);
  });
});
