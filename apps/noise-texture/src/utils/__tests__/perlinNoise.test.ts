import { describe, it, expect } from 'vitest';
import { noise2D, generateNoise } from '../perlinNoise';

function createTestPerm(): number[] {
  const p = [];
  for (let i = 0; i < 512; i++) p[i] = i & 255;
  return p;
}

describe('perlinNoise', () => {
  it('noise2D returns value between -1 and 1', () => {
    const perm = createTestPerm();
    for (let i = 0; i < 100; i++) {
      const v = noise2D(i * 0.1, i * 0.2, perm);
      expect(v).toBeGreaterThanOrEqual(-1);
      expect(v).toBeLessThanOrEqual(1);
    }
  });

  it('generateNoise returns correct size array', () => {
    const data = generateNoise(32, 32, 10, 4, 0.5, 42);
    expect(data.length).toBe(32 * 32);
  });

  it('generateNoise values are normalized to 0-1', () => {
    const data = generateNoise(16, 16, 10, 3, 0.5, 123);
    for (const v of data) {
      expect(v).toBeGreaterThanOrEqual(0);
      expect(v).toBeLessThanOrEqual(1);
    }
  });

  it('same seed produces same output', () => {
    const d1 = generateNoise(8, 8, 10, 2, 0.5, 99);
    const d2 = generateNoise(8, 8, 10, 2, 0.5, 99);
    for (let i = 0; i < d1.length; i++) {
      expect(d1[i]).toBe(d2[i]);
    }
  });

  it('different seed produces different output', () => {
    const d1 = generateNoise(8, 8, 10, 2, 0.5, 1);
    const d2 = generateNoise(8, 8, 10, 2, 0.5, 2);
    let same = true;
    for (let i = 0; i < d1.length; i++) {
      if (d1[i] !== d2[i]) {
        same = false;
        break;
      }
    }
    expect(same).toBe(false);
  });
});
