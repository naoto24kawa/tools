import { describe, it, expect } from 'vitest';
import { searchHeaders, HEADER_DATABASE } from '../headerDatabase';

describe('searchHeaders', () => {
  it('returns all headers with no filter', () => {
    const results = searchHeaders('');
    expect(results.length).toBe(HEADER_DATABASE.length);
  });

  it('searches by header name', () => {
    const results = searchHeaders('Content-Type');
    expect(results.some((h) => h.name === 'Content-Type')).toBe(true);
  });

  it('searches case-insensitively', () => {
    const results = searchHeaders('content-type');
    expect(results.some((h) => h.name === 'Content-Type')).toBe(true);
  });

  it('filters by category', () => {
    const results = searchHeaders('', 'Request');
    expect(results.every((h) => h.category === 'Request')).toBe(true);
    expect(results.length).toBeGreaterThan(0);
  });

  it('combines search and category filter', () => {
    const results = searchHeaders('Accept', 'Request');
    expect(results.length).toBeGreaterThan(0);
    expect(results.every((h) => h.category === 'Request')).toBe(true);
  });

  it('returns empty for non-matching query', () => {
    const results = searchHeaders('xyznonexistent');
    expect(results.length).toBe(0);
  });

  it('searches in description', () => {
    const results = searchHeaders('proxy');
    expect(results.length).toBeGreaterThan(0);
  });
});
