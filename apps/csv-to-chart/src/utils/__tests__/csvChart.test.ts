import { describe, expect, test } from 'bun:test';
import { getMaxValue, parseCSV } from '../csvChart';

describe('csvChart', () => {
  test('parses CSV with headers', () => {
    const data = parseCSV('Month,Sales\nJan,100\nFeb,200');
    expect(data.labels).toEqual(['Jan', 'Feb']);
    expect(data.datasets[0].label).toBe('Sales');
    expect(data.datasets[0].values).toEqual([100, 200]);
  });

  test('multiple columns', () => {
    const data = parseCSV('Label,A,B\nx,1,2\ny,3,4');
    expect(data.datasets.length).toBe(2);
  });

  test('empty input', () => {
    const data = parseCSV('');
    expect(data.labels).toEqual([]);
  });

  test('header only', () => {
    const data = parseCSV('A,B');
    expect(data.labels).toEqual([]);
  });

  test('getMaxValue', () => {
    const data = parseCSV('L,V\na,10\nb,50\nc,30');
    expect(getMaxValue(data)).toBe(50);
  });

  test('getMaxValue empty returns 1', () => {
    expect(getMaxValue({ labels: [], datasets: [] })).toBe(1);
  });
});
