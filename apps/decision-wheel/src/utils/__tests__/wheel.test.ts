import { describe, it, expect } from 'vitest';
import { parseChoices, getWinningSegment, generateSpinAnimation, DEFAULT_COLORS } from '../wheelRenderer';

describe('parseChoices', () => {
  it('parses multiline input into segments', () => {
    const result = parseChoices('A\nB\nC');
    expect(result).toHaveLength(3);
    expect(result[0].text).toBe('A');
    expect(result[1].text).toBe('B');
  });

  it('filters empty lines', () => {
    const result = parseChoices('A\n\n\nB');
    expect(result).toHaveLength(2);
  });

  it('trims whitespace', () => {
    const result = parseChoices('  A  \n  B  ');
    expect(result[0].text).toBe('A');
  });

  it('assigns colors cyclically', () => {
    const result = parseChoices('A\nB');
    expect(result[0].color).toBe(DEFAULT_COLORS[0]);
    expect(result[1].color).toBe(DEFAULT_COLORS[1]);
  });
});

describe('getWinningSegment', () => {
  it('returns null for empty segments', () => {
    expect(getWinningSegment([], 0)).toBeNull();
  });

  it('returns a valid segment', () => {
    const segments = parseChoices('A\nB\nC\nD');
    const result = getWinningSegment(segments, 1.5);
    expect(result).not.toBeNull();
    expect(['A', 'B', 'C', 'D']).toContain(result!.text);
  });
});

describe('generateSpinAnimation', () => {
  it('returns totalRotation and easing function', () => {
    const anim = generateSpinAnimation(4000);
    expect(anim.totalRotation).toBeGreaterThan(0);
    expect(typeof anim.easing).toBe('function');
  });

  it('easing returns 0 at start and 1 at end', () => {
    const anim = generateSpinAnimation(4000);
    expect(anim.easing(0)).toBe(0);
    expect(anim.easing(1)).toBe(1);
  });
});
