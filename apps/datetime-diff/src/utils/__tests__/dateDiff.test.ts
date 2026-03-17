import { describe, expect, test } from 'bun:test';
import { calculateDateDiff } from '../dateDiff';

describe('calculateDateDiff', () => {
  test('same date returns zeros', () => {
    const d = new Date('2024-01-01T00:00:00');
    const result = calculateDateDiff(d, d);
    expect(result.totalDays).toBe(0);
    expect(result.years).toBe(0);
  });

  test('one day difference', () => {
    const d1 = new Date('2024-01-01T00:00:00');
    const d2 = new Date('2024-01-02T00:00:00');
    const result = calculateDateDiff(d1, d2);
    expect(result.totalDays).toBe(1);
    expect(result.totalHours).toBe(24);
  });

  test('one year difference', () => {
    const d1 = new Date('2024-01-01T00:00:00');
    const d2 = new Date('2025-01-01T00:00:00');
    const result = calculateDateDiff(d1, d2);
    expect(result.years).toBe(1);
    expect(result.months).toBe(0);
    expect(result.days).toBe(0);
  });

  test('months and days', () => {
    const d1 = new Date('2024-01-15T00:00:00');
    const d2 = new Date('2024-03-20T00:00:00');
    const result = calculateDateDiff(d1, d2);
    expect(result.months).toBe(2);
    expect(result.days).toBe(5);
  });

  test('order independent', () => {
    const d1 = new Date('2024-01-01T00:00:00');
    const d2 = new Date('2024-06-01T00:00:00');
    const r1 = calculateDateDiff(d1, d2);
    const r2 = calculateDateDiff(d2, d1);
    expect(r1.totalDays).toBe(r2.totalDays);
  });

  test('hours minutes seconds', () => {
    const d1 = new Date('2024-01-01T10:30:00');
    const d2 = new Date('2024-01-01T14:45:30');
    const result = calculateDateDiff(d1, d2);
    expect(result.hours).toBe(4);
    expect(result.minutes).toBe(15);
    expect(result.seconds).toBe(30);
  });
});
