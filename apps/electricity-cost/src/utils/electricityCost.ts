export interface PriceTier {
  upToKwh: number | null; // null = 上限なし
  pricePerKwh: number;
}

export interface ElectricPlan {
  id: string;
  company: string;
  name: string;
  basicFee: number;      // 基本料金（円/月）
  tiers: PriceTier[];
}

export interface ElectricParams {
  monthlyKwh: number;
  planId: string;
  customBasicFee?: number;
  customUnitPrice?: number;
}

export interface ElectricResult {
  basicFee: number;
  usageFee: number;
  totalMonthly: number;
  totalYearly: number;
}

// 主要電力会社の標準プラン（概算値・2024年時点の参考値）
export const ELECTRIC_PLANS: ElectricPlan[] = [
  {
    id: 'tepco_standard',
    company: '東京電力',
    name: '従量電灯B（30A）',
    basicFee: 858,
    tiers: [
      { upToKwh: 120, pricePerKwh: 29.80 },
      { upToKwh: 300, pricePerKwh: 36.40 },
      { upToKwh: null, pricePerKwh: 40.49 },
    ],
  },
  {
    id: 'kansai_standard',
    company: '関西電力',
    name: '従量電灯A',
    basicFee: 363,
    tiers: [
      { upToKwh: 15, pricePerKwh: 20.32 },
      { upToKwh: 120, pricePerKwh: 25.71 },
      { upToKwh: 300, pricePerKwh: 28.68 },
      { upToKwh: null, pricePerKwh: 30.57 },
    ],
  },
  {
    id: 'chubu_standard',
    company: '中部電力',
    name: '従量電灯B（30A）',
    basicFee: 858,
    tiers: [
      { upToKwh: 120, pricePerKwh: 29.44 },
      { upToKwh: 300, pricePerKwh: 36.09 },
      { upToKwh: null, pricePerKwh: 41.39 },
    ],
  },
  {
    id: 'kyushu_standard',
    company: '九州電力',
    name: '従量電灯B（30A）',
    basicFee: 748,
    tiers: [
      { upToKwh: 120, pricePerKwh: 17.55 },
      { upToKwh: 300, pricePerKwh: 22.78 },
      { upToKwh: null, pricePerKwh: 25.08 },
    ],
  },
];

function calcTieredUsageFee(kwh: number, tiers: PriceTier[]): number {
  let remaining = kwh;
  let fee = 0;
  let prevLimit = 0;

  for (const tier of tiers) {
    if (remaining <= 0) break;
    const limit = tier.upToKwh !== null ? tier.upToKwh - prevLimit : Infinity;
    const used = Math.min(remaining, limit);
    fee += used * tier.pricePerKwh;
    remaining -= used;
    prevLimit = tier.upToKwh ?? 0;
  }

  return fee;
}

export function calcElectricityCost(params: ElectricParams): ElectricResult {
  const { monthlyKwh, planId, customBasicFee, customUnitPrice } = params;

  if (monthlyKwh < 0) throw new Error('Monthly kWh must be non-negative');

  let basicFee: number;
  let usageFee: number;

  if (planId === 'custom') {
    basicFee = customBasicFee ?? 0;
    usageFee = monthlyKwh * (customUnitPrice ?? 0);
  } else {
    const plan = ELECTRIC_PLANS.find((p) => p.id === planId);
    if (!plan) throw new Error(`Unknown plan: ${planId}`);
    basicFee = plan.basicFee;
    usageFee = calcTieredUsageFee(monthlyKwh, plan.tiers);
  }

  const totalMonthly = basicFee + usageFee;
  return { basicFee, usageFee, totalMonthly, totalYearly: totalMonthly * 12 };
}
