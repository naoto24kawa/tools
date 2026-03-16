import { describe, expect, test } from 'bun:test';
import { replaceText } from '../textReplace';

const defaults = {
  useRegex: false,
  caseSensitive: true,
  global: true,
};

describe('replaceText', () => {
  test('basic replacement', () => {
    const result = replaceText('hello world', {
      ...defaults,
      searchText: 'world',
      replaceText: 'earth',
    });
    expect(result.text).toBe('hello earth');
    expect(result.matchCount).toBe(1);
  });

  test('global replacement', () => {
    const result = replaceText('aaa', { ...defaults, searchText: 'a', replaceText: 'b' });
    expect(result.text).toBe('bbb');
    expect(result.matchCount).toBe(3);
  });

  test('non-global replaces only first', () => {
    const result = replaceText('aaa', {
      ...defaults,
      searchText: 'a',
      replaceText: 'b',
      global: false,
    });
    expect(result.text).toBe('baa');
    expect(result.matchCount).toBe(1);
  });

  test('case insensitive', () => {
    const result = replaceText('Hello HELLO hello', {
      ...defaults,
      searchText: 'hello',
      replaceText: 'hi',
      caseSensitive: false,
    });
    expect(result.text).toBe('hi hi hi');
    expect(result.matchCount).toBe(3);
  });

  test('case sensitive (default)', () => {
    const result = replaceText('Hello hello', {
      ...defaults,
      searchText: 'hello',
      replaceText: 'hi',
    });
    expect(result.text).toBe('Hello hi');
    expect(result.matchCount).toBe(1);
  });

  test('regex mode', () => {
    const result = replaceText('foo123bar456', {
      ...defaults,
      searchText: '\\d+',
      replaceText: '#',
      useRegex: true,
    });
    expect(result.text).toBe('foo#bar#');
    expect(result.matchCount).toBe(2);
  });

  test('escapes special chars in non-regex mode', () => {
    const result = replaceText('price is $100.00', {
      ...defaults,
      searchText: '$100.00',
      replaceText: '$200',
    });
    expect(result.text).toBe('price is $200');
    expect(result.matchCount).toBe(1);
  });

  test('empty search returns input unchanged', () => {
    const result = replaceText('hello', { ...defaults, searchText: '', replaceText: 'x' });
    expect(result.text).toBe('hello');
    expect(result.matchCount).toBe(0);
  });

  test('empty input returns empty', () => {
    const result = replaceText('', { ...defaults, searchText: 'a', replaceText: 'b' });
    expect(result.text).toBe('');
    expect(result.matchCount).toBe(0);
  });

  test('replace with empty string (deletion)', () => {
    const result = replaceText('hello world', {
      ...defaults,
      searchText: ' world',
      replaceText: '',
    });
    expect(result.text).toBe('hello');
    expect(result.matchCount).toBe(1);
  });

  test('no match returns input unchanged', () => {
    const result = replaceText('hello', { ...defaults, searchText: 'xyz', replaceText: 'abc' });
    expect(result.text).toBe('hello');
    expect(result.matchCount).toBe(0);
  });

  test('multiline text', () => {
    const result = replaceText('line1\nline2\nline1', {
      ...defaults,
      searchText: 'line1',
      replaceText: 'LINE',
    });
    expect(result.text).toBe('LINE\nline2\nLINE');
    expect(result.matchCount).toBe(2);
  });

  test('regex capture group replacement', () => {
    const result = replaceText('John Smith', {
      ...defaults,
      searchText: '(\\w+) (\\w+)',
      replaceText: '$2, $1',
      useRegex: true,
    });
    expect(result.text).toBe('Smith, John');
    expect(result.matchCount).toBe(1);
  });

  test('Japanese text', () => {
    const result = replaceText('こんにちは世界', {
      ...defaults,
      searchText: '世界',
      replaceText: '日本',
    });
    expect(result.text).toBe('こんにちは日本');
    expect(result.matchCount).toBe(1);
  });
});
