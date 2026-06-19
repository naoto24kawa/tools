import { describe, it, expect } from 'vitest';
import { calcRetirement } from '../retirement';

describe('calcRetirement', () => {
  it('退職時資産を計算する（積立フェーズのみ）', () => {
    const result = calcRetirement({
      currentAge: 30,
      retireAge: 65,
      targetAge: 90,
      currentAssets: 0,
      monthlyContribution: 30000,
      monthlyExpenseAfterRetire: 200000,
      annualRate: 3,
    });
    // 35年積立: 大まかに 30000 × 420ヶ月 以上
    expect(result.assetsAtRetirement).toBeGreaterThan(30000 * 420);
  });

  it('yearlyBreakdown が currentAge から targetAge まで含む', () => {
    const result = calcRetirement({
      currentAge: 60,
      retireAge: 65,
      targetAge: 75,
      currentAssets: 10000000,
      monthlyContribution: 0,
      monthlyExpenseAfterRetire: 200000,
      annualRate: 0,
    });
    const ages = result.yearlyBreakdown.map((e) => e.age);
    expect(ages[0]).toBe(60);
    expect(ages[ages.length - 1]).toBe(75);
  });

  it('資産が尽きる年齢を返す', () => {
    const result = calcRetirement({
      currentAge: 65,
      retireAge: 65,
      targetAge: 90,
      currentAssets: 1000000, // 100万のみ
      monthlyContribution: 0,
      monthlyExpenseAfterRetire: 100000, // 月10万支出
      annualRate: 0,
    });
    // 1000000 / 100000 = 10ヶ月で枯渇 → 66歳未満で枯渇
    expect(result.depletionAge).toBeLessThan(66);
  });

  it('資産が尽きない場合 depletionAge は null', () => {
    const result = calcRetirement({
      currentAge: 65,
      retireAge: 65,
      targetAge: 70,
      currentAssets: 100000000,
      monthlyContribution: 0,
      monthlyExpenseAfterRetire: 100000,
      annualRate: 0,
    });
    expect(result.depletionAge).toBeNull();
  });

  it('退職年齢 < 現在年齢は例外を投げる', () => {
    expect(() =>
      calcRetirement({
        currentAge: 65,
        retireAge: 60,
        targetAge: 90,
        currentAssets: 0,
        monthlyContribution: 0,
        monthlyExpenseAfterRetire: 0,
        annualRate: 0,
      }),
    ).toThrow('Retire age must be greater than current age');
  });
});
