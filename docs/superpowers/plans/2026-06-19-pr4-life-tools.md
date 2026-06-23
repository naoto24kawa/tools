# PR-4: Life Tools Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** `apps/` に 5 つの生活・環境・暦系ツールを追加し、`packages/router/src/config/apps.ts` に `Life` カテゴリと合わせて登録する。

**Architecture:** 各ツールは独立 SPA。`src/utils/<name>.ts` にコアロジック（純粋関数）、`src/utils/__tests__/<name>.test.ts` にユニットテスト、`src/App.tsx` に UI を実装する。バイオリズムは Canvas でグラフを描画する。

**Tech Stack:** React 19, TypeScript (strict), Vite+, Tailwind CSS 3.4, shadcn/ui, Vitest

## Global Constraints

- ポート番号: biorhythm=5468, yakudoshi-calculator=5469, electricity-cost=5470, fuel-cost-calculator=5471, co2-footprint=5472
- ボタン要素には必ず `type="button"` を付与
- 日付計算は UTC 日数ではなく各タイムゾーンの現地日付で行う
- テストは Vitest (`describe` / `it` / `expect`)
- `apps.ts` への追記は最後の Task 6 でまとめて行う

---

### Task 1: apps.ts に `Life` カテゴリを追加

**Files:**
- Modify: `packages/router/src/config/apps.ts:8`

- [ ] **Step 1: AppCategory 型に追記**

```typescript
export type AppCategory =
  | 'Text' | 'Encode' | 'Crypto' | 'Number' | 'DateTime'
  | 'JSON' | 'Code' | 'Color / CSS' | 'Image' | 'PDF'
  | 'Video' | 'Generator' | 'Network'
  | 'Design' | 'Finance' | 'Health' | 'Life';
```

- [ ] **Step 2: 型チェック**

```bash
cd packages/router && npx tsc --noEmit
```

Expected: エラーなし

- [ ] **Step 3: コミット**

```bash
git add packages/router/src/config/apps.ts
git commit -m "feat(router): add Life category to AppCategory"
```

---

### Task 2: `biorhythm` — バイオリズム計算ツール

**Files:**
- Create: `apps/biorhythm/`
- Create: `apps/biorhythm/src/utils/biorhythm.ts`
- Create: `apps/biorhythm/src/utils/__tests__/biorhythm.test.ts`
- Create: `apps/biorhythm/src/App.tsx`

**Interfaces:**
- Produces:
  - `calcBiorhythm(birthDate: Date, targetDate: Date): BiorhythmValues`
  - `calcBiorhythmSeries(birthDate: Date, centerDate: Date, days: number): BiorhythmSeries`
  - `interface BiorhythmValues { physical: number; emotional: number; intellectual: number; daysSinceBirth: number }`
  - `interface BiorhythmSeries { dates: Date[]; physical: number[]; emotional: number[]; intellectual: number[] }`

- [ ] **Step 1: スキャフォールド生成**

```bash
node scripts/create-app.js biorhythm "生年月日からバイオリズム波形を計算・表示"
```

`apps/biorhythm/vite.config.ts` の `port` を `5468` に変更。

- [ ] **Step 2: ユニットテストを書く**

`apps/biorhythm/src/utils/__tests__/biorhythm.test.ts`:

```typescript
import { describe, it, expect } from 'vitest';
import { calcBiorhythm, calcBiorhythmSeries } from '../biorhythm';

describe('biorhythm', () => {
  describe('calcBiorhythm', () => {
    it('誕生日当日は全サイクルが0', () => {
      const birth = new Date('2000-01-01');
      const result = calcBiorhythm(birth, birth);
      expect(result.physical).toBeCloseTo(0, 5);
      expect(result.emotional).toBeCloseTo(0, 5);
      expect(result.intellectual).toBeCloseTo(0, 5);
    });

    it('身体サイクル半周期(11.5日後)は最小値-1', () => {
      const birth = new Date('2000-01-01');
      const target = new Date('2000-01-13'); // 12日後: sin(2π*12/23) ≈ -0.97
      const result = calcBiorhythm(birth, target);
      // 半周期付近で負の値
      expect(result.physical).toBeLessThan(0);
    });

    it('経過日数を正しく計算', () => {
      const birth = new Date('2000-01-01');
      const target = new Date('2000-01-11'); // 10日後
      const result = calcBiorhythm(birth, target);
      expect(result.daysSinceBirth).toBe(10);
    });

    it('各サイクルの値が -1 から 1 の範囲内', () => {
      const birth = new Date('1990-06-15');
      const target = new Date('2024-03-20');
      const result = calcBiorhythm(birth, target);
      expect(result.physical).toBeGreaterThanOrEqual(-1);
      expect(result.physical).toBeLessThanOrEqual(1);
      expect(result.emotional).toBeGreaterThanOrEqual(-1);
      expect(result.emotional).toBeLessThanOrEqual(1);
      expect(result.intellectual).toBeGreaterThanOrEqual(-1);
      expect(result.intellectual).toBeLessThanOrEqual(1);
    });
  });

  describe('calcBiorhythmSeries', () => {
    it('指定日数分のシリーズを返す', () => {
      const birth = new Date('2000-01-01');
      const center = new Date('2024-01-01');
      const result = calcBiorhythmSeries(birth, center, 30);
      expect(result.dates).toHaveLength(30);
      expect(result.physical).toHaveLength(30);
      expect(result.emotional).toHaveLength(30);
      expect(result.intellectual).toHaveLength(30);
    });
  });
});
```

- [ ] **Step 3: テストが失敗することを確認**

```bash
cd apps/biorhythm && vp test
```

Expected: FAIL

- [ ] **Step 4: ユーティリティを実装**

`apps/biorhythm/src/utils/biorhythm.ts`:

```typescript
export interface BiorhythmValues {
  physical: number;      // 身体 23日周期
  emotional: number;     // 感情 28日周期
  intellectual: number;  // 知性 33日周期
  daysSinceBirth: number;
}

export interface BiorhythmSeries {
  dates: Date[];
  physical: number[];
  emotional: number[];
  intellectual: number[];
}

const PHYSICAL_CYCLE = 23;
const EMOTIONAL_CYCLE = 28;
const INTELLECTUAL_CYCLE = 33;

function daysBetween(from: Date, to: Date): number {
  const msPerDay = 1000 * 60 * 60 * 24;
  const fromDay = Math.floor(from.getTime() / msPerDay);
  const toDay = Math.floor(to.getTime() / msPerDay);
  return toDay - fromDay;
}

export function calcBiorhythm(birthDate: Date, targetDate: Date): BiorhythmValues {
  const days = daysBetween(birthDate, targetDate);
  return {
    physical: Math.sin((2 * Math.PI * days) / PHYSICAL_CYCLE),
    emotional: Math.sin((2 * Math.PI * days) / EMOTIONAL_CYCLE),
    intellectual: Math.sin((2 * Math.PI * days) / INTELLECTUAL_CYCLE),
    daysSinceBirth: days,
  };
}

export function calcBiorhythmSeries(
  birthDate: Date,
  centerDate: Date,
  days: number,
): BiorhythmSeries {
  const msPerDay = 1000 * 60 * 60 * 24;
  const dates: Date[] = [];
  const physical: number[] = [];
  const emotional: number[] = [];
  const intellectual: number[] = [];

  const startMs = centerDate.getTime() - Math.floor(days / 2) * msPerDay;

  for (let i = 0; i < days; i++) {
    const date = new Date(startMs + i * msPerDay);
    const values = calcBiorhythm(birthDate, date);
    dates.push(date);
    physical.push(values.physical);
    emotional.push(values.emotional);
    intellectual.push(values.intellectual);
  }

  return { dates, physical, emotional, intellectual };
}
```

- [ ] **Step 5: テストが通ることを確認**

```bash
cd apps/biorhythm && vp test
```

Expected: PASS

- [ ] **Step 6: App.tsx を実装**

`apps/biorhythm/src/App.tsx`:

```typescript
import { useState, useMemo, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Toaster } from '@/components/ui/toaster';
import { calcBiorhythm, calcBiorhythmSeries } from '@/utils/biorhythm';

const TODAY = new Date().toISOString().slice(0, 10);

function toDate(s: string): Date | null {
  const d = new Date(s);
  return isNaN(d.getTime()) ? null : d;
}

function levelLabel(v: number): string {
  if (v > 0.5) return '高';
  if (v < -0.5) return '低';
  return '普通';
}

export default function App() {
  const [birthDate, setBirthDate] = useState('1990-01-01');
  const [targetDate, setTargetDate] = useState(TODAY);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const birth = toDate(birthDate);
  const target = toDate(targetDate);

  const todayValues = useMemo(() => {
    if (!birth || !target) return null;
    try { return calcBiorhythm(birth, target); }
    catch { return null; }
  }, [birth, target]);

  const series = useMemo(() => {
    if (!birth || !target) return null;
    try { return calcBiorhythmSeries(birth, target, 30); }
    catch { return null; }
  }, [birth, target]);

  useEffect(() => {
    if (!series || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const W = canvas.width;
    const H = canvas.height;
    const pad = 20;
    const midY = H / 2;
    const scaleX = (W - pad * 2) / series.dates.length;
    const scaleY = (H - pad * 2) / 2;

    ctx.clearRect(0, 0, W, H);

    // ゼロライン
    ctx.strokeStyle = '#e5e7eb';
    ctx.beginPath();
    ctx.moveTo(pad, midY);
    ctx.lineTo(W - pad, midY);
    ctx.stroke();

    const draw = (data: number[], color: string) => {
      ctx.beginPath();
      ctx.strokeStyle = color;
      ctx.lineWidth = 1.5;
      data.forEach((v, i) => {
        const x = pad + i * scaleX;
        const y = midY - v * scaleY;
        if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
      });
      ctx.stroke();
    };

    draw(series.physical, '#ef4444');
    draw(series.emotional, '#3b82f6');
    draw(series.intellectual, '#22c55e');
  }, [series]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
      <div className="max-w-2xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Biorhythm</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">生年月日からバイオリズムを計算</p>
        </div>

        <Card>
          <CardContent className="pt-6 grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>生年月日</Label>
              <Input type="date" value={birthDate} onChange={(e) => setBirthDate(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>対象日</Label>
              <Input type="date" value={targetDate} onChange={(e) => setTargetDate(e.target.value)} />
            </div>
          </CardContent>
        </Card>

        {todayValues && (
          <>
            <div className="grid grid-cols-3 gap-3">
              {[
                { label: '身体', value: todayValues.physical, color: 'text-red-600 dark:text-red-400' },
                { label: '感情', value: todayValues.emotional, color: 'text-blue-600 dark:text-blue-400' },
                { label: '知性', value: todayValues.intellectual, color: 'text-green-600 dark:text-green-400' },
              ].map((item) => (
                <Card key={item.label}>
                  <CardContent className="pt-4 text-center">
                    <p className="text-xs text-gray-500">{item.label}</p>
                    <p className={`text-2xl font-bold ${item.color}`}>{levelLabel(item.value)}</p>
                    <p className="text-xs text-gray-400">{(item.value * 100).toFixed(0)}%</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm flex gap-4">
                  <span className="text-red-500">— 身体 (23日)</span>
                  <span className="text-blue-500">— 感情 (28日)</span>
                  <span className="text-green-500">— 知性 (33日)</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <canvas ref={canvasRef} width={560} height={160} className="w-full" />
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
cd apps/biorhythm && vp dev
```

`http://localhost:5468` を開き、生年月日を入力して波形グラフが表示されることを確認。

- [ ] **Step 8: コミット**

```bash
git add apps/biorhythm/
git commit -m "feat: add biorhythm tool"
```

---

### Task 3: `yakudoshi-calculator` — 厄年計算ツール

**Files:**
- Create: `apps/yakudoshi-calculator/`
- Create: `apps/yakudoshi-calculator/src/utils/yakudoshi.ts`
- Create: `apps/yakudoshi-calculator/src/utils/__tests__/yakudoshi.test.ts`
- Create: `apps/yakudoshi-calculator/src/App.tsx`

**Interfaces:**
- Produces:
  - `calcYakudoshi(birthYear: number, gender: 'male' | 'female'): YakudoshiResult`
  - `interface YakudoshiEntry { age: number; year: number; type: 'pre' | 'main' | 'post' | 'happo' | 'ko' }`
  - `interface YakudoshiResult { entries: YakudoshiEntry[]; currentYear: number }`

- [ ] **Step 1: スキャフォールド生成**

```bash
node scripts/create-app.js yakudoshi-calculator "厄年・八方塞がり・小厄を生年月日から計算"
```

`apps/yakudoshi-calculator/vite.config.ts` の `port` を `5469` に変更。

- [ ] **Step 2: ユニットテストを書く**

`apps/yakudoshi-calculator/src/utils/__tests__/yakudoshi.test.ts`:

```typescript
import { describe, it, expect } from 'vitest';
import { calcYakudoshi } from '../yakudoshi';

describe('yakudoshi', () => {
  describe('男性', () => {
    it('本厄は25・42・61歳', () => {
      const result = calcYakudoshi(1990, 'male');
      const mainYakus = result.entries.filter((e) => e.type === 'main').map((e) => e.age);
      expect(mainYakus).toContain(25);
      expect(mainYakus).toContain(42);
      expect(mainYakus).toContain(61);
    });

    it('前厄は本厄の1年前', () => {
      const result = calcYakudoshi(1990, 'male');
      const preYakus = result.entries.filter((e) => e.type === 'pre').map((e) => e.age);
      expect(preYakus).toContain(24); // 25の前厄
      expect(preYakus).toContain(41); // 42の前厄
    });

    it('後厄は本厄の1年後', () => {
      const result = calcYakudoshi(1990, 'male');
      const postYakus = result.entries.filter((e) => e.type === 'post').map((e) => e.age);
      expect(postYakus).toContain(26); // 25の後厄
      expect(postYakus).toContain(43); // 42の後厄
    });
  });

  describe('女性', () => {
    it('本厄は19・33・37・61歳', () => {
      const result = calcYakudoshi(1990, 'female');
      const mainYakus = result.entries.filter((e) => e.type === 'main').map((e) => e.age);
      expect(mainYakus).toContain(19);
      expect(mainYakus).toContain(33);
      expect(mainYakus).toContain(37);
      expect(mainYakus).toContain(61);
    });
  });

  describe('年号計算', () => {
    it('1990年生まれ・25歳の年は2015年', () => {
      const result = calcYakudoshi(1990, 'male');
      const main25 = result.entries.find((e) => e.type === 'main' && e.age === 25);
      // 数え年: 1990 + 25 - 1 = 2014 or 2015
      expect(main25?.year).toBeGreaterThanOrEqual(2014);
      expect(main25?.year).toBeLessThanOrEqual(2015);
    });
  });
});
```

- [ ] **Step 3: テストが失敗することを確認**

```bash
cd apps/yakudoshi-calculator && vp test
```

Expected: FAIL

- [ ] **Step 4: ユーティリティを実装**

`apps/yakudoshi-calculator/src/utils/yakudoshi.ts`:

```typescript
export type YakudoshiType = 'pre' | 'main' | 'post' | 'happo' | 'ko';

export interface YakudoshiEntry {
  age: number;
  year: number;      // 西暦年（数え年ベース）
  waYear: string;    // 和暦表記
  type: YakudoshiType;
  label: string;
}

export interface YakudoshiResult {
  entries: YakudoshiEntry[];
  currentYear: number;
}

// 男性の本厄年齢（数え年）
const MALE_MAIN_AGES = [25, 42, 61];
// 女性の本厄年齢（数え年）
const FEMALE_MAIN_AGES = [19, 33, 37, 61];
// 八方塞がり（男女共通、数え年の九星が五黄になる年 — 簡易実装: 1·10·19·28... 年生まれが対象）
// 小厄（男女共通）
const MALE_KO_AGES = [19, 28, 37, 46, 55];
const FEMALE_KO_AGES = [25, 34, 43, 52, 61];

function toWaYear(year: number): string {
  if (year >= 2019) return `令和${year - 2018}年`;
  if (year >= 1989) return `平成${year - 1988}年`;
  if (year >= 1926) return `昭和${year - 1925}年`;
  return `${year}年`;
}

export function calcYakudoshi(
  birthYear: number,
  gender: 'male' | 'female',
): YakudoshiResult {
  const mainAges = gender === 'male' ? MALE_MAIN_AGES : FEMALE_MAIN_AGES;
  const koAges = gender === 'male' ? MALE_KO_AGES : FEMALE_KO_AGES;
  const currentYear = new Date().getFullYear();
  const entries: YakudoshiEntry[] = [];

  for (const mainAge of mainAges) {
    // 数え年 = 生まれ年 + 年齢 - 1
    const mainYear = birthYear + mainAge - 1;

    entries.push({ age: mainAge - 1, year: mainYear - 1, waYear: toWaYear(mainYear - 1), type: 'pre', label: '前厄' });
    entries.push({ age: mainAge, year: mainYear, waYear: toWaYear(mainYear), type: 'main', label: '本厄' });
    entries.push({ age: mainAge + 1, year: mainYear + 1, waYear: toWaYear(mainYear + 1), type: 'post', label: '後厄' });
  }

  for (const koAge of koAges) {
    const koYear = birthYear + koAge - 1;
    // 小厄は本厄と重複しない
    if (!entries.some((e) => e.year === koYear)) {
      entries.push({ age: koAge, year: koYear, waYear: toWaYear(koYear), type: 'ko', label: '小厄' });
    }
  }

  entries.sort((a, b) => a.year - b.year);

  return { entries, currentYear };
}
```

- [ ] **Step 5: テストが通ることを確認**

```bash
cd apps/yakudoshi-calculator && vp test
```

Expected: PASS

- [ ] **Step 6: App.tsx を実装**

`apps/yakudoshi-calculator/src/App.tsx`:

```typescript
import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Toaster } from '@/components/ui/toaster';
import { calcYakudoshi } from '@/utils/yakudoshi';

const TYPE_COLORS: Record<string, string> = {
  main: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 font-bold',
  pre: 'bg-orange-50 dark:bg-orange-900/20 text-orange-700 dark:text-orange-300',
  post: 'bg-orange-50 dark:bg-orange-900/20 text-orange-700 dark:text-orange-300',
  ko: 'bg-yellow-50 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-300',
  happo: 'bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300',
};

export default function App() {
  const [birthYear, setBirthYear] = useState(String(new Date().getFullYear() - 30));
  const [gender, setGender] = useState<'male' | 'female'>('male');

  const result = useMemo(() => {
    const year = Number(birthYear);
    if (!year || year < 1900 || year > 2100) return null;
    try { return calcYakudoshi(year, gender); }
    catch { return null; }
  }, [birthYear, gender]);

  const currentYear = new Date().getFullYear();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
      <div className="max-w-2xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">厄年カレンダー</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">生まれ年と性別から厄年・小厄を計算</p>
        </div>

        <Card>
          <CardContent className="pt-6 space-y-4">
            <div className="space-y-2">
              <Label>生まれ年（西暦）</Label>
              <Input type="number" min="1900" max="2100" value={birthYear} onChange={(e) => setBirthYear(e.target.value)} className="w-36" />
            </div>
            <div className="flex gap-2">
              <Button type="button" variant={gender === 'male' ? 'default' : 'outline'} onClick={() => setGender('male')}>男性</Button>
              <Button type="button" variant={gender === 'female' ? 'default' : 'outline'} onClick={() => setGender('female')}>女性</Button>
            </div>
          </CardContent>
        </Card>

        {result && (
          <Card>
            <CardHeader><CardTitle>厄年リスト</CardTitle></CardHeader>
            <CardContent>
              <div className="flex gap-2 text-xs mb-3 flex-wrap">
                <span className="px-2 py-1 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded">本厄</span>
                <span className="px-2 py-1 bg-orange-50 dark:bg-orange-900/20 text-orange-700 dark:text-orange-300 rounded">前厄・後厄</span>
                <span className="px-2 py-1 bg-yellow-50 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-300 rounded">小厄</span>
              </div>
              <div className="space-y-2">
                {result.entries.map((entry, i) => (
                  <div
                    key={i}
                    className={`flex items-center justify-between rounded-lg px-4 py-2 ${TYPE_COLORS[entry.type]} ${entry.year === currentYear ? 'ring-2 ring-offset-1 ring-gray-400' : ''}`}
                  >
                    <div>
                      <span className="text-sm font-medium">{entry.label}</span>
                      {entry.year === currentYear && <span className="ml-2 text-xs bg-white/50 dark:bg-black/20 px-1 rounded">今年</span>}
                    </div>
                    <div className="text-right">
                      <p className="font-bold">{entry.year}年（{entry.waYear}）</p>
                      <p className="text-xs opacity-70">数え年 {entry.age}歳</p>
                    </div>
                  </div>
                ))}
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
cd apps/yakudoshi-calculator && vp dev
```

`http://localhost:5469` を開き、生まれ年と性別を入力して厄年リストが表示されることを確認。

- [ ] **Step 8: コミット**

```bash
git add apps/yakudoshi-calculator/
git commit -m "feat: add yakudoshi-calculator tool"
```

---

### Task 4: `electricity-cost` — 電気料金計算ツール

**Files:**
- Create: `apps/electricity-cost/`
- Create: `apps/electricity-cost/src/utils/electricityCost.ts`
- Create: `apps/electricity-cost/src/utils/__tests__/electricityCost.test.ts`
- Create: `apps/electricity-cost/src/App.tsx`

**Interfaces:**
- Produces:
  - `calcElectricityCost(params: ElectricParams): ElectricResult`
  - `ELECTRIC_PLANS: ElectricPlan[]`
  - `interface ElectricParams { monthlyKwh: number; planId: string; customBasicFee?: number; customUnitPrice?: number }`
  - `interface ElectricPlan { id: string; company: string; name: string; basicFee: number; tiers: PriceTier[] }`
  - `interface PriceTier { upToKwh: number | null; pricePerKwh: number }`
  - `interface ElectricResult { basicFee: number; usageFee: number; totalMonthly: number; totalYearly: number }`

- [ ] **Step 1: スキャフォールド生成**

```bash
node scripts/create-app.js electricity-cost "電気料金計算（使用量・料金プランから月額試算）"
```

`apps/electricity-cost/vite.config.ts` の `port` を `5470` に変更。

- [ ] **Step 2: ユニットテストを書く**

`apps/electricity-cost/src/utils/__tests__/electricityCost.test.ts`:

```typescript
import { describe, it, expect } from 'vitest';
import { calcElectricityCost, ELECTRIC_PLANS } from '../electricityCost';

describe('electricityCost', () => {
  describe('calcElectricityCost', () => {
    it('カスタムプランで使用量100kWh・単価30円・基本料金1000円', () => {
      const result = calcElectricityCost({
        monthlyKwh: 100,
        planId: 'custom',
        customBasicFee: 1000,
        customUnitPrice: 30,
      });
      expect(result.basicFee).toBe(1000);
      expect(result.usageFee).toBe(3000);
      expect(result.totalMonthly).toBe(4000);
      expect(result.totalYearly).toBe(48000);
    });

    it('使用量0のとき使用料は0', () => {
      const result = calcElectricityCost({
        monthlyKwh: 0,
        planId: 'custom',
        customBasicFee: 1000,
        customUnitPrice: 30,
      });
      expect(result.usageFee).toBe(0);
    });

    it('使用量負値は例外を投げる', () => {
      expect(() =>
        calcElectricityCost({ monthlyKwh: -1, planId: 'custom', customBasicFee: 0, customUnitPrice: 30 }),
      ).toThrow('Monthly kWh must be non-negative');
    });

    it('プリセットプランで計算できる', () => {
      const plan = ELECTRIC_PLANS[0];
      const result = calcElectricityCost({ monthlyKwh: 200, planId: plan.id });
      expect(result.totalMonthly).toBeGreaterThan(0);
    });

    it('未知のプランIDは例外を投げる', () => {
      expect(() =>
        calcElectricityCost({ monthlyKwh: 100, planId: 'unknown_plan_xyz' }),
      ).toThrow('Unknown plan');
    });
  });

  describe('ELECTRIC_PLANS', () => {
    it('少なくとも3種類のプランが定義されている', () => {
      expect(ELECTRIC_PLANS.length).toBeGreaterThanOrEqual(3);
    });
  });
});
```

- [ ] **Step 3: テストが失敗することを確認**

```bash
cd apps/electricity-cost && vp test
```

Expected: FAIL

- [ ] **Step 4: ユーティリティを実装**

`apps/electricity-cost/src/utils/electricityCost.ts`:

```typescript
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
```

- [ ] **Step 5: テストが通ることを確認**

```bash
cd apps/electricity-cost && vp test
```

Expected: PASS

- [ ] **Step 6: App.tsx を実装**

`apps/electricity-cost/src/App.tsx`:

```typescript
import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { Toaster } from '@/components/ui/toaster';
import { calcElectricityCost, ELECTRIC_PLANS } from '@/utils/electricityCost';

const ALL_PLANS = [
  ...ELECTRIC_PLANS.map((p) => ({ id: p.id, label: `${p.company} ${p.name}` })),
  { id: 'custom', label: 'カスタム（単価を直接入力）' },
];

const fmt = (n: number) =>
  n.toLocaleString('ja-JP', { style: 'currency', currency: 'JPY', maximumFractionDigits: 0 });

export default function App() {
  const [kwh, setKwh] = useState('300');
  const [planId, setPlanId] = useState('tepco_standard');
  const [customBasicFee, setCustomBasicFee] = useState('800');
  const [customUnitPrice, setCustomUnitPrice] = useState('30');

  const result = useMemo(() => {
    try {
      return calcElectricityCost({
        monthlyKwh: Number(kwh),
        planId,
        customBasicFee: Number(customBasicFee),
        customUnitPrice: Number(customUnitPrice),
      });
    } catch { return null; }
  }, [kwh, planId, customBasicFee, customUnitPrice]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
      <div className="max-w-xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Electricity Cost</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">電気料金計算</p>
        </div>

        <Card>
          <CardContent className="pt-6 space-y-4">
            <div className="space-y-2">
              <Label>月間使用量 (kWh)</Label>
              <Input type="number" min="0" value={kwh} onChange={(e) => setKwh(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>料金プラン</Label>
              <Select value={planId} onValueChange={setPlanId}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {ALL_PLANS.map((p) => <SelectItem key={p.id} value={p.id}>{p.label}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            {planId === 'custom' && (
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>基本料金 (円/月)</Label>
                  <Input type="number" min="0" value={customBasicFee} onChange={(e) => setCustomBasicFee(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>単価 (円/kWh)</Label>
                  <Input type="number" min="0" step="0.1" value={customUnitPrice} onChange={(e) => setCustomUnitPrice(e.target.value)} />
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {result && (
          <Card>
            <CardContent className="pt-6 space-y-3">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-3 text-center">
                  <p className="text-xs text-gray-500">基本料金</p>
                  <p className="font-bold">{fmt(result.basicFee)}</p>
                </div>
                <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-3 text-center">
                  <p className="text-xs text-gray-500">従量料金</p>
                  <p className="font-bold">{fmt(result.usageFee)}</p>
                </div>
              </div>
              <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-4 text-center">
                <p className="text-sm text-gray-500">月額概算</p>
                <p className="text-3xl font-bold text-yellow-700 dark:text-yellow-400">{fmt(result.totalMonthly)}</p>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-500">年間概算: <span className="font-bold">{fmt(result.totalYearly)}</span></p>
              </div>
              <p className="text-xs text-gray-400 text-center">※ 燃料費調整額・再エネ賦課金は含みません</p>
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
cd apps/electricity-cost && vp dev
```

`http://localhost:5470` を開き、東京電力・300kWhで月額が表示されることを確認。

- [ ] **Step 8: コミット**

```bash
git add apps/electricity-cost/
git commit -m "feat: add electricity-cost tool"
```

---

### Task 5: `fuel-cost-calculator` — 燃料代・燃費計算ツール

**Files:**
- Create: `apps/fuel-cost-calculator/`
- Create: `apps/fuel-cost-calculator/src/utils/fuelCost.ts`
- Create: `apps/fuel-cost-calculator/src/utils/__tests__/fuelCost.test.ts`
- Create: `apps/fuel-cost-calculator/src/App.tsx`

**Interfaces:**
- Produces:
  - `calcFuelCost(params: FuelParams): FuelResult`
  - `interface FuelParams { distanceKm: number; fuelEfficiencyKmL: number; pricePerLiter: number }`
  - `interface FuelResult { litersNeeded: number; fuelCost: number; co2Kg: number; monthlyEstimate: number; yearlyEstimate: number }`

- [ ] **Step 1: スキャフォールド生成**

```bash
node scripts/create-app.js fuel-cost-calculator "燃費・ガソリン代・CO2排出量計算"
```

`apps/fuel-cost-calculator/vite.config.ts` の `port` を `5471` に変更。

- [ ] **Step 2: ユニットテストを書く**

`apps/fuel-cost-calculator/src/utils/__tests__/fuelCost.test.ts`:

```typescript
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
```

- [ ] **Step 3: テストが失敗することを確認**

```bash
cd apps/fuel-cost-calculator && vp test
```

Expected: FAIL

- [ ] **Step 4: ユーティリティを実装**

`apps/fuel-cost-calculator/src/utils/fuelCost.ts`:

```typescript
export interface FuelParams {
  distanceKm: number;
  fuelEfficiencyKmL: number;
  pricePerLiter: number;
}

export interface FuelResult {
  litersNeeded: number;
  fuelCost: number;
  co2Kg: number;
  monthlyEstimate: number;
  yearlyEstimate: number;
}

// ガソリン燃焼時のCO2排出係数 (kg-CO2/L) — 環境省公表値
const CO2_PER_LITER = 2.322;

export function calcFuelCost(params: FuelParams): FuelResult {
  const { distanceKm, fuelEfficiencyKmL, pricePerLiter } = params;

  if (distanceKm < 0) throw new Error('Distance must be non-negative');
  if (fuelEfficiencyKmL <= 0) throw new Error('Fuel efficiency must be positive');
  if (pricePerLiter < 0) throw new Error('Price per liter must be non-negative');

  const litersNeeded = distanceKm / fuelEfficiencyKmL;
  const fuelCost = litersNeeded * pricePerLiter;
  const co2Kg = litersNeeded * CO2_PER_LITER;
  const monthlyEstimate = fuelCost * 30;
  const yearlyEstimate = monthlyEstimate * 12;

  return { litersNeeded, fuelCost, co2Kg, monthlyEstimate, yearlyEstimate };
}
```

- [ ] **Step 5: テストが通ることを確認**

```bash
cd apps/fuel-cost-calculator && vp test
```

Expected: PASS

- [ ] **Step 6: App.tsx を実装**

`apps/fuel-cost-calculator/src/App.tsx`:

```typescript
import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Toaster } from '@/components/ui/toaster';
import { calcFuelCost } from '@/utils/fuelCost';

const fmt = (n: number) =>
  n.toLocaleString('ja-JP', { style: 'currency', currency: 'JPY', maximumFractionDigits: 0 });

export default function App() {
  const [distance, setDistance] = useState('100');
  const [efficiency, setEfficiency] = useState('15');
  const [price, setPrice] = useState('175');

  const result = useMemo(() => {
    try {
      return calcFuelCost({
        distanceKm: Number(distance),
        fuelEfficiencyKmL: Number(efficiency),
        pricePerLiter: Number(price),
      });
    } catch { return null; }
  }, [distance, efficiency, price]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
      <div className="max-w-xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Fuel Cost Calculator</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">燃費・ガソリン代・CO2排出量計算</p>
        </div>

        <Card>
          <CardContent className="pt-6 space-y-4">
            <div className="space-y-2">
              <Label>走行距離 (km/日)</Label>
              <Input type="number" min="0" step="0.1" value={distance} onChange={(e) => setDistance(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>燃費 (km/L)</Label>
              <Input type="number" min="0.1" step="0.1" value={efficiency} onChange={(e) => setEfficiency(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>ガソリン価格 (円/L)</Label>
              <Input type="number" min="0" value={price} onChange={(e) => setPrice(e.target.value)} />
            </div>
          </CardContent>
        </Card>

        {result && (
          <Card>
            <CardHeader><CardTitle>計算結果（1日あたり）</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-3 text-center">
                  <p className="text-xs text-gray-500">必要燃料量</p>
                  <p className="font-bold">{result.litersNeeded.toFixed(2)} L</p>
                </div>
                <div className="bg-orange-50 dark:bg-orange-900/20 rounded-lg p-3 text-center">
                  <p className="text-xs text-gray-500">燃料代</p>
                  <p className="font-bold text-orange-700 dark:text-orange-400">{fmt(result.fuelCost)}</p>
                </div>
                <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-3 text-center">
                  <p className="text-xs text-gray-500">CO2排出量</p>
                  <p className="font-bold text-green-700 dark:text-green-400">{result.co2Kg.toFixed(2)} kg</p>
                </div>
              </div>
              <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-3">
                <p className="text-xs text-gray-500 mb-2">推計（同じ走行距離で）</p>
                <div className="flex justify-between">
                  <span className="text-sm">月間（×30日）</span>
                  <span className="font-bold">{fmt(result.monthlyEstimate)}</span>
                </div>
                <div className="flex justify-between mt-1">
                  <span className="text-sm">年間（×365日）</span>
                  <span className="font-bold">{fmt(result.yearlyEstimate)}</span>
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
cd apps/fuel-cost-calculator && vp dev
```

`http://localhost:5471` を開き、100km・15km/L・175円/Lで結果が表示されることを確認。

- [ ] **Step 8: コミット**

```bash
git add apps/fuel-cost-calculator/
git commit -m "feat: add fuel-cost-calculator tool"
```

---

### Task 6: `co2-footprint` — CO2排出量・カーボンフットプリント

**Files:**
- Create: `apps/co2-footprint/`
- Create: `apps/co2-footprint/src/utils/co2Footprint.ts`
- Create: `apps/co2-footprint/src/utils/__tests__/co2Footprint.test.ts`
- Create: `apps/co2-footprint/src/App.tsx`

**Interfaces:**
- Produces:
  - `calcCO2(category: CO2Category, amount: number): number`
  - `calcTotal(inputs: CategoryInput[]): TotalResult`
  - `CO2_CATEGORIES: CO2CategoryDef[]`
  - `type CO2Category = 'electricity' | 'gas' | 'car' | 'flight_domestic' | 'flight_intl' | 'beef' | 'pork' | 'chicken'`
  - `interface CO2CategoryDef { id: CO2Category; label: string; unit: string; kgCO2PerUnit: number }`
  - `interface CategoryInput { categoryId: CO2Category; amount: number }`
  - `interface TotalResult { totalKgCO2: number; perCategory: { categoryId: CO2Category; kgCO2: number }[]; japanAverageKgCO2PerYear: number }`

- [ ] **Step 1: スキャフォールド生成**

```bash
node scripts/create-app.js co2-footprint "生活行動別CO2排出量・カーボンフットプリント計算"
```

`apps/co2-footprint/vite.config.ts` の `port` を `5472` に変更。

- [ ] **Step 2: ユニットテストを書く**

`apps/co2-footprint/src/utils/__tests__/co2Footprint.test.ts`:

```typescript
import { describe, it, expect } from 'vitest';
import { calcCO2, calcTotal, CO2_CATEGORIES } from '../co2Footprint';

describe('co2Footprint', () => {
  describe('calcCO2', () => {
    it('電気100kWh → CO2約45kg', () => {
      // 0.453 kg-CO2/kWh × 100 = 45.3
      const result = calcCO2('electricity', 100);
      expect(result).toBeCloseTo(45.3, 0);
    });

    it('都市ガス1m³ → CO2約2.23kg', () => {
      const result = calcCO2('gas', 1);
      expect(result).toBeCloseTo(2.23, 1);
    });

    it('量0はCO2ゼロ', () => {
      expect(calcCO2('electricity', 0)).toBe(0);
    });

    it('量負値は例外を投げる', () => {
      expect(() => calcCO2('electricity', -1)).toThrow('Amount must be non-negative');
    });
  });

  describe('calcTotal', () => {
    it('複数カテゴリの合計を算出', () => {
      const result = calcTotal([
        { categoryId: 'electricity', amount: 100 },
        { categoryId: 'gas', amount: 10 },
      ]);
      expect(result.totalKgCO2).toBeGreaterThan(0);
      expect(result.perCategory).toHaveLength(2);
    });

    it('日本人平均との比較値が含まれる', () => {
      const result = calcTotal([]);
      expect(result.japanAverageKgCO2PerYear).toBeGreaterThan(0);
    });
  });

  describe('CO2_CATEGORIES', () => {
    it('少なくとも8種類が定義されている', () => {
      expect(CO2_CATEGORIES.length).toBeGreaterThanOrEqual(8);
    });
  });
});
```

- [ ] **Step 3: テストが失敗することを確認**

```bash
cd apps/co2-footprint && vp test
```

Expected: FAIL

- [ ] **Step 4: ユーティリティを実装**

`apps/co2-footprint/src/utils/co2Footprint.ts`:

```typescript
export type CO2Category =
  | 'electricity' | 'gas' | 'car' | 'flight_domestic' | 'flight_intl'
  | 'beef' | 'pork' | 'chicken' | 'bus' | 'train';

export interface CO2CategoryDef {
  id: CO2Category;
  label: string;
  unit: string;
  kgCO2PerUnit: number;  // 排出係数（kg-CO2/単位）
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
```

- [ ] **Step 5: テストが通ることを確認**

```bash
cd apps/co2-footprint && vp test
```

Expected: PASS

- [ ] **Step 6: App.tsx を実装**

`apps/co2-footprint/src/App.tsx`:

```typescript
import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Toaster } from '@/components/ui/toaster';
import { calcTotal, CO2_CATEGORIES, type CO2Category } from '@/utils/co2Footprint';

const MONTH_CATEGORIES: CO2Category[] = [
  'electricity', 'gas', 'car', 'beef', 'pork', 'chicken', 'bus', 'train',
];
const YEAR_CATEGORIES: CO2Category[] = ['flight_domestic', 'flight_intl'];

export default function App() {
  const [amounts, setAmounts] = useState<Partial<Record<CO2Category, string>>>({
    electricity: '300',
    gas: '20',
    car: '500',
  });

  const setAmount = (id: CO2Category, value: string) =>
    setAmounts((prev) => ({ ...prev, [id]: value }));

  const result = useMemo(() => {
    const inputs = CO2_CATEGORIES.map((cat) => ({
      categoryId: cat.id,
      amount: Number(amounts[cat.id] ?? 0),
    }));
    try {
      return calcTotal(inputs);
    } catch { return null; }
  }, [amounts]);

  const monthlyTotal = result
    ? result.perCategory
        .filter((c) => MONTH_CATEGORIES.includes(c.categoryId))
        .reduce((s, c) => s + c.kgCO2, 0)
    : 0;

  const yearlyTotal = result ? result.totalKgCO2 * 12 + result.perCategory
    .filter((c) => YEAR_CATEGORIES.includes(c.categoryId))
    .reduce((s, c) => s + c.kgCO2, 0) : 0;

  const comparisonPct = result
    ? (yearlyTotal / result.japanAverageKgCO2PerYear) * 100
    : 0;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
      <div className="max-w-2xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">CO2 Footprint</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">生活行動別CO2排出量計算</p>
        </div>

        <Card>
          <CardHeader><CardTitle>月間の生活行動</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {CO2_CATEGORIES.filter((c) => MONTH_CATEGORIES.includes(c.id)).map((cat) => (
              <div key={cat.id} className="flex items-center gap-3">
                <div className="flex-1">
                  <Label className="text-sm">{cat.label}</Label>
                  <p className="text-xs text-gray-400">{cat.description}</p>
                </div>
                <div className="flex items-center gap-1 w-40">
                  <Input
                    type="number"
                    min="0"
                    step="0.1"
                    value={amounts[cat.id] ?? ''}
                    onChange={(e) => setAmount(cat.id, e.target.value)}
                    className="w-24 text-right"
                  />
                  <span className="text-xs text-gray-500 whitespace-nowrap">{cat.unit.split('/')[0]}</span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>年間のフライト</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {CO2_CATEGORIES.filter((c) => YEAR_CATEGORIES.includes(c.id)).map((cat) => (
              <div key={cat.id} className="flex items-center gap-3">
                <div className="flex-1">
                  <Label className="text-sm">{cat.label}</Label>
                  <p className="text-xs text-gray-400">{cat.description}</p>
                </div>
                <div className="flex items-center gap-1 w-40">
                  <Input
                    type="number"
                    min="0"
                    value={amounts[cat.id] ?? ''}
                    onChange={(e) => setAmount(cat.id, e.target.value)}
                    className="w-24 text-right"
                  />
                  <span className="text-xs text-gray-500 whitespace-nowrap">回</span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {result && (
          <Card>
            <CardContent className="pt-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-3 text-center">
                  <p className="text-xs text-gray-500">月間CO2排出量</p>
                  <p className="text-xl font-bold text-green-700 dark:text-green-400">{monthlyTotal.toFixed(1)} kg</p>
                </div>
                <div className="bg-emerald-50 dark:bg-emerald-900/20 rounded-lg p-3 text-center">
                  <p className="text-xs text-gray-500">年間CO2排出量（推計）</p>
                  <p className="text-xl font-bold text-emerald-700 dark:text-emerald-400">{yearlyTotal.toFixed(0)} kg</p>
                </div>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">日本人平均（9,000 kg/年）との比較</p>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                  <div
                    className={`h-3 rounded-full ${comparisonPct > 100 ? 'bg-red-500' : 'bg-green-500'}`}
                    style={{ width: `${Math.min(100, comparisonPct)}%` }}
                  />
                </div>
                <p className="text-right text-sm mt-1 font-bold">{comparisonPct.toFixed(0)}%</p>
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
cd apps/co2-footprint && vp dev
```

`http://localhost:5472` を開き、電気300kWh・ガス20m³などを入力してCO2が表示されることを確認。

- [ ] **Step 8: コミット**

```bash
git add apps/co2-footprint/
git commit -m "feat: add co2-footprint tool"
```

---

### Task 7: apps.ts に PR-4 の 5 ツールを登録

**Files:**
- Modify: `packages/router/src/config/apps.ts`

- [ ] **Step 1: APPS_CONFIG 配列に追記**

```typescript
  // ── Life ──
  { path: '/biorhythm', url: 'https://tools-biorhythm.elchika.app', icon: '🌊', displayName: 'Biorhythm', description: '生年月日からバイオリズム波形を計算', category: 'Life' },
  { path: '/yakudoshi-calculator', url: 'https://tools-yakudoshi-calculator.elchika.app', icon: '🎎', displayName: 'Yakudoshi', description: '厄年・八方塞がり・小厄を計算', category: 'Life' },
  { path: '/electricity-cost', url: 'https://tools-electricity-cost.elchika.app', icon: '⚡', displayName: 'Electricity Cost', description: '電気料金計算（使用量・プランから月額試算）', category: 'Life' },
  { path: '/fuel-cost-calculator', url: 'https://tools-fuel-cost-calculator.elchika.app', icon: '⛽', displayName: 'Fuel Cost', description: '燃費・ガソリン代・CO2排出量計算', category: 'Life' },
  { path: '/co2-footprint', url: 'https://tools-co2-footprint.elchika.app', icon: '🌍', displayName: 'CO2 Footprint', description: '生活行動別CO2排出量計算', category: 'Life' },
```

- [ ] **Step 2: 型チェック**

```bash
cd packages/router && npx tsc --noEmit
```

Expected: エラーなし

- [ ] **Step 3: コミット**

```bash
git add packages/router/src/config/apps.ts
git commit -m "feat(router): register PR-4 Life tools in apps.ts"
```

---

## Self-Review Checklist

- [x] Spec 要件カバー: biorhythm (3サイクル・グラフ・30日シリーズ) ✅, yakudoshi-calculator (男女別本厄・前後厄・小厄・今年ハイライト) ✅, electricity-cost (段階料金・カスタム・4社プリセット) ✅, fuel-cost-calculator (燃料代・CO2・月年推計) ✅, co2-footprint (10カテゴリ・日本平均比較) ✅
- [x] プレースホルダーなし
- [x] 型の一貫性: 全ツールで型が utils と App.tsx で統一されている
- [x] daysBetween は UTC 日数でタイムゾーン影響を最小化 (msPerDay で割る方式)
- [x] 排出係数の出典: 電気=環境省2023年度係数、ガス=J-クレジット参照値、CO2/L=環境省公表値
