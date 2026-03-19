import { describe, it, expect } from 'vitest';
import {
  searchAriaEntries,
  ariaDatabase,
  getCategories,
  getCategoryLabel,
} from '../ariaReference';

describe('ariaDatabase', () => {
  it('has entries', () => {
    expect(ariaDatabase.length).toBeGreaterThan(50);
  });

  it('each entry has required fields', () => {
    for (const entry of ariaDatabase) {
      expect(entry.name).toBeTruthy();
      expect(entry.type).toBeTruthy();
      expect(entry.category).toBeTruthy();
      expect(entry.description).toBeTruthy();
    }
  });
});

describe('searchAriaEntries', () => {
  it('returns all entries with empty query and no filter', () => {
    const results = searchAriaEntries('');
    expect(results.length).toBe(ariaDatabase.length);
  });

  it('filters by name', () => {
    const results = searchAriaEntries('button');
    expect(results.some((e) => e.name === 'button')).toBe(true);
  });

  it('filters by category', () => {
    const results = searchAriaEntries('', 'landmark');
    expect(results.every((e) => e.category === 'landmark')).toBe(true);
    expect(results.length).toBeGreaterThan(0);
  });

  it('filters by type', () => {
    const results = searchAriaEntries('', undefined, 'state');
    expect(results.every((e) => e.type === 'state')).toBe(true);
    expect(results.length).toBeGreaterThan(0);
  });

  it('combines query and category filter', () => {
    const results = searchAriaEntries('nav', 'landmark');
    expect(results.every((e) => e.category === 'landmark')).toBe(true);
    expect(results.some((e) => e.name === 'navigation')).toBe(true);
  });

  it('searches description', () => {
    const results = searchAriaEntries('checkbox');
    expect(results.length).toBeGreaterThan(0);
  });
});

describe('getCategories', () => {
  it('returns all categories', () => {
    const cats = getCategories();
    expect(cats).toContain('landmark');
    expect(cats).toContain('widget');
    expect(cats.length).toBe(5);
  });
});

describe('getCategoryLabel', () => {
  it('returns human-readable labels', () => {
    expect(getCategoryLabel('live-region')).toBe('Live Region');
    expect(getCategoryLabel('document-structure')).toBe('Document Structure');
  });
});
