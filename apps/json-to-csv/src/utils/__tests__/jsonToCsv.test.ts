import { describe, expect, test } from 'vitest';
import { jsonToCsv } from '../jsonToCsv';

describe('jsonToCsv', () => {
  test('basic conversion', () => {
    const result = jsonToCsv('[{"name":"Alice","age":30}]');
    expect(result.error).toBeNull();
    expect(result.csv).toBe('name,age\nAlice,30');
  });

  test('multiple rows', () => {
    const result = jsonToCsv('[{"a":1},{"a":2},{"a":3}]');
    expect(result.csv).toBe('a\n1\n2\n3');
  });

  test('handles missing keys', () => {
    const result = jsonToCsv('[{"a":1,"b":2},{"a":3}]');
    expect(result.csv).toContain('a,b');
    expect(result.csv).toContain('3,');
  });

  test('escapes commas in values', () => {
    const result = jsonToCsv('[{"name":"Doe, Jane"}]');
    expect(result.csv).toContain('"Doe, Jane"');
  });

  test('escapes quotes in values', () => {
    const result = jsonToCsv('[{"name":"say \\"hello\\""}]');
    expect(result.csv).toContain('""hello""');
  });

  test('handles null values', () => {
    const result = jsonToCsv('[{"a":null}]');
    expect(result.csv).toBe('a\n');
  });

  test('handles nested objects as JSON strings', () => {
    const result = jsonToCsv('[{"a":{"b":1}}]');
    // nested object is JSON-stringified then CSV-escaped: quotes are doubled
    expect(result.csv).toContain('"{""b"":1}"');
  });

  test('error for non-array JSON', () => {
    const result = jsonToCsv('{"a":1}');
    expect(result.error).not.toBeNull();
  });

  test('error for invalid JSON', () => {
    const result = jsonToCsv('{invalid}');
    expect(result.error).not.toBeNull();
  });

  test('empty input', () => {
    const result = jsonToCsv('');
    expect(result.csv).toBe('');
    expect(result.error).toBeNull();
  });

  test('empty array', () => {
    const result = jsonToCsv('[]');
    expect(result.csv).toBe('');
  });
});
