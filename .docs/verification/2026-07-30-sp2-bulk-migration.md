# SP2 Tailwind v4 一括移行 検証レポート

## 結論

- 全 346 アプリを古い `dist` がない状態からビルドし、`scripts/verify-v4-migration.js` は **346 / 346 PASS**、アセットパス検査は **346 / 346・違反 0 件**だった。
- 全アプリテストは計画どおり exit 1 だった。移行前 baseline と同じ **6 failed / 1 error / 6815 passed** で、移行由来の追加失敗はなかった。
- デザイン監査は移行前 baseline と同じ **MUST 336 アプリ / 1161 件、SHOULD 2 アプリ / 5 件**で、非回帰を確認した。監査が更新した JSON は検査後に復元した。
- agent-browser で **5 / 346 アプリ**を light / dark の両方で目視した。**残り 341 アプリは未目視**であり、機械検証のみ通過している。
- 総合判定は PASS。ただし全 346 アプリの表示を目視したという意味ではない。

## 実行環境

- 検証日時: 2026-07-30 23:00:33 JST
- 対象 HEAD: `f0332086a973ad1a7ff3a417f913eab191531348`
- branch: `feature/sp2-tailwind-v4-bulk-migration`
- Node.js: `v24.18.1`
- pnpm: `10.32.1`
- agent-browser viewport: 1440 × 1000
- 目視 URL: 各アプリの preview 起動ログが示した `http://127.0.0.1:4173/`

## Step 1〜6 の実行結果

各コマンドは pipe や連結を使わず単独で実行した。

| Step | コマンド | exit code | 判定 | 主要出力・実体 |
|---|---|---:|---|---|
| 1 | `find apps -maxdepth 2 -name dist -type d -exec rm -r {} +` | 0 | PASS | 全アプリの既存 `dist` を削除した。 |
| 1 | `find apps -maxdepth 2 -name dist -type d` | 0 | PASS | 出力なし。古い成果物が残っていないことを確認した。 |
| 2 | `bash scripts/build-all.sh` | 0 | PASS | 最終出力 `All apps built successfully!`。全 346 アプリを再ビルドした。 |
| 3 | `node scripts/verify-v4-migration.js` | 0 | PASS | `検証: 346 / 346 PASS`。 |
| 4 | `node scripts/check-asset-paths.js` | 0 | PASS | `vite.config.ts : 346 / 346 が base: './'`、`ビルド成果物 : 346 アプリを検査、違反 0 件`。 |
| 5 | `pnpm exec vp test apps` | 1 | PASS（既知 baseline と同一） | 10 failed / 684 passed test files、6 failed / 6815 passed / 5 skipped tests、1 error。失敗内訳と passed 数は移行前と同一。 |
| 6 | `node scripts/design-audit.js` | 1 | PASS（既知 baseline と同一） | compliant 10 / 346、MUST 336 アプリ / 1161 件、SHOULD 2 アプリ / 5 件。移行前から増加なし。 |
| 6 | `git checkout -- .docs/design-audit-result.json` | 0 | PASS | 監査が更新した `.docs/design-audit-result.json` を復元した。 |

## Step 5 テストの baseline 比較

| 分類 | 移行前 baseline | 移行後 | 判定 |
|---|---:|---:|---|
| failed tests | 6 | 6 | 同一 |
| passed tests | 6815 | 6815 | 減少なし |
| skipped tests | 5 | 5 | 同一 |
| error | 1 | 1 | 同一 |

既知の failed tests は次の 6 件だった。

- `k8s-yaml-generator`: 1 件
- `geo-distance`: 1 件
- `markdown-to-slides`: 1 件
- `file-rename-batch`: 2 件
- `nato-phonetic`: 1 件

既知の 1 error は wasm 依存の次の 5 test files に対応する。

- `bcrypt-hash`
- `hash-crc32`
- `hash-md5`
- `sql-playground`
- `zip-creator`

失敗件数・対象・passed 数が baseline と一致したため、新規失敗を移行前へ戻して再現確認する切り分けは不要だった。移行由来の失敗は 0 件と判定した。

## Step 6 デザイン監査の baseline 比較

| 分類 | 移行前 baseline | 移行後 | 判定 |
|---|---:|---:|---|
| compliant | 10 / 346 | 10 / 346 | 同一 |
| MUST | 336 アプリ / 1161 件 | 336 アプリ / 1161 件 | 同一 |
| SHOULD | 2 アプリ / 5 件 | 2 アプリ / 5 件 | 同一 |

exit 1 は既存の監査違反を表す想定済みの結果であり、今回の判定条件は「違反が baseline から増加していないこと」とした。

## Step 7 目視サンプリング

agent-browser で 5 アプリを操作し、light / dark のスクリーンショット計 10 枚を取得後、画像そのものを再度確認した。

| アプリ | 選定理由 | 操作・確認結果 | 判定 |
|---|---|---|---|
| `json-formatter` | 既定形の代表 | 有効な Format primary と Minify secondary、本文、入力・出力枠、カード角丸を確認。light primary は `oklch(0.55 0.18 255)` / 白文字、dark は `oklch(0.72 0.14 255)` / 暗色文字。 | PASS |
| `image-trim` | `.checkerboard` のカスタム CSS | 透明 40 × 40 PNG の中央に赤い 20 × 20 領域を持つ fixture を実際に読み込み、元画像とトリミング後の checkerboard、活性化した Download primary、枠線と角丸を確認。 | PASS |
| `text-counter` | destructive token の統一 | 日本語本文を入力し、light/dark の「テキストをクリア」destructive、checked Switch、textarea と card の境界・角丸を確認。primary button はこのアプリの UI に存在しない。 | PASS（primary は確認不能） |
| `text-code-case` | config を持たなかった構成 | `hello world` を入力し `helloWorld` の出力、有効な Copy Result primary、モード選択、入力・出力枠、本文を確認。 | PASS |
| `text-kana-converter` | 日本語本文の和文フォールバック | 日本語を入力し、ひらがなからカタカナへの自然な変換結果、有効な Copy Result primary、本文・ラベル・枠線・角丸を確認。 | PASS |

ボタン variant はサンプル全体で次のとおり確認した。

- primary: `json-formatter`、`image-trim`、`text-code-case`、`text-kana-converter`
- secondary: `json-formatter` の Minify
- destructive: `text-counter` の「テキストをクリア」
- checked control: `text-counter` の Switch

`text-counter` には primary button が存在しないため UI は追加せず、既存 destructive / Switch / border の確認に限定した。これは見落としではなく、アプリ構成による確認限界である。

### computed style の代表値

| 対象 | light | dark |
|---|---|---|
| primary background | `oklch(0.55 0.18 255)` | `oklch(0.72 0.14 255)` |
| primary foreground | `oklch(0.985 0 0)` | `oklch(0.145 0 0)` |
| standard border | `oklch(0.922 0 0)` | `oklch(1 0 0 / 0.15)` |
| `text-counter` destructive background | `oklch(0.505 0.213 27.518)` | `oklch(0.704 0.191 22.216)` |
| `text-counter` destructive foreground | `oklch(0.985 0 0)` | `oklch(0.145 0 0)` |

### スクリーンショット

| アプリ | light | dark |
|---|---|---|
| `json-formatter` | [light](sp2-screenshots/json-formatter-light.png) | [dark](sp2-screenshots/json-formatter-dark.png) |
| `image-trim` | [light](sp2-screenshots/image-trim-light.png) | [dark](sp2-screenshots/image-trim-dark.png) |
| `text-counter` | [light](sp2-screenshots/text-counter-light.png) | [dark](sp2-screenshots/text-counter-dark.png) |
| `text-code-case` | [light](sp2-screenshots/text-code-case-light.png) | [dark](sp2-screenshots/text-code-case-dark.png) |
| `text-kana-converter` | [light](sp2-screenshots/text-kana-converter-light.png) | [dark](sp2-screenshots/text-kana-converter-dark.png) |

## 目視範囲の限界

- 目視したのは **5 / 346 アプリ**である。
- **341 アプリは未目視**で、ビルド・migration verifier・asset gate・テスト baseline・デザイン監査の機械検証だけを通過している。
- 5 アプリでは light / dark の両方、活性状態のボタン、本文・ラベル、入力欄・カード枠、角丸、コントラスト、個別要件を確認した。
- 画像比較用の移行前スクリーンショットはないため、移行前後の pixel diff は実施していない。

## 想定と違った点・警告

- `pnpm exec vp test apps` と `node scripts/design-audit.js` は計画どおり exit 1 だった。exit code を成功へ読み替えず、baseline の件数と対象が一致することで非回帰を判定した。
- build 中に `vite:react-swc` の `esbuild` option deprecated warning と、一部アプリで 500 kB を超える chunk warning が出た。いずれも build を止めず、移行検証の新規 failure ではなかった。
- `git diff --cached --check` は exit 2 で、96 個の `packages/router/public/**/assets/*.js` に trailing whitespace 458 件を検出した。すべて clean build が生成した JavaScript 内の空白で、authored source や本レポートの違反ではない。生成物を直接整形すると再 build で上書きされるため、成果物は手修正していない。
- `text-counter` には primary button が存在しなかった。画面を変更せず、destructive / checked Switch / border を確認した。
- `image-trim` は静的表示だけでなく画像 fixture を読み込ませ、`.checkerboard` が実際に描画される経路まで到達させた。

## 成果物

- `packages/router/public`: clean build で全 346 アプリ分を再生成した。
- `.docs/verification/sp2-screenshots`: light / dark の PNG 計 10 枚を保存した。
- preview server と agent-browser session は検証後に停止した。
