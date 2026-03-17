import { describe, expect, test } from 'vitest';
import { dateToRFC2822, dateToUTC, rfc2822ToDate } from '../rfc2822';

describe('rfc2822', () => {
  test('dateToRFC2822 includes day name', () => {
    const d = new Date('2024-01-15T10:30:00Z');
    const rfc = dateToRFC2822(d);
    expect(rfc).toMatch(/^(Mon|Tue|Wed|Thu|Fri|Sat|Sun),/);
    expect(rfc).toContain('Jan');
    expect(rfc).toContain('2024');
  });

  test('rfc2822ToDate parses valid', () => {
    const d = rfc2822ToDate('Mon, 15 Jan 2024 10:30:00 +0000');
    expect(d).not.toBeNull();
    expect(d?.getFullYear()).toBe(2024);
  });

  test('rfc2822ToDate invalid returns null', () => {
    expect(rfc2822ToDate('invalid')).toBeNull();
  });

  test('dateToUTC returns UTC string', () => {
    const d = new Date('2024-01-15T10:30:00Z');
    expect(dateToUTC(d)).toContain('GMT');
  });

  test('round-trip', () => {
    const original = new Date('2024-06-15T12:00:00Z');
    const rfc = dateToRFC2822(original);
    const parsed = rfc2822ToDate(rfc);
    expect(parsed).not.toBeNull();
  });
});
