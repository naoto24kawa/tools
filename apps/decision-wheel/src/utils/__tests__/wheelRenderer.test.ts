import { describe, it, expect } from 'vitest';
import {
  parseChoices,
  getWinningSegment,
  generateSpinAnimation,
  DEFAULT_COLORS,
} from '../wheelRenderer';

describe('parseChoices', () => {
  it('parses newline-separated input', () => {
    const result = parseChoices('Apple\nBanana\nCherry');
    expect(result).toHaveLength(3);
    expect(result[0].text).toBe('Apple');
    expect(result[1].text).toBe('Banana');
    expect(result[2].text).toBe('Cherry');
  });

  it('filters empty lines', () => {
    const result = parseChoices('Apple\n\n\nBanana\n');
    expect(result).toHaveLength(2);
  });

  it('trims whitespace', () => {
    const result = parseChoices('  Apple  \n  Banana  ');
    expect(result[0].text).toBe('Apple');
    expect(result[1].text).toBe('Banana');
  });

  it('assigns colors cyclically', () => {
    const result = parseChoices('A\nB\nC');
    expect(result[0].color).toBe(DEFAULT_COLORS[0]);
    expect(result[1].color).toBe(DEFAULT_COLORS[1]);
    expect(result[2].color).toBe(DEFAULT_COLORS[2]);
  });

  it('returns empty for empty input', () => {
    expect(parseChoices('')).toHaveLength(0);
    expect(parseChoices('\n\n')).toHaveLength(0);
  });
});

describe('getWinningSegment', () => {
  it('returns null for empty segments', () => {
    expect(getWinningSegment([], 0)).toBeNull();
  });

  it('returns a valid segment', () => {
    const segments = parseChoices('A\nB\nC');
    const winner = getWinningSegment(segments, 0);
    expect(winner).not.toBeNull();
    expect(['A', 'B', 'C']).toContain(winner!.text);
  });
});

describe('generateSpinAnimation', () => {
  it('returns positive total rotation', () => {
    const { totalRotation } = generateSpinAnimation();
    expect(totalRotation).toBeGreaterThan(0);
  });

  it('easing starts at 0 and ends at 1', () => {
    const { easing } = generateSpinAnimation();
    expect(easing(0)).toBe(0);
    expect(easing(1)).toBe(1);
  });

  it('easing is monotonically increasing', () => {
    const { easing } = generateSpinAnimation();
    let prev = 0;
    for (let t = 0.1; t <= 1; t += 0.1) {
      const val = easing(t);
      expect(val).toBeGreaterThan(prev);
      prev = val;
    }
  });
});
