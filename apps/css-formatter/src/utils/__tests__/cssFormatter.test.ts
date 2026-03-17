import { describe, expect, test } from 'vitest';
import { formatCss, minifyCss } from '../cssFormatter';

describe('cssFormatter', () => {
  test('formats simple CSS', () => {
    const result = formatCss('body{ color: red; margin: 0 }');
    expect(result).toContain('{\n');
    expect(result).toContain('color: red;');
  });

  test('minifies CSS', () => {
    const result = minifyCss('body {\n  color: red;\n  margin: 0;\n}');
    expect(result).toBe('body{color:red;margin:0;}');
  });

  test('handles empty input', () => {
    expect(formatCss('')).toBe('');
    expect(minifyCss('')).toBe('');
  });

  test('removes comments in minify', () => {
    const result = minifyCss('/* comment */ body { color: red; }');
    expect(result).not.toContain('comment');
  });
});
