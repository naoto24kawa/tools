import { describe, expect, test } from 'vitest';
import { testRegex } from '../regexTester';

describe('testRegex', () => {
  test('finds global matches', () => {
    const result = testRegex('\\d+', 'g', 'abc 123 def 456');
    expect(result.matches.length).toBe(2);
    expect(result.matches[0].match).toBe('123');
    expect(result.matches[1].match).toBe('456');
  });

  test('finds single match without global flag', () => {
    const result = testRegex('\\d+', '', 'abc 123 def 456');
    expect(result.matches.length).toBe(1);
    expect(result.matches[0].match).toBe('123');
  });

  test('returns match index', () => {
    const result = testRegex('world', 'g', 'hello world');
    expect(result.matches[0].index).toBe(6);
  });

  test('captures groups', () => {
    const result = testRegex('(\\w+)@(\\w+)', 'g', 'test@example');
    expect(result.matches[0].groups).toEqual(['test', 'example']);
  });

  test('case insensitive flag', () => {
    const result = testRegex('hello', 'gi', 'Hello HELLO hello');
    expect(result.matches.length).toBe(3);
  });

  test('returns error for invalid pattern', () => {
    const result = testRegex('[unclosed', 'g', 'test');
    expect(result.error).not.toBeNull();
    expect(result.matches.length).toBe(0);
  });

  test('empty pattern returns no matches', () => {
    const result = testRegex('', 'g', 'test');
    expect(result.matches.length).toBe(0);
    expect(result.error).toBeNull();
  });

  test('no match returns empty array', () => {
    const result = testRegex('xyz', 'g', 'hello world');
    expect(result.matches.length).toBe(0);
    expect(result.error).toBeNull();
  });

  test('handles zero-length matches', () => {
    const result = testRegex('(?=\\d)', 'g', 'a1b2c3');
    expect(result.matches.length).toBe(3);
  });

  test('multiline flag', () => {
    const result = testRegex('^\\w+', 'gm', 'hello\nworld');
    expect(result.matches.length).toBe(2);
  });
});
