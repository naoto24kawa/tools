import { describe, expect, test } from 'bun:test';
import { decodeHTMLEntities, encodeAllHTMLEntities, encodeHTMLEntities } from '../htmlEntity';

describe('htmlEntity', () => {
  describe('encodeHTMLEntities', () => {
    test('encodes basic entities', () => {
      expect(encodeHTMLEntities('<div class="test">')).toBe('&lt;div class=&quot;test&quot;&gt;');
    });

    test('encodes ampersand', () => {
      expect(encodeHTMLEntities('a & b')).toBe('a &amp; b');
    });

    test('encodes single quotes', () => {
      expect(encodeHTMLEntities("it's")).toBe('it&#039;s');
    });

    test('handles empty string', () => {
      expect(encodeHTMLEntities('')).toBe('');
    });

    test('preserves normal text', () => {
      expect(encodeHTMLEntities('hello world')).toBe('hello world');
    });
  });

  describe('encodeAllHTMLEntities', () => {
    test('encodes non-ASCII as numeric references', () => {
      const result = encodeAllHTMLEntities('hello');
      expect(result).toBe('hello');
    });

    test('encodes Japanese as numeric references', () => {
      const result = encodeAllHTMLEntities('\u3042');
      expect(result).toBe('&#12354;');
    });

    test('still uses named entities for common chars', () => {
      expect(encodeAllHTMLEntities('<')).toBe('&lt;');
    });
  });

  describe('decodeHTMLEntities', () => {
    test('decodes named entities', () => {
      expect(decodeHTMLEntities('&lt;div&gt;')).toBe('<div>');
    });

    test('decodes numeric decimal entities', () => {
      expect(decodeHTMLEntities('&#12354;')).toBe('\u3042');
    });

    test('decodes numeric hex entities', () => {
      expect(decodeHTMLEntities('&#x3042;')).toBe('\u3042');
    });

    test('handles mixed content', () => {
      expect(decodeHTMLEntities('&lt;p&gt;&#12354;&lt;/p&gt;')).toBe('<p>\u3042</p>');
    });

    test('handles empty string', () => {
      expect(decodeHTMLEntities('')).toBe('');
    });

    test('preserves unknown entities', () => {
      expect(decodeHTMLEntities('&unknown;')).toBe('&unknown;');
    });
  });

  describe('round-trip', () => {
    test('basic round-trip', () => {
      const original = '<div class="test">hello & world</div>';
      expect(decodeHTMLEntities(encodeHTMLEntities(original))).toBe(original);
    });
  });
});
