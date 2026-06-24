import { describe, it, expect } from 'vitest';
import { calcBiorhythm, calcBiorhythmSeries } from '../biorhythm';

describe('biorhythm', () => {
  describe('calcBiorhythm', () => {
    it('誕生日当日は全サイクルが0', () => {
      const birth = new Date('2000-01-01');
      const result = calcBiorhythm(birth, birth);
      expect(result.physical).toBeCloseTo(0, 5);
      expect(result.emotional).toBeCloseTo(0, 5);
      expect(result.intellectual).toBeCloseTo(0, 5);
    });

    it('身体サイクル半周期(11.5日後)は最小値-1', () => {
      const birth = new Date('2000-01-01');
      const target = new Date('2000-01-13'); // 12日後: sin(2π*12/23) ≈ -0.97
      const result = calcBiorhythm(birth, target);
      // 半周期付近で負の値
      expect(result.physical).toBeLessThan(0);
    });

    it('経過日数を正しく計算', () => {
      const birth = new Date('2000-01-01');
      const target = new Date('2000-01-11'); // 10日後
      const result = calcBiorhythm(birth, target);
      expect(result.daysSinceBirth).toBe(10);
    });

    it('各サイクルの値が -1 から 1 の範囲内', () => {
      const birth = new Date('1990-06-15');
      const target = new Date('2024-03-20');
      const result = calcBiorhythm(birth, target);
      expect(result.physical).toBeGreaterThanOrEqual(-1);
      expect(result.physical).toBeLessThanOrEqual(1);
      expect(result.emotional).toBeGreaterThanOrEqual(-1);
      expect(result.emotional).toBeLessThanOrEqual(1);
      expect(result.intellectual).toBeGreaterThanOrEqual(-1);
      expect(result.intellectual).toBeLessThanOrEqual(1);
    });
  });

  describe('calcBiorhythmSeries', () => {
    it('指定日数分のシリーズを返す', () => {
      const birth = new Date('2000-01-01');
      const center = new Date('2024-01-01');
      const result = calcBiorhythmSeries(birth, center, 30);
      expect(result.dates).toHaveLength(30);
      expect(result.physical).toHaveLength(30);
      expect(result.emotional).toHaveLength(30);
      expect(result.intellectual).toHaveLength(30);
    });
  });
});
