import { describe, it, expect } from 'vitest';
import { calcCO2, calcTotal, CO2_CATEGORIES } from '../co2Footprint';

describe('co2Footprint', () => {
  describe('calcCO2', () => {
    it('電気100kWh → CO2約45kg', () => {
      // 0.453 kg-CO2/kWh × 100 = 45.3
      const result = calcCO2('electricity', 100);
      expect(result).toBeCloseTo(45.3, 0);
    });

    it('都市ガス1m³ → CO2約2.23kg', () => {
      const result = calcCO2('gas', 1);
      expect(result).toBeCloseTo(2.23, 1);
    });

    it('量0はCO2ゼロ', () => {
      expect(calcCO2('electricity', 0)).toBe(0);
    });

    it('量負値は例外を投げる', () => {
      expect(() => calcCO2('electricity', -1)).toThrow('Amount must be non-negative');
    });
  });

  describe('calcTotal', () => {
    it('複数カテゴリの合計を算出', () => {
      const result = calcTotal([
        { categoryId: 'electricity', amount: 100 },
        { categoryId: 'gas', amount: 10 },
      ]);
      expect(result.totalKgCO2).toBeGreaterThan(0);
      expect(result.perCategory).toHaveLength(2);
    });

    it('日本人平均との比較値が含まれる', () => {
      const result = calcTotal([]);
      expect(result.japanAverageKgCO2PerYear).toBeGreaterThan(0);
    });
  });

  describe('CO2_CATEGORIES', () => {
    it('少なくとも8種類が定義されている', () => {
      expect(CO2_CATEGORIES.length).toBeGreaterThanOrEqual(8);
    });
  });
});
