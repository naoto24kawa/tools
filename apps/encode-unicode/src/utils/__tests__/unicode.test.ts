import { describe, expect, test } from 'bun:test';
import { textToCodePoints, textToUnicodeEscape, unicodeEscapeToText } from '../unicode';

describe('unicode', () => {
  test('textToUnicodeEscape ASCII', () => {
    expect(textToUnicodeEscape('AB')).toBe('\\u0041\\u0042');
  });

  test('textToUnicodeEscape Japanese', () => {
    expect(textToUnicodeEscape('\u3042')).toBe('\\u3042');
  });

  test('textToUnicodeEscape emoji', () => {
    const result = textToUnicodeEscape('\u{1F389}');
    expect(result).toBe('\\u{1f389}');
  });

  test('unicodeEscapeToText basic', () => {
    expect(unicodeEscapeToText('\\u0041\\u0042')).toBe('AB');
  });

  test('unicodeEscapeToText extended', () => {
    expect(unicodeEscapeToText('\\u{1f389}')).toBe('\u{1F389}');
  });

  test('round-trip ASCII', () => {
    const original = 'Hello World';
    expect(unicodeEscapeToText(textToUnicodeEscape(original))).toBe(original);
  });

  test('round-trip Japanese', () => {
    const original = '\u3053\u3093\u306B\u3061\u306F';
    expect(unicodeEscapeToText(textToUnicodeEscape(original))).toBe(original);
  });

  test('textToCodePoints', () => {
    expect(textToCodePoints('AB')).toBe('U+0041 U+0042');
  });

  test('textToCodePoints Japanese', () => {
    expect(textToCodePoints('\u3042')).toBe('U+3042');
  });

  test('empty string', () => {
    expect(textToUnicodeEscape('')).toBe('');
    expect(unicodeEscapeToText('')).toBe('');
    expect(textToCodePoints('')).toBe('');
  });
});
