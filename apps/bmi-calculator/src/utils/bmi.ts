export type BMICategory = 'underweight' | 'normal' | 'overweight' | 'obese1' | 'obese2' | 'obese3' | 'obese4';

export interface BMIResult {
  bmi: number;
  category: BMICategory;
  label: string;
  standardWeight: number;
}

interface CategoryDef {
  category: BMICategory;
  label: string;
  minBMI: number;
}

// 日本肥満学会基準（BMI 25以上を肥満と定義）
const CATEGORIES: CategoryDef[] = [
  { category: 'underweight', label: '低体重', minBMI: 0 },
  { category: 'normal', label: '普通体重', minBMI: 18.5 },
  { category: 'overweight', label: '過体重（前肥満）', minBMI: 25 },
  { category: 'obese1', label: '肥満（1度）', minBMI: 25 },
  { category: 'obese2', label: '肥満（2度）', minBMI: 30 },
  { category: 'obese3', label: '肥満（3度）', minBMI: 35 },
  { category: 'obese4', label: '肥満（4度）', minBMI: 40 },
];

function getCategory(bmi: number): { category: BMICategory; label: string } {
  if (bmi < 18.5) return { category: 'underweight', label: '低体重' };
  if (bmi < 25) return { category: 'normal', label: '普通体重' };
  if (bmi < 30) return { category: 'obese1', label: '肥満（1度）' };
  if (bmi < 35) return { category: 'obese2', label: '肥満（2度）' };
  if (bmi < 40) return { category: 'obese3', label: '肥満（3度）' };
  return { category: 'obese4', label: '肥満（4度）' };
}

export function calcBMI(heightCm: number, weightKg: number): BMIResult {
  if (heightCm <= 0) throw new Error('Height must be positive');
  if (weightKg <= 0) throw new Error('Weight must be positive');

  const heightM = heightCm / 100;
  const bmi = weightKg / (heightM * heightM);
  const { category, label } = getCategory(bmi);
  const standardWeight = heightM * heightM * 22;

  return { bmi, category, label, standardWeight };
}

export function getIdealWeightRange(heightCm: number): { min: number; max: number } {
  if (heightCm <= 0) throw new Error('Height must be positive');
  const heightM = heightCm / 100;
  return {
    min: heightM * heightM * 18.5,
    max: heightM * heightM * 24.9,
  };
}
