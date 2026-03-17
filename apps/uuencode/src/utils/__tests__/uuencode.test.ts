import { describe, expect, test } from 'bun:test';
import { uudecode, uuencode } from '../uuencode';

describe('uuencode', () => {
  test('encodes simple text', () => {
    const result = uuencode('Cat');
    expect(result).toContain('begin 644 data');
    expect(result).toContain('end');
  });

  test('roundtrip encode/decode', () => {
    const input = 'Hello, World!';
    expect(uudecode(uuencode(input))).toBe(input);
  });

  test('handles empty string', () => {
    const result = uuencode('');
    expect(result).toContain('begin 644 data');
  });

  test('handles multi-byte characters', () => {
    const input = 'abc123';
    expect(uudecode(uuencode(input))).toBe(input);
  });

  test('decodes valid uuencoded data', () => {
    const encoded = uuencode('test');
    const decoded = uudecode(encoded);
    expect(decoded).toBe('test');
  });
});
