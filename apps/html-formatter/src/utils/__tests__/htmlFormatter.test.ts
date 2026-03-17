import { describe, expect, test } from 'vitest';
import { formatHtml, minifyHtml } from '../htmlFormatter';

describe('htmlFormatter', () => {
  test('formats simple HTML', () => {
    const result = formatHtml('<div><p>Hello</p></div>');
    expect(result).toContain('  <p>');
  });

  test('minifies HTML', () => {
    const result = minifyHtml('<div>\n  <p>Hello</p>\n</div>');
    expect(result).toBe('<div><p>Hello</p></div>');
  });

  test('handles void elements', () => {
    const result = formatHtml('<div><br><p>text</p></div>');
    expect(result).toContain('<br>');
  });

  test('handles empty input', () => {
    expect(formatHtml('')).toBe('');
    expect(minifyHtml('')).toBe('');
  });
});
