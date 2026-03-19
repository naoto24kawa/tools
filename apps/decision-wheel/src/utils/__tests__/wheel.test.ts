import { describe, it, expect } from 'vitest';
import { getSliceColor, pickWinner, easeOut, WHEEL_COLORS } from '../wheel';

describe('getSliceColor', () => {
  it('returns correct color for index', () => {
    expect(getSliceColor(0)).toBe(WHEEL_COLORS[0]);
    expect(getSliceColor(3)).toBe(WHEEL_COLORS[3]);
  });

  it('wraps around for large index', () => {
    expect(getSliceColor(WHEEL_COLORS.length)).toBe(WHEEL_COLORS[0]);
  });
});

describe('pickWinner', () => {
  it('returns empty string for no choices', () => {
    expect(pickWinner([], 0)).toBe('');
  });

  it('returns the only choice for single item', () => {
    expect(pickWinner(['A'], 0)).toBe('A');
  });

  it('returns a valid choice', () => {
    const choices = ['A', 'B', 'C', 'D'];
    const result = pickWinner(choices, 1.5);
    expect(choices).toContain(result);
  });
});

describe('easeOut', () => {
  it('returns 0 at start', () => {
    expect(easeOut(0)).toBe(0);
  });

  it('returns 1 at end', () => {
    expect(easeOut(1)).toBe(1);
  });

  it('is monotonically increasing', () => {
    let prev = 0;
    for (let t = 0.1; t <= 1; t += 0.1) {
      const val = easeOut(t);
      expect(val).toBeGreaterThan(prev);
      prev = val;
    }
  });
});
