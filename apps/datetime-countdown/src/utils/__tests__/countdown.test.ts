import { describe, expect, test } from 'vitest';
import { calculateCountdown } from '../countdown';

describe('countdown', () => {
  test('future date has isPast false', () => {
    const future = new Date(Date.now() + 86400000);
    expect(calculateCountdown(future).isPast).toBe(false);
  });

  test('past date has isPast true', () => {
    const past = new Date(Date.now() - 86400000);
    expect(calculateCountdown(past).isPast).toBe(true);
  });

  test('1 day = 1 day', () => {
    const future = new Date(Date.now() + 86400000 + 1000);
    const result = calculateCountdown(future);
    expect(result.days).toBe(1);
  });

  test('totalMs is positive', () => {
    const result = calculateCountdown(new Date(Date.now() + 5000));
    expect(result.totalMs).toBeGreaterThan(0);
  });
});
