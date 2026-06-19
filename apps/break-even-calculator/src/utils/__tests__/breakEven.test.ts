import { describe, it, expect } from 'vitest';
import { calcBreakEven } from '../breakEven';

describe('breakEven', () => {
  it('固定費100万・変動費率60%・売上300万 → 損益分岐点250万', () => {
    // BEP = FC / (1 - VC率) = 1000000 / 0.4 = 2500000
    const result = calcBreakEven({ fixedCost: 1000000, variableRatio: 60, revenue: 3000000 });
    expect(result.breakEvenRevenue).toBeCloseTo(2500000, 0);
  });

  it('利益を正しく算出', () => {
    const result = calcBreakEven({ fixedCost: 1000000, variableRatio: 60, revenue: 3000000 });
    // 利益 = 3000000 - 1800000 - 1000000 = 200000
    expect(result.profit).toBeCloseTo(200000, 0);
  });

  it('安全余裕率を算出', () => {
    const result = calcBreakEven({ fixedCost: 1000000, variableRatio: 60, revenue: 3000000 });
    // (3000000 - 2500000) / 3000000 ≈ 16.67%
    expect(result.safetyMarginRatio).toBeCloseTo(16.67, 1);
  });

  it('貢献利益率 = 1 - 変動費率', () => {
    const result = calcBreakEven({ fixedCost: 1000000, variableRatio: 60, revenue: 3000000 });
    expect(result.contributionMarginRatio).toBeCloseTo(40, 1);
  });

  it('固定費負値は例外を投げる', () => {
    expect(() => calcBreakEven({ fixedCost: -1, variableRatio: 60, revenue: 3000000 })).toThrow('Fixed cost must be non-negative');
  });

  it('変動費率100%以上は例外を投げる', () => {
    expect(() => calcBreakEven({ fixedCost: 1000000, variableRatio: 100, revenue: 3000000 })).toThrow('Variable ratio must be less than 100');
  });

  it('売上0は例外を投げる', () => {
    expect(() => calcBreakEven({ fixedCost: 1000000, variableRatio: 60, revenue: 0 })).toThrow('Revenue must be positive');
  });
});
