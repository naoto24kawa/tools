# SP1: デザイントークン基盤と Tailwind v4 パイロット移行 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** `@tools/design-tokens` パッケージを新設し、`apps/url-encoder` 1 アプリを Tailwind v4 + oklch へ移行して、残り 345 アプリへ展開可能な変換手順を実測で確定させる。

**Architecture:** standards `templates/design-tokens.css` を正準ソースとする oklch トークンを workspace パッケージ 1 箇所に置き、各アプリの `src/index.css` は `@import '@tools/design-tokens';` の 1 行にする。Tailwind v4 は CSS-first 設定なので `tailwind.config.js` と `postcss.config.js` は削除し、`@tailwindcss/vite` プラグインへ置き換える。ブランドノブ（`--primary`）のコントラストは目視でなく自動テストで固定する。

**Tech Stack:** Tailwind CSS v4 (`@tailwindcss/vite@^4.3`) / Vite+ 8.0.0 (Rolldown, `vite-plus`) / pnpm workspaces / Vitest (`vp test`) / React 19

**参照 spec:** `docs/superpowers/specs/2026-07-29-design-standards-adoption-design.md`

## Global Constraints

これらは全タスクの要件に暗黙に含まれる。

- **`apps/url-encoder/vite.config.ts` の `base: './'` は絶対に変更しない。** `'/'` にすると全アプリが白画面になる（HTML は 200 を返すため気づけない）。正本は `.docs/ASSET_PATH_INCIDENT.md`。
- **触るアプリは `apps/url-encoder` のみ。** 残り 345 アプリのファイルを一切変更しない。
- **ブランドノブの値は固定値。** light `--primary: oklch(0.55 0.18 255)` / `--primary-foreground: oklch(0.985 0 0)`、dark `--primary: oklch(0.72 0.14 255)` / `--primary-foreground: oklch(0.145 0 0)`。L 値を上げると WCAG 4.5:1 を割るため変更しない。
- **`tokens.css` の standards テンプレートからの差分は上記 4 行のみ。** 他の行は `~/projects/naoto24kawa/standards/templates/design-tokens.css` からそのままコピーする。
- **検証コマンドに pipe を挟まない。** exit code と出力を直接見る。
- **パッケージ名の scope は `@tools/`**（既存の `@tools/ui` に合わせる）。
- **作業ブランチは `feature/design-tokens-v4-pilot`**（既存・作成済み）。
- ボタン要素には `type="button"` を付与する（CLAUDE.md コーディング規約）。
- Oxfmt 設定: indent 2 spaces / single quotes / semicolons / line width 100。

---

### Task 1: `@tools/design-tokens` パッケージとコントラスト自動検証

standards §3 は「`--primary` を上書きしたらコントラスト 4.5:1 を実計算で確認する（MUST）」と定めている。これを人手の確認でなくテストに落とし、値が動いたら CI で落ちるようにする。

**Files:**
- Create: `packages/design-tokens/package.json`
- Create: `packages/design-tokens/tokens.css`
- Create: `packages/design-tokens/README.md`
- Create: `packages/design-tokens/src/contrast.ts`
- Test: `packages/design-tokens/src/__tests__/contrast.test.ts`
- Test: `packages/design-tokens/src/__tests__/tokens.test.ts`

**Interfaces:**
- Consumes: なし（最初のタスク）
- Produces:
  - npm パッケージ `@tools/design-tokens`、`exports: { ".": "./tokens.css" }`。Task 2 が `@import '@tools/design-tokens';` で参照する
  - `parseOklch(value: string): { L: number; C: number; H: number } | null`
  - `contrastRatio(a: OklchColor, b: OklchColor): number`
  - `extractTokens(css: string, selector: ':root' | '.dark'): Record<string, string>`

- [ ] **Step 1: パッケージ骨格を作る**

`packages/design-tokens/package.json`:

```json
{
  "name": "@tools/design-tokens",
  "version": "0.1.0",
  "private": true,
  "type": "module",
  "exports": {
    ".": "./tokens.css"
  },
  "files": ["tokens.css"],
  "scripts": {
    "test": "vp test"
  },
  "dependencies": {
    "@fontsource-variable/geist": "^5.3.0",
    "shadcn": "^4.16.0",
    "tailwindcss": "^4.3.3",
    "tw-animate-css": "^1.4.0"
  }
}
```

依存の理由（`tokens.css` 冒頭の `@import` が参照する）:

| 依存 | 提供するもの |
|---|---|
| `tailwindcss` | `@import "tailwindcss"` の本体 |
| `tw-animate-css` | `animate-in` 等のアニメーションユーティリティ（v3 の `tailwindcss-animate` の後継） |
| `shadcn` | `shadcn/tailwind.css`（`data-state` 系 custom variant と accordion keyframes）。`exports` に `"./tailwind.css": "./dist/tailwind.css"` が定義されていることを確認済み |
| `@fontsource-variable/geist` | Geist Variable フォント本体 |

- [ ] **Step 2: コントラスト計算の失敗するテストを書く**

`packages/design-tokens/src/__tests__/contrast.test.ts`:

```ts
import { describe, expect, it } from 'vitest';
import { contrastRatio, parseOklch } from '../contrast';

describe('parseOklch', () => {
  it('oklch(L C H) 形式を解析する', () => {
    expect(parseOklch('oklch(0.55 0.18 255)')).toEqual({ L: 0.55, C: 0.18, H: 255 });
  });

  it('無彩色（H 省略なし・C=0）を解析する', () => {
    expect(parseOklch('oklch(0.985 0 0)')).toEqual({ L: 0.985, C: 0, H: 0 });
  });

  it('アルファ付き oklch を解析する', () => {
    expect(parseOklch('oklch(1 0 0 / 10%)')).toEqual({ L: 1, C: 0, H: 0 });
  });

  it('oklch でない値には null を返す', () => {
    expect(parseOklch('0.625rem')).toBeNull();
  });
});

describe('contrastRatio', () => {
  it('白と黒は 21:1 になる', () => {
    const white = { L: 1, C: 0, H: 0 };
    const black = { L: 0, C: 0, H: 0 };
    expect(contrastRatio(white, black)).toBeCloseTo(21, 1);
  });

  it('同じ色どうしは 1:1 になる', () => {
    const c = { L: 0.55, C: 0.18, H: 255 };
    expect(contrastRatio(c, c)).toBeCloseTo(1, 5);
  });

  it('引数の順序で結果が変わらない', () => {
    const a = { L: 0.55, C: 0.18, H: 255 };
    const b = { L: 0.985, C: 0, H: 0 };
    expect(contrastRatio(a, b)).toBeCloseTo(contrastRatio(b, a), 10);
  });
});
```

- [ ] **Step 3: テストを実行して失敗を確認する**

Run: `pnpm exec vp test packages/design-tokens/src`（リポジトリルートで実行する）

Expected: FAIL（`../contrast` が存在しないため解決エラー）

もしこのコマンドで design-tokens のテストが収集されない場合は、その事実を報告して指示を待つ。

- [ ] **Step 4: `contrast.ts` を実装する**

`packages/design-tokens/src/contrast.ts`:

```ts
/**
 * oklch トークンの WCAG コントラスト比を計算する。
 * standards DESIGN.md §3 ブランドノブの「4.5:1 を実計算で確認する（MUST）」を
 * 自動テストで担保するために使う。oklch の L 値は WCAG 輝度と一致しないため、
 * 目視や L 値の比較では判定できない。
 */
export type OklchColor = { L: number; C: number; H: number };

/** oklch(L C H) / oklch(L C H / A) を解析する。oklch でなければ null */
export function parseOklch(value: string): OklchColor | null {
  const match = value.trim().match(/^oklch\(\s*([\d.]+)\s+([\d.]+)\s+([\d.]+)/);
  if (!match) return null;
  return { L: Number(match[1]), C: Number(match[2]), H: Number(match[3]) };
}

/** oklch を linear-light sRGB へ変換する（ガンマ補正前） */
function toLinearSrgb({ L, C, H }: OklchColor): [number, number, number] {
  const h = (H * Math.PI) / 180;
  const a = C * Math.cos(h);
  const b = C * Math.sin(h);

  const l = (L + 0.3963377774 * a + 0.2158037573 * b) ** 3;
  const m = (L - 0.1055613458 * a - 0.0638541728 * b) ** 3;
  const s = (L - 0.0894841775 * a - 1.291485548 * b) ** 3;

  return [
    4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
    -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
    -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s,
  ];
}

/** WCAG 相対輝度。sRGB 色域外の値は色域内へクランプする */
function relativeLuminance(color: OklchColor): number {
  const [r, g, b] = toLinearSrgb(color).map((v) => Math.min(1, Math.max(0, v)));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/** WCAG コントラスト比。引数の順序に依存しない */
export function contrastRatio(a: OklchColor, b: OklchColor): number {
  const la = relativeLuminance(a);
  const lb = relativeLuminance(b);
  const [hi, lo] = la > lb ? [la, lb] : [lb, la];
  return (hi + 0.05) / (lo + 0.05);
}

/** CSS から指定セレクタのブロックを取り出し、カスタムプロパティを辞書にする */
export function extractTokens(css: string, selector: ':root' | '.dark'): Record<string, string> {
  const escaped = selector.replace('.', '\\.');
  const block = css.match(new RegExp(`${escaped}\\s*\\{([^}]*)\\}`));
  if (!block) throw new Error(`selector ${selector} not found in css`);

  const tokens: Record<string, string> = {};
  for (const line of block[1].split('\n')) {
    const declaration = line.split('/*')[0];
    const match = declaration.match(/^\s*(--[\w-]+)\s*:\s*(.+?)\s*;/);
    if (match) tokens[match[1]] = match[2];
  }
  return tokens;
}
```

- [ ] **Step 5: テストを実行して通ることを確認する**

Run: `pnpm exec vp test packages/design-tokens/src`（リポジトリルートで実行する）

Expected: PASS（7 テスト）

- [ ] **Step 6: tokens.css の失敗するテストを書く**

`packages/design-tokens/src/__tests__/tokens.test.ts`:

```ts
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import { contrastRatio, extractTokens, parseOklch, type OklchColor } from '../contrast';

const css = readFileSync(fileURLToPath(new URL('../../tokens.css', import.meta.url)), 'utf8');
const light = extractTokens(css, ':root');
const dark = extractTokens(css, '.dark');

function color(tokens: Record<string, string>, name: string): OklchColor {
  const parsed = parseOklch(tokens[name]);
  if (!parsed) throw new Error(`${name} is not an oklch value: ${tokens[name]}`);
  return parsed;
}

describe('ブランドノブ（standards DESIGN.md §3 の MUST）', () => {
  it('light: --primary × --primary-foreground が 4.5:1 以上', () => {
    expect(contrastRatio(color(light, '--primary'), color(light, '--primary-foreground')))
      .toBeGreaterThanOrEqual(4.5);
  });

  it('dark: --primary × --primary-foreground が 4.5:1 以上', () => {
    expect(contrastRatio(color(dark, '--primary'), color(dark, '--primary-foreground')))
      .toBeGreaterThanOrEqual(4.5);
  });

  it('light: --primary をテキスト色として --background 上で 4.5:1 以上', () => {
    expect(contrastRatio(color(light, '--primary'), color(light, '--background')))
      .toBeGreaterThanOrEqual(4.5);
  });

  it('light: --primary をテキスト色として --muted 上で 4.5:1 以上（DS-002 のバックリンク用途）', () => {
    expect(contrastRatio(color(light, '--primary'), color(light, '--muted')))
      .toBeGreaterThanOrEqual(4.5);
  });
});

describe('テキスト系トークン（standards DESIGN.md §8）', () => {
  it('light: --muted-foreground × --background が 4.5:1 以上', () => {
    expect(contrastRatio(color(light, '--muted-foreground'), color(light, '--background')))
      .toBeGreaterThanOrEqual(4.5);
  });

  it('light: --muted-foreground × --muted が 4.5:1 以上', () => {
    expect(contrastRatio(color(light, '--muted-foreground'), color(light, '--muted')))
      .toBeGreaterThanOrEqual(4.5);
  });

  it('dark: --muted-foreground × --background が 4.5:1 以上', () => {
    expect(contrastRatio(color(dark, '--muted-foreground'), color(dark, '--background')))
      .toBeGreaterThanOrEqual(4.5);
  });

  it('light: --ring × --background が 3:1 以上（WCAG 1.4.11 非テキストコントラスト）', () => {
    expect(contrastRatio(color(light, '--ring'), color(light, '--background')))
      .toBeGreaterThanOrEqual(3);
  });
});

describe('ステータス色（standards DESIGN.md §5）', () => {
  for (const status of ['destructive', 'success', 'warning'] as const) {
    it(`light: --${status} × --${status}-foreground が 4.5:1 以上`, () => {
      expect(contrastRatio(color(light, `--${status}`), color(light, `--${status}-foreground`)))
        .toBeGreaterThanOrEqual(4.5);
    });

    it(`dark: --${status} × --${status}-foreground が 4.5:1 以上`, () => {
      expect(contrastRatio(color(dark, `--${status}`), color(dark, `--${status}-foreground`)))
        .toBeGreaterThanOrEqual(4.5);
    });
  }
});

describe('トークンの網羅性', () => {
  it('standards の標準セマンティックトークンがすべて light に定義されている', () => {
    const required = [
      '--background', '--foreground', '--card', '--card-foreground',
      '--popover', '--popover-foreground', '--primary', '--primary-foreground',
      '--secondary', '--secondary-foreground', '--muted', '--muted-foreground',
      '--accent', '--accent-foreground', '--destructive', '--destructive-foreground',
      '--success', '--success-foreground', '--warning', '--warning-foreground',
      '--border', '--input', '--ring', '--radius',
    ];
    for (const token of required) {
      expect(light, `${token} が :root にない`).toHaveProperty(token);
    }
  });

  it('--radius が standards の 0.625rem である', () => {
    expect(light['--radius']).toBe('0.625rem');
  });
});
```

- [ ] **Step 7: テストを実行して失敗を確認する**

Run: `pnpm exec vp test packages/design-tokens/src`（リポジトリルートで実行する）

Expected: FAIL（`tokens.css` が存在せず `readFileSync` が ENOENT）

- [ ] **Step 8: tokens.css を作る**

`~/projects/naoto24kawa/standards/templates/design-tokens.css` の全内容をコピーし、以下 4 行だけを書き換える。**他の行は一切変更しない**（standards テンプレート改訂時の差分マージを機械的に保つため）。

`:root` ブロック内:

```css
    --primary: oklch(0.55 0.18 255);   /* 青。--primary-foreground と 4.72:1（tokens.test.ts で検証） */
    --primary-foreground: oklch(0.985 0 0);
```

`.dark` ブロック内:

```css
    --primary: oklch(0.72 0.14 255);   /* 明るい青。--primary-foreground と 7.97:1（tokens.test.ts で検証） */
    --primary-foreground: oklch(0.145 0 0);   /* 暗色（dark の primary は明るいため暗色テキスト） */
```

ファイル冒頭に次のコメントを追加する:

```css
/*
 * Elchika Tools デザイントークン — 唯一の正本。
 *
 * 正準ソース: naoto24kawa/standards の templates/design-tokens.css
 * tools 側の差分は --primary / --primary-foreground（light・dark 各 2 行）のみ。
 * それ以外を変更すると standards テンプレート改訂時の差分マージが破綻する。
 *
 * 値を変更した場合は src/__tests__/tokens.test.ts が WCAG コントラストを検証する。
 * standards DESIGN.md §3 は「ノブを上書きしたら 4.5:1 を実計算で確認する」を MUST としており、
 * このテストがその実計算にあたる。
 */
```

- [ ] **Step 9: テストを実行して通ることを確認する**

Run: `pnpm exec vp test packages/design-tokens/src`（リポジトリルートで実行する）

Expected: PASS（contrast.test.ts 7 件 + tokens.test.ts 16 件）

- [ ] **Step 10: 差分が 4 行に限定されていることを確認する**

Run: `diff ~/projects/naoto24kawa/standards/templates/design-tokens.css packages/design-tokens/tokens.css`

Expected: 差分は冒頭のコメントブロックと `--primary` / `--primary-foreground` の 4 行のみ。他の行に差分が出ていたらコピーミスなので修正する。

- [ ] **Step 11: README を書く**

`packages/design-tokens/README.md`:

```markdown
# @tools/design-tokens

Elchika Tools 全アプリの oklch デザイントークン。**このパッケージが唯一の正本**。

## 使い方

各アプリの `src/index.css`:

```css
@import '@tools/design-tokens';
```

`@import "tailwindcss"` はこのパッケージが持つため、アプリ側は 1 行でよい。

## standards との関係

正準ソースは `naoto24kawa/standards` の `templates/design-tokens.css`。
tools 側の差分は `--primary` / `--primary-foreground`（light・dark 各 2 行）のみ。

standards のテンプレートが改訂されたら:

1. `diff ~/projects/naoto24kawa/standards/templates/design-tokens.css tokens.css` で差分を確認
2. ブランドノブ 4 行以外の差分を取り込む
3. リポジトリルートで `pnpm exec vp test packages/design-tokens/src` を実行してコントラストが維持されているか確認

## ブランドノブ

| ノブ | 値 | 根拠 |
|---|---|---|
| `--primary` (light) | `oklch(0.55 0.18 255)` | 白 foreground と 4.72:1。**L を 0.57 まで上げると 4.5:1 を割る** |
| `--primary` (dark) | `oklch(0.72 0.14 255)` | 暗色 foreground と 7.97:1 |

値を変更する場合は `src/__tests__/tokens.test.ts` が実計算で検証する（standards DESIGN.md §3 の MUST）。
```

- [ ] **Step 12: lint を通す**

Run: `pnpm check`

Expected: PASS。失敗したら `pnpm check:fix` を実行し、再度 `pnpm check` で PASS を確認する。

- [ ] **Step 13: コミット**

```bash
git add packages/design-tokens
git commit -m "feat(design-tokens): oklch トークンパッケージとコントラスト自動検証を追加

standards templates/design-tokens.css を正準ソースとし、tools の差分は
--primary / --primary-foreground の 4 行に限定する。standards DESIGN.md §3 が
MUST とするコントラスト実計算を tokens.test.ts で自動化した。

Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>"
```

---

### Task 2: `url-encoder` を Tailwind v4 へ移行

spec の「実測で確定させる未知」5 項目を、ここで実際に動かして確定させる。

**Files:**
- Modify: `apps/url-encoder/package.json`
- Modify: `apps/url-encoder/vite.config.ts`
- Modify: `apps/url-encoder/src/index.css`
- Delete: `apps/url-encoder/tailwind.config.js`
- Delete: `apps/url-encoder/postcss.config.js`

**Interfaces:**
- Consumes: `@tools/design-tokens`（Task 1 が作った workspace パッケージ）
- Produces: 移行済みの `apps/url-encoder`。Task 3 の検証スクリプトが `apps/url-encoder/dist/assets/*.css` を検査する

- [ ] **Step 1: 移行前のベースラインを記録する**

Run: `node scripts/design-audit.js --app=url-encoder`

Expected: 違反 1 件（`DS-002 "← Tools トップに戻る" バックリンクがない`）。この数値が Task 4 の G10 の比較基準になる。**移行でこの件数を増やさない**。

Run: `node scripts/check-asset-paths.js`

Expected: PASS。移行前から壊れていないことを確認しておく（移行後に落ちたら移行が原因だと切り分けられる）。

Run: `pnpm exec vp test apps/url-encoder/src`（リポジトリルートで実行する）

Expected: exit 0 / 5 files / 55 tests PASS。これを G8 の比較基準にし、移行後も同じ 55 tests が PASS することを確認する。

- [ ] **Step 2: package.json を書き換える**

`apps/url-encoder/package.json` の `dependencies` に追加:

```json
    "@tools/design-tokens": "workspace:*",
```

`devDependencies` を次のように変更する。`autoprefixer` / `postcss` / `tailwindcss-animate` を削除し、`tailwindcss` を v4 へ、`@tailwindcss/vite` を追加する:

```json
  "devDependencies": {
    "@tailwindcss/vite": "^4.3.3",
    "@types/react": "^19.0.0",
    "@types/react-dom": "^19.0.0",
    "@vitejs/plugin-react-swc": "^4.3.0",
    "tailwindcss": "^4.3.3",
    "vite": "^8.0.0"
  }
```

`tw-animate-css` はアプリ側に足さない（`@tools/design-tokens` が依存として持ち、`tokens.css` が `@import` する）。

- [ ] **Step 3: vite.config.ts に Tailwind プラグインを追加する**

`apps/url-encoder/vite.config.ts` の import 行と `plugins` 配列だけを変更する。**`base: './'` の行には触らない**:

```ts
import path from 'node:path';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react-swc';
import { defineConfig } from 'vite-plus';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  // Pages直接アクセス用にルートパスを使用
  base: './',
```

以降（`server` / `resolve` / `build`）は変更しない。

- [ ] **Step 4: index.css を 1 行にする**

`apps/url-encoder/src/index.css` の全内容を次で置き換える:

```css
@import '@tools/design-tokens';
```

- [ ] **Step 5: v3 の設定ファイルを削除する**

```bash
rm apps/url-encoder/tailwind.config.js apps/url-encoder/postcss.config.js
```

- [ ] **Step 6: 依存を再インストールする**

Run: `pnpm install`

Expected: exit 0。`@tools/design-tokens` が `apps/url-encoder/node_modules/@tools/design-tokens` へ symlink される。

Run: `ls -la apps/url-encoder/node_modules/@tools/`

Expected: `design-tokens` が workspace への symlink として存在する。

- [ ] **Step 7: ビルドする（G1・未知 2 と 4 の確定）**

Run: `pnpm --filter url-encoder build`

Expected: exit 0 かつ `apps/url-encoder/dist/assets/` に `.css` ファイルが生成される。

**失敗した場合の分岐:**

- `@tailwindcss/vite` がプラグインとして認識されない / Rolldown 由来のエラー（未知 2 の否定）→ `@tailwindcss/vite` を外し、`postcss.config.js` を復活させて `{ plugins: { '@tailwindcss/postcss': {} } }` とし、`@tailwindcss/postcss` を devDependencies に追加して再試行する。これも失敗したら **作業を止めて** 事実を `.docs/risk-registry.md` に記録し、スコープ判断を相談する。
- `tw-animate-css` の解決に失敗 → `packages/design-tokens/package.json` の `dependencies` に入っているか確認する。`pnpm install` を再実行する。
- `shadcn/tailwind.css` の解決に失敗（未知 3）→ `packages/design-tokens/package.json` の `dependencies` に `shadcn` が入っているか確認する。入っているのに解決できない場合は、`tokens.css` の `@import "shadcn/tailwind.css";` 行を削除し、その旨を Task 5 の手順書に「standards テンプレートからの追加差分」として記録する。この import が提供するのは `data-state` 系 custom variant と accordion keyframes なので、削除した場合は Task 4 の目視で Toast / Select の開閉アニメーションが壊れていないか追加確認する。

- [ ] **Step 8: 生成 CSS を目で確認する（G2・G3・G4 の手動確認）**

Run: `ls apps/url-encoder/dist/assets/`

生成された CSS ファイル名を控える。以下 `<css>` はそのパスとする。

Run: `grep -c 'max-w-7xl' apps/url-encoder/dist/assets/<css>`

Expected: 1 以上。**0 ならコンテンツ検出が効いていない（未知 1 の否定）** → `apps/url-encoder/src/index.css` を次の 2 行にして Step 7 からやり直す:

```css
@import '@tools/design-tokens';
@source '../src';
```

Run: `grep -c 'oklch(' apps/url-encoder/dist/assets/<css>`

Expected: 1 以上。

Run: `grep -c 'hsl(var(--' apps/url-encoder/dist/assets/<css>`

Expected: 0（grep は不一致で exit 1 を返すので、出力が `0` であることを確認する）。

Run: `grep -o 'oklch(0.55 0.18 255)' apps/url-encoder/dist/assets/<css>`

Expected: 1 件以上ヒットする。

- [ ] **Step 9: アセットパスを検査する（G5）**

Run: `node scripts/check-asset-paths.js`

Expected: PASS。**落ちたら `vite.config.ts` の `base` を確認し、`'./'` でなければ即座に戻す。**

- [ ] **Step 10: 既存テストと lint を通す（G8・G9）**

Run: `pnpm exec vp test apps/url-encoder/src`（リポジトリルートで実行する）

Expected: exit 0。

`pnpm --filter url-encoder test` を使わない。アプリ cwd の `vite.config.ts` が使われ、root の test 設定（`environment: happy-dom` / `setupFiles`）を失って `document is not defined` で全 DOM テストが落ちる。これは移行の失敗ではなく検証経路の誤りである。

Run: `pnpm check`

Expected: PASS。失敗したら `pnpm check:fix` 後に再確認する。

- [ ] **Step 11: DS ルールの非回帰を確認する（G10）**

Run: `node scripts/design-audit.js --app=url-encoder`

Expected: 違反 1 件（Step 1 のベースラインと同数）。増えていたら原因を特定して修正する。

- [ ] **Step 12: コミット**

```bash
git add -A apps/url-encoder pnpm-lock.yaml
git commit -m "feat(url-encoder): Tailwind v4 + oklch トークンへ移行

@tools/design-tokens を @import する方式に切り替え、CSS-first 設定へ移行した。
tailwind.config.js / postcss.config.js を削除し @tailwindcss/vite へ置換。
base: './' は変更していない（check-asset-paths.js で確認済み）。

Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>"
```

---

### Task 3: 移行検証スクリプト `scripts/verify-v4-migration.js`

Task 2 の Step 8〜9 を手作業でなく機械検査にする。SP2 で 346 アプリへ同じ検査をかけるための再利用資産であり、**このスクリプトの品質が SP2 の検証ゲート全体の品質になる**。

**Files:**
- Create: `scripts/verify-v4-migration.js`

**Interfaces:**
- Consumes: `apps/<name>/dist/assets/*.css`（Task 2 が生成したビルド成果物）、`apps/<name>/src/index.css`、`apps/<name>/vite.config.ts`
- Produces: CLI `node scripts/verify-v4-migration.js [--app=<name>]`。全チェック PASS で exit 0、1 つでも FAIL で exit 1。SP2 の一括検証がこれを呼ぶ

- [ ] **Step 1: スクリプトを書く**

`scripts/verify-v4-migration.js`:

```js
#!/usr/bin/env node
/**
 * Tailwind v4 移行の検証ゲート（spec の G2〜G5 を機械化）
 *
 * ビルドが成功したことを完了の根拠にしない。v4 のコンテンツ検出が外れると
 * CSS は生成されるがユーティリティが空になり、ビルド成功のまま画面が崩れる。
 * この静かな失敗を検出することがこのスクリプトの主目的。
 *
 * 使用方法:
 *   node scripts/verify-v4-migration.js --app=url-encoder
 *   node scripts/verify-v4-migration.js            # 移行済み全アプリ
 */

const fs = require('node:fs');
const path = require('node:path');

const APPS_DIR = path.join(__dirname, '..', 'apps');
const filterApp = process.argv.slice(2).find((a) => a.startsWith('--app='))?.split('=')[1];

/** 移行済みの目印: index.css が design-tokens を import している */
function isMigrated(appDir) {
  const indexCss = path.join(appDir, 'src', 'index.css');
  if (!fs.existsSync(indexCss)) return false;
  return fs.readFileSync(indexCss, 'utf8').includes('@tools/design-tokens');
}

function readBuiltCss(appDir) {
  const assetsDir = path.join(appDir, 'dist', 'assets');
  if (!fs.existsSync(assetsDir)) return null;
  const cssFiles = fs.readdirSync(assetsDir).filter((f) => f.endsWith('.css'));
  if (cssFiles.length === 0) return null;
  return cssFiles.map((f) => fs.readFileSync(path.join(assetsDir, f), 'utf8')).join('\n');
}

/** src 配下の tsx から実際に使われている Tailwind ユーティリティを拾う */
function sampleUtilityClasses(appDir) {
  const appTsx = path.join(appDir, 'src', 'App.tsx');
  if (!fs.existsSync(appTsx)) return [];
  const content = fs.readFileSync(appTsx, 'utf8');
  const candidates = ['max-w-7xl', 'max-w-6xl', 'max-w-5xl', 'min-h-screen', 'mx-auto', 'space-y-4'];
  return candidates.filter((c) => content.includes(c));
}

const CHECKS = {
  /** G2: コンテンツ検出が効いている（v4 移行最大の静かな失敗点） */
  G2: ({ builtCss, appDir }) => {
    const used = sampleUtilityClasses(appDir);
    if (used.length === 0) return ['App.tsx に既知のユーティリティが見つからず G2 を判定できない'];
    const missing = used.filter((cls) => !builtCss.includes(`.${cls.replace(/([:.])/g, '\\$1')}`));
    return missing.length > 0
      ? [`生成 CSS に定義がないユーティリティ: ${missing.join(', ')}（コンテンツ検出が外れている）`]
      : [];
  },

  /** G3: oklch へ移行済みで hsl 参照が残っていない */
  G3: ({ builtCss }) => {
    const errors = [];
    if (!builtCss.includes('oklch(')) errors.push('生成 CSS に oklch( が存在しない');
    if (builtCss.includes('hsl(var(--')) errors.push('生成 CSS に v3 形式の hsl(var(--) が残っている');
    return errors;
  },

  /** G4: ブランドノブの青が適用されている */
  G4: ({ builtCss }) => {
    return builtCss.includes('oklch(0.55 0.18 255)')
      ? []
      : ['生成 CSS に --primary の青 oklch(0.55 0.18 255) が現れない'];
  },

  /** G5 補強: base: './' が維持されている（白画面事故の直撃点） */
  G5: ({ appDir }) => {
    const viteConfig = path.join(appDir, 'vite.config.ts');
    if (!fs.existsSync(viteConfig)) return ['vite.config.ts が存在しない'];
    const content = fs.readFileSync(viteConfig, 'utf8');
    return /base:\s*'\.\/'/.test(content) ? [] : ["vite.config.ts の base が './' でない"];
  },

  /** v3 の設定ファイルが残っていない */
  V3: ({ appDir }) => {
    const leftovers = ['tailwind.config.js', 'postcss.config.js'].filter((f) =>
      fs.existsSync(path.join(appDir, f))
    );
    return leftovers.length > 0 ? [`v3 の設定ファイルが残っている: ${leftovers.join(', ')}`] : [];
  },
};

const targets = (filterApp ? [filterApp] : fs.readdirSync(APPS_DIR))
  .map((name) => ({ name, appDir: path.join(APPS_DIR, name) }))
  .filter(({ appDir }) => fs.statSync(appDir).isDirectory() && isMigrated(appDir));

if (targets.length === 0) {
  console.error(filterApp ? `${filterApp} は未移行、または存在しない` : '移行済みアプリが 1 つもない');
  process.exit(1);
}

let failed = 0;
for (const { name, appDir } of targets) {
  const builtCss = readBuiltCss(appDir);
  if (builtCss === null) {
    console.error(`❌ ${name}: dist/assets に CSS がない（先にビルドすること）`);
    failed++;
    continue;
  }

  const errors = Object.entries(CHECKS).flatMap(([id, check]) =>
    check({ builtCss, appDir }).map((message) => `${id}  ${message}`)
  );

  if (errors.length > 0) {
    console.error(`❌ ${name} (${errors.length}件)`);
    for (const e of errors) console.error(`   ${e}`);
    failed++;
  } else {
    console.log(`✅ ${name}`);
  }
}

console.log(`\n検証: ${targets.length - failed} / ${targets.length} PASS`);
process.exit(failed > 0 ? 1 : 0);
```

- [ ] **Step 2: 移行済みアプリに対して PASS することを確認する**

Run: `node scripts/verify-v4-migration.js --app=url-encoder`

Expected: `✅ url-encoder` と表示され exit 0。

Run: `echo $?`

Expected: `0`

- [ ] **Step 3: 意図的に壊して FAIL することを確認する**

**このステップを省略しない。** 常に PASS を返すスクリプトは検証ゲートとして無価値であり、その状態は PASS 表示からは区別できない（偽成功シグナル）。

G4 の検出を確認する（変更は `git checkout` で戻すのでバックアップは取らない）:

```bash
sed -i '' 's|--primary: oklch(0.55 0.18 255)|--primary: oklch(0.60 0.10 255)|' packages/design-tokens/tokens.css
pnpm --filter url-encoder build
node scripts/verify-v4-migration.js --app=url-encoder
```

Expected: `❌ url-encoder` と `G4 ...` が表示され exit 1。

G5 の検出を確認する（先に tokens.css を戻してから、今度は base を壊す）:

```bash
git checkout packages/design-tokens/tokens.css
sed -i '' "s|base: './'|base: '/'|" apps/url-encoder/vite.config.ts
node scripts/verify-v4-migration.js --app=url-encoder
```

Expected: `G5  vite.config.ts の base が './' でない` が表示され exit 1。

- [ ] **Step 4: 壊した箇所を確実に戻す**

```bash
git checkout apps/url-encoder/vite.config.ts packages/design-tokens/tokens.css
pnpm --filter url-encoder build
node scripts/verify-v4-migration.js --app=url-encoder
```

Expected: `✅ url-encoder` と exit 0。

Run: `git status --short`

Expected: `apps/url-encoder/vite.config.ts` と `packages/design-tokens/tokens.css` に差分がない（`scripts/verify-v4-migration.js` の新規追加のみ）。

- [ ] **Step 5: lint を通してコミット**

Run: `pnpm check`

Expected: PASS。失敗したら `pnpm check:fix` 後に再確認する。

```bash
git add scripts/verify-v4-migration.js
git commit -m "feat(scripts): Tailwind v4 移行の検証ゲートを追加

生成 CSS を検査して G2〜G5 を機械判定する。v4 のコンテンツ検出が外れると
ビルドは成功したままユーティリティが空になるため、ビルド成功を完了の根拠に
しない。意図的に壊した入力で FAIL することを確認済み。

Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>"
```

---

### Task 4: light / dark の目視検証と証跡

G6・G7 は機械検査で代替できない。実際にブラウザで描画して確認し、スクリーンショットを証跡として残す。

**ブラウザ操作の方針**: agent-browser を使う。Claude-in-Chrome の MCP ツール（`tabs_context_mcp` / `navigate` / `computer` 等）を直接呼ばない（ユーザーの明示的な指示）。agent-browser が利用できない環境では playwright MCP を使う（このリポジトリは `e2e/` で Playwright を使っており依存が入っている）。

**Files:**
- Create: `.docs/verification/2026-07-29-sp1-url-encoder-light.png`
- Create: `.docs/verification/2026-07-29-sp1-url-encoder-dark.png`
- Create: `.docs/verification/2026-07-29-sp1-visual-check.md`

**Interfaces:**
- Consumes: 移行済み `apps/url-encoder`（Task 2）
- Produces: 目視検証の証跡。Task 5 の手順書が「SP2 でサンプリング目視する際の観点」としてこの結果を参照する

- [ ] **Step 1: 証跡ディレクトリを作り、dev サーバーを起動する**

```bash
mkdir -p .docs/verification
```

dev サーバーを**バックグラウンドで**起動する（`pnpm --filter url-encoder dev`）。フォアグラウンドで起動するとセッションがブロックされる。

起動を待つ間、次のコマンドで応答を確認する（`vite.config.ts` の `server.port` は 5173）:

Run: `curl -s -o /dev/null -w '%{http_code}\n' http://localhost:5173/`

Expected: `200`。まだなら数秒おいて再実行する。

- [ ] **Step 2: light テーマを確認して撮影する**

ブラウザで `http://localhost:5173/` を開き、次を確認する:

- ヘッダの h1・説明文が読める（`--muted-foreground` が薄すぎない）
- ボタンが**青地に白文字**で描画されている（`--primary` が効いている）
- 入力欄・テキストエリアの枠線が見える
- 角丸が付いている（`--radius: 0.625rem`）
- 欧文が Geist で描画され、日本語がフォールバックで自然に出ている
- Tab キーでフォーカスを移動し、フォーカスリングが 3px で見える

スクリーンショットを `.docs/verification/2026-07-29-sp1-url-encoder-light.png` に保存する。

- [ ] **Step 3: dark テーマを確認して撮影する**

ブラウザの開発者コンソールで次を実行する（ThemeToggle は SP3 のため、ここでは手動でクラスを付ける）:

```js
document.documentElement.classList.add('dark');
```

次を確認する:

- 背景が暗くなり、本文テキストが読める
- ボタンが**明るい青地に暗い文字**で描画されている（dark の `--primary` / `--primary-foreground`）
- **透明度合成によるコントラスト崩壊がない**（`bg-X-900/50` のような dark 前提色 + 透明度が light で淡色になる問題の逆パターン。standards §4）
- 枠線が背景に溶けて消えていない

スクリーンショットを `.docs/verification/2026-07-29-sp1-url-encoder-dark.png` に保存する。

- [ ] **Step 4: 検証記録を書く**

`.docs/verification/2026-07-29-sp1-visual-check.md`:

```markdown
# SP1 目視検証記録 — url-encoder (Tailwind v4 + oklch)

**日付**: 2026-07-29
**対象**: `apps/url-encoder`（移行済み）
**検証者**: （実施者名）

## G6: light テーマ

![light](2026-07-29-sp1-url-encoder-light.png)

| 観点 | 結果 |
|---|---|
| ヘッダ h1・説明文が読める | |
| ボタンが青地に白文字 | |
| 入力欄の枠線が見える | |
| 角丸が付いている | |
| 欧文 Geist・和文フォールバックが自然 | |
| フォーカスリングが見える | |

## G7: dark テーマ

![dark](2026-07-29-sp1-url-encoder-dark.png)

| 観点 | 結果 |
|---|---|
| 本文テキストが読める | |
| ボタンが明るい青地に暗い文字 | |
| 透明度合成によるコントラスト崩壊がない | |
| 枠線が背景に溶けていない | |

## 移行前との差異

（気づいた見た目の変化を記録する。SP2 で 346 アプリに同じ変化が起きるため、
許容できるか判断する材料になる）

## SP2 へ引き継ぐ観点

（サンプリング目視で特に見るべき点）
```

表の「結果」列を実際の確認結果で埋め、「移行前との差異」「SP2 へ引き継ぐ観点」を記述する。

- [ ] **Step 5: dev サーバーを止めてコミット**

バックグラウンドで起動した dev サーバーのプロセスを終了する。終了したことを次で確認する:

Run: `curl -s -o /dev/null -w '%{http_code}\n' http://localhost:5173/`

Expected: 接続失敗（`000`）。まだ 200 が返るならプロセスが残っているので終了させる。

```bash
git add .docs/verification
git commit -m "docs(verification): SP1 の light/dark 目視検証の証跡を追加

Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>"
```

---

### Task 5: SP2 向け変換手順書

SP1 の成果物 3 点目。SP2 の変換スクリプトはこの手順書を仕様として実装するため、**実測で判明した事実だけを書く**（推測を書くと SP2 がそれを literal に実装する）。

**Files:**
- Create: `.docs/plans/tailwind-v4-migration-guide.md`

**Interfaces:**
- Consumes: Task 2 で確定した移行手順、Task 3 の検証スクリプト、Task 4 の目視観点
- Produces: SP2 の `scripts/migrate-tailwind-v4.js` の仕様となる手順書

- [ ] **Step 1: 手順書を書く**

`.docs/plans/tailwind-v4-migration-guide.md` に以下を記述する。**すべて Task 2〜4 で実際に観測した結果で埋める**（未実施・未確認の項目を推測で埋めない）:

```markdown
# Tailwind v4 移行手順書（SP2 の仕様）

SP1（url-encoder パイロット）で実測して確定した手順。SP2 の
`scripts/migrate-tailwind-v4.js` はこの手順を機械化する。

## 実測で確定した事実

| # | 未知だった項目 | 実測結果 |
|---|---|---|
| 1 | v4 のコンテンツ自動検出がアプリの src/ を走査するか | |
| 2 | Rolldown-Vite で @tailwindcss/vite が動くか | |
| 3 | shadcn/tailwind.css の import が必要か / v3 前提の components/ui が動くか | |
| 4 | tailwindcss-animate → tw-animate-css で既存 className が壊れないか | |
| 5 | base: './' が維持されるか | |

## 1 アプリあたりの変換手順

### package.json

- dependencies に追加: `"@tools/design-tokens": "workspace:*"`
- devDependencies から削除: `autoprefixer` / `postcss` / `tailwindcss-animate`
- devDependencies を変更: `"tailwindcss": "^4.3.3"`
- devDependencies に追加: `"@tailwindcss/vite": "^4.3.3"`

### vite.config.ts

- import 追加: `import tailwindcss from '@tailwindcss/vite';`
- plugins に `tailwindcss()` を追加
- **base: './' は変更しない**

### src/index.css

全内容を置換:

（SP1 で確定した最終形をここに書く。@source が必要だったかどうかを反映する）

### 削除するファイル

- `tailwind.config.js`
- `postcss.config.js`

## 例外対応が必要なアプリ

`src/index.css` が shadcn デフォルトと md5 一致しない 6 アプリは個別確認が必要。
（該当アプリ名をここに列挙する）

## 検証

移行後に必ず実行する:

```bash
pnpm --filter <app> build
node scripts/verify-v4-migration.js --app=<app>
node scripts/check-asset-paths.js
node scripts/design-audit.js --app=<app>
```

テストはリポジトリルートから `pnpm exec vp test apps/<app>/src` で実行する。
`pnpm --filter <app> test` はアプリ cwd の `vite.config.ts` を使い、root の test 設定（`environment: happy-dom` / `setupFiles`）を失うため使わない。

## SP2 の変換スクリプトへの要求

- **冪等**: 移行済みアプリに再実行しても二重適用しない（`index.css` の
  `@tools/design-tokens` の有無で判定する）
- **再開可能**: 途中で失敗しても完了済みアプリを skip して再開できる
- **側面隔離**: 1 アプリの失敗で全体を止めない。失敗したアプリ名を記録して続行する
- **サイレントな打ち切りの禁止**: 目視をサンプリングする場合、何個確認して
  何個未確認かを必ず log に出す

## 目視で見るべき観点

（Task 4 の `.docs/verification/2026-07-29-sp1-visual-check.md` から引き継ぐ）
```

- [ ] **Step 2: 未記入の欄が残っていないか確認する**

Run: `grep -n '^| [0-9] |.*| |$' .docs/plans/tailwind-v4-migration-guide.md`

Expected: 出力なし（空欄の表行が残っていない）。残っていたら Task 2〜4 の実測結果で埋める。

Run: `grep -n '（.*ここに' .docs/plans/tailwind-v4-migration-guide.md`

Expected: 出力なし（指示文のプレースホルダが残っていない）。

- [ ] **Step 3: コミット**

```bash
git add .docs/plans/tailwind-v4-migration-guide.md
git commit -m "docs: SP1 実測に基づく Tailwind v4 移行手順書を追加

SP2 の変換スクリプトの仕様となる。実測で確定した事実のみを記載する。

Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>"
```

---

### Task 6: SP1 完了ゲート

spec の rubric G1〜G10 を通しで再実行し、全項目 PASS を確認する。個別タスクで確認済みでも、**最終状態のリポジトリに対して通しで再実行する**（途中の修正が別の項目を壊していないことを確認するため）。

**Files:**
- Modify: `docs/superpowers/plans/2026-07-29-sp1-design-tokens-v4-pilot.md`（本ファイルのチェックボックス）

**Interfaces:**
- Consumes: Task 1〜5 のすべての成果物
- Produces: SP1 完了の判定。SP2 の着手可否が決まる

- [ ] **Step 1: クリーンな状態からビルドし直す**

```bash
rm -rf apps/url-encoder/dist
pnpm --filter url-encoder build
```

Expected: exit 0 かつ `apps/url-encoder/dist/assets/` に CSS が生成される（G1）。

`dist` を消してからビルドするのは、古い成果物が残っていると検証が前回のビルドを見てしまうため（URISK-011「build したら rm -rf dist」）。

- [ ] **Step 2: 機械検査を通しで実行する**

Run: `node scripts/verify-v4-migration.js --app=url-encoder`

Expected: `✅ url-encoder` / exit 0（G2・G3・G4・G5 補強）

Run: `node scripts/check-asset-paths.js`

Expected: PASS（G5）

Run: `node scripts/design-audit.js --app=url-encoder`

Expected: 違反 1 件（Task 2 Step 1 のベースラインと同数。G10）

Run: `pnpm exec vp test apps/url-encoder/src`（リポジトリルートで実行する）

Expected: exit 0（G8）

`pnpm --filter url-encoder test` を使わない。アプリ cwd の `vite.config.ts` が使われ、root の test 設定（`environment: happy-dom` / `setupFiles`）を失って `document is not defined` で全 DOM テストが落ちる。これは移行の失敗ではなく検証経路の誤りである。

Run: `pnpm exec vp test packages/design-tokens/src`（リポジトリルートで実行する）

Expected: exit 0（コントラスト検証）

Run: `pnpm check`

Expected: PASS（G9）

- [ ] **Step 3: 目視の証跡が存在することを確認する（G6・G7）**

Run: `ls .docs/verification/`

Expected: `2026-07-29-sp1-url-encoder-light.png` / `2026-07-29-sp1-url-encoder-dark.png` / `2026-07-29-sp1-visual-check.md` が存在する。

`2026-07-29-sp1-visual-check.md` の表の「結果」列に未記入がないことを目で確認する。

- [ ] **Step 4: スコープ境界が守られたことを確認する**

Run: `git diff --stat main -- apps/`

Expected: `apps/url-encoder/` 配下のファイルのみが変更されている。**他のアプリのファイルが 1 つでも出たらスコープ違反**なので、その変更を戻す。

- [ ] **Step 5: 未コミットの変更がないことを確認する**

Run: `git status --short`

Expected: 出力なし。

- [ ] **Step 6: 結果を報告する**

G1〜G10 の各項目について、実行したコマンドと実際の出力を添えて報告する。**1 つでも FAIL があれば SP1 は未完了**として扱い、修正ループに戻る。

報告に含めるもの:

- G1〜G10 の判定結果（PASS / FAIL）と根拠となる出力
- 実測で確定した未知 5 項目の結論
- SP2 へ引き継ぐ注意点
- 想定と違った点（あれば）

---

## 完了時の状態

- `packages/design-tokens` が存在し、コントラスト検証テストが通る
- `apps/url-encoder` が Tailwind v4 + oklch で動作し、青の `--primary` が適用されている
- `scripts/verify-v4-migration.js` が存在し、壊れた入力で FAIL することが確認されている
- `.docs/verification/` に light / dark の証跡がある
- `.docs/plans/tailwind-v4-migration-guide.md` に SP2 の仕様がある
- **残り 345 アプリは一切変更されていない**
- ブランチ `feature/design-tokens-v4-pilot` にすべてコミット済み

## スコープ外（この計画では実施しない）

- 残り 345 アプリへの適用（SP2）
- ThemeToggle の実装（SP3）
- `.docs/DESIGN.md` / `design-audit.js` / `CLAUDE.md` の改訂（SP4）
- `apps/url-encoder` のレイアウト・機能の変更（DS-002 のバックリンク欠落も**直さない** — 移行と無関係な変更を混ぜると G10 の比較基準が壊れる）
- 本番デプロイ
- `packages/router` / `scripts/build-all.sh` の変更
