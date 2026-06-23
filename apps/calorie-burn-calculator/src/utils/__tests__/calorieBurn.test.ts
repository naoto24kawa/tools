import { describe, it, expect } from 'vitest';
import { calcCalorieBurn, EXERCISES } from '../calorieBurn';

describe('calorieBurn', () => {
  describe('calcCalorieBurn', () => {
    it('体重60kg・MET=3.5・60分 → 消費カロリー', () => {
      // kcal = 3.5 × 60 × 1 × 1.05 = 220.5
      const result = calcCalorieBurn(60, 3.5, 60);
      expect(result.kcal).toBeCloseTo(220.5, 0);
    });

    it('脂肪燃焼量 = kcal / 7.2', () => {
      // 220.5 / 7.2 = 30.625
      const result = calcCalorieBurn(60, 3.5, 60);
      expect(result.fatGrams).toBeCloseTo(30.6, 1);
    });

    it('ゼロ分は0kcalを返す', () => {
      const result = calcCalorieBurn(60, 3.5, 0);
      expect(result.kcal).toBe(0);
    });

    it('体重0は例外を投げる', () => {
      expect(() => calcCalorieBurn(0, 3.5, 60)).toThrow('Weight must be positive');
    });

    it('MET値0は例外を投げる', () => {
      expect(() => calcCalorieBurn(60, 0, 60)).toThrow('MET value must be positive');
    });

    it('分数負値は例外を投げる', () => {
      expect(() => calcCalorieBurn(60, 3.5, -1)).toThrow('Minutes must be non-negative');
    });
  });

  describe('EXERCISES', () => {
    it('50種類以上の運動が定義されている', () => {
      expect(EXERCISES.length).toBeGreaterThanOrEqual(50);
    });

    it('各エントリに id, name, category, met が存在する', () => {
      for (const ex of EXERCISES) {
        expect(typeof ex.id).toBe('string');
        expect(typeof ex.name).toBe('string');
        expect(typeof ex.category).toBe('string');
        expect(ex.met).toBeGreaterThan(0);
      }
    });
  });
});
