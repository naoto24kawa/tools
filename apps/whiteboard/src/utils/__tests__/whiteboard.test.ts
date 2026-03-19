import { describe, it, expect } from 'vitest';
import { getDistance } from '../whiteboard';

describe('getDistance', () => {
  it('returns 0 for same point', () => {
    expect(getDistance({ x: 0, y: 0 }, { x: 0, y: 0 })).toBe(0);
  });

  it('calculates distance correctly', () => {
    expect(getDistance({ x: 0, y: 0 }, { x: 3, y: 4 })).toBe(5);
  });

  it('handles negative coordinates', () => {
    expect(getDistance({ x: -3, y: 0 }, { x: 0, y: 4 })).toBe(5);
  });
});
