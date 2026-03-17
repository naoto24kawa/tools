import { describe, expect, test } from 'bun:test';
import { formatJson, minifyJson, parseJson, sortJsonKeys } from '../jsonEditor';

describe('jsonEditor', () => {
  test('parseJson valid', () => {
    const result = parseJson('{"a":1}');
    expect(result.error).toBeNull();
    expect(result.value).toEqual({ a: 1 });
  });

  test('parseJson invalid', () => {
    const result = parseJson('{invalid}');
    expect(result.error).not.toBeNull();
  });

  test('formatJson with indent', () => {
    const result = formatJson('{"a":1}', 2);
    expect(result).toBe('{\n  "a": 1\n}');
  });

  test('minifyJson', () => {
    const result = minifyJson('{ "a" : 1 }');
    expect(result).toBe('{"a":1}');
  });

  test('sortJsonKeys', () => {
    const result = sortJsonKeys({ b: 2, a: 1 });
    expect(Object.keys(result as Record<string, unknown>)).toEqual(['a', 'b']);
  });
});
