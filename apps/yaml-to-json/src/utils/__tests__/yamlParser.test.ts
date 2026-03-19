import { describe, it, expect } from 'vitest';
import { parse } from '../yamlParser';

describe('yamlParser', () => {
  it('parses simple key-value pairs', () => {
    const yaml = 'name: Alice\nage: 30';
    const result = parse(yaml);
    expect(result).toEqual({ name: 'Alice', age: 30 });
  });

  it('parses nested objects', () => {
    const yaml = 'user:\n  name: Alice\n  age: 30';
    const result = parse(yaml);
    expect(result).toEqual({ user: { name: 'Alice', age: 30 } });
  });

  it('parses arrays', () => {
    const yaml = 'items:\n  - apple\n  - banana\n  - cherry';
    const result = parse(yaml);
    expect(result).toEqual({ items: ['apple', 'banana', 'cherry'] });
  });

  it('parses booleans', () => {
    const yaml = 'active: true\ndeleted: false';
    const result = parse(yaml);
    expect(result).toEqual({ active: true, deleted: false });
  });

  it('parses null values', () => {
    const yaml = 'value: null\nother: ~';
    const result = parse(yaml);
    expect(result).toEqual({ value: null, other: null });
  });

  it('parses numbers', () => {
    const yaml = 'integer: 42\nfloat: 3.14\nnegative: -7';
    const result = parse(yaml);
    expect(result).toEqual({ integer: 42, float: 3.14, negative: -7 });
  });

  it('parses quoted strings', () => {
    const yaml = 'name: "Alice"\ngreeting: \'Hello\'';
    const result = parse(yaml);
    expect(result).toEqual({ name: 'Alice', greeting: 'Hello' });
  });

  it('parses inline arrays', () => {
    const yaml = 'items: [1, 2, 3]';
    const result = parse(yaml);
    expect(result).toEqual({ items: [1, 2, 3] });
  });

  it('parses inline objects', () => {
    const yaml = 'point: {x: 1, y: 2}';
    const result = parse(yaml);
    expect(result).toEqual({ point: { x: 1, y: 2 } });
  });

  it('skips comments', () => {
    const yaml = '# This is a comment\nname: Alice\n# Another comment\nage: 30';
    const result = parse(yaml);
    expect(result).toEqual({ name: 'Alice', age: 30 });
  });

  it('handles document separator', () => {
    const yaml = '---\nname: Alice';
    const result = parse(yaml);
    expect(result).toEqual({ name: 'Alice' });
  });

  it('throws on empty input', () => {
    expect(() => parse('')).toThrow('Input is empty');
  });

  it('parses array of objects', () => {
    const yaml = '- name: Alice\n  age: 30\n- name: Bob\n  age: 25';
    const result = parse(yaml);
    expect(result).toEqual([
      { name: 'Alice', age: 30 },
      { name: 'Bob', age: 25 },
    ]);
  });
});
