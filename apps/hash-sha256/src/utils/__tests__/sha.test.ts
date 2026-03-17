import { describe, expect, test } from 'vitest';
import { generateSHA } from '../sha';

describe('generateSHA', () => {
  test('generates SHA-256 hash', async () => {
    const hash = await generateSHA('hello', 'SHA-256');
    expect(hash).toBe('2cf24dba5fb0a30e26e83b2ac5b9e29e1b161e5c1fa7425e73043362938b9824');
  });

  test('generates SHA-384 hash', async () => {
    const hash = await generateSHA('hello', 'SHA-384');
    expect(hash).toBe(
      '59e1748777448c69de6b800d7a33bbfb9ff1b463e44354c3553bcdb9c666fa90125a3c79f90397bdf5f6a13de828684f'
    );
  });

  test('generates SHA-512 hash', async () => {
    const hash = await generateSHA('hello', 'SHA-512');
    expect(hash).toBe(
      '9b71d224bd62f3785d96d46ad3ea3d73319bfbc2890caadae2dff72519673ca72323c3d99ba5c11d7c7acc6e14b8c5da0c4663475c2e5c3adef46f73bcdec043'
    );
  });

  test('empty string SHA-256', async () => {
    const hash = await generateSHA('', 'SHA-256');
    expect(hash).toBe('e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855');
  });

  test('returns hex string', async () => {
    const hash = await generateSHA('test', 'SHA-256');
    expect(hash).toMatch(/^[0-9a-f]+$/);
  });

  test('same input produces same hash', async () => {
    const hash1 = await generateSHA('hello world', 'SHA-256');
    const hash2 = await generateSHA('hello world', 'SHA-256');
    expect(hash1).toBe(hash2);
  });

  test('different input produces different hash', async () => {
    const hash1 = await generateSHA('hello', 'SHA-256');
    const hash2 = await generateSHA('world', 'SHA-256');
    expect(hash1).not.toBe(hash2);
  });

  test('handles UTF-8 input', async () => {
    const hash = await generateSHA('こんにちは', 'SHA-256');
    expect(hash.length).toBe(64);
  });
});
