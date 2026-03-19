import { describe, expect, test } from 'vitest';
import { detectPII, anonymize } from '../dataAnonymizer';
import type { AnonymizeMode } from '../dataAnonymizer';

describe('detectPII', () => {
  test('returns empty array for clean text', () => {
    expect(detectPII('Hello world')).toEqual([]);
  });

  test('detects email addresses', () => {
    const results = detectPII('Contact: john@example.com');
    expect(results.some((r) => r.type === 'Email')).toBe(true);
    expect(results.find((r) => r.type === 'Email')?.value).toBe('john@example.com');
  });

  test('detects Japanese phone numbers', () => {
    const results = detectPII('TEL: 090-1234-5678');
    expect(results.some((r) => r.type === 'Phone (JP)')).toBe(true);
  });

  test('detects credit card numbers', () => {
    const results = detectPII('Card: 4111-1111-1111-1111');
    expect(results.some((r) => r.type === 'Credit Card')).toBe(true);
  });

  test('detects credit card without dashes', () => {
    const results = detectPII('Card: 4111111111111111');
    expect(results.some((r) => r.type === 'Credit Card')).toBe(true);
  });

  test('detects IP addresses', () => {
    const results = detectPII('Server: 192.168.1.100');
    expect(results.some((r) => r.type === 'IP Address')).toBe(true);
  });

  test('detects dates of birth', () => {
    const results = detectPII('DOB: 1990-05-15');
    expect(results.some((r) => r.type === 'Date of Birth')).toBe(true);
  });

  test('detects Japanese postal codes', () => {
    const results = detectPII('ZIP: 100-0001');
    expect(results.some((r) => r.type === 'Postal Code (JP)')).toBe(true);
  });

  test('detects multiple PII in same text', () => {
    const text = 'Email: test@example.com, Phone: 03-1234-5678, IP: 10.0.0.1';
    const results = detectPII(text);
    expect(results.length).toBeGreaterThanOrEqual(3);
  });
});

describe('anonymize', () => {
  test('returns original text when no PII', () => {
    const text = 'Hello world';
    expect(anonymize(text)).toBe(text);
  });

  test('masks email', () => {
    const result = anonymize('Contact: john@example.com', undefined, 'mask');
    expect(result).not.toContain('john@example.com');
    expect(result).toContain('***');
  });

  test('masks credit card keeping last 4 digits', () => {
    const result = anonymize('Card: 4111-1111-1111-1234', undefined, 'mask');
    expect(result).toContain('1234');
    expect(result).not.toContain('4111-1111-1111-1234');
  });

  test('fake mode replaces with fake data', () => {
    const result = anonymize('Contact: john@example.com', undefined, 'fake');
    expect(result).toContain('user@example.com');
  });

  test('hash mode replaces with hash', () => {
    const result = anonymize('Contact: john@example.com', undefined, 'hash');
    expect(result).toMatch(/\[hash:[0-9a-f]+\]/);
  });

  test('hash produces consistent output for same input', () => {
    const r1 = anonymize('IP: 192.168.1.1', undefined, 'hash');
    const r2 = anonymize('IP: 192.168.1.1', undefined, 'hash');
    expect(r1).toBe(r2);
  });

  test('all modes produce different outputs', () => {
    const text = 'Email: test@test.com';
    const modes: AnonymizeMode[] = ['mask', 'fake', 'hash'];
    const results = modes.map((mode) => anonymize(text, undefined, mode));
    expect(new Set(results).size).toBe(3);
  });
});
