import { describe, expect, it, beforeEach, vi } from 'vitest';
import {
  EMOJI_DATABASE,
  CATEGORIES,
  searchEmojis,
  filterByCategory,
  getRecentEmojis,
  addRecentEmoji,
} from '../emojiData';

// Mock localStorage for Node test environment
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] ?? null,
    setItem: (key: string, value: string) => { store[key] = value; },
    removeItem: (key: string) => { delete store[key]; },
    clear: () => { store = {}; },
  };
})();

vi.stubGlobal('localStorage', localStorageMock);

describe('EMOJI_DATABASE', () => {
  it('has at least 400 emojis', () => {
    expect(EMOJI_DATABASE.length).toBeGreaterThanOrEqual(400);
  });

  it('covers all categories', () => {
    for (const cat of CATEGORIES) {
      const count = EMOJI_DATABASE.filter((e) => e.category === cat).length;
      expect(count).toBeGreaterThan(0);
    }
  });

  it('each emoji has required fields', () => {
    for (const emoji of EMOJI_DATABASE) {
      expect(emoji.emoji).toBeTruthy();
      expect(emoji.name).toBeTruthy();
      expect(emoji.keywords.length).toBeGreaterThan(0);
      expect(CATEGORIES).toContain(emoji.category);
    }
  });
});

describe('searchEmojis', () => {
  it('returns all emojis for empty query', () => {
    expect(searchEmojis('')).toHaveLength(EMOJI_DATABASE.length);
  });

  it('finds emojis by name', () => {
    const results = searchEmojis('dog');
    expect(results.length).toBeGreaterThan(0);
    expect(results.some((e) => e.name.includes('dog'))).toBe(true);
  });

  it('finds emojis by keyword', () => {
    const results = searchEmojis('happy');
    expect(results.length).toBeGreaterThan(0);
  });

  it('is case insensitive', () => {
    const upper = searchEmojis('DOG');
    const lower = searchEmojis('dog');
    expect(upper).toEqual(lower);
  });
});

describe('filterByCategory', () => {
  it('filters by Smileys', () => {
    const results = filterByCategory('Smileys');
    expect(results.length).toBeGreaterThan(0);
    expect(results.every((e) => e.category === 'Smileys')).toBe(true);
  });

  it('filters by Flags', () => {
    const results = filterByCategory('Flags');
    expect(results.length).toBeGreaterThan(0);
    expect(results.every((e) => e.category === 'Flags')).toBe(true);
  });
});

describe('recent emojis', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('returns empty array when no recent emojis', () => {
    expect(getRecentEmojis()).toEqual([]);
  });

  it('adds and retrieves recent emojis', () => {
    addRecentEmoji('\u{1F600}');
    addRecentEmoji('\u{1F601}');
    const recent = getRecentEmojis();
    expect(recent).toHaveLength(2);
    expect(recent[0]).toBe('\u{1F601}');
    expect(recent[1]).toBe('\u{1F600}');
  });

  it('deduplicates recent emojis', () => {
    addRecentEmoji('\u{1F600}');
    addRecentEmoji('\u{1F601}');
    addRecentEmoji('\u{1F600}');
    const recent = getRecentEmojis();
    expect(recent).toHaveLength(2);
    expect(recent[0]).toBe('\u{1F600}');
  });
});
