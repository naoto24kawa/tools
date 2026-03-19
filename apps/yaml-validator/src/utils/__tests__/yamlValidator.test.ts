import { describe, it, expect } from 'vitest';
import { validateYaml, parseYaml } from '../yamlValidator';

describe('validateYaml', () => {
  it('returns error for empty input', () => {
    const result = validateYaml('');
    expect(result.valid).toBe(false);
    expect(result.error).toContain('empty');
  });

  it('validates simple key-value YAML', () => {
    const result = validateYaml('name: test\nversion: 1');
    expect(result.valid).toBe(true);
    expect(result.json).toBeTruthy();
    const parsed = JSON.parse(result.json!);
    expect(parsed.name).toBe('test');
    expect(parsed.version).toBe(1);
  });

  it('validates nested YAML', () => {
    const result = validateYaml('parent:\n  child: value\n  num: 42');
    expect(result.valid).toBe(true);
    const parsed = JSON.parse(result.json!);
    expect(parsed.parent.child).toBe('value');
    expect(parsed.parent.num).toBe(42);
  });

  it('validates sequences', () => {
    const result = validateYaml('items:\n  - one\n  - two\n  - three');
    expect(result.valid).toBe(true);
    const parsed = JSON.parse(result.json!);
    expect(parsed.items).toEqual(['one', 'two', 'three']);
  });

  it('handles boolean values', () => {
    const result = validateYaml('enabled: true\ndisabled: false');
    expect(result.valid).toBe(true);
    const parsed = JSON.parse(result.json!);
    expect(parsed.enabled).toBe(true);
    expect(parsed.disabled).toBe(false);
  });

  it('handles null values', () => {
    const result = validateYaml('value: null\nother: ~');
    expect(result.valid).toBe(true);
    const parsed = JSON.parse(result.json!);
    expect(parsed.value).toBeNull();
    expect(parsed.other).toBeNull();
  });

  it('handles quoted strings', () => {
    const result = validateYaml('name: "hello world"\nsingle: \'test\'');
    expect(result.valid).toBe(true);
    const parsed = JSON.parse(result.json!);
    expect(parsed.name).toBe('hello world');
    expect(parsed.single).toBe('test');
  });

  it('handles comments', () => {
    const result = validateYaml('# comment\nname: test # inline');
    expect(result.valid).toBe(true);
    const parsed = JSON.parse(result.json!);
    expect(parsed.name).toBe('test');
  });

  it('generates JSON output', () => {
    const result = validateYaml('key: value');
    expect(result.json).toBeTruthy();
    expect(() => JSON.parse(result.json!)).not.toThrow();
  });
});

describe('parseYaml', () => {
  it('parses flow sequence', () => {
    const result = parseYaml('items: [1, 2, 3]');
    expect((result as Record<string, unknown>).items).toEqual([1, 2, 3]);
  });

  it('parses flow mapping', () => {
    const result = parseYaml('data: {a: 1, b: 2}');
    expect((result as Record<string, unknown>).data).toEqual({ a: 1, b: 2 });
  });

  it('parses numeric values', () => {
    const result = parseYaml('int: 42\nfloat: 3.14');
    const obj = result as Record<string, unknown>;
    expect(obj.int).toBe(42);
    expect(obj.float).toBe(3.14);
  });
});
