import { describe, expect, it } from 'vitest';
import { parse, stringify, validate, diff } from '../envParser';

describe('parse', () => {
  it('parses basic key-value pairs', () => {
    const result = parse('FOO=bar\nBAZ=qux');
    expect(result).toEqual([
      { key: 'FOO', value: 'bar' },
      { key: 'BAZ', value: 'qux' },
    ]);
  });

  it('ignores comments', () => {
    const result = parse('# comment\nFOO=bar');
    expect(result).toEqual([{ key: 'FOO', value: 'bar' }]);
  });

  it('ignores empty lines', () => {
    const result = parse('FOO=bar\n\nBAZ=qux');
    expect(result).toHaveLength(2);
  });

  it('handles quoted values', () => {
    const result = parse('FOO="hello world"');
    expect(result[0].value).toBe('hello world');
  });

  it('handles single-quoted values', () => {
    const result = parse("FOO='hello world'");
    expect(result[0].value).toBe('hello world');
  });

  it('handles empty values', () => {
    const result = parse('FOO=');
    expect(result[0].value).toBe('');
  });

  it('handles values with equals signs', () => {
    const result = parse('FOO=bar=baz');
    expect(result[0].value).toBe('bar=baz');
  });
});

describe('stringify', () => {
  it('converts entries to env format', () => {
    const result = stringify([
      { key: 'FOO', value: 'bar' },
      { key: 'BAZ', value: 'qux' },
    ]);
    expect(result).toBe('FOO=bar\nBAZ=qux\n');
  });

  it('quotes values with spaces', () => {
    const result = stringify([{ key: 'FOO', value: 'hello world' }]);
    expect(result).toBe('FOO="hello world"\n');
  });

  it('includes comments', () => {
    const result = stringify([{ key: 'FOO', value: 'bar', comment: 'a comment' }]);
    expect(result).toBe('FOO=bar # a comment\n');
  });
});

describe('validate', () => {
  it('returns empty for valid entries', () => {
    const errors = validate([{ key: 'FOO', value: 'bar' }]);
    const realErrors = errors.filter((e) => !e.message.includes('warning'));
    expect(realErrors).toEqual([]);
  });

  it('detects empty keys', () => {
    const errors = validate([{ key: '', value: 'bar' }]);
    expect(errors.some((e) => e.message === 'Key is empty')).toBe(true);
  });

  it('detects spaces in keys', () => {
    const errors = validate([{ key: 'MY KEY', value: 'bar' }]);
    expect(errors.some((e) => e.message === 'Key contains spaces')).toBe(true);
  });

  it('warns on empty values', () => {
    const errors = validate([{ key: 'FOO', value: '' }]);
    expect(errors.some((e) => e.message.includes('empty'))).toBe(true);
  });

  it('detects duplicate keys', () => {
    const errors = validate([
      { key: 'FOO', value: 'bar' },
      { key: 'FOO', value: 'baz' },
    ]);
    expect(errors.some((e) => e.message.includes('Duplicate'))).toBe(true);
  });
});

describe('diff', () => {
  it('finds keys only in first', () => {
    const result = diff(
      [{ key: 'FOO', value: 'bar' }],
      [{ key: 'BAZ', value: 'qux' }]
    );
    expect(result.onlyInA).toEqual(['FOO']);
  });

  it('finds keys only in second', () => {
    const result = diff(
      [{ key: 'FOO', value: 'bar' }],
      [{ key: 'BAZ', value: 'qux' }]
    );
    expect(result.onlyInB).toEqual(['BAZ']);
  });

  it('finds keys in both', () => {
    const result = diff(
      [{ key: 'FOO', value: 'bar' }],
      [{ key: 'FOO', value: 'bar' }]
    );
    expect(result.inBoth).toEqual(['FOO']);
  });

  it('finds different values', () => {
    const result = diff(
      [{ key: 'FOO', value: 'bar' }],
      [{ key: 'FOO', value: 'baz' }]
    );
    expect(result.differentValues).toEqual([
      { key: 'FOO', valueA: 'bar', valueB: 'baz' },
    ]);
  });

  it('handles empty arrays', () => {
    const result = diff([], []);
    expect(result.onlyInA).toEqual([]);
    expect(result.onlyInB).toEqual([]);
    expect(result.inBoth).toEqual([]);
    expect(result.differentValues).toEqual([]);
  });
});
