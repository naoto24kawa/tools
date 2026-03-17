import { describe, expect, test } from 'bun:test';
import type { MinifyOptions } from '../htmlMinifier';
import { DEFAULT_OPTIONS, getStats, minifyHtml } from '../htmlMinifier';

describe('htmlMinifier', () => {
  describe('minifyHtml', () => {
    test('should remove HTML comments', () => {
      const input = '<div><!-- This is a comment --><p>Hello</p></div>';
      const result = minifyHtml(input, { ...DEFAULT_OPTIONS, collapseWhitespace: false });
      expect(result).toBe('<div><p>Hello</p></div>');
    });

    test('should collapse whitespace', () => {
      const input = '<div>  <p>  Hello   World  </p>  </div>';
      const result = minifyHtml(input, {
        ...DEFAULT_OPTIONS,
        removeComments: false,
        removeEmptyAttributes: false,
      });
      expect(result).toBe('<div><p> Hello World </p></div>');
    });

    test('should remove empty attributes', () => {
      const input = '<div class="" id="" style="">content</div>';
      const result = minifyHtml(input, {
        ...DEFAULT_OPTIONS,
        removeComments: false,
        collapseWhitespace: false,
      });
      expect(result).toBe('<div>content</div>');
    });

    test('should apply all options together', () => {
      const input = '<!-- comment -->\n<div class="">\n  <p>  Hello  </p>\n</div>';
      const result = minifyHtml(input, DEFAULT_OPTIONS);
      expect(result).toBe('<div><p> Hello </p></div>');
    });

    test('should return empty string for empty input', () => {
      const result = minifyHtml('', DEFAULT_OPTIONS);
      expect(result).toBe('');
    });

    test('should handle input with no transformations needed', () => {
      const allOff: MinifyOptions = {
        removeComments: false,
        collapseWhitespace: false,
        removeEmptyAttributes: false,
        removeOptionalTags: false,
      };
      const input = '<div>Hello</div>';
      expect(minifyHtml(input, allOff)).toBe('<div>Hello</div>');
    });
  });

  describe('getStats', () => {
    test('should calculate correct byte sizes', () => {
      const original = '<div>  Hello  </div>';
      const minified = '<div>Hello</div>';
      const stats = getStats(original, minified);
      expect(stats.original).toBe(new TextEncoder().encode(original).length);
      expect(stats.minified).toBe(new TextEncoder().encode(minified).length);
      expect(stats.saved).toBe(stats.original - stats.minified);
      expect(stats.percent).toBeGreaterThan(0);
    });

    test('should return 0 percent for empty original', () => {
      const stats = getStats('', '');
      expect(stats.percent).toBe(0);
    });

    test('should handle multibyte characters', () => {
      const original = '<p>  こんにちは  </p>';
      const minified = '<p>こんにちは</p>';
      const stats = getStats(original, minified);
      expect(stats.original).toBeGreaterThan(stats.minified);
      expect(stats.saved).toBeGreaterThan(0);
    });
  });
});
