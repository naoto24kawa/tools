import { describe, it, expect } from 'vitest';
import { parseCSV, createPivot } from '../pivotTable';

describe('parseCSV', () => {
  it('parses simple CSV', () => {
    const result = parseCSV('a,b,c\n1,2,3');
    expect(result).toEqual([
      ['a', 'b', 'c'],
      ['1', '2', '3'],
    ]);
  });

  it('handles quoted fields', () => {
    const result = parseCSV('name,desc\n"Alice","hello, world"');
    expect(result).toEqual([
      ['name', 'desc'],
      ['Alice', 'hello, world'],
    ]);
  });

  it('handles escaped double quotes', () => {
    const result = parseCSV('a\n"say ""hi"""');
    expect(result).toEqual([['a'], ['say "hi"']]);
  });

  it('handles empty input', () => {
    const result = parseCSV('');
    expect(result).toEqual([]);
  });

  it('skips empty rows', () => {
    const result = parseCSV('a,b\n\nc,d');
    expect(result).toEqual([
      ['a', 'b'],
      ['c', 'd'],
    ]);
  });

  it('handles CRLF line endings', () => {
    const result = parseCSV('a,b\r\n1,2');
    expect(result).toEqual([
      ['a', 'b'],
      ['1', '2'],
    ]);
  });
});

describe('createPivot', () => {
  const csvData = [
    ['Region', 'Product', 'Sales'],
    ['East', 'Widget', '100'],
    ['East', 'Gadget', '200'],
    ['West', 'Widget', '150'],
    ['West', 'Gadget', '300'],
  ];

  it('creates pivot with sum aggregation', () => {
    const result = createPivot(csvData, {
      rowField: 0,
      colField: 1,
      valueField: 2,
      aggregation: 'sum',
    });

    expect(result.rowLabels).toEqual(['East', 'West']);
    expect(result.headers).toEqual(['Gadget', 'Widget']);
    expect(result.data).toEqual([
      [200, 100],
      [300, 150],
    ]);
    expect(result.grandTotal).toBe(750);
  });

  it('creates pivot with count aggregation', () => {
    const result = createPivot(csvData, {
      rowField: 0,
      colField: 1,
      valueField: 2,
      aggregation: 'count',
    });

    expect(result.data).toEqual([
      [1, 1],
      [1, 1],
    ]);
  });

  it('creates pivot with avg aggregation', () => {
    const data = [
      ['Region', 'Product', 'Sales'],
      ['East', 'Widget', '100'],
      ['East', 'Widget', '200'],
    ];
    const result = createPivot(data, {
      rowField: 0,
      colField: 1,
      valueField: 2,
      aggregation: 'avg',
    });

    expect(result.data[0][0]).toBe(150);
  });

  it('handles empty data', () => {
    const result = createPivot([], {
      rowField: 0,
      colField: 1,
      valueField: 2,
      aggregation: 'sum',
    });
    expect(result.headers).toEqual([]);
    expect(result.rowLabels).toEqual([]);
  });

  it('handles null cells in data', () => {
    const data = [
      ['Region', 'Product', 'Sales'],
      ['East', 'Widget', '100'],
      ['West', 'Gadget', '200'],
    ];
    const result = createPivot(data, {
      rowField: 0,
      colField: 1,
      valueField: 2,
      aggregation: 'sum',
    });

    expect(result.data[0][0]).toBeNull();
    expect(result.data[1][1]).toBeNull();
  });

  it('calculates row totals correctly', () => {
    const result = createPivot(csvData, {
      rowField: 0,
      colField: 1,
      valueField: 2,
      aggregation: 'sum',
    });

    expect(result.rowTotals[0]).toBe(300);
    expect(result.rowTotals[1]).toBe(450);
  });

  it('calculates column totals correctly', () => {
    const result = createPivot(csvData, {
      rowField: 0,
      colField: 1,
      valueField: 2,
      aggregation: 'sum',
    });

    expect(result.colTotals[0]).toBe(500);
    expect(result.colTotals[1]).toBe(250);
  });

  it('creates pivot with min aggregation', () => {
    const data = [
      ['Region', 'Product', 'Sales'],
      ['East', 'Widget', '100'],
      ['East', 'Widget', '200'],
      ['East', 'Widget', '50'],
    ];
    const result = createPivot(data, {
      rowField: 0,
      colField: 1,
      valueField: 2,
      aggregation: 'min',
    });

    expect(result.data[0][0]).toBe(50);
  });

  it('creates pivot with max aggregation', () => {
    const data = [
      ['Region', 'Product', 'Sales'],
      ['East', 'Widget', '100'],
      ['East', 'Widget', '200'],
      ['East', 'Widget', '50'],
    ];
    const result = createPivot(data, {
      rowField: 0,
      colField: 1,
      valueField: 2,
      aggregation: 'max',
    });

    expect(result.data[0][0]).toBe(200);
  });
});
