import { describe, expect, test } from 'vitest';
import { jsonToTable } from '../jsonToTable';

describe('jsonToTable', () => {
  test('basic conversion', () => {
    const r = jsonToTable('[{"name":"Alice","age":30}]');
    expect(r.headers).toEqual(['name', 'age']);
    expect(r.rows[0]).toEqual(['Alice', '30']);
  });

  test('multiple rows', () => {
    const r = jsonToTable('[{"a":1},{"a":2}]');
    expect(r.rows.length).toBe(2);
  });

  test('missing keys filled with empty', () => {
    const r = jsonToTable('[{"a":1,"b":2},{"a":3}]');
    expect(r.rows[1][1]).toBe('');
  });

  test('non-array returns error', () => {
    expect(jsonToTable('{"a":1}').error).not.toBeNull();
  });

  test('invalid JSON', () => {
    expect(jsonToTable('{bad}').error).not.toBeNull();
  });

  test('empty', () => {
    const r = jsonToTable('');
    expect(r.headers).toEqual([]);
    expect(r.error).toBeNull();
  });

  test('null values', () => {
    const r = jsonToTable('[{"a":null}]');
    expect(r.rows[0][0]).toBe('');
  });
});
