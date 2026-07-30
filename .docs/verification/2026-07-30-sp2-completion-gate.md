# SP2 完了ゲート記録

## 結論

SP2（全 346 アプリの Tailwind v4 + oklch トークン移行）は完了と判定した。
クリーンビルドからの全ゲートが計画の期待値どおりで、テスト・デザイン監査は移行前 baseline と同一だった。

ただし配信されない v3 時代の残骸が `packages/router/public/` に 1390 ファイル残っている（後述）。
これは SP2 のスコープ外だが、SP2 が直接生んだ残骸であるため申し送る。

## 実行者と、その理由

本ゲートは Claude が直接実行した。既定は実装・テスト実行を実装エージェントへ委譲することであり、
これはその例外にあたるため理由を記録する。

- Task 4 完了報告（`4c7d239b`）の直後にターミナルが落ち、委譲先の codex `sp2-impl` セッションが消滅した
- 成果物はすべてコミット済みで worktree は clean だったため、失われたのは検証の途中経過だけだった
- Task 6 は Task 4 とほぼ同じコマンド列であり、Claude が直接回すことで
  **Task 4 の独立検証を兼ねられる**（実行者を分けることが検証の独立性になる）
- 上記を提案し、ユーザーの承認を得て実行した

## Task 6 Step 1〜4 の実行結果

各コマンドは pipe や `;` / `&&` の連結を使わず単独で実行し、そのコマンド自身の exit code を確認した。

| Step | コマンド | exit | 判定 | 実体 |
|---|---|---:|---|---|
| 1 | `find apps -maxdepth 2 -name dist -type d -exec rm -r {} +` | 0 | PASS | 全アプリの `dist` を削除 |
| 1 | `find apps -maxdepth 2 -name dist -type d` | 0 | PASS | 出力なし。古い成果物なし |
| 1 | `bash scripts/build-all.sh` | 0 | PASS | `All apps built successfully!`、`vp build` 実行 346 回 |
| 2 | `node scripts/verify-v4-migration.js` | 0 | PASS | `検証: 346 / 346 PASS` |
| 2 | `node scripts/check-asset-paths.js` | 0 | PASS | `vite.config.ts : 346 / 346 が base: './'`、ビルド成果物 346 アプリ・違反 0 件 |
| 2 | `pnpm exec vp test apps` | 1 | PASS（baseline 同一） | 6 failed / 6815 passed / 5 skipped / 1 error |
| 2 | `pnpm exec vp test packages/design-tokens/src` | 0 | PASS | 2 files / 26 tests PASS |
| 2 | `node scripts/design-audit.js` | 1 | PASS（baseline 同一） | compliant 10 / 346、MUST 336 / 1161 件、SHOULD 2 / 5 件 |
| 2 | `git checkout -- .docs/design-audit-result.json` | 0 | PASS | 監査が書き換えた JSON を復元 |
| 3 | `node scripts/migrate-tailwind-v4.js --dry-run` | 0 | PASS | `変換 0 / skip 346 / blocked 0` |
| 3 | `ls apps/*/tailwind.config.js` | 1 | PASS | `no matches found`。v3 設定が 0 件（**exit 1 が期待値**） |
| 3 | `ls apps/*/postcss.config.js` | 1 | PASS | 同上 |
| 4 | `git status --short` | 0 | PASS | 出力なし |

### テストの baseline 比較

件数だけでなく**失敗している対象**まで移行前と一致することを確認した。

| 分類 | baseline | 今回 | 判定 |
|---|---:|---:|---|
| failed tests | 6 | 6 | 同一 |
| passed tests | 6815 | 6815 | 減少なし |
| skipped | 5 | 5 | 同一 |
| error | 1 | 1 | 同一 |

失敗 6 件の対象: `nato-phonetic` 1 / `markdown-to-slides` 1 / `k8s-yaml-generator` 1 /
`geo-distance` 1 / `file-rename-batch` 2。いずれもロジックのテストでスタイルとは無関係。
1 error に対応する wasm 依存 5 file: `bcrypt-hash` / `hash-crc32` / `hash-md5` /
`sql-playground` / `zip-creator`。10 failed test files = 上記 5 file + wasm 5 file で整合する。

## Task 4 の独立検証（Claude が実施）

| 検証 | 方法 | 結果 |
|---|---|---|
| ビルドの再現性 | クリーンビルド後の `git status` | clean。Task 4 の成果物とバイト一致する成果物が再生成された |
| `public/` が実際に再生成されたか | ファイル mtime | 2785 ファイルが今回のビルドで更新済み。「差分なし」が古いファイルの残留ではないことを確認 |
| アプリ数 | `public/` 直下のディレクトリ数 | 346 |
| 目視証跡の実在性 | PNG を Claude 自身が閲覧 | `text-counter` light/dark、`json-formatter` light を確認。light と dark は別画像で、レポートの記述と一致 |
| サンプリングの明示 | 検証レポートの記述 | 「5 / 346 目視、341 未目視」が明記されている |

`text-counter` は light で暗い赤の destructive、dark で明るい赤 + 暗色文字、checked Switch の青、
和文フォールバックを確認した。`json-formatter` light は primary（青地に白文字）と
secondary（白地に枠線）の対比を確認した。

## 発見事項

### 1. `public/` に v3 時代のアセットが 1390 ファイル残留している

`scripts/build-all.sh` は `cp -r "$app/dist/"* "packages/router/public/$app_name/"` で
**既存を消さずに上書きコピー**する。移行でファイル名ハッシュが変わったため、v3 時代の
アセットが削除されずに残り、git 管理下に入っている。

| 分類 | ファイル数 |
|---|---:|
| `public/` 総数 | 4175 |
| 今回のビルドで再生成された | 2785 |
| 再生成されなかった（v3 の残骸） | 1390（js 1018 / css 371 / html 1） |

残骸が v3 であることは実測で確定した。残骸側の CSS 5 件はすべて `oklch` 0 件・`hsl(` 1 件、
現行側の CSS 5 件はすべて `oklch` 1 件・`hsl(` 0 件で、新旧がきれいに分離している。

**配信への影響はない。** 各アプリの `index.html` は現行アセットだけを参照しており、
`check-asset-paths.js` が 346 / 346・違反 0 件を確認している。
実害はリポジトリと Workers Static Assets に死んだファイルが載り続けること。

SP2 のスコープ外（計画の完了条件に残骸削除は含まれない）のため ACCEPTED_RISK とし、
別途の掃除を申し送る。

### 2. `packages/router/public/index.html` は到達不能な残骸

このファイルは `/assets/index-C_IdhBag.js` と `/assets/index-DUDTGCXP.css` を参照するが、
`public/assets/` は `fc9e5609 fix: remove orphaned public/assets/` で削除済みで実在しない。
本番でも `https://tools.elchika.app/assets/index-C_IdhBag.js` は 404 を返す。

ただしルーターが `/` を `/home/` へ 302 リダイレクトするため、この HTML は配信されない
（`https://tools.elchika.app/home/` は 200 / text/html）。**SP2 とは無関係の既存状態**であり、
白画面事故にはなっていない。紛らわしいので削除を検討する価値はある。

### 3. `vp check` に Markdown だけを渡すと必ず exit 1 になる

Task 5 Step 4 の `pnpm exec vp check --no-fmt CLAUDE.md .docs/plans/...md` が exit 1 になった。
原因は `error: Linting could not start / No files found to lint` で、
**`--no-fmt` は整形を止めるだけで Markdown を lint 対象にはしない**ため対象 0 件になる。
同じ引数に JS を 1 つ加えると exit 0 になることで、ドキュメント側の不備ではないと裏取りした。
計画の Expected（PASS）が誤りだった。この事実は `CLAUDE.md` に追記した（`e521f076`）。

## ACCEPTED_RISKS

| # | 内容 | 受容理由 |
|---|---|---|
| 1 | 341 / 346 アプリが未目視 | 機械検証（ビルド・移行 verifier・asset gate・テスト baseline・デザイン監査）を全数通過。全数目視は費用に見合わない |
| 2 | `public/` に v3 残骸 1390 ファイル | 配信されず実害がない。削除は SP2 のスコープ外 |
| 3 | 移行前後の pixel diff 未実施 | 移行前スクリーンショットが存在しない。computed style の実測値で代替した |
| 4 | 生成 JS 96 ファイルの trailing whitespace 458 件（`git diff --cached --check` が exit 2） | すべてビルドが生成した JavaScript 内の空白。手修正しても再ビルドで巻き戻る |

## 申し送り（SP2 完了直後に対応が必要）

- **`templates/react-spa/` がまだ v3 構成**（`postcss.config.js` / `tailwind.config.js` を持つ）。
  このまま新規アプリを作ると v3 で生成され、せっかく解消した混在が復活する。**最優先**
- `public/` の v3 残骸 1390 ファイルの掃除と、`build-all.sh` がコピー前に
  アプリのディレクトリを消すようにするか（残骸の再発防止）
- `packages/router/public/index.html` の扱い（到達不能な残骸）
- 本番デプロイは本計画のスコープ外。デプロイ手段の確認は
  `.docs/actions/after-deploy-pr837-deploy-workflow-verify.md` を参照
