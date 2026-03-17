import { describe, expect, test } from 'vitest';
import { jsonToToml } from '../jsonToToml';

describe('jsonToToml', () => {
  test('simple key-values', () => {
    const r = jsonToToml('{"name":"Alice","age":30}');
    expect(r.error).toBeNull();
    expect(r.toml).toContain('name = "Alice"');
    expect(r.toml).toContain('age = 30');
  });

  test('nested object becomes section', () => {
    const r = jsonToToml('{"server":{"host":"localhost","port":8080}}');
    expect(r.toml).toContain('[server]');
    expect(r.toml).toContain('host = "localhost"');
  });

  test('boolean values', () => {
    const r = jsonToToml('{"enabled":true}');
    expect(r.toml).toContain('enabled = true');
  });

  test('array values', () => {
    const r = jsonToToml('{"tags":["a","b","c"]}');
    expect(r.toml).toContain('tags = ["a", "b", "c"]');
  });

  test('non-object root returns error', () => {
    expect(jsonToToml('[1,2,3]').error).not.toBeNull();
  });

  test('invalid JSON', () => {
    expect(jsonToToml('{bad}').error).not.toBeNull();
  });

  test('empty input', () => {
    expect(jsonToToml('').toml).toBe('');
  });

  test('string with special chars escaped', () => {
    const r = jsonToToml('{"msg":"hello\\nworld"}');
    expect(r.toml).toContain('\\n');
  });
});
