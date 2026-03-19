import { describe, expect, it, beforeEach, vi } from 'vitest';
import {
  search,
  filterByLanguage,
  filterByTag,
  exportSnippets,
  importSnippets,
  getAllLanguages,
  getAllTags,
  type Snippet,
} from '../snippetStorage';

const mockSnippets: Snippet[] = [
  {
    id: '1',
    title: 'Hello World',
    language: 'JavaScript',
    tags: ['basics', 'tutorial'],
    code: 'console.log("Hello World");',
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z',
  },
  {
    id: '2',
    title: 'Fetch API',
    language: 'TypeScript',
    tags: ['api', 'async'],
    code: 'const res = await fetch(url);',
    createdAt: '2024-01-02T00:00:00.000Z',
    updatedAt: '2024-01-02T00:00:00.000Z',
  },
  {
    id: '3',
    title: 'Python Print',
    language: 'Python',
    tags: ['basics'],
    code: 'print("Hello")',
    createdAt: '2024-01-03T00:00:00.000Z',
    updatedAt: '2024-01-03T00:00:00.000Z',
  },
];

describe('search', () => {
  it('returns all for empty query', () => {
    expect(search('', mockSnippets)).toHaveLength(3);
  });

  it('searches by title', () => {
    const result = search('World', mockSnippets);
    expect(result).toHaveLength(1);
    expect(result[0].title).toBe('Hello World');
  });

  it('searches by language', () => {
    const result = search('TypeScript', mockSnippets);
    expect(result).toHaveLength(1);
    expect(result[0].title).toBe('Fetch API');
  });

  it('searches by tag', () => {
    const result = search('basics', mockSnippets);
    expect(result).toHaveLength(2);
  });

  it('searches by code content', () => {
    const result = search('console.log', mockSnippets);
    expect(result).toHaveLength(1);
  });

  it('is case-insensitive', () => {
    const result = search('hello', mockSnippets);
    // Matches "Hello World" title and Python's print("Hello") code
    expect(result).toHaveLength(2);
  });
});

describe('filterByLanguage', () => {
  it('returns all for empty language', () => {
    expect(filterByLanguage('', mockSnippets)).toHaveLength(3);
  });

  it('filters by language', () => {
    const result = filterByLanguage('JavaScript', mockSnippets);
    expect(result).toHaveLength(1);
    expect(result[0].language).toBe('JavaScript');
  });
});

describe('filterByTag', () => {
  it('returns all for empty tag', () => {
    expect(filterByTag('', mockSnippets)).toHaveLength(3);
  });

  it('filters by tag', () => {
    const result = filterByTag('api', mockSnippets);
    expect(result).toHaveLength(1);
    expect(result[0].title).toBe('Fetch API');
  });
});

describe('exportSnippets', () => {
  it('exports to JSON string', () => {
    const result = exportSnippets(mockSnippets);
    const parsed = JSON.parse(result);
    expect(parsed).toHaveLength(3);
    expect(parsed[0].title).toBe('Hello World');
  });
});

describe('importSnippets', () => {
  it('imports valid JSON', () => {
    const json = JSON.stringify(mockSnippets);
    const result = importSnippets(json);
    expect(result).toHaveLength(3);
  });

  it('returns null for invalid JSON', () => {
    expect(importSnippets('not json')).toBeNull();
  });

  it('returns null for non-array JSON', () => {
    expect(importSnippets('{"key": "value"}')).toBeNull();
  });

  it('returns null for array with invalid items', () => {
    expect(importSnippets('[{"invalid": true}]')).toBeNull();
  });
});

describe('getAllLanguages', () => {
  it('returns sorted unique languages', () => {
    const result = getAllLanguages(mockSnippets);
    expect(result).toEqual(['JavaScript', 'Python', 'TypeScript']);
  });
});

describe('getAllTags', () => {
  it('returns sorted unique tags', () => {
    const result = getAllTags(mockSnippets);
    expect(result).toEqual(['api', 'async', 'basics', 'tutorial']);
  });
});
