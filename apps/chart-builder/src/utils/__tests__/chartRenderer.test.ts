import { describe, expect, it } from 'vitest';
import { parseTableData, getDefaultColor } from '../chartRenderer';

describe('parseTableData', () => {
  it('parses label,value pairs', () => {
    const result = parseTableData('Jan, 100\nFeb, 200\nMar, 150');
    expect(result.labels).toEqual(['Jan', 'Feb', 'Mar']);
    expect(result.values).toEqual([100, 200, 150]);
    expect(result.colors).toHaveLength(3);
  });

  it('handles empty input', () => {
    const result = parseTableData('');
    expect(result.labels).toHaveLength(0);
    expect(result.values).toHaveLength(0);
  });

  it('handles custom colors', () => {
    const result = parseTableData('A, 10, #ff0000\nB, 20, #00ff00');
    expect(result.colors[0]).toBe('#ff0000');
    expect(result.colors[1]).toBe('#00ff00');
  });

  it('uses default colors when not specified', () => {
    const result = parseTableData('A, 10\nB, 20');
    expect(result.colors[0]).toBe(getDefaultColor(0));
    expect(result.colors[1]).toBe(getDefaultColor(1));
  });

  it('handles invalid number as 0', () => {
    const result = parseTableData('A, abc');
    expect(result.values[0]).toBe(0);
  });

  it('skips lines with insufficient parts', () => {
    const result = parseTableData('JustALabel\nA, 10');
    expect(result.labels).toEqual(['A']);
    expect(result.values).toEqual([10]);
  });
});

describe('getDefaultColor', () => {
  it('returns a color string', () => {
    const color = getDefaultColor(0);
    expect(color).toMatch(/^#/);
  });

  it('wraps around for large indices', () => {
    const c0 = getDefaultColor(0);
    const c12 = getDefaultColor(12);
    expect(c0).toBe(c12);
  });
});
