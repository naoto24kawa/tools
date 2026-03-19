import { describe, it, expect } from 'vitest';
import { parseTOML, validateTOML } from '../tomlValidator';

describe('parseTOML', () => {
  it('parses basic key-value pairs', () => {
    const result = parseTOML('title = "TOML Test"');
    expect(result).toEqual({ title: 'TOML Test' });
  });

  it('parses integer values', () => {
    const result = parseTOML('port = 8080');
    expect(result).toEqual({ port: 8080 });
  });

  it('parses negative integers', () => {
    const result = parseTOML('offset = -5');
    expect(result).toEqual({ offset: -5 });
  });

  it('parses float values', () => {
    const result = parseTOML('pi = 3.14');
    expect(result).toEqual({ pi: 3.14 });
  });

  it('parses boolean true', () => {
    const result = parseTOML('enabled = true');
    expect(result).toEqual({ enabled: true });
  });

  it('parses boolean false', () => {
    const result = parseTOML('enabled = false');
    expect(result).toEqual({ enabled: false });
  });

  it('parses sections', () => {
    const result = parseTOML('[server]\nhost = "localhost"\nport = 8080');
    expect(result).toEqual({
      server: {
        host: 'localhost',
        port: 8080,
      },
    });
  });

  it('parses nested sections with dots', () => {
    const result = parseTOML('[servers.alpha]\nip = "10.0.0.1"');
    expect(result).toEqual({
      servers: {
        alpha: {
          ip: '10.0.0.1',
        },
      },
    });
  });

  it('parses arrays', () => {
    const result = parseTOML('ports = [8001, 8002, 8003]');
    expect(result).toEqual({ ports: [8001, 8002, 8003] });
  });

  it('parses string arrays', () => {
    const result = parseTOML('colors = ["red", "green", "blue"]');
    expect(result).toEqual({ colors: ['red', 'green', 'blue'] });
  });

  it('parses empty arrays', () => {
    const result = parseTOML('items = []');
    expect(result).toEqual({ items: [] });
  });

  it('skips comments', () => {
    const result = parseTOML('# This is a comment\nkey = "value"');
    expect(result).toEqual({ key: 'value' });
  });

  it('handles inline comments', () => {
    const result = parseTOML('port = 8080 # default port');
    expect(result).toEqual({ port: 8080 });
  });

  it('parses inline tables', () => {
    const result = parseTOML('point = {x = 1, y = 2}');
    expect(result).toEqual({ point: { x: 1, y: 2 } });
  });

  it('parses array of tables', () => {
    const input = '[[products]]\nname = "Hammer"\n\n[[products]]\nname = "Nail"';
    const result = parseTOML(input);
    expect(result).toEqual({
      products: [
        { name: 'Hammer' },
        { name: 'Nail' },
      ],
    });
  });

  it('handles escape sequences in strings', () => {
    const result = parseTOML('msg = "hello\\nworld"');
    expect(result).toEqual({ msg: 'hello\nworld' });
  });

  it('parses literal strings (single-quoted)', () => {
    const result = parseTOML("path = 'C:\\Users\\test'");
    expect(result).toEqual({ path: 'C:\\Users\\test' });
  });

  it('parses hex integers', () => {
    const result = parseTOML('color = 0xFF');
    expect(result).toEqual({ color: 255 });
  });

  it('parses integers with underscores', () => {
    const result = parseTOML('big = 1_000_000');
    expect(result).toEqual({ big: 1000000 });
  });

  it('throws on empty input', () => {
    expect(() => parseTOML('')).toThrow();
  });

  it('throws on invalid key-value pair', () => {
    expect(() => parseTOML('invalid line without equals')).toThrow();
  });

  it('throws on unterminated string', () => {
    expect(() => parseTOML('msg = "unterminated')).toThrow();
  });

  it('parses dotted keys', () => {
    const result = parseTOML('a.b = "value"');
    expect(result).toEqual({ a: { b: 'value' } });
  });

  it('parses dates as strings', () => {
    const result = parseTOML('date = 2024-01-15');
    expect(result).toEqual({ date: '2024-01-15' });
  });

  it('parses multiple sections', () => {
    const input = 'title = "Test"\n\n[a]\nk1 = 1\n\n[b]\nk2 = 2';
    const result = parseTOML(input);
    expect(result).toEqual({
      title: 'Test',
      a: { k1: 1 },
      b: { k2: 2 },
    });
  });
});

describe('validateTOML', () => {
  it('returns valid for correct TOML', () => {
    const result = validateTOML('key = "value"');
    expect(result.valid).toBe(true);
    expect(result.error).toBeNull();
    expect(result.json).toBeDefined();
  });

  it('returns invalid for empty input', () => {
    const result = validateTOML('');
    expect(result.valid).toBe(false);
    expect(result.error).toContain('empty');
  });

  it('returns invalid for syntax error', () => {
    const result = validateTOML('bad line');
    expect(result.valid).toBe(false);
    expect(result.error).toBeDefined();
  });

  it('returns error line number', () => {
    const result = validateTOML('good = "ok"\nbad line');
    expect(result.valid).toBe(false);
    expect(result.errorLine).toBe(2);
  });

  it('returns JSON for valid TOML', () => {
    const result = validateTOML('port = 8080');
    expect(result.valid).toBe(true);
    expect(JSON.parse(result.json!)).toEqual({ port: 8080 });
  });
});
