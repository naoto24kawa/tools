import { describe, expect, it } from 'vitest';
import {
  parseInput,
  generateHorizontalChart,
  generateVerticalChart,
} from '../asciiChart';

describe('parseInput', () => {
  it('parses comma-separated label,value pairs', () => {
    const result = parseInput('Apples, 10\nBananas, 20\nOranges, 15');
    expect(result).toHaveLength(3);
    expect(result[0]).toEqual({ label: 'Apples', value: 10 });
    expect(result[1]).toEqual({ label: 'Bananas', value: 20 });
    expect(result[2]).toEqual({ label: 'Oranges', value: 15 });
  });

  it('skips invalid lines', () => {
    const result = parseInput('Valid, 10\nInvalid\n, NaN\nAlso Valid, 5');
    expect(result).toHaveLength(2);
  });

  it('handles empty input', () => {
    const result = parseInput('');
    expect(result).toHaveLength(0);
  });

  it('handles decimal values', () => {
    const result = parseInput('A, 3.14');
    expect(result[0].value).toBeCloseTo(3.14);
  });

  it('handles negative values', () => {
    const result = parseInput('A, -5');
    expect(result[0].value).toBe(-5);
  });
});

describe('generateHorizontalChart', () => {
  it('generates horizontal bar chart', () => {
    const data = [
      { label: 'A', value: 10 },
      { label: 'B', value: 20 },
    ];
    const result = generateHorizontalChart(data);
    expect(result).toContain('A');
    expect(result).toContain('B');
    expect(result).toContain('|');
    // B should have longer bar since value is higher
    const lines = result.split('\n');
    const aBar = lines[0].split('|')[1];
    const bBar = lines[1].split('|')[1];
    expect(bBar.length).toBeGreaterThan(aBar.length);
  });

  it('shows values when showValues is true', () => {
    const data = [{ label: 'A', value: 42 }];
    const result = generateHorizontalChart(data, { showValues: true });
    expect(result).toContain('(42)');
  });

  it('hides values when showValues is false', () => {
    const data = [{ label: 'A', value: 42 }];
    const result = generateHorizontalChart(data, { showValues: false });
    expect(result).not.toContain('(42)');
  });

  it('uses custom bar character', () => {
    const data = [{ label: 'A', value: 10 }];
    const result = generateHorizontalChart(data, { barChar: '*' });
    expect(result).toContain('*');
    expect(result).not.toContain('#');
  });

  it('returns message for empty data', () => {
    expect(generateHorizontalChart([])).toBe('No data to display');
  });
});

describe('generateVerticalChart', () => {
  it('generates vertical bar chart', () => {
    const data = [
      { label: 'A', value: 10 },
      { label: 'B', value: 20 },
    ];
    const result = generateVerticalChart(data);
    expect(result).toContain('A');
    expect(result).toContain('B');
    expect(result.split('\n').length).toBeGreaterThan(3);
  });

  it('returns message for empty data', () => {
    expect(generateVerticalChart([])).toBe('No data to display');
  });
});
