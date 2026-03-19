import { describe, it, expect } from 'vitest';
import {
  parseCSV,
  randomSample,
  systematicSample,
  toCSVString,
} from '../dataSampler';

describe('parseCSV', () => {
  it('parses simple CSV', () => {
    const result = parseCSV('a,b,c\n1,2,3\n4,5,6');
    expect(result).toEqual([
      ['a', 'b', 'c'],
      ['1', '2', '3'],
      ['4', '5', '6'],
    ]);
  });

  it('handles quoted fields', () => {
    const result = parseCSV('"hello, world",b\n1,2');
    expect(result[0][0]).toBe('hello, world');
  });

  it('handles empty input', () => {
    const result = parseCSV('');
    expect(result).toEqual([]);
  });

  it('handles CRLF line endings', () => {
    const result = parseCSV('a,b\r\n1,2');
    expect(result.length).toBe(2);
  });
});

describe('randomSample', () => {
  it('returns requested number of rows', () => {
    const data = [
      ['header1', 'header2'],
      ['1', 'a'],
      ['2', 'b'],
      ['3', 'c'],
      ['4', 'd'],
      ['5', 'e'],
    ];
    const result = randomSample(data, 3, true, 42);
    // Header + 3 data rows
    expect(result.length).toBe(4);
    expect(result[0]).toEqual(['header1', 'header2']);
  });

  it('does not exceed available rows', () => {
    const data = [['a'], ['b']];
    const result = randomSample(data, 10, false);
    expect(result.length).toBe(2);
  });

  it('is deterministic with seed', () => {
    const data = [['h'], ['1'], ['2'], ['3'], ['4'], ['5']];
    const r1 = randomSample(data, 2, true, 123);
    const r2 = randomSample(data, 2, true, 123);
    expect(r1).toEqual(r2);
  });
});

describe('systematicSample', () => {
  it('returns evenly spaced rows', () => {
    const data = [
      ['h'],
      ['1'],
      ['2'],
      ['3'],
      ['4'],
      ['5'],
      ['6'],
      ['7'],
      ['8'],
      ['9'],
      ['10'],
    ];
    const result = systematicSample(data, 3, true);
    // Header + 3 data rows
    expect(result.length).toBe(4);
    expect(result[0]).toEqual(['h']);
  });
});

describe('toCSVString', () => {
  it('converts data back to CSV string', () => {
    const data = [['a', 'b'], ['1', '2']];
    const result = toCSVString(data);
    expect(result).toBe('a,b\n1,2');
  });

  it('quotes fields containing commas', () => {
    const data = [['hello, world', 'b']];
    const result = toCSVString(data);
    expect(result).toBe('"hello, world",b');
  });
});
