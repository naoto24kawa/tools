import { describe, expect, test } from 'bun:test';
import { addLineNumbers, DEFAULT_OPTIONS } from '../lineNumber';

describe('addLineNumbers', () => {
  test('adds line numbers with defaults', () => {
    expect(addLineNumbers('a\nb\nc', DEFAULT_OPTIONS)).toBe('1: a\n2: b\n3: c');
  });

  test('custom start number', () => {
    expect(addLineNumbers('a\nb', { ...DEFAULT_OPTIONS, startNumber: 5 })).toBe('5: a\n6: b');
  });

  test('zero start number', () => {
    expect(addLineNumbers('a\nb', { ...DEFAULT_OPTIONS, startNumber: 0 })).toBe('0: a\n1: b');
  });

  test('custom separator', () => {
    expect(addLineNumbers('a\nb', { ...DEFAULT_OPTIONS, separator: '. ' })).toBe('1. a\n2. b');
  });

  test('tab separator', () => {
    expect(addLineNumbers('a\nb', { ...DEFAULT_OPTIONS, separator: '\t' })).toBe('1\ta\n2\tb');
  });

  test('zero padding', () => {
    const input = Array.from({ length: 12 }, (_, i) => String.fromCharCode(97 + (i % 26))).join(
      '\n'
    );
    const result = addLineNumbers(input, { ...DEFAULT_OPTIONS, zeroPadding: true });
    expect(result.startsWith('01: a')).toBe(true);
    expect(result.includes('12: l')).toBe(true);
  });

  test('skip empty lines', () => {
    expect(addLineNumbers('a\n\nb', { ...DEFAULT_OPTIONS, skipEmpty: true })).toBe('1: a\n\n2: b');
  });

  test('empty input', () => {
    expect(addLineNumbers('', DEFAULT_OPTIONS)).toBe('1: ');
  });

  test('single line', () => {
    expect(addLineNumbers('hello', DEFAULT_OPTIONS)).toBe('1: hello');
  });

  test('combined options', () => {
    const result = addLineNumbers('a\n\nb\n\nc', {
      startNumber: 10,
      separator: ') ',
      zeroPadding: true,
      skipEmpty: true,
    });
    expect(result).toBe('10) a\n\n11) b\n\n12) c');
  });
});
