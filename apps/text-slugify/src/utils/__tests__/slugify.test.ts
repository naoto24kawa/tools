import { describe, expect, test } from 'vitest';
import { DEFAULT_OPTIONS, slugify } from '../slugify';

describe('slugify', () => {
  test('basic slugify', () => {
    expect(slugify('Hello World', DEFAULT_OPTIONS)).toBe('hello-world');
  });

  test('removes special characters', () => {
    expect(slugify('Hello, World!', DEFAULT_OPTIONS)).toBe('hello-world');
  });

  test('handles multiple spaces', () => {
    expect(slugify('hello   world', DEFAULT_OPTIONS)).toBe('hello-world');
  });

  test('trims leading/trailing separators', () => {
    expect(slugify('  hello world  ', DEFAULT_OPTIONS)).toBe('hello-world');
  });

  test('custom separator', () => {
    expect(slugify('hello world', { ...DEFAULT_OPTIONS, separator: '_' })).toBe('hello_world');
  });

  test('preserves case when lowercase disabled', () => {
    expect(slugify('Hello World', { ...DEFAULT_OPTIONS, lowercase: false })).toBe('Hello-World');
  });

  test('max length', () => {
    const result = slugify('hello world foo bar', { ...DEFAULT_OPTIONS, maxLength: 11 });
    expect(result.length).toBeLessThanOrEqual(11);
    expect(result).toBe('hello-world');
  });

  test('max length does not end with separator', () => {
    const result = slugify('hello world', { ...DEFAULT_OPTIONS, maxLength: 6 });
    expect(result).toBe('hello');
  });

  test('Japanese hiragana romanization', () => {
    expect(slugify('こんにちは', DEFAULT_OPTIONS)).toBe('konnichiha');
  });

  test('Japanese katakana romanization', () => {
    expect(slugify('コンニチハ', DEFAULT_OPTIONS)).toBe('konnichiha');
  });

  test('mixed Japanese and English', () => {
    expect(slugify('hello こんにちは world', DEFAULT_OPTIONS)).toBe('hello-konnichiha-world');
  });

  test('empty string', () => {
    expect(slugify('', DEFAULT_OPTIONS)).toBe('');
  });

  test('only special characters', () => {
    expect(slugify('!!!', DEFAULT_OPTIONS)).toBe('');
  });
});
