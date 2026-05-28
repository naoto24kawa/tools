# UI共通化 設計ドキュメント

## 概要

328個のアプリに重複する shadcn/ui コンポーネント（button.tsx ×328 など）を
`packages/ui` に集約し、Storybook をビジュアルカタログとして活用する。

## 目標

- コンポーネント重複の解消（保守コスト削減）
- Storybook によるデザイン統一の担保
- 複合コンポーネントを将来追加できる土台の整備

## 現状分析

| コンポーネント | 重複数 |
|---|---|
| button.tsx | 328 |
| label.tsx | 327 |
| card.tsx | 327 |
| input.tsx | 323 |
| toaster.tsx | 320 |
| toast.tsx | 320 |
| select.tsx | 315 |
| textarea.tsx | 10 |
| switch.tsx | 4 |
| slider.tsx | 2 |

既存の Storybook 設定（`.storybook/main.ts`）はすでに
`packages/**/src/**/*.stories.*` を読むため、**追加設定ゼロ**で統合できる。

## 採用アーキテクチャ：フラットな `packages/ui`

### パッケージ構造

```
packages/ui/
  src/
    primitives/          ← shadcn/ui コンポーネントの集約
      button.tsx
      card.tsx
      input.tsx
      label.tsx
      select.tsx
      toast.tsx
      toaster.tsx
      textarea.tsx
      switch.tsx
      slider.tsx
      index.ts
    components/          ← 複合コンポーネント（将来追加）
      index.ts
    index.ts             ← 全体の barrel export
  package.json           ← name: "@tools/ui"
  tsconfig.json
  tailwind.config.js
```

外部からは `import { Button } from "@tools/ui"` でアクセスする。

### 不採用案と理由

| 案 | 不採用理由 |
|---|---|
| 2層パッケージ分割（ui-primitives / ui-components） | パッケージ数が増えメンテコストが上がる |
| packages/router に同居 | router とUIは責務が異なる |

## 段階的移行フロー

### Phase 0（初期実装）
1. `packages/ui` パッケージを作成
2. shadcn/ui primitives を集約（apps/url-encoder のコンポーネントを正典として使用）
3. `packages/ui/src/primitives/*.stories.tsx` を作成
4. pnpm workspace に `packages/ui` を登録

### Phase 1（新規アプリ対応）
5. `scripts/create-app.js` を更新
   - `@tools/ui` からインポートする構成に変更
   - per-app の `src/components/ui/` を生成しない

### Phase 2（既存アプリ移行・任意タイミング）
6. 移行スクリプト（または手動）で既存アプリを順次移行
7. 移行済みアプリの `apps/*/src/components/ui/` を削除

**Phase 0 完了時点で既存 328 アプリは一切変更しない。破壊的変更なし。**

## Storybook 統合方針

```
移行後:
  packages/ui/src/primitives/button.stories.tsx  ← 正典（ここだけメンテ）
  apps/*/src/components/ui/button.stories.tsx    ← 移行済みアプリから順次削除
```

Storybook はコンポーネントのビジュアルカタログ兼デザイン統一の検証基盤として機能する。

## 技術スタック

- React 18 + TypeScript strict（既存アプリと同一）
- Tailwind CSS 3.4（既存アプリと同一設定を参照）
- shadcn/ui / Radix UI（既存コンポーネントをそのまま移動）
- Vite（パッケージビルド用）
- pnpm workspace

## 成功基準

- `pnpm storybook` を起動すると `packages/ui` のコンポーネントが表示される
- 新規アプリが `@tools/ui` からインポートできる
- 既存アプリのビルドが壊れない

## リスク

| リスク | 対策 |
|---|---|
| Tailwind の purge 設定が apps と packages/ui で競合 | packages/ui の tailwind.config.js で content パスを明示 |
| pnpm workspace のシンボリックリンクで Vite が解決できない | vite.config の resolve.alias または dedupe 設定で対処 |
| 将来 shadcn/ui がバージョンアップした際の一元管理 | packages/ui のみ更新すれば全アプリに伝播する（利点でもある） |
