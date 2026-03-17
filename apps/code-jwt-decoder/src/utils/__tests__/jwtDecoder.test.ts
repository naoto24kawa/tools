import { describe, expect, test } from 'bun:test';
import { decodeJWT } from '../jwtDecoder';

// Test JWT: {"alg":"HS256","typ":"JWT"}.{"sub":"1234567890","name":"John Doe","iat":1516239022}
const TEST_TOKEN =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c';

describe('jwtDecoder', () => {
  test('decodes header', () => {
    const result = decodeJWT(TEST_TOKEN);
    expect(result.header).toEqual({ alg: 'HS256', typ: 'JWT' });
  });

  test('decodes payload', () => {
    const result = decodeJWT(TEST_TOKEN);
    expect(result.payload).toEqual({
      sub: '1234567890',
      name: 'John Doe',
      iat: 1516239022,
    });
  });

  test('extracts signature', () => {
    const result = decodeJWT(TEST_TOKEN);
    expect(result.signature).toBe('SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c');
  });

  test('detects issued at', () => {
    const result = decodeJWT(TEST_TOKEN);
    expect(result.issuedAt).toBe('2018-01-18T01:30:22.000Z');
  });

  test('detects expired token', () => {
    // Token with exp in the past
    const expiredPayload = btoa(JSON.stringify({ exp: 1000000000 })).replace(/=/g, '');
    const header = btoa(JSON.stringify({ alg: 'HS256' })).replace(/=/g, '');
    const token = `${header}.${expiredPayload}.signature`;
    const result = decodeJWT(token);
    expect(result.isExpired).toBe(true);
  });

  test('no expiry info when exp not present', () => {
    const result = decodeJWT(TEST_TOKEN);
    // This test token has no exp field
    expect(result.isExpired).toBeNull();
    expect(result.expiresAt).toBeNull();
  });

  test('throws for invalid token format', () => {
    expect(() => decodeJWT('invalid')).toThrow('Invalid JWT');
  });

  test('throws for only 2 parts', () => {
    expect(() => decodeJWT('part1.part2')).toThrow('Invalid JWT');
  });

  test('handles whitespace around token', () => {
    const result = decodeJWT(`  ${TEST_TOKEN}  `);
    expect(result.header.alg).toBe('HS256');
  });
});
