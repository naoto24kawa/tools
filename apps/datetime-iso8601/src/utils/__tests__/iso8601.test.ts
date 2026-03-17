import { describe, expect, test } from 'vitest';
import { dateToISO8601, formatISO8601Variants, iso8601ToDate } from '../iso8601';

describe('iso8601', () => {
  test('dateToISO8601', () => {
    const d = new Date('2024-01-15T10:30:00Z');
    expect(dateToISO8601(d)).toBe('2024-01-15T10:30:00.000Z');
  });

  test('iso8601ToDate valid', () => {
    const d = iso8601ToDate('2024-01-15T10:30:00.000Z');
    expect(d).not.toBeNull();
    expect(d?.getFullYear()).toBe(2024);
  });

  test('iso8601ToDate invalid', () => {
    expect(iso8601ToDate('invalid')).toBeNull();
  });

  test('formatISO8601Variants has all formats', () => {
    const d = new Date('2024-01-15T10:30:00Z');
    const variants = formatISO8601Variants(d);
    expect(variants['ISO 8601 (UTC)']).toBeDefined();
    expect(variants['Date only']).toContain('2024-01-15');
    expect(variants['Week number']).toContain('W');
    expect(variants['Ordinal date']).toContain('2024-');
  });

  test('round-trip', () => {
    const original = '2024-06-15T12:00:00.000Z';
    const d = iso8601ToDate(original);
    expect(d).not.toBeNull();
    if (d) expect(dateToISO8601(d)).toBe(original);
  });
});
