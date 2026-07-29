# 比率計算ツール（黄金比ほか4種） 設計ドキュメント

- 日付: 2026-05-31
- 種別: 新規アプリ（Elchika Tools / クライアントサイドSPA）
- アプリ名（slug）: `ratio-calculator`
- ベーステンプレート: `apps/aspect-ratio-calculator`

## 1. 目的

ある長さを「黄金比などの比率」で分割・拡縮した値を算出するクライアントサイドツール。
デザイン・レイアウトの余白決め、フォントサイズ設計などで使える。完全クライアントサイド（外部通信なし）。

## 2. 対応する比率（4種）

| 名称   | 英名     | 値（近似）    | 定義式    |
| ------ | -------- | ------------- | --------- |
| 黄金比 | golden   | 1.6180339887… | (1+√5)/2  |
| 白銀比 | silver   | 2.4142135624… | 1+√2      |
| 白金比 | platinum | 1.7320508076… | √3        |
| 青銅比 | bronze   | 3.3027756377… | (3+√13)/2 |

- 白銀比は「貴金属比の数列 n=2」の値 1+√2 を採用（紙比率の大和比 √2 ではない）。
- 白金比は確立した数学定義がないため、本ツールでは √3 と定義する。

## 3. コアロジック（`src/utils/ratio.ts` — 純粋関数）

入力は **1つの長さ（数値、単位なし）**。負値・0・NaN は呼び出し側で 0 などに丸めて渡す前提だが、関数側でも非有限・非正入力に対し安全な値（0）を返す。

```ts
export type RatioKey = "golden" | "silver" | "platinum" | "bronze";

export interface RatioDef {
  key: RatioKey;
  label: string; // 日本語名（例: '黄金比'）
  englishLabel: string; // 'Golden'
  value: number; // 比率の数値
}

export const RATIOS: RatioDef[]; // 上表の4要素

// ① 全体分割: total を比率で長短に分ける
//   long = total / ratio, short = total - long
export function split(total: number, ratio: number): { long: number; short: number };

// ② 拡大／縮小: value を基準に比率倍・比率分の1
//   larger = value * ratio, smaller = value / ratio
export function scale(value: number, ratio: number): { larger: number; smaller: number };

// 数値整形: 小数第3位まで（末尾0は適宜トリム）＋3桁区切り
export function formatNumber(n: number): string;
```

- 計算の正確性のため、比率値は `Math.sqrt` を用いた式で定義する（マジックナンバー直書きしない）。

## 4. UI構成（`src/App.tsx`）

`aspect-ratio-calculator` の2カラム＋下部カード構成を踏襲。

1. **ヘッダー**: タイトル「比率計算ツール / Ratio Calculator」、説明文。
2. **入力欄**: 長さ1つ（`number` Input、デフォルト 1000、min 0）。
3. **比率切替（メイン）**: 黄金 / 白銀 / 白金 / 青銅 をタブまたはSelectで切替。選択中の比率名と値を表示。
4. **結果カード**（選択中比率）:
   - ① 全体分割: `long` / `short` を表示。
   - ② 拡大／縮小: `larger` / `smaller` を表示。
   - 各数値にコピーボタン（`navigator.clipboard`、try/catch、トーストで結果表示）。
5. **長方形プレビュー**: 選択中比率の `ratio:1` 長方形を CSS の `div` で描画。長辺側に長短の**分割線**を入れ、`long`/`short` の領域が視覚的に分かるようにする。最大幅は固定（例 360px）でレスポンシブに縮小。
6. **早見表（下部・一覧比較）**: 4比率を `RATIOS.map()` で行展開し、各行に「名称・比率値・long・short」を表示。現在の入力値に対する比較ができる。

### コーディング規約遵守

- ボタンには必ず `type="button"`。
- クリップボード操作は try/catch。
- UIは shadcn/ui（Card, Input, Label, Button, Select または Tabs, Toaster）を使用。
- `innerHTML` は使用しない（数値表示のみ、XSS懸念なし）。
- `.docs/DESIGN.md` の DS-001〜DS-010 に準拠。

## 5. テスト（`src/utils/__tests__/ratio.test.ts`、Vitest）

- `split(1000, golden)` → `long ≈ 618.034`, `short ≈ 381.966`（許容誤差つき）。
- `scale(100, golden)` → `larger ≈ 161.803`, `smaller ≈ 61.803`。
- 各比率定数 `value` の検証（golden≈1.618, silver≈2.414, platinum≈1.732, bronze≈3.303）。
- `split` で long + short === total（保存則）。
- `formatNumber` の整形（小数第3位、3桁区切り）。
- 非正・非有限入力で 0 を返す境界ケース。

## 6. ルーティング登録

`packages/router/src/config/apps.ts` に `ratio-calculator` のルーティング定義を追加。
`index.html` の title / description / og を本ツール用に更新。

## 7. スコープ外（YAGNI）

- フォントサイズのモジュラースケール生成。
- 黄金螺旋の描画。
- 単位（px/em等）の付与・換算（純粋な数値として扱う）。
- 比率のユーザー定義追加。
