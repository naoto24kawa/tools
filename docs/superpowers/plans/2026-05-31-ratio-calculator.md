# 比率計算ツール（ratio-calculator） Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 1つの長さを黄金比・白銀比・白金比・青銅比の4比率で分割／拡縮し、長方形プレビューと早見表で見せるクライアントサイドSPAを `apps/ratio-calculator` に追加する。

**Architecture:** `aspect-ratio-calculator` を雛形にコピーし、コアロジックを `src/utils/ratio.ts` の純粋関数に分離（TDD）。`App.tsx` は shadcn/ui の Card/Tabs/Select でメイン比率切替＋CSS長方形プレビュー＋下部に4比率の早見表を構成。`packages/router/src/config/apps.ts` に Number カテゴリとしてルーティング登録。

**Tech Stack:** React 18 + TypeScript (strict), Vite-plus, Tailwind 3.4 + shadcn/ui, Vitest, Cloudflare Workers ルーター(Hono)。

---

## File Structure

- Create: `apps/ratio-calculator/**`（`aspect-ratio-calculator` をコピーして生成）
- Create: `apps/ratio-calculator/src/utils/ratio.ts` — 比率定数と計算純粋関数（唯一のロジック責務）
- Create: `apps/ratio-calculator/src/utils/__tests__/ratio.test.ts` — ロジックのユニットテスト
- Replace: `apps/ratio-calculator/src/App.tsx` — UI
- Modify: `apps/ratio-calculator/package.json`（name）
- Modify: `apps/ratio-calculator/vite.config.ts`（port → 5456）
- Modify: `apps/ratio-calculator/index.html`（title/description/og）
- Delete: `apps/ratio-calculator/src/utils/aspectRatio.ts` と `apps/ratio-calculator/src/utils/__tests__/aspectRatio.test.ts`（雛形の不要ファイル）
- Modify: `packages/router/src/config/apps.ts`（Number カテゴリにエントリ追加）

---

## Task 1: アプリ雛形のコピーと設定更新

**Files:**

- Create: `apps/ratio-calculator/`（コピー）
- Modify: `apps/ratio-calculator/package.json`
- Modify: `apps/ratio-calculator/vite.config.ts:9`
- Modify: `apps/ratio-calculator/index.html:6-12`
- Delete: `apps/ratio-calculator/src/utils/aspectRatio.ts`, `apps/ratio-calculator/src/utils/__tests__/aspectRatio.test.ts`

- [ ] **Step 1: 雛形をコピー**

Run:

```bash
cp -R apps/aspect-ratio-calculator apps/ratio-calculator
rm -rf apps/ratio-calculator/node_modules apps/ratio-calculator/dist
rm -f apps/ratio-calculator/src/utils/aspectRatio.ts apps/ratio-calculator/src/utils/__tests__/aspectRatio.test.ts
```

- [ ] **Step 2: package.json の name を更新**

`apps/ratio-calculator/package.json` の `"name": "aspect-ratio-calculator"` を次に変更:

```json
  "name": "ratio-calculator",
```

- [ ] **Step 3: vite.config.ts のポートを 5456 に変更**

`apps/ratio-calculator/vite.config.ts` の `port: 5360,` を次に変更:

```ts
    port: 5456,
```

- [ ] **Step 4: index.html のメタ情報を更新**

`apps/ratio-calculator/index.html` の `<title>` 〜 og 部分を次に置換:

```html
<title>比率計算ツール - Elchika Tools</title>
<meta
  name="description"
  content="黄金比・白銀比・白金比・青銅比で長さを分割・拡縮するツール。長方形プレビューと4比率の早見表つき"
/>
<meta property="og:title" content="比率計算ツール - Elchika Tools" />
<meta
  property="og:description"
  content="黄金比・白銀比・白金比・青銅比で長さを分割・拡縮するツール。長方形プレビューと4比率の早見表つき"
/>
<meta property="og:type" content="website" />
<meta property="og:url" content="https://tools.elchika.app/ratio-calculator" />
```

- [ ] **Step 5: コミット**

```bash
git add apps/ratio-calculator
git commit -m "chore(ratio-calculator): scaffold app from aspect-ratio-calculator"
```

---

## Task 2: コアロジック `ratio.ts`（TDD）

**Files:**

- Create: `apps/ratio-calculator/src/utils/ratio.ts`
- Test: `apps/ratio-calculator/src/utils/__tests__/ratio.test.ts`

- [ ] **Step 1: 失敗するテストを書く**

Create `apps/ratio-calculator/src/utils/__tests__/ratio.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { RATIOS, split, scale, formatNumber, getRatio } from "../ratio";

describe("ratio", () => {
  describe("RATIOS", () => {
    it("has 4 ratios in golden/silver/platinum/bronze order", () => {
      expect(RATIOS.map((r) => r.key)).toEqual(["golden", "silver", "platinum", "bronze"]);
    });

    it("golden ratio value is (1+√5)/2", () => {
      expect(getRatio("golden").value).toBeCloseTo(1.618034, 5);
    });

    it("silver ratio value is 1+√2", () => {
      expect(getRatio("silver").value).toBeCloseTo(2.414214, 5);
    });

    it("platinum ratio value is √3", () => {
      expect(getRatio("platinum").value).toBeCloseTo(1.732051, 5);
    });

    it("bronze ratio value is (3+√13)/2", () => {
      expect(getRatio("bronze").value).toBeCloseTo(3.302776, 5);
    });

    it("every ratio has a Japanese label", () => {
      expect(getRatio("golden").label).toBe("黄金比");
      expect(getRatio("silver").label).toBe("白銀比");
      expect(getRatio("platinum").label).toBe("白金比");
      expect(getRatio("bronze").label).toBe("青銅比");
    });
  });

  describe("split", () => {
    it("splits 1000 by golden ratio into long/short", () => {
      const r = split(1000, getRatio("golden").value);
      expect(r.long).toBeCloseTo(618.033989, 4);
      expect(r.short).toBeCloseTo(381.966011, 4);
    });

    it("long + short equals total (conservation)", () => {
      const r = split(1000, getRatio("golden").value);
      expect(r.long + r.short).toBeCloseTo(1000, 6);
    });

    it("returns zeros for non-positive total", () => {
      expect(split(0, 1.618)).toEqual({ long: 0, short: 0 });
      expect(split(-5, 1.618)).toEqual({ long: 0, short: 0 });
    });

    it("returns zeros for non-finite total", () => {
      expect(split(NaN, 1.618)).toEqual({ long: 0, short: 0 });
    });

    it("returns zeros for non-positive ratio", () => {
      expect(split(1000, 0)).toEqual({ long: 0, short: 0 });
    });
  });

  describe("scale", () => {
    it("scales 100 by golden ratio into larger/smaller", () => {
      const r = scale(100, getRatio("golden").value);
      expect(r.larger).toBeCloseTo(161.803399, 4);
      expect(r.smaller).toBeCloseTo(61.803399, 4);
    });

    it("returns zeros for non-positive value", () => {
      expect(scale(0, 1.618)).toEqual({ larger: 0, smaller: 0 });
      expect(scale(-1, 1.618)).toEqual({ larger: 0, smaller: 0 });
    });

    it("returns zeros for non-finite value", () => {
      expect(scale(Infinity, 1.618)).toEqual({ larger: 0, smaller: 0 });
    });
  });

  describe("formatNumber", () => {
    it("formats to at most 3 decimals", () => {
      expect(formatNumber(618.0339887)).toBe("618.034");
    });

    it("adds thousand separators", () => {
      expect(formatNumber(1000)).toBe("1,000");
    });

    it("trims trailing zeros", () => {
      expect(formatNumber(500)).toBe("500");
    });

    it("returns dash for non-finite", () => {
      expect(formatNumber(NaN)).toBe("-");
      expect(formatNumber(Infinity)).toBe("-");
    });
  });
});
```

- [ ] **Step 2: テストが失敗することを確認**

Run: `cd apps/ratio-calculator && vp test ratio`
Expected: FAIL（`../ratio` が存在しない＝import 解決エラー）

- [ ] **Step 3: 最小実装を書く**

Create `apps/ratio-calculator/src/utils/ratio.ts`:

```ts
export type RatioKey = "golden" | "silver" | "platinum" | "bronze";

export interface RatioDef {
  key: RatioKey;
  label: string;
  englishLabel: string;
  value: number;
}

export const RATIOS: readonly RatioDef[] = [
  { key: "golden", label: "黄金比", englishLabel: "Golden", value: (1 + Math.sqrt(5)) / 2 },
  { key: "silver", label: "白銀比", englishLabel: "Silver", value: 1 + Math.sqrt(2) },
  { key: "platinum", label: "白金比", englishLabel: "Platinum", value: Math.sqrt(3) },
  { key: "bronze", label: "青銅比", englishLabel: "Bronze", value: (3 + Math.sqrt(13)) / 2 },
];

export function getRatio(key: RatioKey): RatioDef {
  const found = RATIOS.find((r) => r.key === key);
  if (!found) throw new Error(`Unknown ratio key: ${key}`);
  return found;
}

function isPositiveFinite(n: number): boolean {
  return Number.isFinite(n) && n > 0;
}

export function split(total: number, ratio: number): { long: number; short: number } {
  if (!isPositiveFinite(total) || !isPositiveFinite(ratio)) {
    return { long: 0, short: 0 };
  }
  const long = total / ratio;
  return { long, short: total - long };
}

export function scale(value: number, ratio: number): { larger: number; smaller: number } {
  if (!isPositiveFinite(value) || !isPositiveFinite(ratio)) {
    return { larger: 0, smaller: 0 };
  }
  return { larger: value * ratio, smaller: value / ratio };
}

const numberFormatter = new Intl.NumberFormat("en-US", { maximumFractionDigits: 3 });

export function formatNumber(n: number): string {
  if (!Number.isFinite(n)) return "-";
  return numberFormatter.format(n);
}
```

- [ ] **Step 4: テストが通ることを確認**

Run: `cd apps/ratio-calculator && vp test ratio`
Expected: PASS（全ケース green）

- [ ] **Step 5: コミット**

```bash
git add apps/ratio-calculator/src/utils/ratio.ts apps/ratio-calculator/src/utils/__tests__/ratio.test.ts
git commit -m "feat(ratio-calculator): add ratio split/scale core logic with tests"
```

---

## Task 3: UI 実装 `App.tsx`

**Files:**

- Replace: `apps/ratio-calculator/src/App.tsx`

- [ ] **Step 1: App.tsx を全置換**

`apps/ratio-calculator/src/App.tsx` の内容を以下に置換:

```tsx
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Copy } from "lucide-react";
import { Toaster } from "@/components/ui/toaster";
import { useToast } from "@/hooks/useToast";
import { RATIOS, getRatio, split, scale, formatNumber, type RatioKey } from "@/utils/ratio";

export default function App() {
  const [length, setLength] = useState(1000);
  const [ratioKey, setRatioKey] = useState<RatioKey>("golden");
  const { toast } = useToast();

  const current = getRatio(ratioKey);
  const splitResult = useMemo(() => split(length, current.value), [length, current.value]);
  const scaleResult = useMemo(() => scale(length, current.value), [length, current.value]);

  const copy = async (value: number, label: string) => {
    try {
      const text = formatNumber(value);
      await navigator.clipboard.writeText(text);
      toast({ title: `Copied ${label}: ${text}` });
    } catch {
      toast({ title: "Copy failed", variant: "destructive" });
    }
  };

  // 長方形プレビュー: ratio:1 の横長長方形。長辺(横)を long/short に分割。
  const previewMaxWidth = 360;
  const longRatio = current.value > 0 ? current.value / (current.value + 1) : 0.5;
  const previewWidth = previewMaxWidth;
  const previewHeight = current.value > 0 ? previewMaxWidth / current.value : previewMaxWidth;

  return (
    <div className="min-h-screen bg-background p-8">
      <main className="max-w-4xl mx-auto space-y-6">
        <header className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">比率計算ツール</h1>
          <p className="text-muted-foreground">
            黄金比・白銀比・白金比・青銅比で長さを分割・拡縮するツール。
          </p>
        </header>

        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>入力と比率</CardTitle>
              <CardDescription>長さと比率を選ぶと、分割・拡縮の結果を表示します。</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="length">長さ</Label>
                <Input
                  id="length"
                  type="number"
                  min={0}
                  value={length}
                  onChange={(e) => setLength(parseFloat(e.target.value) || 0)}
                />
              </div>

              <div className="space-y-2">
                <Label>比率</Label>
                <Select value={ratioKey} onValueChange={(v) => setRatioKey(v as RatioKey)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {RATIOS.map((r) => (
                      <SelectItem key={r.key} value={r.key}>
                        {r.label}（{formatNumber(r.value)} : 1）
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center justify-center pt-2">
                <div
                  className="relative border-2 border-primary rounded-md bg-primary/10 flex"
                  style={{
                    width: `${previewWidth}px`,
                    height: `${previewHeight}px`,
                    maxWidth: "100%",
                  }}
                >
                  <div
                    className="flex items-center justify-center text-xs text-muted-foreground border-r-2 border-primary/60"
                    style={{ width: `${longRatio * 100}%` }}
                  >
                    long
                  </div>
                  <div className="flex items-center justify-center text-xs text-muted-foreground flex-1">
                    short
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{current.label} の計算結果</CardTitle>
              <CardDescription>{formatNumber(current.value)} : 1</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <p className="text-sm font-medium">
                  全体分割（長さ {formatNumber(length)} を分割）
                </p>
                <ResultRow label="長い部分 (long)" value={splitResult.long} onCopy={copy} />
                <ResultRow label="短い部分 (short)" value={splitResult.short} onCopy={copy} />
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium">拡大・縮小</p>
                <ResultRow label="拡大 (×比率)" value={scaleResult.larger} onCopy={copy} />
                <ResultRow label="縮小 (÷比率)" value={scaleResult.smaller} onCopy={copy} />
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>4比率の早見表</CardTitle>
            <CardDescription>長さ {formatNumber(length)} に対する各比率の分割値。</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-left text-muted-foreground">
                    <th className="py-2 pr-4 font-medium">比率</th>
                    <th className="py-2 pr-4 font-medium">値</th>
                    <th className="py-2 pr-4 font-medium">long</th>
                    <th className="py-2 pr-4 font-medium">short</th>
                  </tr>
                </thead>
                <tbody>
                  {RATIOS.map((r) => {
                    const s = split(length, r.value);
                    return (
                      <tr key={r.key} className="border-b last:border-0">
                        <td className="py-2 pr-4">
                          {r.label}
                          <span className="ml-1 text-xs text-muted-foreground">
                            {r.englishLabel}
                          </span>
                        </td>
                        <td className="py-2 pr-4 font-mono">{formatNumber(r.value)}</td>
                        <td className="py-2 pr-4 font-mono">{formatNumber(s.long)}</td>
                        <td className="py-2 pr-4 font-mono">{formatNumber(s.short)}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </main>
      <Toaster />
    </div>
  );
}

function ResultRow({
  label,
  value,
  onCopy,
}: {
  label: string;
  value: number;
  onCopy: (value: number, label: string) => void;
}) {
  return (
    <div className="flex items-center justify-between rounded-md bg-muted p-3">
      <span className="text-sm text-muted-foreground">{label}</span>
      <div className="flex items-center gap-2">
        <span className="font-mono font-medium">{formatNumber(value)}</span>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="h-7 w-7"
          onClick={() => onCopy(value, label)}
        >
          <Copy className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: lint / format チェック**

Run: `cd apps/ratio-calculator && vp check`
Expected: エラーなし（必要なら `vp check --fix`）

- [ ] **Step 3: ビルドが通ることを確認**

Run: `cd apps/ratio-calculator && vp build`
Expected: 型エラーなしでビルド成功

- [ ] **Step 4: コミット**

```bash
git add apps/ratio-calculator/src/App.tsx
git commit -m "feat(ratio-calculator): add ratio calculator UI with preview and comparison table"
```

---

## Task 4: ルーティング登録

**Files:**

- Modify: `packages/router/src/config/apps.ts`（Number カテゴリ末尾）

- [ ] **Step 1: apps.ts にエントリを追加**

`packages/router/src/config/apps.ts` の `// ── DateTime ──` の直前（Number カテゴリの最後の `random-coin` 行の次）に以下を追加:

```ts
  { path: '/ratio-calculator', url: 'https://tools-ratio-calculator.elchika.app', icon: '📐', displayName: 'Ratio Calculator', description: '黄金比・白銀比・白金比・青銅比で長さを分割・拡縮', category: 'Number' },
```

- [ ] **Step 2: ルーターの型チェックが通ることを確認**

Run: `cd packages/router && pnpm exec tsc --noEmit`
Expected: 型エラーなし（コマンドが存在しない場合は `npx tsc --noEmit` を使用）

- [ ] **Step 3: コミット**

```bash
git add packages/router/src/config/apps.ts
git commit -m "feat(router): register ratio-calculator route"
```

---

## Task 5: 最終確認

- [ ] **Step 1: ユニットテスト全実行**

Run: `cd apps/ratio-calculator && vp test`
Expected: 全テスト PASS

- [ ] **Step 2: デザイン監査（任意・存在すれば）**

Run: `node scripts/design-audit.js --app=ratio-calculator`
Expected: 違反なし（違反があれば該当箇所を修正して再実行）

- [ ] **Step 3: 開発サーバーで目視確認（任意）**

Run: `cd apps/ratio-calculator && vp dev`
確認: 長さ 1000・黄金比で long≈618.034 / short≈381.966、比率切替で長方形と数値が変わる、コピーが動く、早見表に4行表示。

---

## Self-Review メモ

- スペック §2 比率4種 → Task 2 RATIOS で実装・検証済み。
- スペック §3 split/scale/formatNumber → Task 2 で実装・テスト済み。
- スペック §4 UI（入力/切替/結果/プレビュー/早見表/コピー）→ Task 3 で実装。
- スペック §5 テスト項目（既知値・保存則・境界）→ Task 2 テストで網羅。
- スペック §6 ルーティング・index.html → Task 1（index.html）・Task 4（apps.ts）で対応。
- 型整合: `RatioKey` / `getRatio` / `split` / `scale` / `formatNumber` / `RATIOS` を Task 2 で定義し Task 3 で同名利用、一致を確認。
