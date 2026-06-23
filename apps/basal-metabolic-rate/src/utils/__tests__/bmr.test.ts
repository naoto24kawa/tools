import { describe, it, expect } from 'vitest';
import { calcHarrisBenedict, calcMifflin, calcTDEE, type ActivityLevel } from '../bmr';

const maleParams = { heightCm: 175, weightKg: 70, age: 30, gender: 'male' as const };
const femaleParams = { heightCm: 160, weightKg: 55, age: 30, gender: 'female' as const };

describe('bmr', () => {
  describe('calcHarrisBenedict', () => {
    it('男性のBMRを計算', () => {
      // 男性: 88.362 + (13.397×70) + (4.799×175) - (5.677×30)
      // = 88.362 + 937.79 + 839.825 - 170.31 = 1695.667
      const bmr = calcHarrisBenedict(maleParams);
      expect(bmr).toBeCloseTo(1695.7, 0);
    });

    it('女性のBMRを計算', () => {
      // 女性: 447.593 + (9.247×55) + (3.098×160) - (4.330×30)
      // = 447.593 + 508.585 + 495.68 - 129.9 = 1321.958
      const bmr = calcHarrisBenedict(femaleParams);
      expect(bmr).toBeCloseTo(1321.9, 0);
    });

    it('体重0は例外を投げる', () => {
      expect(() => calcHarrisBenedict({ ...maleParams, weightKg: 0 })).toThrow('Weight must be positive');
    });

    it('身長0は例外を投げる', () => {
      expect(() => calcHarrisBenedict({ ...maleParams, heightCm: 0 })).toThrow('Height must be positive');
    });

    it('年齢0は例外を投げる', () => {
      expect(() => calcHarrisBenedict({ ...maleParams, age: 0 })).toThrow('Age must be positive');
    });
  });

  describe('calcMifflin', () => {
    it('男性のBMRを計算（ミフリン式）', () => {
      // 男性: (10×70) + (6.25×175) - (5×30) + 5 = 700 + 1093.75 - 150 + 5 = 1648.75
      const bmr = calcMifflin(maleParams);
      expect(bmr).toBeCloseTo(1648.75, 0);
    });

    it('女性のBMRを計算（ミフリン式）', () => {
      // 女性: (10×55) + (6.25×160) - (5×30) - 161 = 550 + 1000 - 150 - 161 = 1239
      const bmr = calcMifflin(femaleParams);
      expect(bmr).toBeCloseTo(1239, 0);
    });

    it('体重0は例外を投げる', () => {
      expect(() => calcMifflin({ ...maleParams, weightKg: 0 })).toThrow('Weight must be positive');
    });

    it('身長0は例外を投げる', () => {
      expect(() => calcMifflin({ ...maleParams, heightCm: 0 })).toThrow('Height must be positive');
    });

    it('年齢0は例外を投げる', () => {
      expect(() => calcMifflin({ ...maleParams, age: 0 })).toThrow('Age must be positive');
    });
  });

  describe('calcTDEE', () => {
    it('sedentary: BMR × 1.2', () => {
      const tdee = calcTDEE(1700, 'sedentary');
      expect(tdee).toBeCloseTo(2040, 0);
    });

    it('light: BMR × 1.375', () => {
      const tdee = calcTDEE(1700, 'light');
      expect(tdee).toBeCloseTo(2337.5, 0);
    });

    it('moderate: BMR × 1.55', () => {
      const tdee = calcTDEE(1700, 'moderate');
      expect(tdee).toBeCloseTo(2635, 0);
    });

    it('active: BMR × 1.725', () => {
      const tdee = calcTDEE(1700, 'active');
      expect(tdee).toBeCloseTo(2932.5, 0);
    });

    it('very_active: BMR × 1.9', () => {
      const tdee = calcTDEE(1700, 'very_active');
      expect(tdee).toBeCloseTo(3230, 0);
    });

    it('不明な活動レベルは例外を投げる', () => {
      expect(() => calcTDEE(1700, 'unknown' as ActivityLevel)).toThrow('Unknown activity level: unknown');
    });
  });
});
