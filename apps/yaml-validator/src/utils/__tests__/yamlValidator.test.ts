import { describe, it, expect } from 'vitest';
import { parseYaml, validateYaml } from '../yamlValidator';

describe('parseYaml', () => {
  it('parses simple key-value pairs', () => {
    const result = parseYaml('name: Alice\nage: 30');
    expect(result).toEqual({ name: 'Alice', age: 30 });
  });

  it('parses nested mappings', () => {
    const result = parseYaml('server:\n  host: localhost\n  port: 8080');
    expect(result).toEqual({
      server: {
        host: 'localhost',
        port: 8080,
      },
    });
  });

  it('parses sequences', () => {
    const result = parseYaml('items:\n  - apple\n  - banana\n  - cherry');
    expect(result).toEqual({
      items: ['apple', 'banana', 'cherry'],
    });
  });

  it('parses boolean true values', () => {
    const result = parseYaml('enabled: true');
    expect(result).toEqual({ enabled: true });
  });

  it('parses boolean false values', () => {
    const result = parseYaml('enabled: false');
    expect(result).toEqual({ enabled: false });
  });

  it('parses null values', () => {
    const result = parseYaml('value: null');
    expect(result).toEqual({ value: null });
  });

  it('parses integer values', () => {
    const result = parseYaml('count: 42');
    expect(result).toEqual({ count: 42 });
  });

  it('parses float values', () => {
    const result = parseYaml('pi: 3.14');
    expect(result).toEqual({ pi: 3.14 });
  });

  it('parses quoted strings', () => {
    const result = parseYaml('name: "Alice"');
    expect(result).toEqual({ name: 'Alice' });
  });

  it('parses single-quoted strings', () => {
    const result = parseYaml("name: 'Bob'");
    expect(result).toEqual({ name: 'Bob' });
  });

  it('parses flow sequences', () => {
    const result = parseYaml('colors: [red, green, blue]');
    expect(result).toEqual({ colors: ['red', 'green', 'blue'] });
  });

  it('parses flow mappings', () => {
    const result = parseYaml('point: {x: 1, y: 2}');
    expect(result).toEqual({ point: { x: 1, y: 2 } });
  });

  it('handles document separator ---', () => {
    const result = parseYaml('---\nkey: value');
    expect(result).toEqual({ key: 'value' });
  });

  it('handles document end ...', () => {
    const result = parseYaml('key: value\n...');
    expect(result).toEqual({ key: 'value' });
  });

  it('skips comments', () => {
    const result = parseYaml('# comment\nkey: value');
    expect(result).toEqual({ key: 'value' });
  });

  it('parses Yes/No as booleans', () => {
    const result = parseYaml('a: yes\nb: no');
    expect(result).toEqual({ a: true, b: false });
  });

  it('handles empty input', () => {
    expect(() => parseYaml('')).toThrow();
  });

  it('parses top-level sequence', () => {
    const result = parseYaml('- item1\n- item2\n- item3');
    expect(result).toEqual(['item1', 'item2', 'item3']);
  });

  it('parses deeply nested structures', () => {
    const input = 'a:\n  b:\n    c: deep';
    const result = parseYaml(input);
    expect(result).toEqual({ a: { b: { c: 'deep' } } });
  });

  it('parses sequence of mappings', () => {
    const input = '- name: Alice\n  age: 30\n- name: Bob\n  age: 25';
    const result = parseYaml(input);
    expect(result).toEqual([
      { name: 'Alice', age: 30 },
      { name: 'Bob', age: 25 },
    ]);
  });

  it('parses tilde as null', () => {
    const result = parseYaml('val: ~');
    expect(result).toEqual({ val: null });
  });

  it('parses hex numbers', () => {
    const result = parseYaml('color: 0xFF');
    expect(result).toEqual({ color: 255 });
  });
});

describe('validateYaml', () => {
  it('returns valid for correct YAML', () => {
    const result = validateYaml('key: value');
    expect(result.valid).toBe(true);
    expect(result.error).toBeNull();
    expect(result.json).toBeDefined();
  });

  it('returns invalid for empty input', () => {
    const result = validateYaml('');
    expect(result.valid).toBe(false);
    expect(result.error).toBeDefined();
  });

  it('returns JSON for valid YAML', () => {
    const result = validateYaml('port: 8080');
    expect(result.valid).toBe(true);
    expect(JSON.parse(result.json!)).toEqual({ port: 8080 });
  });

  it('returns error line for invalid YAML', () => {
    const result = validateYaml('good: ok\n  bad indent: value');
    expect(result.valid).toBe(false);
    expect(result.errorLine).toBeDefined();
  });

  it('handles complex valid YAML', () => {
    const input = 'services:\n  web:\n    image: nginx\n    ports:\n      - "80:80"';
    const result = validateYaml(input);
    expect(result.valid).toBe(true);
    const parsed = JSON.parse(result.json!);
    expect(parsed.services.web.image).toBe('nginx');
  });
});
