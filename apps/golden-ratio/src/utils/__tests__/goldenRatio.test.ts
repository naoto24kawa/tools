import { describe, it, expect } from 'vitest';
import { calcRatio, RATIOS } from '../goldenRatio';

describe('goldenRatio', () => {
  describe('calcRatio', () => {
    it('黄金比: 幅100から高さを算出', () => {
      const result = calcRatio(100, 'width', 1.6180339887);
      expect(result).toBeCloseTo(61.8, 1);
    });

    it('黄金比: 高さ100から幅を算出', () => {
      const result = calcRatio(100, 'height', 1.6180339887);
      expect(result).toBeCloseTo(161.8, 1);
    });

    it('白銀比(√2): 幅100から高さを算出', () => {
      const result = calcRatio(100, 'width', Math.SQRT2);
      expect(result).toBeCloseTo(70.71, 1);
    });

    it('正方形比(1:1): 幅100から高さは100', () => {
      const result = calcRatio(100, 'width', 1);
      expect(result).toBe(100);
    });

    it('幅0は0を返す', () => {
      expect(calcRatio(0, 'width', 1.618)).toBe(0);
    });

    it('負値は例外を投げる', () => {
      expect(() => calcRatio(-1, 'width', 1.618)).toThrow('Input must be non-negative');
    });
  });

  describe('RATIOS', () => {
    it('少なくとも5つの比率が定義されている', () => {
      expect(RATIOS.length).toBeGreaterThanOrEqual(5);
    });

    it('各エントリに id, label, ratio が存在する', () => {
      for (const r of RATIOS) {
        expect(typeof r.id).toBe('string');
        expect(typeof r.label).toBe('string');
        expect(typeof r.ratio).toBe('number');
        expect(r.ratio).toBeGreaterThan(0);
      }
    });
  });
});
