import { describe, expect, test } from 'vitest';
import { minifyJSON } from '../jsonMinify';

describe('minifyJSON', () => {
  test('minifies formatted JSON', () => {
    const r = minifyJSON('{\n  "a": 1,\n  "b": 2\n}');
    expect(r.result).toBe('{"a":1,"b":2}');
    expect(r.error).toBeNull();
  });

  test('calculates saved bytes', () => {
    const input = '{\n  "a": 1\n}';
    const r = minifyJSON(input);
    expect(r.savedBytes).toBe(input.length - r.result.length);
    expect(r.savedBytes).toBeGreaterThan(0);
  });

  test('already minified returns same', () => {
    const r = minifyJSON('{"a":1}');
    expect(r.result).toBe('{"a":1}');
    expect(r.savedBytes).toBe(0);
  });

  test('invalid JSON returns error', () => {
    const r = minifyJSON('{bad}');
    expect(r.error).not.toBeNull();
  });

  test('empty input', () => {
    const r = minifyJSON('');
    expect(r.result).toBe('');
    expect(r.error).toBeNull();
  });

  test('arrays', () => {
    const r = minifyJSON('[ 1, 2, 3 ]');
    expect(r.result).toBe('[1,2,3]');
  });
});
