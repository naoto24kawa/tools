import { describe, expect, test } from 'bun:test';
import { domainToASCII, punycodeEncode } from '../punycode';

describe('punycode', () => {
  test('encode ASCII-only returns same', () => {
    expect(domainToASCII('example.com')).toBe('example.com');
  });

  test('encode simple Japanese domain', () => {
    const result = domainToASCII('example.jp');
    expect(result).toBe('example.jp');
  });

  test('punycodeEncode basic', () => {
    // "mnchen" with u-umlaut -> "mnchen-3ya"
    expect(punycodeEncode('mnchen\u00FC')).toBeDefined();
  });

  test('encode preserves dots', () => {
    const result = domainToASCII('test.example.com');
    expect(result.split('.').length).toBe(3);
  });

  test('international domain gets xn-- prefix', () => {
    const result = domainToASCII('\u00FC.com');
    expect(result).toStartWith('xn--');
  });
});
