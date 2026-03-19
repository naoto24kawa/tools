import { describe, it, expect } from 'vitest';
import {
  ELEMENTS,
  filterElements,
  getElementById,
  getElementBySymbol,
  getGridPosition,
} from '../elements';

describe('ELEMENTS', () => {
  it('contains 118 elements', () => {
    expect(ELEMENTS).toHaveLength(118);
  });

  it('has correct first and last elements', () => {
    expect(ELEMENTS[0].symbol).toBe('H');
    expect(ELEMENTS[0].name).toBe('Hydrogen');
    expect(ELEMENTS[117].symbol).toBe('Og');
    expect(ELEMENTS[117].name).toBe('Oganesson');
  });
});

describe('filterElements', () => {
  it('filters by name', () => {
    const results = filterElements('carbon');
    expect(results.some((el) => el.symbol === 'C')).toBe(true);
  });

  it('filters by symbol', () => {
    const results = filterElements('Fe');
    expect(results.some((el) => el.name === 'Iron')).toBe(true);
  });

  it('filters by atomic number', () => {
    const results = filterElements('26');
    expect(results.some((el) => el.name === 'Iron')).toBe(true);
  });

  it('filters by category', () => {
    const results = filterElements('', 'noble-gas');
    expect(results.every((el) => el.category === 'noble-gas')).toBe(true);
    expect(results.length).toBe(7);
  });

  it('returns all elements with empty query', () => {
    expect(filterElements('')).toHaveLength(118);
  });
});

describe('getElementById', () => {
  it('finds element by number', () => {
    expect(getElementById(1)?.name).toBe('Hydrogen');
    expect(getElementById(79)?.name).toBe('Gold');
  });

  it('returns undefined for invalid number', () => {
    expect(getElementById(0)).toBeUndefined();
    expect(getElementById(119)).toBeUndefined();
  });
});

describe('getElementBySymbol', () => {
  it('finds element by symbol case-insensitive', () => {
    expect(getElementBySymbol('au')?.name).toBe('Gold');
    expect(getElementBySymbol('AU')?.name).toBe('Gold');
  });
});

describe('getGridPosition', () => {
  it('returns correct position for main group elements', () => {
    const hydrogen = getElementById(1)!;
    expect(getGridPosition(hydrogen)).toEqual({ row: 1, col: 1 });
  });

  it('returns lanthanide row for lanthanides', () => {
    const la = getElementById(57)!;
    expect(getGridPosition(la)).toEqual({ row: 9, col: 3 });
  });
});
