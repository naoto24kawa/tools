import { describe, expect, test } from 'vitest';
import { filterStatusCodes, getCategories, HTTP_STATUS_CODES } from '../httpStatus';

describe('httpStatus', () => {
  test('has common status codes', () => {
    expect(HTTP_STATUS_CODES.find((c) => c.code === 200)).toBeDefined();
    expect(HTTP_STATUS_CODES.find((c) => c.code === 404)).toBeDefined();
    expect(HTTP_STATUS_CODES.find((c) => c.code === 500)).toBeDefined();
  });

  test('filter by code number', () => {
    const result = filterStatusCodes(HTTP_STATUS_CODES, '404', '');
    expect(result.length).toBe(1);
    expect(result[0].code).toBe(404);
  });

  test('filter by name', () => {
    const result = filterStatusCodes(HTTP_STATUS_CODES, 'not found', '');
    expect(result.length).toBe(1);
  });

  test('filter by category', () => {
    const result = filterStatusCodes(HTTP_STATUS_CODES, '', '2xx Success');
    for (const c of result) {
      expect(c.category).toBe('2xx Success');
    }
  });

  test('filter combined', () => {
    const result = filterStatusCodes(HTTP_STATUS_CODES, 'error', '5xx Server Error');
    expect(result.length).toBeGreaterThan(0);
    for (const c of result) {
      expect(c.category).toBe('5xx Server Error');
    }
  });

  test('no results for unknown query', () => {
    expect(filterStatusCodes(HTTP_STATUS_CODES, 'xyzxyz', '').length).toBe(0);
  });

  test('getCategories returns unique categories', () => {
    const cats = getCategories(HTTP_STATUS_CODES);
    expect(cats.length).toBe(5);
    expect(cats).toContain('2xx Success');
  });
});
