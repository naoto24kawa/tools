import { describe, it, expect } from 'vitest';
import { calcElectricityCost, ELECTRIC_PLANS } from '../electricityCost';

describe('electricityCost', () => {
  describe('calcElectricityCost', () => {
    it('カスタムプランで使用量100kWh・単価30円・基本料金1000円', () => {
      const result = calcElectricityCost({
        monthlyKwh: 100,
        planId: 'custom',
        customBasicFee: 1000,
        customUnitPrice: 30,
      });
      expect(result.basicFee).toBe(1000);
      expect(result.usageFee).toBe(3000);
      expect(result.totalMonthly).toBe(4000);
      expect(result.totalYearly).toBe(48000);
    });

    it('使用量0のとき使用料は0', () => {
      const result = calcElectricityCost({
        monthlyKwh: 0,
        planId: 'custom',
        customBasicFee: 1000,
        customUnitPrice: 30,
      });
      expect(result.usageFee).toBe(0);
    });

    it('使用量負値は例外を投げる', () => {
      expect(() =>
        calcElectricityCost({ monthlyKwh: -1, planId: 'custom', customBasicFee: 0, customUnitPrice: 30 }),
      ).toThrow('Monthly kWh must be non-negative');
    });

    it('プリセットプランで計算できる', () => {
      const plan = ELECTRIC_PLANS[0];
      const result = calcElectricityCost({ monthlyKwh: 200, planId: plan.id });
      expect(result.totalMonthly).toBeGreaterThan(0);
    });

    it('未知のプランIDは例外を投げる', () => {
      expect(() =>
        calcElectricityCost({ monthlyKwh: 100, planId: 'unknown_plan_xyz' }),
      ).toThrow('Unknown plan');
    });
  });

  describe('ELECTRIC_PLANS', () => {
    it('少なくとも3種類のプランが定義されている', () => {
      expect(ELECTRIC_PLANS.length).toBeGreaterThanOrEqual(3);
    });
  });
});
