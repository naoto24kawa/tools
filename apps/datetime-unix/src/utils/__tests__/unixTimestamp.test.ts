import { describe, expect, test } from 'vitest';
import { dateToTimestamp, formatDate, formatISO, timestampToDate } from '../unixTimestamp';

describe('unixTimestamp', () => {
  test('timestampToDate converts correctly', () => {
    const date = timestampToDate(0);
    expect(date.toISOString()).toBe('1970-01-01T00:00:00.000Z');
  });

  test('dateToTimestamp converts correctly', () => {
    const date = new Date('2024-01-01T00:00:00Z');
    expect(dateToTimestamp(date)).toBe(1704067200);
  });

  test('round-trip timestamp -> date -> timestamp', () => {
    const ts = 1700000000;
    expect(dateToTimestamp(timestampToDate(ts))).toBe(ts);
  });

  test('formatDate returns formatted string', () => {
    const date = new Date('2024-01-15T10:30:45Z');
    const formatted = formatDate(date);
    expect(formatted).toContain('2024');
    expect(formatted).toContain('30');
    expect(formatted).toContain('45');
  });

  test('formatISO returns ISO string', () => {
    const date = new Date('2024-01-01T00:00:00Z');
    expect(formatISO(date)).toBe('2024-01-01T00:00:00.000Z');
  });

  test('negative timestamp (before epoch)', () => {
    const date = timestampToDate(-86400);
    expect(date.toISOString()).toBe('1969-12-31T00:00:00.000Z');
  });

  test('large timestamp', () => {
    const date = timestampToDate(2000000000);
    expect(date.getFullYear()).toBe(2033);
  });
});
