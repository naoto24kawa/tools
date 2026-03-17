import { describe, expect, test } from 'vitest';
import { getStats, type JsMinifyOptions, minifyJs } from '../utils/jsMinifier';

describe('minifyJs', () => {
  test('removes single-line comments', () => {
    const input = 'const x = 1; // this is a comment\nconst y = 2;';
    const result = minifyJs(input, {
      removeComments: true,
      removeWhitespace: false,
      removeConsoleLog: false,
    });
    expect(result).not.toContain('// this is a comment');
    expect(result).toContain('const x = 1;');
    expect(result).toContain('const y = 2;');
  });

  test('removes multi-line comments', () => {
    const input = '/* block comment */\nconst x = 1;';
    const result = minifyJs(input, {
      removeComments: true,
      removeWhitespace: false,
      removeConsoleLog: false,
    });
    expect(result).not.toContain('block comment');
    expect(result).toContain('const x = 1;');
  });

  test('removes whitespace and collapses spaces', () => {
    const input = 'const   x   =   1;\n\n  const   y   =   2;';
    const result = minifyJs(input, {
      removeComments: false,
      removeWhitespace: true,
      removeConsoleLog: false,
    });
    expect(result).not.toContain('  ');
    expect(result).not.toContain('\n');
  });

  test('removes console.log statements', () => {
    const input =
      'console.log("hello");\nconsole.debug("debug");\nconsole.info("info");\nconsole.warn("warn");\nconst x = 1;';
    const result = minifyJs(input, {
      removeComments: false,
      removeWhitespace: false,
      removeConsoleLog: true,
    });
    expect(result).not.toContain('console.log');
    expect(result).not.toContain('console.debug');
    expect(result).not.toContain('console.info');
    expect(result).not.toContain('console.warn');
    expect(result).toContain('const x = 1;');
  });

  test('applies all options together', () => {
    const input = `// comment
const x = 1;
/* block */
console.log("test");
const y = 2;`;
    const allOptions: JsMinifyOptions = {
      removeComments: true,
      removeWhitespace: true,
      removeConsoleLog: true,
    };
    const result = minifyJs(input, allOptions);
    expect(result).not.toContain('// comment');
    expect(result).not.toContain('block');
    expect(result).not.toContain('console.log');
    expect(result.length).toBeLessThan(input.length);
  });
});

describe('getStats', () => {
  test('calculates correct stats', () => {
    const original = 'const x = 1; // comment';
    const minified = 'const x=1;';
    const stats = getStats(original, minified);
    expect(stats.original).toBe(new TextEncoder().encode(original).length);
    expect(stats.minified).toBe(new TextEncoder().encode(minified).length);
    expect(stats.saved).toBe(stats.original - stats.minified);
    expect(stats.percent).toBeGreaterThan(0);
  });

  test('returns zero percent for empty input', () => {
    const stats = getStats('', '');
    expect(stats.percent).toBe(0);
    expect(stats.saved).toBe(0);
  });
});
