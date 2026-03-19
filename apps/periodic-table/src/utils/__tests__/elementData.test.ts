import { describe, it, expect } from 'vitest';
import {
  elements,
  searchElements,
  getElementByNumber,
  getElementBySymbol,
  getGridPosition,
  CATEGORY_LABELS,
  CATEGORY_COLORS,
} from '../elementData';

describe('elementData', () => {
  describe('elements', () => {
    it('has 118 elements', () => {
      expect(elements.length).toBe(118);
    });

    it('starts with Hydrogen', () => {
      expect(elements[0].symbol).toBe('H');
      expect(elements[0].name).toBe('Hydrogen');
      expect(elements[0].number).toBe(1);
    });

    it('ends with Oganesson', () => {
      expect(elements[117].symbol).toBe('Og');
      expect(elements[117].name).toBe('Oganesson');
      expect(elements[117].number).toBe(118);
    });

    it('each element has required fields', () => {
      for (const el of elements) {
        expect(el.number).toBeGreaterThan(0);
        expect(el.symbol.length).toBeGreaterThan(0);
        expect(el.name.length).toBeGreaterThan(0);
        expect(el.mass).toBeGreaterThan(0);
        expect(el.category.length).toBeGreaterThan(0);
        expect(el.electronConfig.length).toBeGreaterThan(0);
        expect(el.group).toBeGreaterThanOrEqual(1);
        expect(el.period).toBeGreaterThanOrEqual(1);
        expect(el.state.length).toBeGreaterThan(0);
      }
    });

    it('has unique atomic numbers', () => {
      const numbers = elements.map((el) => el.number);
      expect(new Set(numbers).size).toBe(118);
    });

    it('has unique symbols', () => {
      const symbols = elements.map((el) => el.symbol);
      expect(new Set(symbols).size).toBe(118);
    });
  });

  describe('searchElements', () => {
    it('finds element by name', () => {
      const results = searchElements('hydrogen');
      expect(results.length).toBe(1);
      expect(results[0].symbol).toBe('H');
    });

    it('finds element by symbol', () => {
      const results = searchElements('Fe');
      expect(results.length).toBeGreaterThanOrEqual(1);
      expect(results.some((el) => el.name === 'Iron' && el.symbol === 'Fe')).toBe(true);
    });

    it('finds element by number', () => {
      const results = searchElements('79');
      expect(results.length).toBe(1);
      expect(results[0].name).toBe('Gold');
    });

    it('filters by category', () => {
      const results = searchElements('', 'noble-gas');
      expect(results.length).toBe(7); // He, Ne, Ar, Kr, Xe, Rn, Og
      expect(results.every((el) => el.category === 'noble-gas')).toBe(true);
    });

    it('combines search and filter', () => {
      const results = searchElements('i', 'halogen');
      expect(results.some((el) => el.name === 'Iodine')).toBe(true);
    });

    it('returns all elements for empty query', () => {
      expect(searchElements('')).toHaveLength(118);
    });
  });

  describe('getElementByNumber', () => {
    it('finds element by number', () => {
      expect(getElementByNumber(1)?.name).toBe('Hydrogen');
      expect(getElementByNumber(79)?.name).toBe('Gold');
    });

    it('returns undefined for invalid number', () => {
      expect(getElementByNumber(0)).toBeUndefined();
      expect(getElementByNumber(119)).toBeUndefined();
    });
  });

  describe('getElementBySymbol', () => {
    it('finds element by symbol', () => {
      expect(getElementBySymbol('Au')?.name).toBe('Gold');
      expect(getElementBySymbol('au')?.name).toBe('Gold');
    });

    it('returns undefined for invalid symbol', () => {
      expect(getElementBySymbol('Xx')).toBeUndefined();
    });
  });

  describe('getGridPosition', () => {
    it('places H at row 1, col 1', () => {
      const pos = getGridPosition(elements[0]);
      expect(pos).toEqual({ row: 1, col: 1 });
    });

    it('places He at row 1, col 18', () => {
      const pos = getGridPosition(elements[1]);
      expect(pos).toEqual({ row: 1, col: 18 });
    });

    it('places lanthanides in row 9', () => {
      const la = elements.find((el) => el.symbol === 'La')!;
      const pos = getGridPosition(la);
      expect(pos.row).toBe(9);
    });

    it('places actinides in row 10', () => {
      const ac = elements.find((el) => el.symbol === 'Ac')!;
      const pos = getGridPosition(ac);
      expect(pos.row).toBe(10);
    });
  });

  describe('constants', () => {
    it('has labels for all categories', () => {
      expect(Object.keys(CATEGORY_LABELS).length).toBe(10);
    });

    it('has colors for all categories', () => {
      expect(Object.keys(CATEGORY_COLORS).length).toBe(10);
    });
  });
});
