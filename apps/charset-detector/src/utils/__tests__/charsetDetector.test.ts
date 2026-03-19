import { describe, it, expect } from 'vitest';
import {
  detectEncoding,
  decodeWithEncoding,
  bytesToHex,
} from '../charsetDetector';

describe('detectEncoding', () => {
  it('detects ASCII', () => {
    const bytes = new Uint8Array([72, 101, 108, 108, 111]); // "Hello"
    const results = detectEncoding(bytes);
    expect(results.some((r) => r.encoding === 'ASCII')).toBe(true);
  });

  it('detects UTF-8 BOM', () => {
    const bytes = new Uint8Array([0xef, 0xbb, 0xbf, 72, 101, 108, 108, 111]);
    const results = detectEncoding(bytes);
    expect(results[0].encoding).toBe('UTF-8 (BOM)');
    expect(results[0].confidence).toBe(100);
  });

  it('detects UTF-16LE BOM', () => {
    const bytes = new Uint8Array([0xff, 0xfe, 72, 0, 105, 0]);
    const results = detectEncoding(bytes);
    expect(results[0].encoding).toBe('UTF-16LE');
    expect(results[0].confidence).toBe(95);
  });

  it('detects UTF-16BE BOM', () => {
    const bytes = new Uint8Array([0xfe, 0xff, 0, 72, 0, 105]);
    const results = detectEncoding(bytes);
    expect(results[0].encoding).toBe('UTF-16BE');
    expect(results[0].confidence).toBe(95);
  });

  it('detects UTF-8 multi-byte', () => {
    // UTF-8 encoded hiragana 'a' (U+3042) = E3 81 82
    const bytes = new Uint8Array([0xe3, 0x81, 0x82]);
    const results = detectEncoding(bytes);
    expect(results.some((r) => r.encoding === 'UTF-8')).toBe(true);
  });

  it('returns results sorted by confidence', () => {
    const bytes = new Uint8Array([0xe3, 0x81, 0x82]);
    const results = detectEncoding(bytes);
    for (let i = 1; i < results.length; i++) {
      expect(results[i - 1].confidence).toBeGreaterThanOrEqual(results[i].confidence);
    }
  });
});

describe('decodeWithEncoding', () => {
  it('decodes UTF-8 text', () => {
    const encoder = new TextEncoder();
    const bytes = encoder.encode('Hello World');
    const text = decodeWithEncoding(bytes, 'UTF-8');
    expect(text).toBe('Hello World');
  });

  it('returns error message for invalid encoding', () => {
    const bytes = new Uint8Array([72, 101]);
    const text = decodeWithEncoding(bytes, 'INVALID-ENCODING');
    expect(text).toContain('Decoding failed');
  });
});

describe('bytesToHex', () => {
  it('converts bytes to hex string', () => {
    const bytes = new Uint8Array([0x48, 0x65, 0x6c]);
    expect(bytesToHex(bytes)).toBe('48 65 6C');
  });

  it('handles empty array', () => {
    expect(bytesToHex(new Uint8Array([]))).toBe('');
  });
});
