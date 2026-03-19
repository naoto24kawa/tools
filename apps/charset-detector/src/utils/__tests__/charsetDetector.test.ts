import { describe, it, expect } from 'vitest';
import { detect, convertText } from '../charsetDetector';

describe('charsetDetector', () => {
  it('should detect ASCII', () => {
    const bytes = new Uint8Array([72, 101, 108, 108, 111]); // "Hello"
    const results = detect(bytes);
    expect(results[0].encoding).toBe('ASCII');
  });

  it('should detect UTF-8 BOM', () => {
    const bytes = new Uint8Array([0xef, 0xbb, 0xbf, 72, 101, 108, 108, 111]);
    const results = detect(bytes);
    expect(results[0].encoding).toBe('UTF-8 (BOM)');
    expect(results[0].confidence).toBe(100);
  });

  it('should detect UTF-16 LE BOM', () => {
    const bytes = new Uint8Array([0xff, 0xfe, 72, 0, 105, 0]);
    const results = detect(bytes);
    expect(results[0].encoding).toBe('UTF-16 LE');
  });

  it('should detect UTF-16 BE BOM', () => {
    const bytes = new Uint8Array([0xfe, 0xff, 0, 72, 0, 105]);
    const results = detect(bytes);
    expect(results[0].encoding).toBe('UTF-16 BE');
  });

  it('should detect UTF-8 multi-byte', () => {
    // UTF-8 encoded Japanese (e.g., U+3042 hiragana "a" = E3 81 82)
    const bytes = new Uint8Array([0xe3, 0x81, 0x82]);
    const results = detect(bytes);
    expect(results.some((r) => r.encoding === 'UTF-8')).toBe(true);
  });

  it('should convert text using TextDecoder', () => {
    const encoder = new TextEncoder();
    const bytes = encoder.encode('Hello World');
    const text = convertText(bytes, 'utf-8');
    expect(text).toBe('Hello World');
  });

  it('should handle unknown encoding', () => {
    // Mostly 0x80-0xFF bytes that don't fit any pattern well
    const bytes = new Uint8Array([0x80, 0x81, 0x82, 0x83]);
    const results = detect(bytes);
    expect(results.length).toBeGreaterThan(0);
  });
});
