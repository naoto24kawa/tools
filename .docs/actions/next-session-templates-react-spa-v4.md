---
trigger: next-session
created: 2026-07-31
autonomy: manual
---

# templates/react-spa が v3 構成のまま — 新規アプリを作ると Tailwind 混在が復活する

## 背景

SP2（`main` へマージ済み、`6335c6dd`）で全 346 アプリを Tailwind v4 + `@tools/design-tokens` へ移行した。
しかし**新規アプリ作成テンプレートは移行対象に含まれていない**（SP2 計画のスコープ外）。

`node scripts/create-app.js` は React アプリのとき `templates/react-spa/` をコピーする
（`scripts/create-app.js:377`）。このテンプレートは 2026-07-31 時点で次を持つ v3 構成である。

```
templates/react-spa/
  tailwind.config.js   ← v3 の残骸
  postcss.config.js    ← v3 の残骸
```

このため**新規アプリは v3 で生成され、SP2 で解消した混在が 1 アプリ目から復活する**。

## やること

`templates/react-spa/` を v4 構成へ移行する。手順は移行済みアプリと同一で、
正本は `.docs/plans/tailwind-v4-migration-guide.md`（「1 アプリあたりの変換手順」）。

- `package.json`: `@tools/design-tokens` を dependencies へ、`tailwindcss` を `^4.3.3` へ、
  `@tailwindcss/vite` を追加、`autoprefixer` / `postcss` / `tailwindcss-animate` を削除
- `vite.config.ts`: `tailwindcss()` を plugins 末尾へ追加。**`base: './'` は変更しない**
- `src/index.css`: 全内容を `@import "@tools/design-tokens";` の 1 行に置換
- `tailwind.config.js` / `postcss.config.js` を削除

## 完了条件

1. `ls templates/react-spa/tailwind.config.js` と `ls templates/react-spa/postcss.config.js` が
   どちらも「該当なし」（exit 1）
2. `node scripts/create-app.js` で試作アプリを作り、そのアプリに対して
   `node scripts/migrate-tailwind-v4.js --app=<name> --dry-run` が
   「変換 0 / skip 1 / blocked 0」を返す（＝生成時点で既に v4）
3. 試作アプリが `pnpm --filter <name> build` で exit 0（build と dev の filter 実行は正しい）
4. 試作アプリを削除し、`git status --short` が clean

## 注意

- 検証コマンドを `;` や `&&` で連結しない。各コマンドを単独実行して exit code を見る
- 現時点の回避策は「アプリ作成直後に `node scripts/migrate-tailwind-v4.js --app=<name>` を実行」であり、
  `.docs/plans/tailwind-v4-migration-guide.md` の冒頭に記載済み。
  テンプレート移行が完了したら**その回避策の記述も削除する**

## 出典

`.docs/verification/2026-07-30-sp2-completion-gate.md` の「申し送り」
