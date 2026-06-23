import { describe, it, expect } from 'vitest';
import { calcBMI, getIdealWeightRange } from '../bmi';

describe('bmi', () => {
  describe('calcBMI', () => {
    it('身長170cm・体重60kg → BMI約20.8（普通体重）', () => {
      const result = calcBMI(170, 60);
      // 60 / (1.7 * 1.7) = 20.76...
      expect(result.bmi).toBeCloseTo(20.76, 1);
      expect(result.category).toBe('normal');
    });

    it('BMI 18.5未満 → 低体重', () => {
      const result = calcBMI(170, 50);
      expect(result.category).toBe('underweight');
    });

    it('BMI 25以上30未満 → 肥満（1度）', () => {
      // 170cm 73kg: 73/2.89 ≈ 25.26
      const result = calcBMI(170, 73);
      expect(result.category).toBe('obese1');
    });

    it('BMI 18.5ちょうど（境界）→ 普通体重', () => {
      // 170cm: 53.47 / 1.7^2 ≈ 18.502 → normal
      const result = calcBMI(170, 53.47);
      expect(result.category).toBe('normal');
    });

    it('BMI 25ちょうど → 肥満（1度）', () => {
      // 170cm: 1.7^2 × 25 = 72.25kg
      const result = calcBMI(170, 72.25);
      expect(result.category).toBe('obese1');
    });

    it('BMI 30ちょうど → 肥満（2度）', () => {
      // 170cm: 1.7^2 × 30 = 86.7kg
      const result = calcBMI(170, 86.7);
      expect(result.category).toBe('obese2');
    });

    it('BMI 35ちょうど → 肥満（3度）', () => {
      // 170cm: 1.7^2 × 35 = 101.15kg
      const result = calcBMI(170, 101.15);
      expect(result.category).toBe('obese3');
    });

    it('BMI 40ちょうど → 肥満（4度）', () => {
      // 170cm: 1.7^2 × 40 = 115.6kg
      const result = calcBMI(170, 115.6);
      expect(result.category).toBe('obese4');
    });

    it('BMI 35以上 → 肥満（3度）', () => {
      const result = calcBMI(170, 102);
      expect(result.category).toBe('obese3');
    });

    it('標準体重 = 身長(m)^2 × 22', () => {
      const result = calcBMI(170, 60);
      // 1.7^2 * 22 = 63.58
      expect(result.standardWeight).toBeCloseTo(63.58, 1);
    });

    it('身長0は例外を投げる', () => {
      expect(() => calcBMI(0, 60)).toThrow('Height must be positive');
    });

    it('体重0は例外を投げる', () => {
      expect(() => calcBMI(170, 0)).toThrow('Weight must be positive');
    });
  });

  describe('getIdealWeightRange', () => {
    it('身長170cm → BMI 18.5〜25の範囲を返す', () => {
      const range = getIdealWeightRange(170);
      // min: 1.7^2 * 18.5 = 53.46
      // max: 1.7^2 * 24.9 = 71.91
      expect(range.min).toBeCloseTo(53.5, 0);
      expect(range.max).toBeCloseTo(71.9, 0);
    });
  });
});
