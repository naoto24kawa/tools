// 日本肥満学会基準（BMI 25以上を肥満と定義。WHOの overweight 区分は採用しない）
export type BMICategory = 'underweight' | 'normal' | 'obese1' | 'obese2' | 'obese3' | 'obese4';

export interface BMIResult {
  bmi: number;
  category: BMICategory;
  label: string;
  standardWeight: number;
}

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
