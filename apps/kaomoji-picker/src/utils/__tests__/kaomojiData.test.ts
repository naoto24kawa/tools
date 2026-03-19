import { describe, expect, it } from 'vitest';
import {
  KAOMOJI_DATA,
  CATEGORIES,
  filterKaomoji,
} from '../kaomojiData';

describe('KAOMOJI_DATA', () => {
  it('has at least 150 kaomojis', () => {
    expect(KAOMOJI_DATA.length).toBeGreaterThanOrEqual(150);
  });

  it('covers all categories', () => {
    for (const cat of CATEGORIES) {
      const count = KAOMOJI_DATA.filter((k) => k.category === cat).length;
      expect(count).toBeGreaterThan(0);
    }
  });

  it('each kaomoji has required fields', () => {
    for (const kaomoji of KAOMOJI_DATA) {
      expect(kaomoji.text).toBeTruthy();
      expect(kaomoji.keywords.length).toBeGreaterThan(0);
      expect(CATEGORIES).toContain(kaomoji.category);
    }
  });
});

describe('CATEGORIES', () => {
  it('has categories', () => {
    expect(CATEGORIES.length).toBeGreaterThan(0);
  });

  it('includes expected categories', () => {
    expect(CATEGORIES).toContain('Happy');
    expect(CATEGORIES).toContain('Sad');
    expect(CATEGORIES).toContain('Angry');
    expect(CATEGORIES).toContain('Animals');
  });
});

describe('filterKaomoji', () => {
  it('returns all kaomojis with no filter', () => {
    const result = filterKaomoji(KAOMOJI_DATA, '', 'All');
    expect(result.length).toBe(KAOMOJI_DATA.length);
  });

  it('filters by category', () => {
    const result = filterKaomoji(KAOMOJI_DATA, '', 'Happy');
    expect(result.length).toBeGreaterThan(0);
    expect(result.every((k) => k.category === 'Happy')).toBe(true);
  });

  it('filters by search term in keywords', () => {
    const result = filterKaomoji(KAOMOJI_DATA, 'crying', 'All');
    expect(result.length).toBeGreaterThan(0);
  });

  it('is case insensitive', () => {
    const upper = filterKaomoji(KAOMOJI_DATA, 'CAT', 'All');
    const lower = filterKaomoji(KAOMOJI_DATA, 'cat', 'All');
    expect(upper).toEqual(lower);
  });

  it('returns empty array for no matches', () => {
    const result = filterKaomoji(KAOMOJI_DATA, 'xyznonexistent', 'All');
    expect(result.length).toBe(0);
  });

  it('combines category and search filters', () => {
    const result = filterKaomoji(KAOMOJI_DATA, 'smile', 'Happy');
    expect(result.length).toBeGreaterThan(0);
    expect(result.every((k) => k.category === 'Happy')).toBe(true);
  });
});
