import { describe, expect, test } from 'bun:test';
import { simulateColorBlind } from '../colorBlind';

describe('colorBlind', () => {
  test('normal returns same color', () => {
    expect(simulateColorBlind('#ff0000', 'normal')).toBe('#ff0000');
  });

  test('protanopia changes red', () => {
    expect(simulateColorBlind('#ff0000', 'protanopia')).not.toBe('#ff0000');
  });

  test('deuteranopia changes green', () => {
    expect(simulateColorBlind('#00ff00', 'deuteranopia')).not.toBe('#00ff00');
  });

  test('achromatopsia produces gray', () => {
    const result = simulateColorBlind('#ff0000', 'achromatopsia');
    // Should be a shade of gray (R=G=B)
    const r = Number.parseInt(result.slice(1, 3), 16);
    const g = Number.parseInt(result.slice(3, 5), 16);
    const b = Number.parseInt(result.slice(5, 7), 16);
    expect(r).toBe(g);
    expect(g).toBe(b);
  });

  test('returns valid hex', () => {
    expect(simulateColorBlind('#3b82f6', 'tritanopia')).toMatch(/^#[0-9a-f]{6}$/);
  });
});
