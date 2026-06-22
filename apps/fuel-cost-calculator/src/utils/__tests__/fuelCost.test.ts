import { describe, it, expect } from 'vitest';
import { calcFuelCost } from '../fuelCost';

describe('fuelCost', () => {
  it('100km・燃費20km/L・160円/L → 燃料5L・800円', () => {
    const result = calcFuelCost({ distanceKm: 100, fuelEfficiencyKmL: 20, pricePerLiter: 160 });
    expect(result.litersNeeded).toBeCloseTo(5, 1);
    expect(result.fuelCost).toBeCloseTo(800, 0);
  });

  it('CO2排出量 = リター数 × 2.322', () => {
    const result = calcFuelCost({ distanceKm: 100, fuelEfficiencyKmL: 20, pricePerLiter: 160 });
    // 5L × 2.322 = 11.61 kg
    expect(result.co2Kg).toBeCloseTo(11.61, 1);
  });

  it('月間推計 = 燃料代 × 30日', () => {
    const result = calcFuelCost({ distanceKm: 10, fuelEfficiencyKmL: 20, pricePerLiter: 160 });
    const expectedMonthly = result.fuelCost * 30;
    expect(result.monthlyEstimate).toBeCloseTo(expectedMonthly, 0);
  });

  it('年間推計 = 月間 × 12', () => {
    const result = calcFuelCost({ distanceKm: 10, fuelEfficiencyKmL: 20, pricePerLiter: 160 });
    expect(result.yearlyEstimate).toBeCloseTo(result.monthlyEstimate * 12, 0);
  });

  it('走行距離0は0を返す', () => {
    const result = calcFuelCost({ distanceKm: 0, fuelEfficiencyKmL: 20, pricePerLiter: 160 });
    expect(result.fuelCost).toBe(0);
    expect(result.co2Kg).toBe(0);
  });

  it('燃費0は例外を投げる', () => {
    expect(() => calcFuelCost({ distanceKm: 100, fuelEfficiencyKmL: 0, pricePerLiter: 160 })).toThrow('Fuel efficiency must be positive');
  });

  it('走行距離負値は例外を投げる', () => {
    expect(() => calcFuelCost({ distanceKm: -1, fuelEfficiencyKmL: 20, pricePerLiter: 160 })).toThrow('Distance must be non-negative');
  });
});
