import { describe, expect, test } from 'bun:test';
import { calculateETA, formatDuration } from '../eta';

describe('eta', () => {
  test('100km at 60km/h', () => {
    const eta = calculateETA(100, 60);
    expect(eta?.hours).toBe(1);
    expect(eta?.minutes).toBe(40);
  });

  test('60km at 60km/h = 1 hour', () => {
    const eta = calculateETA(60, 60);
    expect(eta?.hours).toBe(1);
    expect(eta?.minutes).toBe(0);
  });

  test('zero speed returns null', () => {
    expect(calculateETA(100, 0)).toBeNull();
  });

  test('negative distance returns null', () => {
    expect(calculateETA(-10, 60)).toBeNull();
  });

  test('arrival is in the future', () => {
    const eta = calculateETA(100, 100);
    expect(eta?.arrival.getTime()).toBeGreaterThan(Date.now());
  });

  test('formatDuration hours only', () => {
    expect(formatDuration(2, 0)).toBe('2時間');
  });

  test('formatDuration minutes only', () => {
    expect(formatDuration(0, 30)).toBe('30分');
  });

  test('formatDuration both', () => {
    expect(formatDuration(1, 30)).toBe('1時間30分');
  });
});
