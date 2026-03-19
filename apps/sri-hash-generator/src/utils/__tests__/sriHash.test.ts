import { describe, expect, test } from 'vitest';
import {
  generateSriHashFromText,
  generateScriptTag,
  generateLinkTag,
} from '../sriHash';

describe('generateSriHashFromText', () => {
  test('generates sha256 hash', async () => {
    const hash = await generateSriHashFromText('hello', 'sha256');
    expect(hash).toMatch(/^sha256-[A-Za-z0-9+/]+=*$/);
  });

  test('generates sha384 hash', async () => {
    const hash = await generateSriHashFromText('hello', 'sha384');
    expect(hash).toMatch(/^sha384-[A-Za-z0-9+/]+=*$/);
  });

  test('generates sha512 hash', async () => {
    const hash = await generateSriHashFromText('hello', 'sha512');
    expect(hash).toMatch(/^sha512-[A-Za-z0-9+/]+=*$/);
  });

  test('same input produces same hash', async () => {
    const hash1 = await generateSriHashFromText('test content', 'sha256');
    const hash2 = await generateSriHashFromText('test content', 'sha256');
    expect(hash1).toBe(hash2);
  });

  test('different input produces different hash', async () => {
    const hash1 = await generateSriHashFromText('hello', 'sha256');
    const hash2 = await generateSriHashFromText('world', 'sha256');
    expect(hash1).not.toBe(hash2);
  });

  test('generates known sha256 hash for empty string', async () => {
    const hash = await generateSriHashFromText('', 'sha256');
    // SHA-256 of empty string is known
    expect(hash).toBe('sha256-47DEQpj8HBSa+/TImW+5JCeuQeRkm5NMpJWZG3hSuFU=');
  });
});

describe('generateScriptTag', () => {
  test('generates valid script tag', () => {
    const tag = generateScriptTag('https://cdn.example.com/lib.js', 'sha256-abc123');
    expect(tag).toBe(
      '<script src="https://cdn.example.com/lib.js" integrity="sha256-abc123" crossorigin="anonymous"></script>'
    );
  });

  test('allows custom crossorigin', () => {
    const tag = generateScriptTag('https://cdn.example.com/lib.js', 'sha256-abc123', 'use-credentials');
    expect(tag).toContain('crossorigin="use-credentials"');
  });
});

describe('generateLinkTag', () => {
  test('generates valid link tag', () => {
    const tag = generateLinkTag('https://cdn.example.com/style.css', 'sha384-xyz789');
    expect(tag).toBe(
      '<link rel="stylesheet" href="https://cdn.example.com/style.css" integrity="sha384-xyz789" crossorigin="anonymous">'
    );
  });
});
