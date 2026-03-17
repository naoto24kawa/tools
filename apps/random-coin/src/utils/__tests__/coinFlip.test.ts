import { describe, expect, test } from 'bun:test';
import { flipCoins } from '../coinFlip';

describe('flipCoins', () => {
  test('returns correct count', () => {
    const result = flipCoins(10);
    expect(result.flips.length).toBe(10);
  });

  test('heads + tails = total', () => {
    const result = flipCoins(100);
    expect(result.headsCount + result.tailsCount).toBe(100);
  });

  test('values are heads or tails', () => {
    const result = flipCoins(50);
    for (const f of result.flips) {
      expect(f === 'heads' || f === 'tails').toBe(true);
    }
  });

  test('percentages sum to 100', () => {
    const result = flipCoins(100);
    expect(result.headsPercent + result.tailsPercent).toBeCloseTo(100);
  });

  test('single flip', () => {
    const result = flipCoins(1);
    expect(result.flips.length).toBe(1);
    expect(result.headsCount + result.tailsCount).toBe(1);
  });

  test('produces both outcomes over many flips', () => {
    const result = flipCoins(100);
    expect(result.headsCount).toBeGreaterThan(0);
    expect(result.tailsCount).toBeGreaterThan(0);
  });
});
