import { describe, expect, test } from 'vitest';
import { DEFAULT_OPTIONS, getStats, minifyCss } from '../cssMinifier';

describe('CSS Minifier Utils', () => {
  describe('minifyCss', () => {
    test('should remove comments', () => {
      const input = '/* comment */ body { color: red; }';
      const result = minifyCss(input, {
        ...DEFAULT_OPTIONS,
        removeWhitespace: false,
        shortenColors: false,
        removeLastSemicolon: false,
      });
      expect(result).toBe('body { color: red; }');
    });

    test('should remove whitespace and collapse spaces', () => {
      const input = `body {
  color: red;
  margin: 0;
}`;
      const result = minifyCss(input, {
        ...DEFAULT_OPTIONS,
        removeComments: false,
        shortenColors: false,
        removeLastSemicolon: false,
      });
      expect(result).toBe('body{color:red;margin:0;}');
    });

    test('should shorten hex colors like #aabbcc to #abc', () => {
      const input = 'body{color:#aabbcc;background:#112233}';
      const result = minifyCss(input, {
        ...DEFAULT_OPTIONS,
        removeComments: false,
        removeWhitespace: false,
        removeLastSemicolon: false,
      });
      expect(result).toBe('body{color:#abc;background:#123}');
    });

    test('should remove last semicolon before closing brace', () => {
      const input = 'body{color:red;margin:0;}';
      const result = minifyCss(input, {
        ...DEFAULT_OPTIONS,
        removeComments: false,
        removeWhitespace: false,
        shortenColors: false,
      });
      expect(result).toBe('body{color:red;margin:0}');
    });

    test('should apply all options together', () => {
      const input = `/* Reset */
body {
  color: #ffffff;
  background: #000000;
  margin: 0;
}

/* Links */
a {
  color: #aabbcc;
}`;
      const result = minifyCss(input);
      expect(result).toBe('body{color:#fff;background:#000;margin:0}a{color:#abc}');
    });

    test('should handle empty input', () => {
      expect(minifyCss('')).toBe('');
    });

    test('should not shorten non-matching hex colors', () => {
      const input = 'body{color:#abcdef}';
      const result = minifyCss(input, {
        ...DEFAULT_OPTIONS,
        removeComments: false,
        removeWhitespace: false,
        removeLastSemicolon: false,
      });
      expect(result).toBe('body{color:#abcdef}');
    });
  });

  describe('getStats', () => {
    test('should calculate correct stats', () => {
      const original = 'body { color: red; }';
      const minified = 'body{color:red}';
      const stats = getStats(original, minified);
      expect(stats.original).toBe(20);
      expect(stats.minified).toBe(15);
      expect(stats.saved).toBe(5);
      expect(stats.percent).toBe(25);
    });

    test('should return 0 percent for empty original', () => {
      const stats = getStats('', '');
      expect(stats.percent).toBe(0);
      expect(stats.saved).toBe(0);
    });
  });
});
