# PR-3: Health Tools Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** `apps/` に 3 つの健康系ツールを追加し、`packages/router/src/config/apps.ts` に `Health` カテゴリと合わせて登録する。

**Architecture:** 各ツールは独立 SPA。`src/utils/<name>.ts` にコアロジック（純粋関数）、`src/utils/__tests__/<name>.test.ts` にユニットテスト、`src/App.tsx` に UI を実装する。

**Tech Stack:** React 19, TypeScript (strict), Vite+, Tailwind CSS 3.4, shadcn/ui, Vitest

## Global Constraints

- ポート番号: bmi-calculator=5465, calorie-burn-calculator=5466, basal-metabolic-rate=5467
- ボタン要素には必ず `type="button"` を付与
- 身体的な計算は WHO/日本肥満学会の公式に準拠
- テストは Vitest (`describe` / `it` / `expect`)
- `apps.ts` への追記は最後の Task 4 でまとめて行う

---

### Task 1: apps.ts に `Health` カテゴリを追加

**Files:**
- Modify: `packages/router/src/config/apps.ts:8`

- [ ] **Step 1: AppCategory 型に追記**

```typescript
export type AppCategory =
  | 'Text' | 'Encode' | 'Crypto' | 'Number' | 'DateTime'
  | 'JSON' | 'Code' | 'Color / CSS' | 'Image' | 'PDF'
  | 'Video' | 'Generator' | 'Network'
  | 'Design' | 'Finance' | 'Health';
```

- [ ] **Step 2: 型チェック**

```bash
cd packages/router && npx tsc --noEmit
```

Expected: エラーなし

- [ ] **Step 3: コミット**

```bash
git add packages/router/src/config/apps.ts
git commit -m "feat(router): add Health category to AppCategory"
```

---

### Task 2: `bmi-calculator` — BMI・標準体重計算

**Files:**
- Create: `apps/bmi-calculator/`
- Create: `apps/bmi-calculator/src/utils/bmi.ts`
- Create: `apps/bmi-calculator/src/utils/__tests__/bmi.test.ts`
- Create: `apps/bmi-calculator/src/App.tsx`

**Interfaces:**
- Produces:
  - `calcBMI(heightCm: number, weightKg: number): BMIResult`
  - `getIdealWeightRange(heightCm: number): { min: number; max: number }`
  - `interface BMIResult { bmi: number; category: BMICategory; label: string; standardWeight: number }`
  - `type BMICategory = 'underweight' | 'normal' | 'overweight' | 'obese1' | 'obese2' | 'obese3' | 'obese4'`

- [ ] **Step 1: スキャフォールド生成**

```bash
node scripts/create-app.js bmi-calculator "BMI・標準体重・肥満度計算"
```

`apps/bmi-calculator/vite.config.ts` の `port` を `5465` に変更。

- [ ] **Step 2: ユニットテストを書く**

`apps/bmi-calculator/src/utils/__tests__/bmi.test.ts`:

```typescript
import { describe, it, expect } from 'vitest';
import { calcBMI, getIdealWeightRange } from '../bmi';

describe('bmi', () => {
  describe('calcBMI', () => {
    it('身長170cm・体重60kg → BMI約20.8（普通体重）', () => {
      const result = calcBMI(170, 60);
      // 60 / (1.7 * 1.7) = 20.76...
      expect(result.bmi).toBeCloseTo(20.76, 1);
      expect(result.category).toBe('normal');
    });

    it('BMI 18.5未満 → 低体重', () => {
      const result = calcBMI(170, 50);
      expect(result.category).toBe('underweight');
    });

    it('BMI 25以上30未満 → 肥満（1度）', () => {
      // 170cm 73kg: 73/2.89 ≈ 25.26
      const result = calcBMI(170, 73);
      expect(result.category).toBe('obese1');
    });

    it('BMI 35以上 → 肥満（3度）', () => {
      const result = calcBMI(170, 102);
      expect(result.category).toBe('obese3');
    });

    it('標準体重 = 身長(m)^2 × 22', () => {
      const result = calcBMI(170, 60);
      // 1.7^2 * 22 = 63.58
      expect(result.standardWeight).toBeCloseTo(63.58, 1);
    });

    it('身長0は例外を投げる', () => {
      expect(() => calcBMI(0, 60)).toThrow('Height must be positive');
    });

    it('体重0は例外を投げる', () => {
      expect(() => calcBMI(170, 0)).toThrow('Weight must be positive');
    });
  });

  describe('getIdealWeightRange', () => {
    it('身長170cm → BMI 18.5〜25の範囲を返す', () => {
      const range = getIdealWeightRange(170);
      // min: 1.7^2 * 18.5 = 53.46
      // max: 1.7^2 * 24.9 = 71.91
      expect(range.min).toBeCloseTo(53.5, 0);
      expect(range.max).toBeCloseTo(71.9, 0);
    });
  });
});
```

- [ ] **Step 3: テストが失敗することを確認**

```bash
cd apps/bmi-calculator && vp test
```

Expected: FAIL

- [ ] **Step 4: ユーティリティを実装**

`apps/bmi-calculator/src/utils/bmi.ts`:

```typescript
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
```

- [ ] **Step 5: テストが通ることを確認**

```bash
cd apps/bmi-calculator && vp test
```

Expected: PASS

- [ ] **Step 6: App.tsx を実装**

`apps/bmi-calculator/src/App.tsx`:

```typescript
import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Toaster } from '@/components/ui/toaster';
import { calcBMI, getIdealWeightRange } from '@/utils/bmi';

const CATEGORY_COLORS: Record<string, string> = {
  underweight: 'text-blue-600 dark:text-blue-400',
  normal: 'text-green-600 dark:text-green-400',
  obese1: 'text-yellow-600 dark:text-yellow-400',
  obese2: 'text-orange-600 dark:text-orange-400',
  obese3: 'text-red-600 dark:text-red-400',
  obese4: 'text-red-800 dark:text-red-300',
};

export default function App() {
  const [height, setHeight] = useState('170');
  const [weight, setWeight] = useState('60');
  const [unit, setUnit] = useState<'metric' | 'imperial'>('metric');

  const toMetric = (h: string, w: string) => {
    if (unit === 'metric') return { h: Number(h), w: Number(w) };
    return { h: Number(h) * 2.54, w: Number(w) * 0.453592 };
  };

  const { h: heightCm, w: weightKg } = toMetric(height, weight);

  const result = useMemo(() => {
    try { return calcBMI(heightCm, weightKg); }
    catch { return null; }
  }, [heightCm, weightKg]);

  const range = useMemo(() => {
    try { return getIdealWeightRange(heightCm); }
    catch { return null; }
  }, [heightCm]);

  const bmiPercent = result ? Math.min(100, Math.max(0, ((result.bmi - 10) / 40) * 100)) : 0;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
      <div className="max-w-xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">BMI Calculator</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">BMI・標準体重・肥満度計算（日本肥満学会基準）</p>
        </div>

        <div className="flex gap-2">
          <Button type="button" variant={unit === 'metric' ? 'default' : 'outline'} onClick={() => setUnit('metric')}>cm / kg</Button>
          <Button type="button" variant={unit === 'imperial' ? 'default' : 'outline'} onClick={() => setUnit('imperial')}>in / lb</Button>
        </div>

        <Card>
          <CardContent className="pt-6 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>身長 ({unit === 'metric' ? 'cm' : 'in'})</Label>
                <Input type="number" min="50" value={height} onChange={(e) => setHeight(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>体重 ({unit === 'metric' ? 'kg' : 'lb'})</Label>
                <Input type="number" min="1" value={weight} onChange={(e) => setWeight(e.target.value)} />
              </div>
            </div>
          </CardContent>
        </Card>

        {result && (
          <>
            <Card>
              <CardContent className="pt-6 text-center space-y-3">
                <p className="text-gray-500">BMI</p>
                <p className={`text-5xl font-bold ${CATEGORY_COLORS[result.category]}`}>
                  {result.bmi.toFixed(1)}
                </p>
                <p className={`text-lg font-semibold ${CATEGORY_COLORS[result.category]}`}>
                  {result.label}
                </p>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 mt-2">
                  <div
                    className="h-3 rounded-full bg-gradient-to-r from-blue-400 via-green-400 to-red-500"
                    style={{ width: `${bmiPercent}%` }}
                  />
                </div>
                <p className="text-xs text-gray-400">10 ← BMI → 50</p>
              </CardContent>
            </Card>

            <div className="grid grid-cols-2 gap-4">
              <Card>
                <CardContent className="pt-4 text-center">
                  <p className="text-xs text-gray-500">標準体重</p>
                  <p className="text-xl font-bold">{result.standardWeight.toFixed(1)} kg</p>
                  <p className="text-xs text-gray-400">(BMI 22)</p>
                </CardContent>
              </Card>
              {range && (
                <Card>
                  <CardContent className="pt-4 text-center">
                    <p className="text-xs text-gray-500">健康体重範囲</p>
                    <p className="text-sm font-bold">{range.min.toFixed(1)}〜{range.max.toFixed(1)} kg</p>
                    <p className="text-xs text-gray-400">(BMI 18.5〜24.9)</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </>
        )}
      </div>
      <Toaster />
    </div>
  );
}
```

- [ ] **Step 7: ローカル動作確認**

```bash
cd apps/bmi-calculator && vp dev
```

`http://localhost:5465` を開き、身長170cm・体重60kgでBMI≈20.8・普通体重が表示されることを確認。

- [ ] **Step 8: コミット**

```bash
git add apps/bmi-calculator/
git commit -m "feat: add bmi-calculator tool"
```

---

### Task 3: `calorie-burn-calculator` — 消費カロリー計算

**Files:**
- Create: `apps/calorie-burn-calculator/`
- Create: `apps/calorie-burn-calculator/src/utils/calorieBurn.ts`
- Create: `apps/calorie-burn-calculator/src/utils/__tests__/calorieBurn.test.ts`
- Create: `apps/calorie-burn-calculator/src/App.tsx`

**Interfaces:**
- Produces:
  - `calcCalorieBurn(weightKg: number, metValue: number, minutes: number): CalorieBurnResult`
  - `EXERCISES: ExerciseDef[]`
  - `interface ExerciseDef { id: string; name: string; category: string; met: number }`
  - `interface CalorieBurnResult { kcal: number; fatGrams: number }`

- [ ] **Step 1: スキャフォールド生成**

```bash
node scripts/create-app.js calorie-burn-calculator "運動種目別消費カロリー計算（MET値使用）"
```

`apps/calorie-burn-calculator/vite.config.ts` の `port` を `5466` に変更。

- [ ] **Step 2: ユニットテストを書く**

`apps/calorie-burn-calculator/src/utils/__tests__/calorieBurn.test.ts`:

```typescript
import { describe, it, expect } from 'vitest';
import { calcCalorieBurn, EXERCISES } from '../calorieBurn';

describe('calorieBurn', () => {
  describe('calcCalorieBurn', () => {
    it('体重60kg・MET=3.5・60分 → 消費カロリー', () => {
      // kcal = 3.5 × 60 × 1 × 1.05 = 220.5
      const result = calcCalorieBurn(60, 3.5, 60);
      expect(result.kcal).toBeCloseTo(220.5, 0);
    });

    it('脂肪燃焼量 = kcal / 7.2', () => {
      const result = calcCalorieBurn(60, 3.5, 60);
      expect(result.fatGrams).toBeCloseTo(result.kcal / 7.2, 1);
    });

    it('ゼロ分は0kcalを返す', () => {
      const result = calcCalorieBurn(60, 3.5, 0);
      expect(result.kcal).toBe(0);
    });

    it('体重0は例外を投げる', () => {
      expect(() => calcCalorieBurn(0, 3.5, 60)).toThrow('Weight must be positive');
    });

    it('MET値0は例外を投げる', () => {
      expect(() => calcCalorieBurn(60, 0, 60)).toThrow('MET value must be positive');
    });

    it('分数負値は例外を投げる', () => {
      expect(() => calcCalorieBurn(60, 3.5, -1)).toThrow('Minutes must be non-negative');
    });
  });

  describe('EXERCISES', () => {
    it('50種類以上の運動が定義されている', () => {
      expect(EXERCISES.length).toBeGreaterThanOrEqual(50);
    });

    it('各エントリに id, name, category, met が存在する', () => {
      for (const ex of EXERCISES) {
        expect(typeof ex.id).toBe('string');
        expect(typeof ex.name).toBe('string');
        expect(typeof ex.category).toBe('string');
        expect(ex.met).toBeGreaterThan(0);
      }
    });
  });
});
```

- [ ] **Step 3: テストが失敗することを確認**

```bash
cd apps/calorie-burn-calculator && vp test
```

Expected: FAIL

- [ ] **Step 4: ユーティリティを実装**

`apps/calorie-burn-calculator/src/utils/calorieBurn.ts`:

```typescript
export interface ExerciseDef {
  id: string;
  name: string;
  category: string;
  met: number;
}

export interface CalorieBurnResult {
  kcal: number;
  fatGrams: number;
}

// MET値テーブル（厚生労働省・ACSMの身体活動のメッツ表をベース）
export const EXERCISES: ExerciseDef[] = [
  // 歩行
  { id: 'walk_slow', name: 'ゆっくり歩く (3km/h)', category: '歩行', met: 2.5 },
  { id: 'walk_normal', name: '普通歩き (4km/h)', category: '歩行', met: 3.0 },
  { id: 'walk_fast', name: '速歩き (5.5km/h)', category: '歩行', met: 4.3 },
  { id: 'walk_brisk', name: 'ウォーキング (6.5km/h)', category: '歩行', met: 5.0 },
  // ランニング
  { id: 'run_slow', name: 'ジョギング (7km/h)', category: 'ランニング', met: 7.0 },
  { id: 'run_normal', name: 'ランニング (8km/h)', category: 'ランニング', met: 8.3 },
  { id: 'run_fast', name: 'ランニング (10km/h)', category: 'ランニング', met: 10.0 },
  { id: 'run_sprint', name: 'スプリント (12km/h)', category: 'ランニング', met: 12.3 },
  { id: 'marathon', name: 'マラソン', category: 'ランニング', met: 13.3 },
  // 自転車
  { id: 'bike_slow', name: '自転車 (低速 <16km/h)', category: '自転車', met: 4.0 },
  { id: 'bike_normal', name: '自転車 (中速 16-19km/h)', category: '自転車', met: 6.0 },
  { id: 'bike_fast', name: '自転車 (高速 20-22km/h)', category: '自転車', met: 8.0 },
  { id: 'bike_racing', name: '自転車 (レース)', category: '自転車', met: 12.0 },
  // 水泳
  { id: 'swim_slow', name: '水泳（ゆっくり）', category: '水泳', met: 5.0 },
  { id: 'swim_normal', name: '水泳（クロール 中速）', category: '水泳', met: 7.0 },
  { id: 'swim_fast', name: '水泳（クロール 速い）', category: '水泳', met: 10.0 },
  { id: 'swim_back', name: '背泳ぎ', category: '水泳', met: 4.8 },
  { id: 'swim_breast', name: '平泳ぎ', category: '水泳', met: 5.3 },
  { id: 'swim_butterfly', name: 'バタフライ', category: '水泳', met: 13.8 },
  // 筋トレ
  { id: 'weight_light', name: '筋トレ（軽い）', category: '筋トレ', met: 3.0 },
  { id: 'weight_moderate', name: '筋トレ（中程度）', category: '筋トレ', met: 5.0 },
  { id: 'weight_heavy', name: '筋トレ（高強度）', category: '筋トレ', met: 6.0 },
  { id: 'pushup', name: '腕立て伏せ', category: '筋トレ', met: 3.8 },
  { id: 'situp', name: '腹筋', category: '筋トレ', met: 2.8 },
  { id: 'squat', name: 'スクワット', category: '筋トレ', met: 5.0 },
  // 有酸素運動
  { id: 'aerobics_low', name: 'エアロビクス（低強度）', category: '有酸素運動', met: 5.0 },
  { id: 'aerobics_high', name: 'エアロビクス（高強度）', category: '有酸素運動', met: 7.3 },
  { id: 'yoga', name: 'ヨガ', category: '有酸素運動', met: 2.5 },
  { id: 'pilates', name: 'ピラティス', category: '有酸素運動', met: 3.0 },
  { id: 'stretching', name: 'ストレッチ', category: '有酸素運動', met: 2.3 },
  { id: 'hiit', name: 'HIIT', category: '有酸素運動', met: 8.0 },
  // スポーツ
  { id: 'soccer', name: 'サッカー（試合）', category: 'スポーツ', met: 10.0 },
  { id: 'basketball', name: 'バスケットボール', category: 'スポーツ', met: 8.0 },
  { id: 'tennis', name: 'テニス（シングルス）', category: 'スポーツ', met: 8.0 },
  { id: 'badminton', name: 'バドミントン', category: 'スポーツ', met: 7.0 },
  { id: 'volleyball', name: 'バレーボール', category: 'スポーツ', met: 4.0 },
  { id: 'baseball', name: '野球', category: 'スポーツ', met: 5.0 },
  { id: 'golf', name: 'ゴルフ（ラウンド）', category: 'スポーツ', met: 4.8 },
  { id: 'table_tennis', name: '卓球', category: 'スポーツ', met: 4.0 },
  { id: 'bowling', name: 'ボーリング', category: 'スポーツ', met: 3.0 },
  { id: 'skiing', name: 'スキー（ダウンヒル）', category: 'スポーツ', met: 6.8 },
  { id: 'snowboard', name: 'スノーボード', category: 'スポーツ', met: 5.3 },
  // 日常活動
  { id: 'stair_climb', name: '階段昇降', category: '日常活動', met: 4.0 },
  { id: 'housework', name: '掃除（軽い）', category: '日常活動', met: 2.5 },
  { id: 'housework_heavy', name: '掃除（重い）', category: '日常活動', met: 3.5 },
  { id: 'cooking', name: '料理', category: '日常活動', met: 2.0 },
  { id: 'shopping', name: '買い物', category: '日常活動', met: 2.3 },
  { id: 'gardening', name: '庭仕事', category: '日常活動', met: 3.5 },
  { id: 'dancing', name: 'ダンス（一般）', category: '日常活動', met: 4.8 },
  { id: 'rope_jump', name: '縄跳び', category: '日常活動', met: 10.0 },
  { id: 'hula_hoop', name: 'フラフープ', category: '日常活動', met: 3.0 },
];

/** 消費カロリー = MET × 体重(kg) × 時間(h) × 1.05 */
export function calcCalorieBurn(
  weightKg: number,
  metValue: number,
  minutes: number,
): CalorieBurnResult {
  if (weightKg <= 0) throw new Error('Weight must be positive');
  if (metValue <= 0) throw new Error('MET value must be positive');
  if (minutes < 0) throw new Error('Minutes must be non-negative');

  const kcal = metValue * weightKg * (minutes / 60) * 1.05;
  const fatGrams = kcal / 7.2;

  return { kcal, fatGrams };
}
```

- [ ] **Step 5: テストが通ることを確認**

```bash
cd apps/calorie-burn-calculator && vp test
```

Expected: PASS

- [ ] **Step 6: App.tsx を実装**

`apps/calorie-burn-calculator/src/App.tsx`:

```typescript
import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { Toaster } from '@/components/ui/toaster';
import { Plus, Trash2 } from 'lucide-react';
import { calcCalorieBurn, EXERCISES } from '@/utils/calorieBurn';

const CATEGORIES = Array.from(new Set(EXERCISES.map((e) => e.category)));

interface ExerciseEntry {
  id: string;
  exerciseId: string;
  minutes: string;
}

let counter = 0;
const newId = () => String(++counter);

export default function App() {
  const [weight, setWeight] = useState('60');
  const [entries, setEntries] = useState<ExerciseEntry[]>([
    { id: newId(), exerciseId: 'walk_normal', minutes: '30' },
  ]);
  const [selectedCategory, setSelectedCategory] = useState(CATEGORIES[0]);

  const addEntry = () =>
    setEntries((prev) => [
      ...prev,
      { id: newId(), exerciseId: EXERCISES.find((e) => e.category === selectedCategory)?.id ?? EXERCISES[0].id, minutes: '30' },
    ]);

  const removeEntry = (id: string) => setEntries((prev) => prev.filter((e) => e.id !== id));

  const updateEntry = (id: string, field: 'exerciseId' | 'minutes', value: string) =>
    setEntries((prev) => prev.map((e) => (e.id === id ? { ...e, [field]: value } : e)));

  const totalResult = useMemo(() => {
    const w = Number(weight);
    if (!w) return null;
    let totalKcal = 0;
    for (const entry of entries) {
      const ex = EXERCISES.find((e) => e.id === entry.exerciseId);
      if (!ex) continue;
      try {
        const r = calcCalorieBurn(w, ex.met, Number(entry.minutes));
        totalKcal += r.kcal;
      } catch { /* skip invalid entries */ }
    }
    return { kcal: totalKcal, fatGrams: totalKcal / 7.2 };
  }, [weight, entries]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
      <div className="max-w-2xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Calorie Burn Calculator</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">運動種目別消費カロリー計算（MET値使用）</p>
        </div>

        <Card>
          <CardContent className="pt-6">
            <div className="space-y-2">
              <Label>体重 (kg)</Label>
              <Input type="number" min="1" max="300" value={weight} onChange={(e) => setWeight(e.target.value)} className="w-32" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between flex-wrap gap-2">
              <CardTitle>運動リスト</CardTitle>
              <div className="flex gap-2 items-center">
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="w-36"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                  </SelectContent>
                </Select>
                <Button type="button" variant="outline" size="sm" onClick={addEntry}>
                  <Plus className="h-4 w-4 mr-1" />追加
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {entries.map((entry) => {
              const ex = EXERCISES.find((e) => e.id === entry.exerciseId);
              const result = ex && Number(weight) > 0
                ? calcCalorieBurn(Number(weight), ex.met, Number(entry.minutes))
                : null;
              return (
                <div key={entry.id} className="flex gap-2 items-start">
                  <div className="flex-1 space-y-1">
                    <Select value={entry.exerciseId} onValueChange={(v) => updateEntry(entry.id, 'exerciseId', v)}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {EXERCISES.map((e) => (
                          <SelectItem key={e.id} value={e.id}>{e.name} (MET {e.met})</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="w-24">
                    <Input type="number" min="0" placeholder="分" value={entry.minutes} onChange={(e) => updateEntry(entry.id, 'minutes', e.target.value)} />
                  </div>
                  {result && (
                    <div className="text-sm text-right w-20 pt-2">
                      <p className="font-bold text-orange-600 dark:text-orange-400">{result.kcal.toFixed(0)} kcal</p>
                    </div>
                  )}
                  <Button type="button" variant="ghost" size="icon" onClick={() => removeEntry(entry.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              );
            })}
          </CardContent>
        </Card>

        {totalResult && totalResult.kcal > 0 && (
          <Card>
            <CardContent className="pt-6">
              <div className="grid grid-cols-2 gap-4 text-center">
                <div>
                  <p className="text-gray-500 text-sm">合計消費カロリー</p>
                  <p className="text-3xl font-bold text-orange-600 dark:text-orange-400">{totalResult.kcal.toFixed(0)} kcal</p>
                </div>
                <div>
                  <p className="text-gray-500 text-sm">脂肪燃焼量（推定）</p>
                  <p className="text-3xl font-bold text-yellow-600 dark:text-yellow-400">{totalResult.fatGrams.toFixed(1)} g</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
      <Toaster />
    </div>
  );
}
```

- [ ] **Step 7: ローカル動作確認**

```bash
cd apps/calorie-burn-calculator && vp dev
```

`http://localhost:5466` を開き、体重60kg・普通歩き30分で ≈110kcal が表示されることを確認。

- [ ] **Step 8: コミット**

```bash
git add apps/calorie-burn-calculator/
git commit -m "feat: add calorie-burn-calculator tool"
```

---

### Task 4: `basal-metabolic-rate` — 基礎代謝・TDEE計算

**Files:**
- Create: `apps/basal-metabolic-rate/`
- Create: `apps/basal-metabolic-rate/src/utils/bmr.ts`
- Create: `apps/basal-metabolic-rate/src/utils/__tests__/bmr.test.ts`
- Create: `apps/basal-metabolic-rate/src/App.tsx`

**Interfaces:**
- Produces:
  - `calcHarrisBenedict(params: BMRParams): number`
  - `calcMifflin(params: BMRParams): number`
  - `calcTDEE(bmr: number, activityLevel: ActivityLevel): number`
  - `interface BMRParams { heightCm: number; weightKg: number; age: number; gender: 'male' | 'female' }`
  - `type ActivityLevel = 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active'`
  - `ACTIVITY_LEVELS: ActivityLevelDef[]`

- [ ] **Step 1: スキャフォールド生成**

```bash
node scripts/create-app.js basal-metabolic-rate "基礎代謝・1日の必要カロリー計算"
```

`apps/basal-metabolic-rate/vite.config.ts` の `port` を `5467` に変更。

- [ ] **Step 2: ユニットテストを書く**

`apps/basal-metabolic-rate/src/utils/__tests__/bmr.test.ts`:

```typescript
import { describe, it, expect } from 'vitest';
import { calcHarrisBenedict, calcMifflin, calcTDEE } from '../bmr';

const maleParams = { heightCm: 175, weightKg: 70, age: 30, gender: 'male' as const };
const femaleParams = { heightCm: 160, weightKg: 55, age: 30, gender: 'female' as const };

describe('bmr', () => {
  describe('calcHarrisBenedict', () => {
    it('男性のBMRを計算', () => {
      // 男性: 88.362 + (13.397×70) + (4.799×175) - (5.677×30)
      // = 88.362 + 937.79 + 839.825 - 170.31 = 1695.667
      const bmr = calcHarrisBenedict(maleParams);
      expect(bmr).toBeCloseTo(1695.7, 0);
    });

    it('女性のBMRを計算', () => {
      // 女性: 447.593 + (9.247×55) + (3.098×160) - (4.330×30)
      // = 447.593 + 508.585 + 495.68 - 129.9 = 1321.958
      const bmr = calcHarrisBenedict(femaleParams);
      expect(bmr).toBeCloseTo(1321.9, 0);
    });

    it('体重0は例外を投げる', () => {
      expect(() => calcHarrisBenedict({ ...maleParams, weightKg: 0 })).toThrow('Weight must be positive');
    });
  });

  describe('calcMifflin', () => {
    it('男性のBMRを計算（ミフリン式）', () => {
      // 男性: (10×70) + (6.25×175) - (5×30) + 5 = 700 + 1093.75 - 150 + 5 = 1648.75
      const bmr = calcMifflin(maleParams);
      expect(bmr).toBeCloseTo(1648.75, 0);
    });

    it('女性のBMRを計算（ミフリン式）', () => {
      // 女性: (10×55) + (6.25×160) - (5×30) - 161 = 550 + 1000 - 150 - 161 = 1239
      const bmr = calcMifflin(femaleParams);
      expect(bmr).toBeCloseTo(1239, 0);
    });
  });

  describe('calcTDEE', () => {
    it('sedentary: BMR × 1.2', () => {
      const tdee = calcTDEE(1700, 'sedentary');
      expect(tdee).toBeCloseTo(2040, 0);
    });

    it('very_active: BMR × 1.9', () => {
      const tdee = calcTDEE(1700, 'very_active');
      expect(tdee).toBeCloseTo(3230, 0);
    });
  });
});
```

- [ ] **Step 3: テストが失敗することを確認**

```bash
cd apps/basal-metabolic-rate && vp test
```

Expected: FAIL

- [ ] **Step 4: ユーティリティを実装**

`apps/basal-metabolic-rate/src/utils/bmr.ts`:

```typescript
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
```

- [ ] **Step 5: テストが通ることを確認**

```bash
cd apps/basal-metabolic-rate && vp test
```

Expected: PASS

- [ ] **Step 6: App.tsx を実装**

`apps/basal-metabolic-rate/src/App.tsx`:

```typescript
import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { Toaster } from '@/components/ui/toaster';
import {
  calcHarrisBenedict, calcMifflin, calcTDEE,
  ACTIVITY_LEVELS, type ActivityLevel,
} from '@/utils/bmr';

type Formula = 'harris' | 'mifflin';

const fmt = (n: number) => Math.round(n).toLocaleString('ja-JP');

export default function App() {
  const [height, setHeight] = useState('170');
  const [weight, setWeight] = useState('65');
  const [age, setAge] = useState('30');
  const [gender, setGender] = useState<'male' | 'female'>('male');
  const [activity, setActivity] = useState<ActivityLevel>('moderate');
  const [formula, setFormula] = useState<Formula>('mifflin');

  const params = {
    heightCm: Number(height),
    weightKg: Number(weight),
    age: Number(age),
    gender,
  };

  const result = useMemo(() => {
    try {
      const bmrHarris = calcHarrisBenedict(params);
      const bmrMifflin = calcMifflin(params);
      const bmr = formula === 'harris' ? bmrHarris : bmrMifflin;
      const tdee = calcTDEE(bmr, activity);
      return { bmrHarris, bmrMifflin, bmr, tdee };
    } catch { return null; }
  }, [height, weight, age, gender, activity, formula]);

  const targets = result ? [
    { label: '減量 (−500kcal)', kcal: result.tdee - 500 },
    { label: '維持', kcal: result.tdee },
    { label: '増量 (+500kcal)', kcal: result.tdee + 500 },
  ] : [];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
      <div className="max-w-2xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Basal Metabolic Rate</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">基礎代謝・1日の必要カロリー計算</p>
        </div>

        <Card>
          <CardHeader><CardTitle>身体情報</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2"><Label>身長 (cm)</Label><Input type="number" min="100" max="250" value={height} onChange={(e) => setHeight(e.target.value)} /></div>
              <div className="space-y-2"><Label>体重 (kg)</Label><Input type="number" min="20" max="300" value={weight} onChange={(e) => setWeight(e.target.value)} /></div>
              <div className="space-y-2"><Label>年齢</Label><Input type="number" min="1" max="120" value={age} onChange={(e) => setAge(e.target.value)} /></div>
              <div className="space-y-2">
                <Label>性別</Label>
                <div className="flex gap-2">
                  <Button type="button" variant={gender === 'male' ? 'default' : 'outline'} onClick={() => setGender('male')}>男性</Button>
                  <Button type="button" variant={gender === 'female' ? 'default' : 'outline'} onClick={() => setGender('female')}>女性</Button>
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <Label>活動レベル</Label>
              <Select value={activity} onValueChange={(v) => setActivity(v as ActivityLevel)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {ACTIVITY_LEVELS.map((a) => (
                    <SelectItem key={a.id} value={a.id}>{a.label} — {a.description}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>計算式</Label>
              <div className="flex gap-2">
                <Button type="button" variant={formula === 'mifflin' ? 'default' : 'outline'} onClick={() => setFormula('mifflin')}>Mifflin-St Jeor</Button>
                <Button type="button" variant={formula === 'harris' ? 'default' : 'outline'} onClick={() => setFormula('harris')}>Harris-Benedict</Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {result && (
          <>
            <div className="grid grid-cols-2 gap-4">
              <Card>
                <CardContent className="pt-4 text-center">
                  <p className="text-xs text-gray-500">基礎代謝 (BMR)</p>
                  <p className="text-2xl font-bold">{fmt(result.bmr)} kcal</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-4 text-center">
                  <p className="text-xs text-gray-500">1日の消費カロリー (TDEE)</p>
                  <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{fmt(result.tdee)} kcal</p>
                </CardContent>
              </Card>
            </div>
            <Card>
              <CardHeader><CardTitle>目標カロリー目安</CardTitle></CardHeader>
              <CardContent className="space-y-2">
                {targets.map((t) => (
                  <div key={t.label} className="flex justify-between items-center bg-gray-100 dark:bg-gray-800 rounded-lg px-4 py-2">
                    <span className="text-sm text-gray-600 dark:text-gray-400">{t.label}</span>
                    <span className="font-bold">{fmt(t.kcal)} kcal/日</span>
                  </div>
                ))}
              </CardContent>
            </Card>
          </>
        )}
      </div>
      <Toaster />
    </div>
  );
}
```

- [ ] **Step 7: ローカル動作確認**

```bash
cd apps/basal-metabolic-rate && vp dev
```

`http://localhost:5467` を開き、男性・175cm・70kg・30歳・中程度の運動で TDEE ≈ 2556 kcal が表示されることを確認。

- [ ] **Step 8: コミット**

```bash
git add apps/basal-metabolic-rate/
git commit -m "feat: add basal-metabolic-rate tool"
```

---

### Task 5: apps.ts に PR-3 の 3 ツールを登録

**Files:**
- Modify: `packages/router/src/config/apps.ts`

- [ ] **Step 1: APPS_CONFIG 配列に追記**

```typescript
  // ── Health ──
  { path: '/bmi-calculator', url: 'https://tools-bmi-calculator.elchika.app', icon: '⚖️', displayName: 'BMI Calculator', description: 'BMI・標準体重・肥満度計算', category: 'Health' },
  { path: '/calorie-burn-calculator', url: 'https://tools-calorie-burn-calculator.elchika.app', icon: '🔥', displayName: 'Calorie Burn', description: '運動種目別消費カロリー計算（MET値）', category: 'Health' },
  { path: '/basal-metabolic-rate', url: 'https://tools-basal-metabolic-rate.elchika.app', icon: '💪', displayName: 'BMR Calculator', description: '基礎代謝・1日の必要カロリー計算', category: 'Health' },
```

- [ ] **Step 2: 型チェック**

```bash
cd packages/router && npx tsc --noEmit
```

Expected: エラーなし

- [ ] **Step 3: コミット**

```bash
git add packages/router/src/config/apps.ts
git commit -m "feat(router): register PR-3 Health tools in apps.ts"
```

---

## Self-Review Checklist

- [x] Spec 要件カバー: bmi-calculator (BMI・標準体重・範囲・ゲージ) ✅, calorie-burn-calculator (MET値・50種以上・複数運動合計) ✅, basal-metabolic-rate (Harris-Benedict・Mifflin・TDEE・目標カロリー) ✅
- [x] プレースホルダーなし
- [x] 型の一貫性: 全ツールで params/result が utils と App.tsx で統一されている
- [x] 計算式の出典: BMR は Harris-Benedict 1984改訂版 / Mifflin-St Jeor 1990、MET は厚労省/ACSM準拠、BMI基準は日本肥満学会
