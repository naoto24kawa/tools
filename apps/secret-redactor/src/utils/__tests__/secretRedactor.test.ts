import { describe, expect, test } from 'vitest';
import { detect, redact } from '../secretRedactor';

describe('detect', () => {
  test('returns empty array for clean text', () => {
    expect(detect('Hello, this is normal text.')).toEqual([]);
  });

  test('detects AWS access key', () => {
    const text = 'My key is AKIAIOSFODNN7EXAMPLE';
    const secrets = detect(text);
    expect(secrets.length).toBe(1);
    expect(secrets[0].type).toBe('AWS Access Key');
    expect(secrets[0].value).toBe('AKIAIOSFODNN7EXAMPLE');
  });

  test('detects GitHub token', () => {
    const text = 'token: ghp_ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefgh12';
    const secrets = detect(text);
    expect(secrets.some((s) => s.type === 'GitHub Token')).toBe(true);
  });

  test('detects Bearer token', () => {
    const text = 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.test12345678';
    const secrets = detect(text);
    expect(secrets.some((s) => s.type === 'Bearer Token' || s.type === 'JWT')).toBe(true);
  });

  test('detects password assignment', () => {
    const text = 'password=mysecretpassword123';
    const secrets = detect(text);
    expect(secrets.some((s) => s.type === 'Password Assignment')).toBe(true);
  });

  test('detects connection string', () => {
    const text = 'DATABASE_URL=postgres://user:pass@host:5432/db';
    const secrets = detect(text);
    expect(secrets.some((s) => s.type === 'Connection String')).toBe(true);
  });

  test('detects API key assignment', () => {
    const text = 'api_key = "sk_1234567890abcdef1234567890abcdef"';
    const secrets = detect(text);
    expect(secrets.some((s) => s.type === 'Generic API Key')).toBe(true);
  });

  test('detects private key block', () => {
    const text = `-----BEGIN RSA PRIVATE KEY-----
MIIBogIBAAJBALRiMLAHudeSA/x3hB2f+2NRkJSQ
-----END RSA PRIVATE KEY-----`;
    const secrets = detect(text);
    expect(secrets.some((s) => s.type === 'Private Key')).toBe(true);
  });

  test('detects multiple secrets', () => {
    const text = `
AWS_KEY=AKIAIOSFODNN7EXAMPLE
password=supersecret123
    `;
    const secrets = detect(text);
    expect(secrets.length).toBeGreaterThanOrEqual(2);
  });
});

describe('redact', () => {
  test('returns original text when no secrets', () => {
    const text = 'Hello, this is normal text.';
    expect(redact(text)).toBe(text);
  });

  test('redacts detected secrets', () => {
    const text = 'My key is AKIAIOSFODNN7EXAMPLE and done';
    const result = redact(text);
    expect(result).toContain('[REDACTED]');
    expect(result).not.toContain('AKIAIOSFODNN7EXAMPLE');
  });

  test('uses custom replacement', () => {
    const text = 'password=mysecretpassword123';
    const secrets = detect(text);
    const result = redact(text, secrets, '***');
    expect(result).toContain('***');
  });

  test('preserves surrounding text', () => {
    const text = 'Start AKIAIOSFODNN7EXAMPLE End';
    const result = redact(text);
    expect(result).toMatch(/^Start .+ End$/);
  });

  test('handles multiple redactions', () => {
    const text = 'key1: AKIAIOSFODNN7EXAMPLE and password=secretvalue1';
    const result = redact(text);
    const redactedCount = (result.match(/\[REDACTED\]/g) || []).length;
    expect(redactedCount).toBeGreaterThanOrEqual(2);
  });
});
