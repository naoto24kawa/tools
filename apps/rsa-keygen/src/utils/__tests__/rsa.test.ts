import { describe, expect, test } from 'bun:test';
import { generateRsaKeyPair } from '../rsa';

describe('rsa', () => {
  test('generates valid key pair with 1024 bits', async () => {
    const keyPair = await generateRsaKeyPair(1024);
    expect(keyPair.publicKey).toContain('-----BEGIN PUBLIC KEY-----');
    expect(keyPair.publicKey).toContain('-----END PUBLIC KEY-----');
    expect(keyPair.privateKey).toContain('-----BEGIN PRIVATE KEY-----');
    expect(keyPair.privateKey).toContain('-----END PRIVATE KEY-----');
  });

  test('generates different keys each time', async () => {
    const k1 = await generateRsaKeyPair(1024);
    const k2 = await generateRsaKeyPair(1024);
    expect(k1.publicKey).not.toBe(k2.publicKey);
  });

  test('public and private keys are different', async () => {
    const keyPair = await generateRsaKeyPair(1024);
    expect(keyPair.publicKey).not.toBe(keyPair.privateKey);
  });
});
