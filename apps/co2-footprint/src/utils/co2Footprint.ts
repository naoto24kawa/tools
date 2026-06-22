export type CO2Category =
  | 'electricity' | 'gas' | 'car' | 'flight_domestic' | 'flight_intl'
  | 'beef' | 'pork' | 'chicken' | 'bus' | 'train';

export interface CO2CategoryDef {
  id: CO2Category;
  label: string;
  unit: string;
  kgCO2PerUnit: number; // 排出係数（kg-CO2/単位）
  description: string;
}

export interface CategoryInput {
  categoryId: CO2Category;
  amount: number;
}

export interface TotalResult {
  totalKgCO2: number;
  perCategory: { categoryId: CO2Category; kgCO2: number }[];
  japanAverageKgCO2PerYear: number;
}

// 排出係数テーブル（環境省・国立環境研究所公表値ベース、2023年度版）
export const CO2_CATEGORIES: CO2CategoryDef[] = [
  {
    id: 'electricity',
    label: '電気',
    unit: 'kWh/月',
    kgCO2PerUnit: 0.453,
    description: '家庭での電気使用量',
  },
  {
    id: 'gas',
    label: '都市ガス',
    unit: 'm³/月',
    kgCO2PerUnit: 2.23,
    description: '都市ガス使用量（給湯・調理等）',
  },
  {
    id: 'car',
    label: '自動車（ガソリン）',
    unit: 'km/月',
    kgCO2PerUnit: 0.139,
    description: '自家用車の月間走行距離',
  },
  {
    id: 'flight_domestic',
    label: '国内航空',
    unit: '往復回数/年',
    kgCO2PerUnit: 89,
    description: '国内線の往復フライト（平均距離ベース）',
  },
  {
    id: 'flight_intl',
    label: '国際航空',
    unit: '往復回数/年',
    kgCO2PerUnit: 2000,
    description: '国際線の往復フライト（欧米路線目安）',
  },
  {
    id: 'beef',
    label: '牛肉',
    unit: 'kg/月',
    kgCO2PerUnit: 27,
    description: '牛肉の消費量',
  },
  {
    id: 'pork',
    label: '豚肉',
    unit: 'kg/月',
    kgCO2PerUnit: 6.1,
    description: '豚肉の消費量',
  },
  {
    id: 'chicken',
    label: '鶏肉',
    unit: 'kg/月',
    kgCO2PerUnit: 3.7,
    description: '鶏肉の消費量',
  },
  {
    id: 'bus',
    label: 'バス',
    unit: 'km/月',
    kgCO2PerUnit: 0.059,
    description: '路線バス・高速バスの移動距離',
  },
  {
    id: 'train',
    label: '電車',
    unit: 'km/月',
    kgCO2PerUnit: 0.019,
    description: '電車の移動距離',
  },
];

// 日本人1人当たりの年間CO2排出量（ton-CO2/人 → kg）
const JAPAN_AVERAGE_KG_CO2_PER_YEAR = 9000;

export function calcCO2(category: CO2Category, amount: number): number {
  if (amount < 0) throw new Error('Amount must be non-negative');
  const def = CO2_CATEGORIES.find((c) => c.id === category);
  if (!def) throw new Error(`Unknown category: ${category}`);
  return amount * def.kgCO2PerUnit;
}

export function calcTotal(inputs: CategoryInput[]): TotalResult {
  const perCategory = inputs.map((input) => ({
    categoryId: input.categoryId,
    kgCO2: calcCO2(input.categoryId, input.amount),
  }));
  const totalKgCO2 = perCategory.reduce((sum, c) => sum + c.kgCO2, 0);
  return {
    totalKgCO2,
    perCategory,
    japanAverageKgCO2PerYear: JAPAN_AVERAGE_KG_CO2_PER_YEAR,
  };
}
