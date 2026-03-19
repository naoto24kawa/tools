import { describe, expect, it, beforeEach } from 'vitest';
import {
  KAOMOJI_DATABASE,
  CATEGORIES,
  searchKaomojis,
  filterByCategory,
  getRecentKaomojis,
  addRecentKaomoji,
} from '../kaomojiData';

describe('KAOMOJI_DATABASE', () => {
  it('has at least 150 kaomojis', () => {
    expect(KAOMOJI_DATABASE.length).toBeGreaterThanOrEqual(150);
  });

  it('covers all categories', () => {
    for (const cat of CATEGORIES) {
      const count = KAOMOJI_DATABASE.filter((k) => k.category === cat).length;
      expect(count).toBeGreaterThan(0);
    }
  });

  it('each kaomoji has required fields', () => {
    for (const kaomoji of KAOMOJI_DATABASE) {
      expect(kaomoji.text).toBeTruthy();
      expect(kaomoji.keywords.length).toBeGreaterThan(0);
      expect(CATEGORIES).toContain(kaomoji.category);
    }
  });
});

describe('searchKaomojis', () => {
  it('returns all kaomojis for empty query', () => {
    expect(searchKaomojis('')).toHaveLength(KAOMOJI_DATABASE.length);
  });

  it('finds kaomojis by keyword', () => {
    const results = searchKaomojis('happy');
    expect(results.length).toBeGreaterThan(0);
  });

  it('is case insensitive', () => {
    const upper = searchKaomojis('CAT');
    const lower = searchKaomojis('cat');
    expect(upper).toEqual(lower);
  });

  it('returns empty for no matches', () => {
    const results = searchKaomojis('xyznonexistent');
    expect(results).toHaveLength(0);
  });
});

describe('filterByCategory', () => {
  it('filters by happy category', () => {
    const results = filterByCategory('happy');
    expect(results.length).toBeGreaterThan(0);
    expect(results.every((k) => k.category === 'happy')).toBe(true);
  });

  it('filters by table-flip category', () => {
    const results = filterByCategory('table-flip');
    expect(results.length).toBeGreaterThan(0);
    expect(results.every((k) => k.category === 'table-flip')).toBe(true);
  });
});

describe('recent kaomojis', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('returns empty array when no recent kaomojis', () => {
    expect(getRecentKaomojis()).toEqual([]);
  });

  it('adds and retrieves recent kaomojis', () => {
    addRecentKaomoji('(^_^)');
    addRecentKaomoji('(T_T)');
    const recent = getRecentKaomojis();
    expect(recent).toHaveLength(2);
    expect(recent[0]).toBe('(T_T)');
    expect(recent[1]).toBe('(^_^)');
  });

  it('deduplicates recent kaomojis', () => {
    addRecentKaomoji('(^_^)');
    addRecentKaomoji('(T_T)');
    addRecentKaomoji('(^_^)');
    const recent = getRecentKaomojis();
    expect(recent).toHaveLength(2);
    expect(recent[0]).toBe('(^_^)');
  });
});
