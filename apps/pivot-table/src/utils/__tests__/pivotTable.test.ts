import { describe, it, expect } from 'vitest';
import { parseCSV, createPivot } from '../pivotTable';

describe('pivotTable', () => {
  describe('parseCSV', () => {
    it('parses simple CSV', () => {
      const result = parseCSV('a,b,c\n1,2,3');
      expect(result).toEqual([['a', 'b', 'c'], ['1', '2', '3']]);
    });

    it('handles quoted fields', () => {
      const result = parseCSV('"a,b",c\nd,e');
      expect(result).toEqual([['a,b', 'c'], ['d', 'e']]);
    });
  });

  describe('createPivot', () => {
    const csv = [
      ['Region', 'Product', 'Sales'],
      ['East', 'Widget', '100'],
      ['East', 'Gadget', '200'],
      ['West', 'Widget', '150'],
      ['West', 'Gadget', '300'],
    ];

    it('creates pivot with sum aggregation', () => {
      const result = createPivot(csv, {
        rowField: 0,
        colField: 1,
        valueField: 2,
        aggregation: 'sum',
      });

      expect(result.rowLabels).toContain('East');
      expect(result.rowLabels).toContain('West');
      expect(result.headers).toContain('Gadget');
      expect(result.headers).toContain('Widget');
      expect(result.data.length).toBe(2);
    });

    it('creates pivot with count aggregation', () => {
      const result = createPivot(csv, {
        rowField: 0,
        colField: 1,
        valueField: 2,
        aggregation: 'count',
      });

      // Each cell should be 1 (one entry per region-product combo)
      for (const row of result.data) {
        for (const val of row) {
          if (val !== null) {
            expect(val).toBe(1);
          }
        }
      }
    });

    it('handles empty data', () => {
      const result = createPivot([['A', 'B', 'C']], {
        rowField: 0,
        colField: 1,
        valueField: 2,
        aggregation: 'sum',
      });

      expect(result.headers).toEqual([]);
      expect(result.rowLabels).toEqual([]);
    });

    it('calculates grand total', () => {
      const result = createPivot(csv, {
        rowField: 0,
        colField: 1,
        valueField: 2,
        aggregation: 'sum',
      });

      expect(result.grandTotal).toBe(750); // 100+200+150+300
    });
  });
});
