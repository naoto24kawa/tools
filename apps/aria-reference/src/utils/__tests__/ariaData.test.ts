import { describe, it, expect } from 'vitest';
import { ARIA_DATA, getCategories, filterAriaData } from '../ariaData';

describe('ARIA_DATA', () => {
  it('should contain entries', () => {
    expect(ARIA_DATA.length).toBeGreaterThan(30);
  });

  it('should have required fields for each entry', () => {
    for (const entry of ARIA_DATA) {
      expect(entry.name).toBeTruthy();
      expect(entry.type).toBeTruthy();
      expect(entry.category).toBeTruthy();
      expect(entry.description).toBeTruthy();
    }
  });
});

describe('getCategories', () => {
  it('should return unique categories', () => {
    const cats = getCategories();
    expect(cats.length).toBeGreaterThanOrEqual(4);
    expect(cats).toContain('landmark');
    expect(cats).toContain('widget');
    expect(cats).toContain('document');
  });
});

describe('filterAriaData', () => {
  it('should return all entries with empty query', () => {
    const result = filterAriaData('');
    expect(result.length).toBe(ARIA_DATA.length);
  });

  it('should filter by name', () => {
    const result = filterAriaData('button');
    expect(result.length).toBeGreaterThanOrEqual(1);
    expect(result.some((e) => e.name === 'button')).toBe(true);
  });

  it('should filter by category', () => {
    const result = filterAriaData('', 'landmark');
    expect(result.length).toBeGreaterThanOrEqual(1);
    expect(result.every((e) => e.category === 'landmark')).toBe(true);
  });

  it('should filter by type', () => {
    const result = filterAriaData('', undefined, 'state');
    expect(result.length).toBeGreaterThanOrEqual(1);
    expect(result.every((e) => e.type === 'state')).toBe(true);
  });

  it('should combine query and category', () => {
    const result = filterAriaData('nav', 'landmark');
    expect(result.length).toBeGreaterThanOrEqual(1);
  });
});
