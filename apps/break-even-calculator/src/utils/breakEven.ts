export interface BreakEvenParams {
  fixedCost: number;
  variableRatio: number; // %（0–99）
  revenue: number;
}

export interface BreakEvenResult {
  breakEvenRevenue: number;
  safetyMarginRatio: number;
  operatingLeverage: number;
  profit: number;
  variableCost: number;
  contributionMarginRatio: number;
}

export function calcBreakEven(params: BreakEvenParams): BreakEvenResult {
  const { fixedCost, variableRatio, revenue } = params;
  if (fixedCost < 0) throw new Error('Fixed cost must be non-negative');
  if (variableRatio >= 100 || variableRatio < 0) throw new Error('Variable ratio must be less than 100');
  if (revenue <= 0) throw new Error('Revenue must be positive');

  const vcRatio = variableRatio / 100;
  const contributionMarginRatio = (1 - vcRatio) * 100;
  const variableCost = revenue * vcRatio;
  const contributionMargin = revenue - variableCost;
  const profit = contributionMargin - fixedCost;
  const breakEvenRevenue = fixedCost / (1 - vcRatio);
  const safetyMarginRatio = ((revenue - breakEvenRevenue) / revenue) * 100;
  const operatingLeverage = profit !== 0 ? contributionMargin / profit : Infinity;

  return {
    breakEvenRevenue,
    safetyMarginRatio,
    operatingLeverage,
    profit,
    variableCost,
    contributionMarginRatio,
  };
}
