# PR-1: Design Tools Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** `apps/` に 4 つのデザイン/写真系ツールを追加し、`packages/router/src/config/apps.ts` に `Design` カテゴリと合わせて登録する。

**Architecture:** 各ツールは独立 SPA。`create-app.js` でスキャフォールドを生成し、`src/utils/<name>.ts` にコアロジック（純粋関数）、`src/utils/__tests__/<name>.test.ts` にユニットテスト、`src/App.tsx` に UI を実装する。

**Tech Stack:** React 19, TypeScript (strict), Vite+, Tailwind CSS 3.4, shadcn/ui, Vitest

## Global Constraints

- ポート番号: golden-ratio=5457, image-grid-calculator=5458, photo-exposure=5459, depth-of-field=5460
- コマンドは `apps/<tool-name>/` ディレクトリ内で `vp test` / `vp dev` を実行
- ボタン要素には必ず `type="button"` を付与
- コアロジックは純粋関数として `src/utils/` に分離（副作用なし）
- テストは Vitest (`describe` / `it` / `expect`)
- `apps.ts` への追記は最後の Task 5 でまとめて行う

---

### Task 1: apps.ts に `Design` カテゴリを追加

**Files:**
- Modify: `packages/router/src/config/apps.ts:8`

**Interfaces:**
- Produces: `'Design'` が `AppCategory` 型に追加される

- [ ] **Step 1: AppCategory 型に追記**

`packages/router/src/config/apps.ts` の `AppCategory` 型を以下に変更する:

```typescript
export type AppCategory =
  | 'Text' | 'Encode' | 'Crypto' | 'Number' | 'DateTime'
  | 'JSON' | 'Code' | 'Color / CSS' | 'Image' | 'PDF'
  | 'Video' | 'Generator' | 'Network'
  | 'Design';
```

- [ ] **Step 2: 型チェック**

```bash
cd packages/router && npx tsc --noEmit
```

Expected: エラーなし

- [ ] **Step 3: コミット**

```bash
git add packages/router/src/config/apps.ts
git commit -m "feat(router): add Design category to AppCategory"
```

---

### Task 2: `golden-ratio` — 黄金比・白銀比計算ツール

**Files:**
- Create: `apps/golden-ratio/` (スキャフォールド一式)
- Create: `apps/golden-ratio/src/utils/goldenRatio.ts`
- Create: `apps/golden-ratio/src/utils/__tests__/goldenRatio.test.ts`
- Create: `apps/golden-ratio/src/App.tsx`

**Interfaces:**
- Produces:
  - `calcRatio(input: number, side: 'width' | 'height', ratio: number): number`
  - `RATIOS: RatioDef[]` — 比率の定義リスト

- [ ] **Step 1: スキャフォールド生成**

```bash
cd /path/to/repo
node scripts/create-app.js golden-ratio "黄金比・白銀比から寸法計算"
```

生成後、`apps/golden-ratio/vite.config.ts` の `port` を `5457` に変更する:

```typescript
server: {
  port: 5457,
},
```

- [ ] **Step 2: ユニットテストを書く**

`apps/golden-ratio/src/utils/__tests__/goldenRatio.test.ts`:

```typescript
import { describe, it, expect } from 'vitest';
import { calcRatio, RATIOS } from '../goldenRatio';

describe('goldenRatio', () => {
  describe('calcRatio', () => {
    it('黄金比: 幅100から高さを算出', () => {
      const result = calcRatio(100, 'width', 1.6180339887);
      expect(result).toBeCloseTo(61.8, 1);
    });

    it('黄金比: 高さ100から幅を算出', () => {
      const result = calcRatio(100, 'height', 1.6180339887);
      expect(result).toBeCloseTo(161.8, 1);
    });

    it('白銀比(√2): 幅100から高さを算出', () => {
      const result = calcRatio(100, 'width', Math.SQRT2);
      expect(result).toBeCloseTo(70.71, 1);
    });

    it('正方形比(1:1): 幅100から高さは100', () => {
      const result = calcRatio(100, 'width', 1);
      expect(result).toBe(100);
    });

    it('幅0は0を返す', () => {
      expect(calcRatio(0, 'width', 1.618)).toBe(0);
    });

    it('負値は例外を投げる', () => {
      expect(() => calcRatio(-1, 'width', 1.618)).toThrow('Input must be non-negative');
    });
  });

  describe('RATIOS', () => {
    it('少なくとも5つの比率が定義されている', () => {
      expect(RATIOS.length).toBeGreaterThanOrEqual(5);
    });

    it('各エントリに id, label, ratio が存在する', () => {
      for (const r of RATIOS) {
        expect(typeof r.id).toBe('string');
        expect(typeof r.label).toBe('string');
        expect(typeof r.ratio).toBe('number');
        expect(r.ratio).toBeGreaterThan(0);
      }
    });
  });
});
```

- [ ] **Step 3: テストが失敗することを確認**

```bash
cd apps/golden-ratio && vp test
```

Expected: FAIL — `goldenRatio.ts` が存在しないためインポートエラー

- [ ] **Step 4: ユーティリティを実装**

`apps/golden-ratio/src/utils/goldenRatio.ts`:

```typescript
export interface RatioDef {
  id: string;
  label: string;
  ratio: number;
  description: string;
}

export const RATIOS: RatioDef[] = [
  {
    id: 'golden',
    label: '黄金比 (φ)',
    ratio: 1.6180339887498948,
    description: '1 : 1.618 — 自然界や芸術に現れる美の比率',
  },
  {
    id: 'silver',
    label: '白銀比 (√2)',
    ratio: Math.SQRT2,
    description: '1 : 1.414 — A4用紙などに使われる比率',
  },
  {
    id: 'bronze',
    label: '青銅比',
    ratio: 3.302775637731995,
    description: '1 : 3.303',
  },
  {
    id: 'third',
    label: '三分割',
    ratio: 1 / 3,
    description: '1 : 0.333 — 写真の構図で使われる比率',
  },
  {
    id: 'sixteen9',
    label: '16:9',
    ratio: 16 / 9,
    description: 'ワイドスクリーン標準比率',
  },
  {
    id: 'four3',
    label: '4:3',
    ratio: 4 / 3,
    description: '従来のモニター・TV比率',
  },
  {
    id: 'three2',
    label: '3:2',
    ratio: 3 / 2,
    description: '一眼レフカメラの標準比率',
  },
];

/**
 * 入力値と側面指定から比率に基づくもう一方の辺を算出する。
 * side='width' の場合: height = width / ratio
 * side='height' の場合: width = height * ratio
 */
export function calcRatio(input: number, side: 'width' | 'height', ratio: number): number {
  if (input < 0) throw new Error('Input must be non-negative');
  if (ratio <= 0) throw new Error('Ratio must be positive');
  if (input === 0) return 0;
  return side === 'width' ? input / ratio : input * ratio;
}
```

- [ ] **Step 5: テストが通ることを確認**

```bash
cd apps/golden-ratio && vp test
```

Expected: PASS (全テスト green)

- [ ] **Step 6: App.tsx を実装**

`apps/golden-ratio/src/App.tsx`:

```typescript
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Toaster } from '@/components/ui/toaster';
import { useToast } from '@/hooks/useToast';
import { Copy } from 'lucide-react';
import { calcRatio, RATIOS } from '@/utils/goldenRatio';

type Side = 'width' | 'height';

export default function App() {
  const [inputValue, setInputValue] = useState('');
  const [side, setSide] = useState<Side>('width');
  const { toast } = useToast();

  const numVal = Number(inputValue);
  const isValid = inputValue !== '' && !isNaN(numVal) && numVal >= 0;

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text).catch(() => {
      toast({ title: 'コピーに失敗しました', variant: 'destructive' });
    });
    toast({ title: 'コピーしました' });
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
      <div className="max-w-2xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Golden Ratio</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">黄金比・白銀比などから寸法を計算</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>入力</CardTitle>
            <CardDescription>基準となる辺の値を入力してください</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="value">基準値 (px)</Label>
              <Input
                id="value"
                type="number"
                min="0"
                placeholder="例: 1200"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <Button
                type="button"
                variant={side === 'width' ? 'default' : 'outline'}
                onClick={() => setSide('width')}
              >
                幅を指定
              </Button>
              <Button
                type="button"
                variant={side === 'height' ? 'default' : 'outline'}
                onClick={() => setSide('height')}
              >
                高さを指定
              </Button>
            </div>
          </CardContent>
        </Card>

        {isValid && (
          <div className="space-y-3">
            {RATIOS.map((r) => {
              const other = calcRatio(numVal, side, r.ratio);
              const w = side === 'width' ? numVal : other;
              const h = side === 'height' ? numVal : other;
              const text = `${Math.round(w)} × ${Math.round(h)}`;
              return (
                <Card key={r.id}>
                  <CardContent className="py-4 flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-gray-100">{r.label}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{r.description}</p>
                      <p className="text-lg font-mono mt-1">
                        {Math.round(w)} × {Math.round(h)} px
                      </p>
                    </div>
                    <Button type="button" variant="ghost" size="icon" onClick={() => handleCopy(text)}>
                      <Copy className="h-4 w-4" />
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
      <Toaster />
    </div>
  );
}
```

- [ ] **Step 7: ローカル動作確認**

```bash
cd apps/golden-ratio && vp dev
```

ブラウザで `http://localhost:5457` を開き、幅 `1200` を入力して各比率の結果が表示されることを確認。

- [ ] **Step 8: コミット**

```bash
git add apps/golden-ratio/
git commit -m "feat: add golden-ratio tool"
```

---

### Task 3: `image-grid-calculator` — 画像グリッド計算ツール

**Files:**
- Create: `apps/image-grid-calculator/` (スキャフォールド一式)
- Create: `apps/image-grid-calculator/src/utils/imageGrid.ts`
- Create: `apps/image-grid-calculator/src/utils/__tests__/imageGrid.test.ts`
- Create: `apps/image-grid-calculator/src/App.tsx`

**Interfaces:**
- Produces:
  - `calcGridColumns(containerWidth: number, imageWidth: number, gap: number): GridResult`
  - `calcImageWidthFromColumns(containerWidth: number, columns: number, gap: number): number`
  - `interface GridResult { columns: number; remainder: number; cssGridTemplate: string }`

- [ ] **Step 1: スキャフォールド生成**

```bash
node scripts/create-app.js image-grid-calculator "コンテナ幅から画像グリッドを計算"
```

`apps/image-grid-calculator/vite.config.ts` の `port` を `5458` に変更。

- [ ] **Step 2: ユニットテストを書く**

`apps/image-grid-calculator/src/utils/__tests__/imageGrid.test.ts`:

```typescript
import { describe, it, expect } from 'vitest';
import { calcGridColumns, calcImageWidthFromColumns } from '../imageGrid';

describe('imageGrid', () => {
  describe('calcGridColumns', () => {
    it('1200px幅・300px画像・gap20 → 3列', () => {
      // (1200 + 20) / (300 + 20) = 1220 / 320 = 3.8125 → 3列
      const result = calcGridColumns(1200, 300, 20);
      expect(result.columns).toBe(3);
    });

    it('余白を正しく計算する', () => {
      // 3列: 使用幅 = 3*300 + 2*20 = 940, 余白 = 1200 - 940 = 260
      const result = calcGridColumns(1200, 300, 20);
      expect(result.remainder).toBe(260);
    });

    it('cssGridTemplateを出力する', () => {
      const result = calcGridColumns(1200, 300, 20);
      expect(result.cssGridTemplate).toContain('repeat(3');
    });

    it('gap=0のとき余白を正しく計算', () => {
      // 1200 / 300 = 4列
      const result = calcGridColumns(1200, 300, 0);
      expect(result.columns).toBe(4);
      expect(result.remainder).toBe(0);
    });

    it('画像幅 > コンテナ幅 → 1列', () => {
      const result = calcGridColumns(300, 400, 0);
      expect(result.columns).toBe(1);
    });

    it('コンテナ幅0は例外を投げる', () => {
      expect(() => calcGridColumns(0, 300, 20)).toThrow('Container width must be positive');
    });

    it('画像幅0は例外を投げる', () => {
      expect(() => calcGridColumns(1200, 0, 20)).toThrow('Image width must be positive');
    });

    it('gap負値は例外を投げる', () => {
      expect(() => calcGridColumns(1200, 300, -1)).toThrow('Gap must be non-negative');
    });
  });

  describe('calcImageWidthFromColumns', () => {
    it('3列・gap20 → 画像幅を逆算', () => {
      // (1200 - 2*20) / 3 = 1160/3 ≈ 386.67
      const result = calcImageWidthFromColumns(1200, 3, 20);
      expect(result).toBeCloseTo(386.67, 1);
    });

    it('gap=0のとき均等分割', () => {
      const result = calcImageWidthFromColumns(1200, 4, 0);
      expect(result).toBe(300);
    });

    it('列数0は例外を投げる', () => {
      expect(() => calcImageWidthFromColumns(1200, 0, 20)).toThrow('Columns must be at least 1');
    });
  });
});
```

- [ ] **Step 3: テストが失敗することを確認**

```bash
cd apps/image-grid-calculator && vp test
```

Expected: FAIL

- [ ] **Step 4: ユーティリティを実装**

`apps/image-grid-calculator/src/utils/imageGrid.ts`:

```typescript
export interface GridResult {
  columns: number;
  remainder: number;
  cssGridTemplate: string;
}

export function calcGridColumns(
  containerWidth: number,
  imageWidth: number,
  gap: number,
): GridResult {
  if (containerWidth <= 0) throw new Error('Container width must be positive');
  if (imageWidth <= 0) throw new Error('Image width must be positive');
  if (gap < 0) throw new Error('Gap must be non-negative');

  const columns = Math.max(1, Math.floor((containerWidth + gap) / (imageWidth + gap)));
  const usedWidth = columns * imageWidth + (columns - 1) * gap;
  const remainder = containerWidth - usedWidth;
  const cssGridTemplate = `grid-template-columns: repeat(${columns}, ${imageWidth}px);`;

  return { columns, remainder, cssGridTemplate };
}

export function calcImageWidthFromColumns(
  containerWidth: number,
  columns: number,
  gap: number,
): number {
  if (columns < 1) throw new Error('Columns must be at least 1');
  if (containerWidth <= 0) throw new Error('Container width must be positive');
  if (gap < 0) throw new Error('Gap must be non-negative');

  return (containerWidth - (columns - 1) * gap) / columns;
}
```

- [ ] **Step 5: テストが通ることを確認**

```bash
cd apps/image-grid-calculator && vp test
```

Expected: PASS

- [ ] **Step 6: App.tsx を実装**

`apps/image-grid-calculator/src/App.tsx`:

```typescript
import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Toaster } from '@/components/ui/toaster';
import { useToast } from '@/hooks/useToast';
import { Copy } from 'lucide-react';
import { calcGridColumns, calcImageWidthFromColumns } from '@/utils/imageGrid';

export default function App() {
  const [containerWidth, setContainerWidth] = useState('1200');
  const [imageWidth, setImageWidth] = useState('300');
  const [gap, setGap] = useState('16');
  const [mode, setMode] = useState<'auto' | 'manual'>('auto');
  const [manualColumns, setManualColumns] = useState('3');
  const { toast } = useToast();

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text).catch(() => {
      toast({ title: 'コピーに失敗しました', variant: 'destructive' });
    });
    toast({ title: 'コピーしました' });
  };

  const autoResult = useMemo(() => {
    const cw = Number(containerWidth);
    const iw = Number(imageWidth);
    const g = Number(gap);
    if (!cw || !iw || isNaN(g)) return null;
    try {
      return calcGridColumns(cw, iw, g);
    } catch {
      return null;
    }
  }, [containerWidth, imageWidth, gap]);

  const manualResult = useMemo(() => {
    const cw = Number(containerWidth);
    const cols = Number(manualColumns);
    const g = Number(gap);
    if (!cw || !cols || isNaN(g)) return null;
    try {
      return calcImageWidthFromColumns(cw, cols, g);
    } catch {
      return null;
    }
  }, [containerWidth, manualColumns, gap]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
      <div className="max-w-2xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Image Grid Calculator</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">コンテナ幅と画像サイズからグリッド列数を計算</p>
        </div>

        <Card>
          <CardHeader><CardTitle>共通設定</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="container">コンテナ幅 (px)</Label>
              <Input id="container" type="number" min="1" value={containerWidth} onChange={(e) => setContainerWidth(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="gap">ギャップ (px)</Label>
              <Input id="gap" type="number" min="0" value={gap} onChange={(e) => setGap(e.target.value)} />
            </div>
          </CardContent>
        </Card>

        <div className="flex gap-2">
          <Button type="button" variant={mode === 'auto' ? 'default' : 'outline'} onClick={() => setMode('auto')}>
            画像幅→列数
          </Button>
          <Button type="button" variant={mode === 'manual' ? 'default' : 'outline'} onClick={() => setMode('manual')}>
            列数→画像幅
          </Button>
        </div>

        {mode === 'auto' && (
          <Card>
            <CardHeader><CardTitle>画像幅から列数を算出</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="imageWidth">画像幅 (px)</Label>
                <Input id="imageWidth" type="number" min="1" value={imageWidth} onChange={(e) => setImageWidth(e.target.value)} />
              </div>
              {autoResult && (
                <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4 space-y-2">
                  <p className="text-2xl font-bold">{autoResult.columns} 列</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">余白: {autoResult.remainder}px</p>
                  <div className="flex items-center justify-between">
                    <code className="text-sm font-mono">{autoResult.cssGridTemplate}</code>
                    <Button type="button" variant="ghost" size="icon" onClick={() => handleCopy(autoResult.cssGridTemplate)}>
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {mode === 'manual' && (
          <Card>
            <CardHeader><CardTitle>列数から画像幅を算出</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="columns">列数</Label>
                <Input id="columns" type="number" min="1" value={manualColumns} onChange={(e) => setManualColumns(e.target.value)} />
              </div>
              {manualResult !== null && (
                <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4">
                  <p className="text-2xl font-bold">{manualResult.toFixed(1)} px</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">推奨画像幅</p>
                </div>
              )}
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
cd apps/image-grid-calculator && vp dev
```

`http://localhost:5458` を開き、コンテナ 1200px・画像 300px・gap 16px で計算結果が表示されることを確認。

- [ ] **Step 8: コミット**

```bash
git add apps/image-grid-calculator/
git commit -m "feat: add image-grid-calculator tool"
```

---

### Task 4: `photo-exposure` — 写真露出計算ツール

**Files:**
- Create: `apps/photo-exposure/` (スキャフォールド一式)
- Create: `apps/photo-exposure/src/utils/exposure.ts`
- Create: `apps/photo-exposure/src/utils/__tests__/exposure.test.ts`
- Create: `apps/photo-exposure/src/App.tsx`

**Interfaces:**
- Produces:
  - `calcEV(fNumber: number, shutterSpeed: number, iso: number): number`
  - `calcShutterSpeed(ev: number, fNumber: number, iso: number): number`
  - `calcFNumber(ev: number, shutterSpeed: number, iso: number): number`
  - `calcISO(ev: number, fNumber: number, shutterSpeed: number): number`
  - `STANDARD_F_NUMBERS: number[]`
  - `STANDARD_SHUTTER_SPEEDS: number[]`
  - `STANDARD_ISO_VALUES: number[]`

- [ ] **Step 1: スキャフォールド生成**

```bash
node scripts/create-app.js photo-exposure "写真のEV値・f値・ISO・シャッタースピード相互計算"
```

`apps/photo-exposure/vite.config.ts` の `port` を `5459` に変更。

- [ ] **Step 2: ユニットテストを書く**

`apps/photo-exposure/src/utils/__tests__/exposure.test.ts`:

```typescript
import { describe, it, expect } from 'vitest';
import { calcEV, calcShutterSpeed, calcFNumber, calcISO } from '../exposure';

describe('exposure', () => {
  describe('calcEV', () => {
    it('f/8, 1/125s, ISO100 → EV13', () => {
      // EV = log2(f²/t) + log2(ISO/100)
      // = log2(64 * 125) + 0 = log2(8000) ≈ 12.97
      const ev = calcEV(8, 1 / 125, 100);
      expect(ev).toBeCloseTo(13, 0);
    });

    it('f/1.4, 1/60s, ISO200 → EV約5', () => {
      const ev = calcEV(1.4, 1 / 60, 200);
      expect(ev).toBeCloseTo(5, 0);
    });

    it('f値0は例外を投げる', () => {
      expect(() => calcEV(0, 1 / 125, 100)).toThrow('f-number must be positive');
    });

    it('シャッタースピード0は例外を投げる', () => {
      expect(() => calcEV(8, 0, 100)).toThrow('Shutter speed must be positive');
    });

    it('ISO 0は例外を投げる', () => {
      expect(() => calcEV(8, 1 / 125, 0)).toThrow('ISO must be positive');
    });
  });

  describe('calcShutterSpeed', () => {
    it('EV13, f/8, ISO100 → 1/125s', () => {
      // t = f²/2^(EV - log2(ISO/100)) = 64/2^13 = 64/8192 ≈ 0.00781
      const ss = calcShutterSpeed(13, 8, 100);
      expect(ss).toBeCloseTo(1 / 128, 4);
    });
  });

  describe('calcFNumber', () => {
    it('EV13, 1/125s, ISO100 → f/8', () => {
      const f = calcFNumber(13, 1 / 125, 100);
      expect(f).toBeCloseTo(8, 0);
    });
  });

  describe('calcISO', () => {
    it('EV13, f/8, 1/125s → ISO100', () => {
      const iso = calcISO(13, 8, 1 / 125);
      expect(iso).toBeCloseTo(100, 0);
    });
  });
});
```

- [ ] **Step 3: テストが失敗することを確認**

```bash
cd apps/photo-exposure && vp test
```

Expected: FAIL

- [ ] **Step 4: ユーティリティを実装**

`apps/photo-exposure/src/utils/exposure.ts`:

```typescript
// EV = log2(f² / t) + log2(ISO / 100)
// EV = log2(f² × ISO / (100 × t))

export const STANDARD_F_NUMBERS = [1, 1.4, 2, 2.8, 4, 5.6, 8, 11, 16, 22, 32];
export const STANDARD_SHUTTER_SPEEDS = [
  30, 15, 8, 4, 2, 1,
  1 / 2, 1 / 4, 1 / 8, 1 / 15, 1 / 30, 1 / 60,
  1 / 125, 1 / 250, 1 / 500, 1 / 1000, 1 / 2000, 1 / 4000,
];
export const STANDARD_ISO_VALUES = [50, 100, 200, 400, 800, 1600, 3200, 6400, 12800, 25600];

function assertPositive(value: number, name: string) {
  if (value <= 0) throw new Error(`${name} must be positive`);
}

/** EV値を算出 */
export function calcEV(fNumber: number, shutterSpeed: number, iso: number): number {
  assertPositive(fNumber, 'f-number');
  assertPositive(shutterSpeed, 'Shutter speed');
  assertPositive(iso, 'ISO');
  return Math.log2((fNumber * fNumber * iso) / (100 * shutterSpeed));
}

/** シャッタースピードを算出 */
export function calcShutterSpeed(ev: number, fNumber: number, iso: number): number {
  assertPositive(fNumber, 'f-number');
  assertPositive(iso, 'ISO');
  return (fNumber * fNumber * iso) / (100 * Math.pow(2, ev));
}

/** f値を算出 */
export function calcFNumber(ev: number, shutterSpeed: number, iso: number): number {
  assertPositive(shutterSpeed, 'Shutter speed');
  assertPositive(iso, 'ISO');
  return Math.sqrt((100 * shutterSpeed * Math.pow(2, ev)) / iso);
}

/** ISO感度を算出 */
export function calcISO(ev: number, fNumber: number, shutterSpeed: number): number {
  assertPositive(fNumber, 'f-number');
  assertPositive(shutterSpeed, 'Shutter speed');
  return (100 * shutterSpeed * Math.pow(2, ev)) / (fNumber * fNumber);
}

/** シャッタースピードを人間が読める文字列に変換 (例: 0.008 → "1/125s") */
export function formatShutterSpeed(ss: number): string {
  if (ss >= 1) return `${ss}s`;
  const denom = Math.round(1 / ss);
  return `1/${denom}s`;
}
```

- [ ] **Step 5: テストが通ることを確認**

```bash
cd apps/photo-exposure && vp test
```

Expected: PASS

- [ ] **Step 6: App.tsx を実装**

`apps/photo-exposure/src/App.tsx`:

```typescript
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { Toaster } from '@/components/ui/toaster';
import { useToast } from '@/hooks/useToast';
import {
  calcEV, calcShutterSpeed, calcFNumber, calcISO,
  formatShutterSpeed,
  STANDARD_F_NUMBERS, STANDARD_SHUTTER_SPEEDS, STANDARD_ISO_VALUES,
} from '@/utils/exposure';

type Solve = 'ev' | 'ss' | 'f' | 'iso';

export default function App() {
  const [solve, setSolve] = useState<Solve>('ev');
  const [fVal, setFVal] = useState('8');
  const [ssVal, setSsVal] = useState('0.008');
  const [isoVal, setIsoVal] = useState('100');
  const [evVal, setEvVal] = useState('13');
  const { toast } = useToast();

  const compute = () => {
    try {
      const f = Number(fVal);
      const ss = Number(ssVal);
      const iso = Number(isoVal);
      const ev = Number(evVal);
      switch (solve) {
        case 'ev': return { label: 'EV値', value: calcEV(f, ss, iso).toFixed(2) };
        case 'ss': return { label: 'シャッタースピード', value: formatShutterSpeed(calcShutterSpeed(ev, f, iso)) };
        case 'f': return { label: 'f値', value: `f/${calcFNumber(ev, ss, iso).toFixed(1)}` };
        case 'iso': return { label: 'ISO', value: Math.round(calcISO(ev, f, ss)).toString() };
      }
    } catch {
      return null;
    }
  };

  const result = compute();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
      <div className="max-w-2xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Exposure Calculator</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">EV値・f値・ISO・シャッタースピードの相互計算</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>算出する値</CardTitle>
          </CardHeader>
          <CardContent className="flex gap-2 flex-wrap">
            {(['ev', 'ss', 'f', 'iso'] as Solve[]).map((s) => (
              <Button key={s} type="button" variant={solve === s ? 'default' : 'outline'} onClick={() => setSolve(s)}>
                {s === 'ev' ? 'EV値' : s === 'ss' ? 'SS' : s === 'f' ? 'f値' : 'ISO'}
              </Button>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>既知の値を入力</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            {solve !== 'f' && (
              <div className="space-y-2">
                <Label>f値</Label>
                <Select value={fVal} onValueChange={setFVal}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {STANDARD_F_NUMBERS.map((f) => (
                      <SelectItem key={f} value={String(f)}>f/{f}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
            {solve !== 'ss' && (
              <div className="space-y-2">
                <Label>シャッタースピード (秒)</Label>
                <Select value={ssVal} onValueChange={setSsVal}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {STANDARD_SHUTTER_SPEEDS.map((ss) => (
                      <SelectItem key={ss} value={String(ss)}>{formatShutterSpeed(ss)}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
            {solve !== 'iso' && (
              <div className="space-y-2">
                <Label>ISO感度</Label>
                <Select value={isoVal} onValueChange={setIsoVal}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {STANDARD_ISO_VALUES.map((iso) => (
                      <SelectItem key={iso} value={String(iso)}>ISO {iso}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
            {solve !== 'ev' && (
              <div className="space-y-2">
                <Label>EV値</Label>
                <Input type="number" value={evVal} onChange={(e) => setEvVal(e.target.value)} />
              </div>
            )}
          </CardContent>
        </Card>

        {result && (
          <Card>
            <CardContent className="py-6 text-center">
              <p className="text-gray-500 dark:text-gray-400">{result.label}</p>
              <p className="text-4xl font-bold mt-2">{result.value}</p>
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
cd apps/photo-exposure && vp dev
```

`http://localhost:5459` を開き、f/8・1/125s・ISO100 でEV値 ≈ 13 が表示されることを確認。

- [ ] **Step 8: コミット**

```bash
git add apps/photo-exposure/
git commit -m "feat: add photo-exposure tool"
```

---

### Task 5: `depth-of-field` — 被写界深度計算ツール

**Files:**
- Create: `apps/depth-of-field/` (スキャフォールド一式)
- Create: `apps/depth-of-field/src/utils/depthOfField.ts`
- Create: `apps/depth-of-field/src/utils/__tests__/depthOfField.test.ts`
- Create: `apps/depth-of-field/src/App.tsx`

**Interfaces:**
- Produces:
  - `calcDepthOfField(params: DofParams): DofResult`
  - `SENSOR_SIZES: SensorSize[]`
  - `interface DofParams { focalLength: number; fNumber: number; subjectDistance: number; sensorId: string }`
  - `interface DofResult { dof: number; nearLimit: number; farLimit: number; hyperfocalDistance: number; coc: number }`

- [ ] **Step 1: スキャフォールド生成**

```bash
node scripts/create-app.js depth-of-field "焦点距離・f値・被写体距離から被写界深度計算"
```

`apps/depth-of-field/vite.config.ts` の `port` を `5460` に変更。

- [ ] **Step 2: ユニットテストを書く**

`apps/depth-of-field/src/utils/__tests__/depthOfField.test.ts`:

```typescript
import { describe, it, expect } from 'vitest';
import { calcDepthOfField, SENSOR_SIZES } from '../depthOfField';

describe('depthOfField', () => {
  describe('calcDepthOfField', () => {
    it('フルサイズ 50mm f/8 3m → DoF を算出', () => {
      const result = calcDepthOfField({
        focalLength: 50,
        fNumber: 8,
        subjectDistance: 3000, // mm
        sensorId: 'fullframe',
      });
      // hyperfocal ≈ 50²/(8*0.03) = 2500/0.24 ≈ 10417mm
      expect(result.hyperfocalDistance).toBeCloseTo(10417, -2);
      expect(result.dof).toBeGreaterThan(0);
      expect(result.nearLimit).toBeLessThan(3000);
      expect(result.farLimit).toBeGreaterThan(3000);
    });

    it('超焦点距離以遠のとき farLimit は Infinity', () => {
      const result = calcDepthOfField({
        focalLength: 50,
        fNumber: 16,
        subjectDistance: 20000,
        sensorId: 'fullframe',
      });
      expect(result.farLimit).toBe(Infinity);
    });

    it('フォーカルレングス0は例外を投げる', () => {
      expect(() =>
        calcDepthOfField({ focalLength: 0, fNumber: 8, subjectDistance: 3000, sensorId: 'fullframe' }),
      ).toThrow('Focal length must be positive');
    });

    it('被写体距離0は例外を投げる', () => {
      expect(() =>
        calcDepthOfField({ focalLength: 50, fNumber: 8, subjectDistance: 0, sensorId: 'fullframe' }),
      ).toThrow('Subject distance must be positive');
    });

    it('未知のセンサーIDは例外を投げる', () => {
      expect(() =>
        calcDepthOfField({ focalLength: 50, fNumber: 8, subjectDistance: 3000, sensorId: 'unknown' }),
      ).toThrow('Unknown sensor');
    });
  });

  describe('SENSOR_SIZES', () => {
    it('4種類以上のセンサーが定義されている', () => {
      expect(SENSOR_SIZES.length).toBeGreaterThanOrEqual(4);
    });

    it('各センサーに id, label, coc が存在する', () => {
      for (const s of SENSOR_SIZES) {
        expect(typeof s.id).toBe('string');
        expect(typeof s.label).toBe('string');
        expect(s.coc).toBeGreaterThan(0);
      }
    });
  });
});
```

- [ ] **Step 3: テストが失敗することを確認**

```bash
cd apps/depth-of-field && vp test
```

Expected: FAIL

- [ ] **Step 4: ユーティリティを実装**

`apps/depth-of-field/src/utils/depthOfField.ts`:

```typescript
export interface SensorSize {
  id: string;
  label: string;
  coc: number; // 許容錯乱円径 (mm)
}

export interface DofParams {
  focalLength: number;   // mm
  fNumber: number;
  subjectDistance: number; // mm
  sensorId: string;
}

export interface DofResult {
  dof: number;               // mm (Infinity の場合あり)
  nearLimit: number;         // mm
  farLimit: number;          // mm (Infinity の場合あり)
  hyperfocalDistance: number; // mm
  coc: number;               // mm
}

export const SENSOR_SIZES: SensorSize[] = [
  { id: 'fullframe', label: 'フルサイズ (35mm)', coc: 0.03 },
  { id: 'apsc_canon', label: 'APS-C (Canon)', coc: 0.019 },
  { id: 'apsc_nikon', label: 'APS-C (Nikon/Sony)', coc: 0.02 },
  { id: 'mft', label: 'マイクロフォーサーズ', coc: 0.015 },
  { id: 'one_inch', label: '1型', coc: 0.011 },
];

export function calcDepthOfField(params: DofParams): DofResult {
  const { focalLength, fNumber, subjectDistance, sensorId } = params;
  if (focalLength <= 0) throw new Error('Focal length must be positive');
  if (fNumber <= 0) throw new Error('f-number must be positive');
  if (subjectDistance <= 0) throw new Error('Subject distance must be positive');

  const sensor = SENSOR_SIZES.find((s) => s.id === sensorId);
  if (!sensor) throw new Error(`Unknown sensor: ${sensorId}`);

  const { coc } = sensor;
  const f = focalLength;
  const N = fNumber;
  const d = subjectDistance;

  // 超焦点距離: H = f² / (N × c) + f
  const H = (f * f) / (N * coc) + f;

  // 前景限界: Dn = d(H-f) / (H+d-2f)
  const Dn = (d * (H - f)) / (H + d - 2 * f);

  // 後景限界: Df = d(H-f) / (H-d)
  const HminusD = H - d;
  const Df = HminusD <= 0 ? Infinity : (d * (H - f)) / HminusD;

  const dof = Df === Infinity ? Infinity : Df - Dn;

  return {
    dof,
    nearLimit: Dn,
    farLimit: Df,
    hyperfocalDistance: H,
    coc,
  };
}
```

- [ ] **Step 5: テストが通ることを確認**

```bash
cd apps/depth-of-field && vp test
```

Expected: PASS

- [ ] **Step 6: App.tsx を実装**

`apps/depth-of-field/src/App.tsx`:

```typescript
import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { Toaster } from '@/components/ui/toaster';
import { calcDepthOfField, SENSOR_SIZES } from '@/utils/depthOfField';

const F_NUMBERS = [1, 1.4, 2, 2.8, 4, 5.6, 8, 11, 16, 22];

function formatDistance(mm: number): string {
  if (mm === Infinity) return '∞';
  return mm >= 1000 ? `${(mm / 1000).toFixed(2)}m` : `${mm.toFixed(0)}mm`;
}

export default function App() {
  const [focalLength, setFocalLength] = useState('50');
  const [fNumber, setFNumber] = useState('8');
  const [subjectDistance, setSubjectDistance] = useState('3');
  const [sensorId, setSensorId] = useState('fullframe');

  const result = useMemo(() => {
    const fl = Number(focalLength);
    const fn = Number(fNumber);
    const sd = Number(subjectDistance) * 1000; // m→mm
    if (!fl || !fn || !sd) return null;
    try {
      return calcDepthOfField({ focalLength: fl, fNumber: fn, subjectDistance: sd, sensorId });
    } catch {
      return null;
    }
  }, [focalLength, fNumber, subjectDistance, sensorId]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
      <div className="max-w-2xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Depth of Field</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">被写界深度・超焦点距離を計算</p>
        </div>

        <Card>
          <CardHeader><CardTitle>撮影設定</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>焦点距離 (mm)</Label>
                <Input type="number" min="1" value={focalLength} onChange={(e) => setFocalLength(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>f値</Label>
                <Select value={fNumber} onValueChange={setFNumber}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {F_NUMBERS.map((f) => <SelectItem key={f} value={String(f)}>f/{f}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>被写体距離 (m)</Label>
                <Input type="number" min="0.1" step="0.1" value={subjectDistance} onChange={(e) => setSubjectDistance(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>センサーサイズ</Label>
                <Select value={sensorId} onValueChange={setSensorId}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {SENSOR_SIZES.map((s) => <SelectItem key={s.id} value={s.id}>{s.label}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {result && (
          <Card>
            <CardHeader><CardTitle>計算結果</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-3">
                  <p className="text-sm text-gray-500">被写界深度</p>
                  <p className="text-xl font-bold">{formatDistance(result.dof)}</p>
                </div>
                <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-3">
                  <p className="text-sm text-gray-500">超焦点距離</p>
                  <p className="text-xl font-bold">{formatDistance(result.hyperfocalDistance)}</p>
                </div>
                <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-3">
                  <p className="text-sm text-gray-500">ピント前景限界</p>
                  <p className="text-xl font-bold">{formatDistance(result.nearLimit)}</p>
                </div>
                <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-3">
                  <p className="text-sm text-gray-500">ピント後景限界</p>
                  <p className="text-xl font-bold">{formatDistance(result.farLimit)}</p>
                </div>
              </div>
              <p className="text-xs text-gray-400">許容錯乱円径: {result.coc}mm</p>
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
cd apps/depth-of-field && vp dev
```

`http://localhost:5460` を開き、50mm f/8 被写体3m フルサイズで結果が表示されることを確認。

- [ ] **Step 8: コミット**

```bash
git add apps/depth-of-field/
git commit -m "feat: add depth-of-field tool"
```

---

### Task 6: apps.ts に PR-1 の 4 ツールを登録

**Files:**
- Modify: `packages/router/src/config/apps.ts`

- [ ] **Step 1: APPS_CONFIG 配列に追記**

`packages/router/src/config/apps.ts` の `APPS_CONFIG` 配列に以下を追加（既存エントリの末尾、または適切なカテゴリ位置）:

```typescript
  // ── Design ──
  { path: '/golden-ratio', url: 'https://tools-golden-ratio.elchika.app', icon: 'φ', displayName: 'Golden Ratio', description: '黄金比・白銀比などから寸法計算', category: 'Design' },
  { path: '/image-grid-calculator', url: 'https://tools-image-grid-calculator.elchika.app', icon: '🔲', displayName: 'Image Grid', description: 'コンテナ幅・画像サイズから列数を計算', category: 'Design' },
  { path: '/photo-exposure', url: 'https://tools-photo-exposure.elchika.app', icon: '📷', displayName: 'Exposure Calculator', description: 'EV値・f値・ISO・SSの相互計算', category: 'Design' },
  { path: '/depth-of-field', url: 'https://tools-depth-of-field.elchika.app', icon: '🔭', displayName: 'Depth of Field', description: '被写界深度・超焦点距離を計算', category: 'Design' },
```

- [ ] **Step 2: 型チェック**

```bash
cd packages/router && npx tsc --noEmit
```

Expected: エラーなし

- [ ] **Step 3: コミット**

```bash
git add packages/router/src/config/apps.ts
git commit -m "feat(router): register PR-1 Design tools in apps.ts"
```

---

## Self-Review Checklist

- [x] Spec 要件カバー: golden-ratio (比率計算) ✅, image-grid-calculator (列数・逆算) ✅, photo-exposure (4値相互計算) ✅, depth-of-field (DoF・超焦点距離) ✅
- [x] プレースホルダーなし
- [x] 型の一貫性: `DofParams`, `DofResult`, `GridResult`, `RatioDef` が utils と App.tsx で統一されている
- [x] コミット粒度: ツールごとに 1 コミット + apps.ts 登録で 1 コミット
