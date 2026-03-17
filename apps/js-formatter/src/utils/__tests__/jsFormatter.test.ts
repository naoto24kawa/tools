import { describe, expect, test } from 'vitest';
import { formatJs, minifyJs } from '../jsFormatter';

describe('jsFormatter', () => {
  test('formats simple JS', () => {
    const result = formatJs('function foo(){return 1;}');
    expect(result).toContain('{\n');
  });

  test('minifies JS', () => {
    const result = minifyJs('function foo() {\n  return 1;\n}');
    expect(result).not.toContain('\n');
  });

  test('handles empty input', () => {
    expect(formatJs('')).toBe('');
  });

  test('preserves strings', () => {
    const result = formatJs('var x = "hello world";');
    expect(result).toContain('"hello world"');
  });

  test('handles single-line comments', () => {
    const result = formatJs('var x = 1; // comment\nvar y = 2;');
    expect(result).toContain('// comment');
  });

  test('handles multi-line comments', () => {
    const result = formatJs('/* block comment */ var x = 1;');
    expect(result).toContain('/* block comment */');
  });

  test('minify removes comments', () => {
    const result = minifyJs('var x = 1; // comment');
    expect(result).not.toContain('comment');
  });

  test('formats with custom indent size', () => {
    const result = formatJs('function foo(){return 1;}', 4);
    expect(result).toContain('    ');
  });
});
