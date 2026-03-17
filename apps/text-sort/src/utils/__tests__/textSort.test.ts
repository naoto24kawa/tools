import { describe, expect, test } from 'bun:test';
import { DEFAULT_SORT_OPTIONS, sortText } from '../textSort';

describe('sortText', () => {
  test('sorts alphabetically ascending', () => {
    expect(sortText('cherry\napple\nbanana', DEFAULT_SORT_OPTIONS)).toBe('apple\nbanana\ncherry');
  });

  test('sorts descending', () => {
    expect(sortText('apple\nbanana\ncherry', { ...DEFAULT_SORT_OPTIONS, order: 'desc' })).toBe(
      'cherry\nbanana\napple'
    );
  });

  test('numeric sort', () => {
    expect(sortText('10\n2\n1\n20', { ...DEFAULT_SORT_OPTIONS, numeric: true })).toBe(
      '1\n2\n10\n20'
    );
  });

  test('numeric sort descending', () => {
    expect(sortText('10\n2\n1', { ...DEFAULT_SORT_OPTIONS, numeric: true, order: 'desc' })).toBe(
      '10\n2\n1'
    );
  });

  test('case insensitive sort', () => {
    expect(
      sortText('Banana\napple\nCherry', { ...DEFAULT_SORT_OPTIONS, caseSensitive: false })
    ).toBe('apple\nBanana\nCherry');
  });

  test('removes duplicates', () => {
    expect(sortText('a\nb\na\nc\nb', { ...DEFAULT_SORT_OPTIONS, removeDuplicates: true })).toBe(
      'a\nb\nc'
    );
  });

  test('trims lines', () => {
    expect(sortText('  b  \n  a  ', { ...DEFAULT_SORT_OPTIONS, trimLines: true })).toBe('a\nb');
  });

  test('removes empty lines', () => {
    expect(sortText('b\n\na\n\nc', { ...DEFAULT_SORT_OPTIONS, removeEmpty: true })).toBe('a\nb\nc');
  });

  test('handles empty input', () => {
    expect(sortText('', DEFAULT_SORT_OPTIONS)).toBe('');
  });

  test('handles single line', () => {
    expect(sortText('hello', DEFAULT_SORT_OPTIONS)).toBe('hello');
  });

  test('Japanese text sort', () => {
    const result = sortText('さ\nあ\nか', DEFAULT_SORT_OPTIONS);
    expect(result).toBe('あ\nか\nさ');
  });

  test('combined options', () => {
    const result = sortText('  b  \n\n  a  \n  b  \n\n  c  ', {
      ...DEFAULT_SORT_OPTIONS,
      trimLines: true,
      removeEmpty: true,
      removeDuplicates: true,
    });
    expect(result).toBe('a\nb\nc');
  });
});
