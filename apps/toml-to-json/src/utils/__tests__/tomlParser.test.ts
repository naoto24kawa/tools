import { describe, it, expect } from 'vitest';
import { parse } from '../tomlParser';

describe('tomlParser', () => {
  it('parses basic key-value pairs', () => {
    const toml = 'name = "Alice"\nage = 30';
    expect(parse(toml)).toEqual({ name: 'Alice', age: 30 });
  });

  it('parses sections', () => {
    const toml = '[server]\nhost = "localhost"\nport = 8080';
    expect(parse(toml)).toEqual({ server: { host: 'localhost', port: 8080 } });
  });

  it('parses nested sections', () => {
    const toml = '[server.database]\nhost = "db.example.com"';
    expect(parse(toml)).toEqual({ server: { database: { host: 'db.example.com' } } });
  });

  it('parses arrays', () => {
    const toml = 'colors = ["red", "green", "blue"]';
    expect(parse(toml)).toEqual({ colors: ['red', 'green', 'blue'] });
  });

  it('parses booleans', () => {
    const toml = 'enabled = true\ndisabled = false';
    expect(parse(toml)).toEqual({ enabled: true, disabled: false });
  });

  it('parses integers', () => {
    const toml = 'a = 42\nb = -17\nc = 1_000';
    expect(parse(toml)).toEqual({ a: 42, b: -17, c: 1000 });
  });

  it('parses floats', () => {
    const toml = 'pi = 3.14\nneg = -0.5';
    expect(parse(toml)).toEqual({ pi: 3.14, neg: -0.5 });
  });

  it('parses dates', () => {
    const toml = 'date = 2024-01-15';
    expect(parse(toml)).toEqual({ date: '2024-01-15' });
  });

  it('parses inline tables', () => {
    const toml = 'point = {x = 1, y = 2}';
    expect(parse(toml)).toEqual({ point: { x: 1, y: 2 } });
  });

  it('parses array of tables', () => {
    const toml = '[[fruits]]\nname = "apple"\n\n[[fruits]]\nname = "banana"';
    expect(parse(toml)).toEqual({
      fruits: [{ name: 'apple' }, { name: 'banana' }],
    });
  });

  it('skips comments', () => {
    const toml = '# This is a comment\nname = "Alice"';
    expect(parse(toml)).toEqual({ name: 'Alice' });
  });

  it('handles literal strings', () => {
    const toml = "path = 'C:\\Users\\Alice'";
    expect(parse(toml)).toEqual({ path: 'C:\\Users\\Alice' });
  });

  it('throws on empty input', () => {
    expect(() => parse('')).toThrow('Input is empty');
  });

  it('parses dotted keys', () => {
    const toml = 'fruit.name = "banana"';
    expect(parse(toml)).toEqual({ fruit: { name: 'banana' } });
  });

  it('handles escape sequences in basic strings', () => {
    const toml = 'msg = "Hello\\nWorld"';
    expect(parse(toml)).toEqual({ msg: 'Hello\nWorld' });
  });
});
