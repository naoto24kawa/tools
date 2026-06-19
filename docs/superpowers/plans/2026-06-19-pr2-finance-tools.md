# PR-2: Finance Tools Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** `apps/` に 4 つのお金・金融系ツールを追加し、`packages/router/src/config/apps.ts` に `Finance` カテゴリと合わせて登録する。

**Architecture:** 各ツールは独立 SPA。`create-app.js` でスキャフォールドを生成し、`src/utils/<name>.ts` にコアロジック（純粋関数）、`src/utils/__tests__/<name>.test.ts` にユニットテスト、`src/App.tsx` に UI を実装する。グラフが必要なツールは Canvas API を使用。

**Tech Stack:** React 19, TypeScript (strict), Vite+, Tailwind CSS 3.4, shadcn/ui, Vitest

## Global Constraints

- ポート番号: savings-calculator=5461, retirement-calculator=5462, break-even-calculator=5463, bill-split-calculator=5464
- コアロジックは純粋関数として `src/utils/` に分離（副作用なし）
- ボタン要素には必ず `type="button"` を付与
- テストは Vitest (`describe` / `it` / `expect`)
- `apps.ts` への追記は最後の Task 5 でまとめて行う
- 金額表示は `toLocaleString('ja-JP')` で整形

---

### Task 1: apps.ts に `Finance` カテゴリを追加

**Files:**
- Modify: `packages/router/src/config/apps.ts:8`

**Interfaces:**
- Produces: `'Finance'` が `AppCategory` 型に追加される

- [ ] **Step 1: AppCategory 型に追記**

`packages/router/src/config/apps.ts` の `AppCategory` 型に `'Finance'` を追加する（`'Design'` が既に追加済みの前提）:

```typescript
export type AppCategory =
  | 'Text' | 'Encode' | 'Crypto' | 'Number' | 'DateTime'
  | 'JSON' | 'Code' | 'Color / CSS' | 'Image' | 'PDF'
  | 'Video' | 'Generator' | 'Network'
  | 'Design' | 'Finance';
```

- [ ] **Step 2: 型チェック**

```bash
cd packages/router && npx tsc --noEmit
```

Expected: エラーなし

- [ ] **Step 3: コミット**

```bash
git add packages/router/src/config/apps.ts
git commit -m "feat(router): add Finance category to AppCategory"
```

---

### Task 2: `savings-calculator` — 積立シミュレーション

**Files:**
- Create: `apps/savings-calculator/`
- Create: `apps/savings-calculator/src/utils/savings.ts`
- Create: `apps/savings-calculator/src/utils/__tests__/savings.test.ts`
- Create: `apps/savings-calculator/src/App.tsx`

**Interfaces:**
- Produces:
  - `calcSavings(params: SavingsParams): SavingsResult`
  - `calcRequiredMonthly(target: number, years: number, annualRate: number): number`
  - `interface SavingsParams { monthlyAmount: number; years: number; annualRate: number; initialAmount?: number }`
  - `interface SavingsResult { total: number; principal: number; interest: number; yearlyBreakdown: YearlyEntry[] }`
  - `interface YearlyEntry { year: number; balance: number; totalPrincipal: number; totalInterest: number }`

- [ ] **Step 1: スキャフォールド生成**

```bash
node scripts/create-app.js savings-calculator "積立シミュレーション（目標額・期間・利率から月額計算）"
```

`apps/savings-calculator/vite.config.ts` の `port` を `5461` に変更。

- [ ] **Step 2: ユニットテストを書く**

`apps/savings-calculator/src/utils/__tests__/savings.test.ts`:

```typescript
import { describe, it, expect } from 'vitest';
import { calcSavings, calcRequiredMonthly } from '../savings';

describe('savings', () => {
  describe('calcSavings', () => {
    it('月1万・10年・年利0%→元本のみ120万', () => {
      const result = calcSavings({ monthlyAmount: 10000, years: 10, annualRate: 0 });
      expect(result.principal).toBe(1200000);
      expect(result.interest).toBeCloseTo(0, 0);
      expect(result.total).toBeCloseTo(1200000, 0);
    });

    it('月1万・10年・年利3%→利息が加算される', () => {
      const result = calcSavings({ monthlyAmount: 10000, years: 10, annualRate: 3 });
      expect(result.total).toBeGreaterThan(1200000);
      expect(result.interest).toBeGreaterThan(0);
    });

    it('初期金額あり→正しく合算', () => {
      const result = calcSavings({
        monthlyAmount: 0,
        years: 1,
        annualRate: 12,
        initialAmount: 100000,
      });
      // 100000 × (1.01)^12 ≈ 112682
      expect(result.total).toBeCloseTo(112682, -2);
    });

    it('yearlyBreakdown の長さが years と一致', () => {
      const result = calcSavings({ monthlyAmount: 10000, years: 5, annualRate: 2 });
      expect(result.yearlyBreakdown).toHaveLength(5);
    });

    it('yearlyBreakdown は昇順', () => {
      const result = calcSavings({ monthlyAmount: 10000, years: 3, annualRate: 2 });
      const balances = result.yearlyBreakdown.map((e) => e.balance);
      expect(balances[0]).toBeLessThan(balances[1]);
      expect(balances[1]).toBeLessThan(balances[2]);
    });

    it('月額負値は例外を投げる', () => {
      expect(() =>
        calcSavings({ monthlyAmount: -1, years: 10, annualRate: 3 }),
      ).toThrow('Monthly amount must be non-negative');
    });

    it('期間0は例外を投げる', () => {
      expect(() =>
        calcSavings({ monthlyAmount: 10000, years: 0, annualRate: 3 }),
      ).toThrow('Years must be positive');
    });
  });

  describe('calcRequiredMonthly', () => {
    it('目標100万・10年・年利0%→月8333円', () => {
      const monthly = calcRequiredMonthly(1000000, 10, 0);
      expect(monthly).toBeCloseTo(8333.33, 0);
    });

    it('目標額負値は例外を投げる', () => {
      expect(() => calcRequiredMonthly(-1, 10, 3)).toThrow('Target must be positive');
    });
  });
});
```

- [ ] **Step 3: テストが失敗することを確認**

```bash
cd apps/savings-calculator && vp test
```

Expected: FAIL

- [ ] **Step 4: ユーティリティを実装**

`apps/savings-calculator/src/utils/savings.ts`:

```typescript
export interface SavingsParams {
  monthlyAmount: number;
  years: number;
  annualRate: number;
  initialAmount?: number;
}

export interface YearlyEntry {
  year: number;
  balance: number;
  totalPrincipal: number;
  totalInterest: number;
}

export interface SavingsResult {
  total: number;
  principal: number;
  interest: number;
  yearlyBreakdown: YearlyEntry[];
}

export function calcSavings(params: SavingsParams): SavingsResult {
  const { monthlyAmount, years, annualRate, initialAmount = 0 } = params;
  if (monthlyAmount < 0) throw new Error('Monthly amount must be non-negative');
  if (years <= 0) throw new Error('Years must be positive');
  if (annualRate < 0) throw new Error('Annual rate must be non-negative');

  const monthlyRate = annualRate / 100 / 12;
  const months = years * 12;

  let balance = initialAmount;
  const yearlyBreakdown: YearlyEntry[] = [];
  let totalPrincipal = initialAmount;

  for (let m = 1; m <= months; m++) {
    balance = balance * (1 + monthlyRate) + monthlyAmount;
    totalPrincipal += monthlyAmount;

    if (m % 12 === 0) {
      yearlyBreakdown.push({
        year: m / 12,
        balance,
        totalPrincipal,
        totalInterest: balance - totalPrincipal,
      });
    }
  }

  return {
    total: balance,
    principal: totalPrincipal,
    interest: balance - totalPrincipal,
    yearlyBreakdown,
  };
}

export function calcRequiredMonthly(
  target: number,
  years: number,
  annualRate: number,
): number {
  if (target <= 0) throw new Error('Target must be positive');
  if (years <= 0) throw new Error('Years must be positive');
  if (annualRate < 0) throw new Error('Annual rate must be non-negative');

  const monthlyRate = annualRate / 100 / 12;
  const months = years * 12;

  if (monthlyRate === 0) return target / months;

  // FV = PMT × ((1+r)^n - 1) / r → PMT = FV × r / ((1+r)^n - 1)
  return (target * monthlyRate) / (Math.pow(1 + monthlyRate, months) - 1);
}
```

- [ ] **Step 5: テストが通ることを確認**

```bash
cd apps/savings-calculator && vp test
```

Expected: PASS

- [ ] **Step 6: App.tsx を実装**

`apps/savings-calculator/src/App.tsx`:

```typescript
import { useState, useMemo, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Toaster } from '@/components/ui/toaster';
import { calcSavings, calcRequiredMonthly } from '@/utils/savings';

type Mode = 'forward' | 'reverse';

const fmt = (n: number) => n.toLocaleString('ja-JP', { style: 'currency', currency: 'JPY', maximumFractionDigits: 0 });

export default function App() {
  const [mode, setMode] = useState<Mode>('forward');
  const [monthly, setMonthly] = useState('30000');
  const [years, setYears] = useState('20');
  const [rate, setRate] = useState('3');
  const [initial, setInitial] = useState('0');
  const [target, setTarget] = useState('10000000');
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const fwdResult = useMemo(() => {
    if (mode !== 'forward') return null;
    try {
      return calcSavings({
        monthlyAmount: Number(monthly),
        years: Number(years),
        annualRate: Number(rate),
        initialAmount: Number(initial),
      });
    } catch { return null; }
  }, [mode, monthly, years, rate, initial]);

  const revResult = useMemo(() => {
    if (mode !== 'reverse') return null;
    try {
      return calcRequiredMonthly(Number(target), Number(years), Number(rate));
    } catch { return null; }
  }, [mode, target, years, rate]);

  useEffect(() => {
    if (!fwdResult || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const { yearlyBreakdown } = fwdResult;
    const W = canvas.width;
    const H = canvas.height;
    const pad = 40;
    ctx.clearRect(0, 0, W, H);
    const maxVal = yearlyBreakdown[yearlyBreakdown.length - 1]?.balance ?? 1;
    yearlyBreakdown.forEach((entry, i) => {
      const x = pad + (i / (yearlyBreakdown.length - 1)) * (W - pad * 2);
      const yP = H - pad - (entry.totalPrincipal / maxVal) * (H - pad * 2);
      const yB = H - pad - (entry.balance / maxVal) * (H - pad * 2);
      if (i === 0) { ctx.beginPath(); ctx.moveTo(x, yB); }
      else ctx.lineTo(x, yB);
    });
    ctx.strokeStyle = '#3b82f6';
    ctx.lineWidth = 2;
    ctx.stroke();
  }, [fwdResult]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
      <div className="max-w-2xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Savings Calculator</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">積立シミュレーション</p>
        </div>

        <div className="flex gap-2">
          <Button type="button" variant={mode === 'forward' ? 'default' : 'outline'} onClick={() => setMode('forward')}>積立額→残高</Button>
          <Button type="button" variant={mode === 'reverse' ? 'default' : 'outline'} onClick={() => setMode('reverse')}>目標額→必要月額</Button>
        </div>

        <Card>
          <CardHeader><CardTitle>条件入力</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            {mode === 'forward' ? (
              <>
                <div className="space-y-2">
                  <Label>初期金額 (円)</Label>
                  <Input type="number" min="0" value={initial} onChange={(e) => setInitial(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>月積立額 (円)</Label>
                  <Input type="number" min="0" value={monthly} onChange={(e) => setMonthly(e.target.value)} />
                </div>
              </>
            ) : (
              <div className="space-y-2">
                <Label>目標金額 (円)</Label>
                <Input type="number" min="1" value={target} onChange={(e) => setTarget(e.target.value)} />
              </div>
            )}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>運用期間 (年)</Label>
                <Input type="number" min="1" value={years} onChange={(e) => setYears(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>年利 (%)</Label>
                <Input type="number" min="0" step="0.1" value={rate} onChange={(e) => setRate(e.target.value)} />
              </div>
            </div>
          </CardContent>
        </Card>

        {fwdResult && (
          <Card>
            <CardHeader><CardTitle>結果</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3 text-center">
                  <p className="text-xs text-gray-500">最終残高</p>
                  <p className="font-bold text-blue-600 dark:text-blue-400">{fmt(fwdResult.total)}</p>
                </div>
                <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-3 text-center">
                  <p className="text-xs text-gray-500">元本合計</p>
                  <p className="font-bold">{fmt(fwdResult.principal)}</p>
                </div>
                <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-3 text-center">
                  <p className="text-xs text-gray-500">利息合計</p>
                  <p className="font-bold text-green-600 dark:text-green-400">{fmt(fwdResult.interest)}</p>
                </div>
              </div>
              <canvas ref={canvasRef} width={560} height={200} className="w-full h-40 mt-2" />
            </CardContent>
          </Card>
        )}

        {revResult !== null && (
          <Card>
            <CardContent className="py-6 text-center">
              <p className="text-gray-500">必要月積立額</p>
              <p className="text-4xl font-bold mt-2">{fmt(Math.ceil(revResult))}</p>
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
cd apps/savings-calculator && vp dev
```

`http://localhost:5461` を開き、月3万・20年・年利3%で結果が表示されることを確認。

- [ ] **Step 8: コミット**

```bash
git add apps/savings-calculator/
git commit -m "feat: add savings-calculator tool"
```

---

### Task 3: `retirement-calculator` — 老後資金シミュレーション

**Files:**
- Create: `apps/retirement-calculator/`
- Create: `apps/retirement-calculator/src/utils/retirement.ts`
- Create: `apps/retirement-calculator/src/utils/__tests__/retirement.test.ts`
- Create: `apps/retirement-calculator/src/App.tsx`

**Interfaces:**
- Produces:
  - `calcRetirement(params: RetirementParams): RetirementResult`
  - `interface RetirementParams { currentAge: number; retireAge: number; lifeExpectancy: number; currentAssets: number; monthlyContribution: number; monthlyExpenseAfterRetire: number; annualRate: number }`
  - `interface RetirementResult { assetsAtRetirement: number; depletionAge: number | null; yearlyBreakdown: RetirementEntry[] }`
  - `interface RetirementEntry { age: number; balance: number; phase: 'accumulation' | 'withdrawal' }`

- [ ] **Step 1: スキャフォールド生成**

```bash
node scripts/create-app.js retirement-calculator "老後資金・退職金シミュレーション"
```

`apps/retirement-calculator/vite.config.ts` の `port` を `5462` に変更。

- [ ] **Step 2: ユニットテストを書く**

`apps/retirement-calculator/src/utils/__tests__/retirement.test.ts`:

```typescript
import { describe, it, expect } from 'vitest';
import { calcRetirement } from '../retirement';

describe('calcRetirement', () => {
  it('退職時資産を計算する（積立フェーズのみ）', () => {
    const result = calcRetirement({
      currentAge: 30,
      retireAge: 65,
      lifeExpectancy: 90,
      currentAssets: 0,
      monthlyContribution: 30000,
      monthlyExpenseAfterRetire: 200000,
      annualRate: 3,
    });
    // 35年積立: 大まかに 30000 × 420ヶ月 以上
    expect(result.assetsAtRetirement).toBeGreaterThan(30000 * 420);
  });

  it('yearlyBreakdown が currentAge から lifeExpectancy まで含む', () => {
    const result = calcRetirement({
      currentAge: 60,
      retireAge: 65,
      lifeExpectancy: 75,
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
      lifeExpectancy: 90,
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
      lifeExpectancy: 70,
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
        lifeExpectancy: 90,
        currentAssets: 0,
        monthlyContribution: 0,
        monthlyExpenseAfterRetire: 0,
        annualRate: 0,
      }),
    ).toThrow('Retire age must be greater than current age');
  });
});
```

- [ ] **Step 3: テストが失敗することを確認**

```bash
cd apps/retirement-calculator && vp test
```

Expected: FAIL

- [ ] **Step 4: ユーティリティを実装**

`apps/retirement-calculator/src/utils/retirement.ts`:

```typescript
export interface RetirementParams {
  currentAge: number;
  retireAge: number;
  lifeExpectancy: number;
  currentAssets: number;
  monthlyContribution: number;
  monthlyExpenseAfterRetire: number;
  annualRate: number;
}

export interface RetirementEntry {
  age: number;
  balance: number;
  phase: 'accumulation' | 'withdrawal';
}

export interface RetirementResult {
  assetsAtRetirement: number;
  depletionAge: number | null;
  yearlyBreakdown: RetirementEntry[];
}

export function calcRetirement(params: RetirementParams): RetirementResult {
  const {
    currentAge, retireAge, lifeExpectancy,
    currentAssets, monthlyContribution, monthlyExpenseAfterRetire, annualRate,
  } = params;

  if (retireAge <= currentAge) throw new Error('Retire age must be greater than current age');
  if (lifeExpectancy <= retireAge) throw new Error('Life expectancy must be greater than retire age');

  const monthlyRate = annualRate / 100 / 12;
  const yearlyBreakdown: RetirementEntry[] = [];
  let balance = currentAssets;
  let depletionAge: number | null = null;

  for (let age = currentAge; age <= lifeExpectancy; age++) {
    const isAccumulation = age < retireAge;
    const monthlyFlow = isAccumulation ? monthlyContribution : -monthlyExpenseAfterRetire;

    for (let m = 0; m < 12; m++) {
      balance = balance * (1 + monthlyRate) + monthlyFlow;
      if (balance < 0 && depletionAge === null) {
        depletionAge = age + (m + 1) / 12;
        balance = 0;
      }
    }

    yearlyBreakdown.push({
      age,
      balance,
      phase: isAccumulation ? 'accumulation' : 'withdrawal',
    });
  }

  const retirementEntry = yearlyBreakdown.find((e) => e.age === retireAge - 1);
  const assetsAtRetirement = retirementEntry?.balance ?? currentAssets;

  return { assetsAtRetirement, depletionAge, yearlyBreakdown };
}
```

- [ ] **Step 5: テストが通ることを確認**

```bash
cd apps/retirement-calculator && vp test
```

Expected: PASS

- [ ] **Step 6: App.tsx を実装**

`apps/retirement-calculator/src/App.tsx`:

```typescript
import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Toaster } from '@/components/ui/toaster';
import { calcRetirement } from '@/utils/retirement';

const fmt = (n: number) =>
  n.toLocaleString('ja-JP', { style: 'currency', currency: 'JPY', maximumFractionDigits: 0 });

export default function App() {
  const [currentAge, setCurrentAge] = useState('35');
  const [retireAge, setRetireAge] = useState('65');
  const [lifeExpectancy, setLifeExpectancy] = useState('90');
  const [currentAssets, setCurrentAssets] = useState('5000000');
  const [monthlyContribution, setMonthlyContribution] = useState('30000');
  const [monthlyExpense, setMonthlyExpense] = useState('200000');
  const [rate, setRate] = useState('3');

  const result = useMemo(() => {
    try {
      return calcRetirement({
        currentAge: Number(currentAge),
        retireAge: Number(retireAge),
        lifeExpectancy: Number(lifeExpectancy),
        currentAssets: Number(currentAssets),
        monthlyContribution: Number(monthlyContribution),
        monthlyExpenseAfterRetire: Number(monthlyExpense),
        annualRate: Number(rate),
      });
    } catch { return null; }
  }, [currentAge, retireAge, lifeExpectancy, currentAssets, monthlyContribution, monthlyExpense, rate]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
      <div className="max-w-2xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Retirement Calculator</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">老後資金シミュレーション</p>
        </div>

        <Card>
          <CardHeader><CardTitle>基本情報</CardTitle></CardHeader>
          <CardContent className="grid grid-cols-2 gap-4">
            <div className="space-y-2"><Label>現在年齢</Label><Input type="number" min="20" max="80" value={currentAge} onChange={(e) => setCurrentAge(e.target.value)} /></div>
            <div className="space-y-2"><Label>退職年齢</Label><Input type="number" min="50" max="80" value={retireAge} onChange={(e) => setRetireAge(e.target.value)} /></div>
            <div className="space-y-2"><Label>目標寿命</Label><Input type="number" min="70" max="110" value={lifeExpectancy} onChange={(e) => setLifeExpectancy(e.target.value)} /></div>
            <div className="space-y-2"><Label>年利 (%)</Label><Input type="number" min="0" step="0.1" value={rate} onChange={(e) => setRate(e.target.value)} /></div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>資産・収支</CardTitle></CardHeader>
          <CardContent className="grid grid-cols-2 gap-4">
            <div className="space-y-2"><Label>現在の資産 (円)</Label><Input type="number" min="0" value={currentAssets} onChange={(e) => setCurrentAssets(e.target.value)} /></div>
            <div className="space-y-2"><Label>月積立額 (円)</Label><Input type="number" min="0" value={monthlyContribution} onChange={(e) => setMonthlyContribution(e.target.value)} /></div>
            <div className="space-y-2 col-span-2"><Label>退職後の月支出 (円)</Label><Input type="number" min="0" value={monthlyExpense} onChange={(e) => setMonthlyExpense(e.target.value)} /></div>
          </CardContent>
        </Card>

        {result && (
          <Card>
            <CardHeader><CardTitle>シミュレーション結果</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3 text-center">
                  <p className="text-xs text-gray-500">退職時資産</p>
                  <p className="font-bold text-blue-600 dark:text-blue-400">{fmt(result.assetsAtRetirement)}</p>
                </div>
                <div className={`rounded-lg p-3 text-center ${result.depletionAge ? 'bg-red-50 dark:bg-red-900/20' : 'bg-green-50 dark:bg-green-900/20'}`}>
                  <p className="text-xs text-gray-500">資産枯渇年齢</p>
                  <p className={`font-bold ${result.depletionAge ? 'text-red-600 dark:text-red-400' : 'text-green-600 dark:text-green-400'}`}>
                    {result.depletionAge ? `${Math.floor(result.depletionAge)}歳` : '枯渇なし'}
                  </p>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead><tr className="text-left text-gray-500"><th className="pb-2">年齢</th><th className="pb-2">残高</th><th className="pb-2">フェーズ</th></tr></thead>
                  <tbody>
                    {result.yearlyBreakdown.filter((_, i) => i % 5 === 0).map((entry) => (
                      <tr key={entry.age} className="border-t border-gray-100 dark:border-gray-800">
                        <td className="py-1">{entry.age}歳</td>
                        <td className="py-1">{fmt(entry.balance)}</td>
                        <td className="py-1 text-xs text-gray-500">{entry.phase === 'accumulation' ? '積立' : '取崩し'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
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
cd apps/retirement-calculator && vp dev
```

`http://localhost:5462` を開き、35歳・退職65歳・寿命90歳のシナリオで結果が表示されることを確認。

- [ ] **Step 8: コミット**

```bash
git add apps/retirement-calculator/
git commit -m "feat: add retirement-calculator tool"
```

---

### Task 4: `break-even-calculator` — 損益分岐点計算

**Files:**
- Create: `apps/break-even-calculator/`
- Create: `apps/break-even-calculator/src/utils/breakEven.ts`
- Create: `apps/break-even-calculator/src/utils/__tests__/breakEven.test.ts`
- Create: `apps/break-even-calculator/src/App.tsx`

**Interfaces:**
- Produces:
  - `calcBreakEven(params: BreakEvenParams): BreakEvenResult`
  - `interface BreakEvenParams { fixedCost: number; variableRatio: number; revenue: number }`
  - `interface BreakEvenResult { breakEvenRevenue: number; safetyMarginRatio: number; operatingLeverage: number; profit: number; variableCost: number; contributionMarginRatio: number }`

- [ ] **Step 1: スキャフォールド生成**

```bash
node scripts/create-app.js break-even-calculator "損益分岐点・安全余裕率計算"
```

`apps/break-even-calculator/vite.config.ts` の `port` を `5463` に変更。

- [ ] **Step 2: ユニットテストを書く**

`apps/break-even-calculator/src/utils/__tests__/breakEven.test.ts`:

```typescript
import { describe, it, expect } from 'vitest';
import { calcBreakEven } from '../breakEven';

describe('breakEven', () => {
  it('固定費100万・変動費率60%・売上300万 → 損益分岐点250万', () => {
    // BEP = FC / (1 - VC率) = 1000000 / 0.4 = 2500000
    const result = calcBreakEven({ fixedCost: 1000000, variableRatio: 60, revenue: 3000000 });
    expect(result.breakEvenRevenue).toBeCloseTo(2500000, 0);
  });

  it('利益を正しく算出', () => {
    const result = calcBreakEven({ fixedCost: 1000000, variableRatio: 60, revenue: 3000000 });
    // 利益 = 3000000 - 1800000 - 1000000 = 200000
    expect(result.profit).toBeCloseTo(200000, 0);
  });

  it('安全余裕率を算出', () => {
    const result = calcBreakEven({ fixedCost: 1000000, variableRatio: 60, revenue: 3000000 });
    // (3000000 - 2500000) / 3000000 ≈ 16.67%
    expect(result.safetyMarginRatio).toBeCloseTo(16.67, 1);
  });

  it('貢献利益率 = 1 - 変動費率', () => {
    const result = calcBreakEven({ fixedCost: 1000000, variableRatio: 60, revenue: 3000000 });
    expect(result.contributionMarginRatio).toBeCloseTo(40, 1);
  });

  it('固定費負値は例外を投げる', () => {
    expect(() => calcBreakEven({ fixedCost: -1, variableRatio: 60, revenue: 3000000 })).toThrow('Fixed cost must be non-negative');
  });

  it('変動費率100%以上は例外を投げる', () => {
    expect(() => calcBreakEven({ fixedCost: 1000000, variableRatio: 100, revenue: 3000000 })).toThrow('Variable ratio must be less than 100');
  });

  it('売上0は例外を投げる', () => {
    expect(() => calcBreakEven({ fixedCost: 1000000, variableRatio: 60, revenue: 0 })).toThrow('Revenue must be positive');
  });
});
```

- [ ] **Step 3: テストが失敗することを確認**

```bash
cd apps/break-even-calculator && vp test
```

Expected: FAIL

- [ ] **Step 4: ユーティリティを実装**

`apps/break-even-calculator/src/utils/breakEven.ts`:

```typescript
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
```

- [ ] **Step 5: テストが通ることを確認**

```bash
cd apps/break-even-calculator && vp test
```

Expected: PASS

- [ ] **Step 6: App.tsx を実装**

`apps/break-even-calculator/src/App.tsx`:

```typescript
import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Toaster } from '@/components/ui/toaster';
import { calcBreakEven } from '@/utils/breakEven';

const fmt = (n: number) =>
  n.toLocaleString('ja-JP', { style: 'currency', currency: 'JPY', maximumFractionDigits: 0 });

export default function App() {
  const [fixedCost, setFixedCost] = useState('1000000');
  const [variableRatio, setVariableRatio] = useState('60');
  const [revenue, setRevenue] = useState('3000000');

  const result = useMemo(() => {
    try {
      return calcBreakEven({
        fixedCost: Number(fixedCost),
        variableRatio: Number(variableRatio),
        revenue: Number(revenue),
      });
    } catch { return null; }
  }, [fixedCost, variableRatio, revenue]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
      <div className="max-w-2xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Break-Even Point</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">損益分岐点・安全余裕率計算</p>
        </div>
        <Card>
          <CardHeader><CardTitle>入力</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2"><Label>固定費 (円)</Label><Input type="number" min="0" value={fixedCost} onChange={(e) => setFixedCost(e.target.value)} /></div>
            <div className="space-y-2"><Label>変動費率 (%)</Label><Input type="number" min="0" max="99" value={variableRatio} onChange={(e) => setVariableRatio(e.target.value)} /></div>
            <div className="space-y-2"><Label>売上高 (円)</Label><Input type="number" min="1" value={revenue} onChange={(e) => setRevenue(e.target.value)} /></div>
          </CardContent>
        </Card>
        {result && (
          <Card>
            <CardHeader><CardTitle>計算結果</CardTitle></CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-3 text-center">
                  <p className="text-xs text-gray-500">損益分岐点売上高</p>
                  <p className="font-bold text-yellow-700 dark:text-yellow-400">{fmt(result.breakEvenRevenue)}</p>
                </div>
                <div className={`rounded-lg p-3 text-center ${result.profit >= 0 ? 'bg-green-50 dark:bg-green-900/20' : 'bg-red-50 dark:bg-red-900/20'}`}>
                  <p className="text-xs text-gray-500">利益</p>
                  <p className={`font-bold ${result.profit >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>{fmt(result.profit)}</p>
                </div>
                <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-3 text-center">
                  <p className="text-xs text-gray-500">安全余裕率</p>
                  <p className="font-bold">{result.safetyMarginRatio.toFixed(1)}%</p>
                </div>
                <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-3 text-center">
                  <p className="text-xs text-gray-500">営業レバレッジ</p>
                  <p className="font-bold">{isFinite(result.operatingLeverage) ? result.operatingLeverage.toFixed(2) : '∞'}</p>
                </div>
                <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-3 text-center">
                  <p className="text-xs text-gray-500">貢献利益率</p>
                  <p className="font-bold">{result.contributionMarginRatio.toFixed(1)}%</p>
                </div>
                <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-3 text-center">
                  <p className="text-xs text-gray-500">変動費</p>
                  <p className="font-bold">{fmt(result.variableCost)}</p>
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
cd apps/break-even-calculator && vp dev
```

`http://localhost:5463` を開き、損益分岐点が正しく表示されることを確認。

- [ ] **Step 8: コミット**

```bash
git add apps/break-even-calculator/
git commit -m "feat: add break-even-calculator tool"
```

---

### Task 5: `bill-split-calculator` — 割り勘計算ツール

**Files:**
- Create: `apps/bill-split-calculator/`
- Create: `apps/bill-split-calculator/src/utils/billSplit.ts`
- Create: `apps/bill-split-calculator/src/utils/__tests__/billSplit.test.ts`
- Create: `apps/bill-split-calculator/src/App.tsx`

**Interfaces:**
- Produces:
  - `splitBill(params: SplitParams): SplitResult`
  - `interface BillItem { id: string; name: string; amount: number }`
  - `interface Member { id: string; name: string; ratio: number }`
  - `interface SplitParams { items: BillItem[]; members: Member[]; rounding: 'up' | 'down' | 'nearest' }`
  - `interface SplitResult { totalAmount: number; perMember: MemberShare[]; summaryText: string }`
  - `interface MemberShare { memberId: string; memberName: string; amount: number }`

- [ ] **Step 1: スキャフォールド生成**

```bash
node scripts/create-app.js bill-split-calculator "割り勘計算（品目別・不均等割り対応）"
```

`apps/bill-split-calculator/vite.config.ts` の `port` を `5464` に変更。

- [ ] **Step 2: ユニットテストを書く**

`apps/bill-split-calculator/src/utils/__tests__/billSplit.test.ts`:

```typescript
import { describe, it, expect } from 'vitest';
import { splitBill } from '../billSplit';

const members = [
  { id: 'a', name: 'Alice', ratio: 1 },
  { id: 'b', name: 'Bob', ratio: 1 },
];

describe('billSplit', () => {
  it('2人均等割り', () => {
    const result = splitBill({
      items: [{ id: '1', name: '食事', amount: 10000 }],
      members,
      rounding: 'nearest',
    });
    expect(result.totalAmount).toBe(10000);
    expect(result.perMember[0].amount).toBe(5000);
    expect(result.perMember[1].amount).toBe(5000);
  });

  it('不均等割り（2:1）', () => {
    const result = splitBill({
      items: [{ id: '1', name: '食事', amount: 9000 }],
      members: [
        { id: 'a', name: 'Alice', ratio: 2 },
        { id: 'b', name: 'Bob', ratio: 1 },
      ],
      rounding: 'nearest',
    });
    expect(result.perMember[0].amount).toBe(6000); // 2/3
    expect(result.perMember[1].amount).toBe(3000); // 1/3
  });

  it('切り上げ端数処理', () => {
    const result = splitBill({
      items: [{ id: '1', name: '食事', amount: 1000 }],
      members: [
        { id: 'a', name: 'Alice', ratio: 1 },
        { id: 'b', name: 'Bob', ratio: 1 },
        { id: 'c', name: 'Carol', ratio: 1 },
      ],
      rounding: 'up',
    });
    // 1000/3 = 333.33 → ceil = 334
    expect(result.perMember[0].amount).toBe(334);
  });

  it('品目が空の場合はゼロ', () => {
    const result = splitBill({ items: [], members, rounding: 'nearest' });
    expect(result.totalAmount).toBe(0);
    expect(result.perMember[0].amount).toBe(0);
  });

  it('メンバーが空は例外を投げる', () => {
    expect(() =>
      splitBill({ items: [{ id: '1', name: 'test', amount: 1000 }], members: [], rounding: 'nearest' }),
    ).toThrow('At least one member required');
  });

  it('summaryText にメンバー名が含まれる', () => {
    const result = splitBill({
      items: [{ id: '1', name: '食事', amount: 10000 }],
      members,
      rounding: 'nearest',
    });
    expect(result.summaryText).toContain('Alice');
    expect(result.summaryText).toContain('Bob');
  });
});
```

- [ ] **Step 3: テストが失敗することを確認**

```bash
cd apps/bill-split-calculator && vp test
```

Expected: FAIL

- [ ] **Step 4: ユーティリティを実装**

`apps/bill-split-calculator/src/utils/billSplit.ts`:

```typescript
export type RoundingMode = 'up' | 'down' | 'nearest';

export interface BillItem {
  id: string;
  name: string;
  amount: number;
}

export interface Member {
  id: string;
  name: string;
  ratio: number;
}

export interface MemberShare {
  memberId: string;
  memberName: string;
  amount: number;
}

export interface SplitParams {
  items: BillItem[];
  members: Member[];
  rounding: RoundingMode;
}

export interface SplitResult {
  totalAmount: number;
  perMember: MemberShare[];
  summaryText: string;
}

function applyRounding(value: number, mode: RoundingMode): number {
  switch (mode) {
    case 'up': return Math.ceil(value);
    case 'down': return Math.floor(value);
    case 'nearest': return Math.round(value);
  }
}

export function splitBill(params: SplitParams): SplitResult {
  const { items, members, rounding } = params;
  if (members.length === 0) throw new Error('At least one member required');

  const totalAmount = items.reduce((sum, item) => sum + item.amount, 0);
  const totalRatio = members.reduce((sum, m) => sum + m.ratio, 0);

  const perMember: MemberShare[] = members.map((member) => ({
    memberId: member.id,
    memberName: member.name,
    amount: applyRounding((totalAmount * member.ratio) / totalRatio, rounding),
  }));

  const lines = perMember.map(
    (m) => `${m.memberName}: ${m.amount.toLocaleString('ja-JP')}円`,
  );
  const summaryText = [
    `合計: ${totalAmount.toLocaleString('ja-JP')}円`,
    ...lines,
  ].join('\n');

  return { totalAmount, perMember, summaryText };
}
```

- [ ] **Step 5: テストが通ることを確認**

```bash
cd apps/bill-split-calculator && vp test
```

Expected: PASS

- [ ] **Step 6: App.tsx を実装**

`apps/bill-split-calculator/src/App.tsx`:

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
import { useToast } from '@/hooks/useToast';
import { Copy, Plus, Trash2 } from 'lucide-react';
import { splitBill, type BillItem, type Member, type RoundingMode } from '@/utils/billSplit';

let idCounter = 0;
const newId = () => String(++idCounter);

export default function App() {
  const [items, setItems] = useState<BillItem[]>([
    { id: newId(), name: '食事', amount: 10000 },
  ]);
  const [members, setMembers] = useState<Member[]>([
    { id: newId(), name: 'Alice', ratio: 1 },
    { id: newId(), name: 'Bob', ratio: 1 },
  ]);
  const [rounding, setRounding] = useState<RoundingMode>('nearest');
  const { toast } = useToast();

  const result = useMemo(() => {
    try { return splitBill({ items, members, rounding }); }
    catch { return null; }
  }, [items, members, rounding]);

  const addItem = () => setItems((prev) => [...prev, { id: newId(), name: '', amount: 0 }]);
  const removeItem = (id: string) => setItems((prev) => prev.filter((i) => i.id !== id));
  const updateItem = (id: string, field: 'name' | 'amount', value: string) =>
    setItems((prev) => prev.map((i) => i.id === id ? { ...i, [field]: field === 'amount' ? Number(value) : value } : i));

  const addMember = () => setMembers((prev) => [...prev, { id: newId(), name: '', ratio: 1 }]);
  const removeMember = (id: string) => setMembers((prev) => prev.filter((m) => m.id !== id));
  const updateMember = (id: string, field: 'name' | 'ratio', value: string) =>
    setMembers((prev) => prev.map((m) => m.id === id ? { ...m, [field]: field === 'ratio' ? Number(value) : value } : m));

  const handleCopy = () => {
    if (!result) return;
    navigator.clipboard.writeText(result.summaryText).catch(() => {
      toast({ title: 'コピーに失敗しました', variant: 'destructive' });
    });
    toast({ title: 'コピーしました' });
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
      <div className="max-w-2xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Bill Split</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">割り勘計算（品目別・不均等割り対応）</p>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>品目</CardTitle>
              <Button type="button" variant="outline" size="sm" onClick={addItem}><Plus className="h-4 w-4 mr-1" />追加</Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-2">
            {items.map((item) => (
              <div key={item.id} className="flex gap-2 items-center">
                <Input placeholder="品目名" value={item.name} onChange={(e) => updateItem(item.id, 'name', e.target.value)} className="flex-1" />
                <Input type="number" min="0" placeholder="金額" value={item.amount || ''} onChange={(e) => updateItem(item.id, 'amount', e.target.value)} className="w-32" />
                <Button type="button" variant="ghost" size="icon" onClick={() => removeItem(item.id)}><Trash2 className="h-4 w-4" /></Button>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>参加者</CardTitle>
              <Button type="button" variant="outline" size="sm" onClick={addMember}><Plus className="h-4 w-4 mr-1" />追加</Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-2">
            {members.map((member) => (
              <div key={member.id} className="flex gap-2 items-center">
                <Input placeholder="名前" value={member.name} onChange={(e) => updateMember(member.id, 'name', e.target.value)} className="flex-1" />
                <div className="flex items-center gap-1">
                  <Label className="text-xs whitespace-nowrap">比率</Label>
                  <Input type="number" min="0.1" step="0.1" value={member.ratio} onChange={(e) => updateMember(member.id, 'ratio', e.target.value)} className="w-20" />
                </div>
                <Button type="button" variant="ghost" size="icon" onClick={() => removeMember(member.id)}><Trash2 className="h-4 w-4" /></Button>
              </div>
            ))}
            <div className="flex items-center gap-2 mt-2">
              <Label className="text-sm">端数処理</Label>
              <Select value={rounding} onValueChange={(v) => setRounding(v as RoundingMode)}>
                <SelectTrigger className="w-32"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="nearest">四捨五入</SelectItem>
                  <SelectItem value="up">切り上げ</SelectItem>
                  <SelectItem value="down">切り捨て</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {result && (
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>結果</CardTitle>
                <Button type="button" variant="outline" size="sm" onClick={handleCopy}><Copy className="h-4 w-4 mr-1" />コピー</Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-2">
              <p className="text-sm text-gray-500">合計: {result.totalAmount.toLocaleString('ja-JP')}円</p>
              {result.perMember.map((m) => (
                <div key={m.memberId} className="flex justify-between items-center bg-gray-100 dark:bg-gray-800 rounded-lg px-4 py-2">
                  <span className="font-medium">{m.memberName}</span>
                  <span className="font-bold">{m.amount.toLocaleString('ja-JP')}円</span>
                </div>
              ))}
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
cd apps/bill-split-calculator && vp dev
```

`http://localhost:5464` を開き、品目・参加者を追加して割り勘計算が正しく動くことを確認。

- [ ] **Step 8: コミット**

```bash
git add apps/bill-split-calculator/
git commit -m "feat: add bill-split-calculator tool"
```

---

### Task 6: apps.ts に PR-2 の 4 ツールを登録

**Files:**
- Modify: `packages/router/src/config/apps.ts`

- [ ] **Step 1: APPS_CONFIG 配列に追記**

```typescript
  // ── Finance ──
  { path: '/savings-calculator', url: 'https://tools-savings-calculator.elchika.app', icon: '💰', displayName: 'Savings Calculator', description: '積立シミュレーション（目標額から月額逆算）', category: 'Finance' },
  { path: '/retirement-calculator', url: 'https://tools-retirement-calculator.elchika.app', icon: '🏖', displayName: 'Retirement Calculator', description: '老後資金シミュレーション', category: 'Finance' },
  { path: '/break-even-calculator', url: 'https://tools-break-even-calculator.elchika.app', icon: '📊', displayName: 'Break-Even Point', description: '損益分岐点・安全余裕率計算', category: 'Finance' },
  { path: '/bill-split-calculator', url: 'https://tools-bill-split-calculator.elchika.app', icon: '🧾', displayName: 'Bill Split', description: '割り勘計算（品目別・不均等割り対応）', category: 'Finance' },
```

- [ ] **Step 2: 型チェック**

```bash
cd packages/router && npx tsc --noEmit
```

Expected: エラーなし

- [ ] **Step 3: コミット**

```bash
git add packages/router/src/config/apps.ts
git commit -m "feat(router): register PR-2 Finance tools in apps.ts"
```

---

## Self-Review Checklist

- [x] Spec 要件カバー: savings-calculator (正算・逆算・グラフ) ✅, retirement-calculator (積立→取崩し・枯渇年齢) ✅, break-even-calculator (BEP・安全余裕率・OL) ✅, bill-split-calculator (品目・不均等割り・端数) ✅
- [x] プレースホルダーなし
- [x] 型の一貫性: 全ツールで params/result インターフェースが utils と App.tsx で統一されている
- [x] compound-interest との差異: savings-calculator は「目標額逆算」機能があり UI が積立専用
- [x] tip-calculator との差異: bill-split-calculator はチップなし・品目別割り当て・不均等比率に特化
