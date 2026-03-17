import { describe, expect, test } from 'vitest';
import { validateJSON } from '../jsonValidator';

describe('validateJSON', () => {
  test('valid object', () => {
    const r = validateJSON('{"a":1}');
    expect(r.valid).toBe(true);
    expect(r.error).toBeNull();
  });

  test('valid array', () => {
    expect(validateJSON('[1,2,3]').valid).toBe(true);
  });
  test('valid string', () => {
    expect(validateJSON('"hello"').valid).toBe(true);
  });
  test('valid number', () => {
    expect(validateJSON('42').valid).toBe(true);
  });
  test('valid null', () => {
    expect(validateJSON('null').valid).toBe(true);
  });

  test('invalid JSON', () => {
    const r = validateJSON('{invalid}');
    expect(r.valid).toBe(false);
    expect(r.error).not.toBeNull();
  });

  test('empty input', () => {
    const r = validateJSON('');
    expect(r.valid).toBe(false);
    expect(r.error).toBeNull();
  });

  test('formatted output', () => {
    const r = validateJSON('{"a":1,"b":2}');
    expect(r.formatted).toContain('  "a"');
  });

  test('stats for object', () => {
    const r = validateJSON('{"a":1,"b":{"c":2},"d":[1,2]}');
    expect(r.stats).not.toBeNull();
    expect(r.stats?.keys).toBe(3);
    expect(r.stats?.objects).toBe(2);
    expect(r.stats?.arrays).toBe(1);
  });

  test('stats depth', () => {
    const r = validateJSON('{"a":{"b":{"c":1}}}');
    expect(r.stats?.depth).toBe(3);
  });
});
