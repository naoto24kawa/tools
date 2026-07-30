---
trigger: next-session
created: 2026-07-29
autonomy: manual
---

# check-asset-paths.js がクォート種別で誤検知する（SP2 の前提条件）

`scripts/check-asset-paths.js` は `apps/*/vite.config.ts` の `base` をソーステキストの完全一致で判定している。

```js
const EXPECTED_BASE = "'./'";          // シングルクォートを含む文字列
const actual = m[1].replace(/,$/, '').trim();
if (actual !== EXPECTED_BASE) { /* violation */ }
```

このため `base: "./"`（ダブルクォート）は **runtime では完全に同値なのに violation として exit 1** になる。

## なぜ問題になるか

`vp check --fix` を `vite.config.ts` にかけると Oxfmt がクォートを `"` に正規化する。
root `vite.config.ts` に `fmt` 設定が無く、Oxfmt の既定が double quote のため。
（root `vite.config.ts` 自身も `"vite-plus"` / `"happy-dom"` と double quote で書かれている）

結果として「フォーマッタをかける」と「アセットパス検査が通る」が両立しない。
SP1 では `apps/url-encoder/vite.config.ts` をフォーマット対象外にして回避したが、
SP2 で 346 アプリの `vite.config.ts` を機械変換するため、この衝突は全アプリで顕在化する。

## 実害の性質

白画面事故を防ぐ最重要のゲートが、**意味を持たない字面の差異で誤検知する**。
誤検知するゲートは「またあれか」と無視される訓練を生み、本物の違反を見逃す土壌になる。

## 対応案

### 案 A: check-asset-paths.js をクォート非依存にする（推奨）

```js
const actual = m[1].replace(/,$/, '').trim().replace(/^["']|["']$/g, '');
if (actual !== './') { /* violation */ }
```

違反メッセージの期待値表示も `./` に合わせる。ゲートが意味を見るようになるので本質的。

### 案 B: root vite.config.ts に fmt.singleQuote を追加する

```js
fmt: { singleQuote: true },
```

リポジトリ全体のフォーマット方針が変わる。既存 9074 ファイルの formatting issue の内訳も変わるため影響が読みにくい。
なお CLAUDE.md の「コーディング規約」は既に「Oxfmt: single quotes」と書いており、
**設定を追加する方がドキュメントの記述と実態が一致する**という利点はある。

### 案 A + B の併用

ゲートを意味ベースにしつつ、規約どおりのフォーマットに揃える。最も整合的だが影響範囲は最大。

## 判断が必要な点

- SP2 の着手前に決着させる必要がある（346 アプリの vite.config.ts を触るため）
- CLAUDE.md の「Oxfmt: indent 2 spaces, single quotes, semicolons, line width 100」が
  実態（設定なし = Oxfmt 既定 = double quote）と食い違っている件も併せて整理する

## 検出の経緯

SP1（`docs/superpowers/specs/2026-07-29-design-standards-adoption-design.md`）の
Task 2 で `apps/url-encoder/vite.config.ts` に `@tailwindcss/vite` を追加し、
scoped `vp check --fix` をかけた際に検出した。
