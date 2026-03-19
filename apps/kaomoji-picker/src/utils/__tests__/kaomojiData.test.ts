import { describe, it, expect } from 'vitest';
import { KAOMOJI_DATA, CATEGORIES, filterKaomoji } from '../kaomojiData';

describe('kaomojiData', () => {
  describe('data', () => {
    it('should have kaomoji entries', () => {
      expect(KAOMOJI_DATA.length).toBeGreaterThan(100);
    });

    it('should have categories', () => {
      expect(CATEGORIES.length).toBeGreaterThan(0);
    });

    it('every kaomoji should have a valid category', () => {
      for (const k of KAOMOJI_DATA) {
        expect(CATEGORIES).toContain(k.category);
      }
    });

    it('every kaomoji should have keywords', () => {
      for (const k of KAOMOJI_DATA) {
        expect(k.keywords.length).toBeGreaterThan(0);
      }
    });
  });

  describe('filterKaomoji', () => {
    it('returns all when no filter', () => {
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
});
