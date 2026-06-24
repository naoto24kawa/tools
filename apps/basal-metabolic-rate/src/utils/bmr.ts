export interface BMRParams {
  heightCm: number;
  weightKg: number;
  age: number;
  gender: 'male' | 'female';
}

export type ActivityLevel = 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active';

export interface ActivityLevelDef {
  id: ActivityLevel;
  label: string;
  description: string;
  factor: number;
}

export const ACTIVITY_LEVELS: ActivityLevelDef[] = [
  { id: 'sedentary', label: '座業中心', description: 'ほぼ運動しない、デスクワーク', factor: 1.2 },
  { id: 'light', label: '軽い運動', description: '週1〜3回の軽い運動', factor: 1.375 },
  { id: 'moderate', label: '中程度の運動', description: '週3〜5回の適度な運動', factor: 1.55 },
  { id: 'active', label: '活発な運動', description: '週6〜7回のハードな運動', factor: 1.725 },
  { id: 'very_active', label: '非常に活発', description: '毎日激しい運動、肉体労働', factor: 1.9 },
];

function validateParams(params: BMRParams) {
  if (params.weightKg <= 0) throw new Error('Weight must be positive');
  if (params.heightCm <= 0) throw new Error('Height must be positive');
  if (params.age <= 0) throw new Error('Age must be positive');
}

/** Harris-Benedict 改訂版（1984年） */
export function calcHarrisBenedict(params: BMRParams): number {
  validateParams(params);
  const { heightCm, weightKg, age, gender } = params;
  if (gender === 'male') {
    return 88.362 + (13.397 * weightKg) + (4.799 * heightCm) - (5.677 * age);
  }
  return 447.593 + (9.247 * weightKg) + (3.098 * heightCm) - (4.330 * age);
}

/** Mifflin-St Jeor 式（1990年） */
export function calcMifflin(params: BMRParams): number {
  validateParams(params);
  const { heightCm, weightKg, age, gender } = params;
  const base = (10 * weightKg) + (6.25 * heightCm) - (5 * age);
  return gender === 'male' ? base + 5 : base - 161;
}

/** TDEE = BMR × 活動係数 */
export function calcTDEE(bmr: number, activityLevel: ActivityLevel): number {
  const def = ACTIVITY_LEVELS.find((a) => a.id === activityLevel);
  if (!def) throw new Error(`Unknown activity level: ${activityLevel}`);
  return bmr * def.factor;
}
