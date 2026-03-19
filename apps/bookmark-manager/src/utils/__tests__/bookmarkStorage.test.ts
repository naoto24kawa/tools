import { describe, it, expect, beforeEach } from 'vitest';
import {
  addBookmark,
  updateBookmark,
  deleteBookmark,
  getAllTags,
  filterBookmarks,
  exportAsJson,
  importFromJson,
  exportAsNetscapeHtml,
  importFromNetscapeHtml,
} from '../bookmarkStorage';
import type { Bookmark } from '../bookmarkStorage';

beforeEach(() => {
  localStorage.clear();
});

describe('addBookmark', () => {
  it('adds a bookmark', () => {
    const result = addBookmark([], 'https://example.com', 'Example', 'A site', ['web']);
    expect(result).toHaveLength(1);
    expect(result[0].url).toBe('https://example.com');
    expect(result[0].tags).toEqual(['web']);
  });
});

describe('updateBookmark', () => {
  it('updates bookmark properties', () => {
    const bm = addBookmark([], 'https://old.com', 'Old', '', []);
    const updated = updateBookmark(bm, bm[0].id, {
      url: 'https://new.com',
      title: 'New',
    });
    expect(updated[0].url).toBe('https://new.com');
    expect(updated[0].title).toBe('New');
  });
});

describe('deleteBookmark', () => {
  it('removes the bookmark', () => {
    const bm = addBookmark([], 'https://example.com', 'Example', '', []);
    const deleted = deleteBookmark(bm, bm[0].id);
    expect(deleted).toHaveLength(0);
  });
});

describe('getAllTags', () => {
  it('returns unique sorted tags', () => {
    let bm = addBookmark([], 'https://a.com', 'A', '', ['beta', 'alpha']);
    bm = addBookmark(bm, 'https://b.com', 'B', '', ['gamma', 'alpha']);
    expect(getAllTags(bm)).toEqual(['alpha', 'beta', 'gamma']);
  });
});

describe('filterBookmarks', () => {
  it('filters by search query', () => {
    let bm = addBookmark([], 'https://react.dev', 'React', '', []);
    bm = addBookmark(bm, 'https://vue.org', 'Vue', '', []);
    expect(filterBookmarks(bm, 'react', [])).toHaveLength(1);
  });

  it('filters by tags', () => {
    let bm = addBookmark([], 'https://a.com', 'A', '', ['js']);
    bm = addBookmark(bm, 'https://b.com', 'B', '', ['python']);
    expect(filterBookmarks(bm, '', ['js'])).toHaveLength(1);
  });

  it('returns all for empty filters', () => {
    let bm = addBookmark([], 'https://a.com', 'A', '', []);
    bm = addBookmark(bm, 'https://b.com', 'B', '', []);
    expect(filterBookmarks(bm, '', [])).toHaveLength(2);
  });
});

describe('JSON export/import', () => {
  it('round-trips data', () => {
    const bm = addBookmark([], 'https://example.com', 'Example', 'desc', ['tag1']);
    const json = exportAsJson(bm);
    const imported = importFromJson(json);
    expect(imported[0].title).toBe('Example');
    expect(imported[0].tags).toEqual(['tag1']);
  });

  it('throws on invalid JSON', () => {
    expect(() => importFromJson('not json')).toThrow();
  });
});

describe('Netscape HTML export/import', () => {
  it('exports and re-imports bookmarks', () => {
    let bm = addBookmark([], 'https://example.com', 'Example', 'A site', ['folder1']);
    bm = addBookmark(bm, 'https://test.com', 'Test', '', []);
    const html = exportAsNetscapeHtml(bm);
    expect(html).toContain('NETSCAPE-Bookmark-file-1');
    expect(html).toContain('https://example.com');

    const imported = importFromNetscapeHtml(html);
    expect(imported.length).toBeGreaterThanOrEqual(2);
  });
});
