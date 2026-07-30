# 動作検証レポート: SP1 最終完了ゲート

## 結論

- 対象HEAD `82ee0db612e7cf366313531965572ea51efc79f4` に対し、G1〜G10はすべてPASS。
- 追加のfail-closed確認、contrast negative tests、スコープ検査、不変条件検査もPASS。
- ACCEPTED_RISKS: 0。
- 総合判定: **SP1完了**。
- 未知3は従来どおり部分確定。button / card / input、Toaster mount + App testまでは確認したが、未使用のSelectを含むcomponents全体の互換性へ拡張しない。

## 実行環境（再現性の前提）

- 検証日時: 2026-07-30T03:19:18+09:00
- 対象HEAD: `82ee0db612e7cf366313531965572ea51efc79f4`
- branch: `feature/design-tokens-v4-pilot`
- OS: Darwin 25.3.0 arm64
- Node.js: v24.18.1
- pnpm: 10.32.1
- build実行時Vite: 8.0.16
- 対象: `apps/url-encoder`、`packages/design-tokens`、移行検証スクリプト
- 実行可否: ✅ G1〜G10および追加確認を実行
- 初期worktree: clean
- 初期監査JSON blob: `1f9b823b2d4f350fbccdb11e90a6b3c62edc173b`
- 初期監査JSON SHA-256: `f15ba1393d9f837e3df4b8dc48f92b50f97ed4dac8b7057261cc68e51f50efe0`
- 初期Vite設定 blob: `428e6ce7492216bead87ea945533190d2ca6f1ae`
- 初期base source: `9:  base: './',`

## 成功基準（rubric・実行前に定義）

- G1: stale `dist`を除去した状態からbuildがexit 0となり、生成CSSが実在する。
- G2: verifierがexit 0となり、生成CSSに`.max-w-6xl`が実在する。
- G3: 生成CSSに`oklch(`があり、`hsl(var(--`がない。
- G4: `--primary`がlight/darkの正確に2宣言で、lightが数値として`0.55 / 0.18 / 255`。
- G5: asset gateが346/346、成果物違反0で、sourceの`base: './'`が維持される。
- G6/G7: light/dark PNGが実在・非空で、10観点に未記入・FAILがなく、画像自体を実見できる。
- G8: url-encoderが5 files/55 tests、design-tokensが2 files/26 testsでexit 0。
- G9: 指定されたscoped checkだけを実行してexit 0。
- G10: design auditが期待どおりexit 1となり、DS-002バックリンク欠落1件のみを報告する。監査JSONは直後にexact restoreする。
- 総合: 1件でもFAILならSP1未完了。
- 追加確認: CLI不正引数が作業開始前にexit 1、package test scriptなし、strict parser negative 10/10、apps差分5パス限定、開始・終了不変条件一致。

## G1〜G10の実行結果

| Gate | 判定 | 単独コマンドとexit code | 主要出力・実体 |
|---|---|---|---|
| G1 clean build | PASS | `test -e apps/url-encoder/dist` → 0、`rm -r apps/url-encoder/dist` → 0、`test ! -e apps/url-encoder/dist` → 0、`pnpm --filter url-encoder build` → 0 | 1,689 modules、`index-CQ3WOB66.css`生成、31,481 bytes、SHA-256 `dd1ee7531e262dad04efec1f7a5a80081d10806d82a83526f3d0ddc6457381ee`、build 223ms。 |
| G2 コンテンツ検出 | PASS | `node scripts/verify-v4-migration.js --app=url-encoder` → 0、`rg -o -F '.max-w-6xl' ...` → 0 | `✅ url-encoder`、`検証: 1 / 1 PASS`。生成CSSに`.max-w-6xl`実在。 |
| G3 OKLCH移行 | PASS | verifier → 0、`rg -c -F 'oklch(' ...` → 0、`rg -F 'hsl(var(--' ...` → 1 | `oklch(`あり。`hsl(var(--`は出力なしで期待どおり不存在。 |
| G4 primary契約 | PASS | verifier → 0、primary抽出用`node -e` → 0 | `count: 2`、値はlight `oklch(55% .18 255)`、dark `oklch(72% .14 255)`。light数値は`0.55 / 0.18 / 255`。 |
| G5 asset/base | PASS | `node scripts/check-asset-paths.js` → 0、source検索 → 0 | `vite.config.ts : 346 / 346`、`ビルド成果物 : 346 アプリを検査、違反 0 件`、sourceはexact `base: './',`。 |
| G6 light目視 | PASS | `file` / `wc -c` / `shasum` → 0、`view_image(detail=original)` → 成功 | PNG 1440×1185 RGB、40,871 bytes、SHA-256 `739e2561102650d689cc5177011ab00c5190aa3e349cc15a39112c7e771df3e8`。白背景、見出し、説明、入力枠、青いEncode、secondary、Output、focus外縁を実見。 |
| G7 dark目視 | PASS | `file` / `wc -c` / `shasum` → 0、`view_image(detail=original)` → 成功 | PNG 1440×1185 RGB、40,275 bytes、SHA-256 `174934855837997159dc877a259e9fc71424532846cfeb4efa74c5152adb6446`。暗背景、明色文字、明るい青のEncode、Card/Input/Output境界を実見。 |
| G8 tests | PASS | `pnpm exec vp test apps/url-encoder/src` → 0、`pnpm exec vp test packages/design-tokens/src` → 0 | url-encoder: 5 files/55 tests。design-tokens: 2 files/26 tests。 |
| G9 scoped check | PASS | 指定された`pnpm exec vp check ...` → 0 | `All 8 files are correctly formatted`、`Found no warnings, lint errors, or type errors in 4 files`。root全体checkは未実行。 |
| G10 design audit | PASS | `node scripts/design-audit.js --app=url-encoder` → 期待exit 1、直後の`git restore --source=HEAD -- .docs/design-audit-result.json` → 0 | DS-002「← Tools トップに戻る」バックリンク欠落1件のみ。MUST 1件、SHOULD 0件。復元後blob/hashは開始時と一致し、diffなし。 |

## 各主要コマンドの実測出力

### G1

```text
$ pnpm --filter url-encoder build
vite v8.0.16 building client environment for production...
transforming...✓ 1689 modules transformed.
dist/assets/index-CQ3WOB66.css  31.48 kB │ gzip: 6.73 kB
dist/assets/index-DJETcWo9.js  253.49 kB │ gzip: 79.80 kB
✓ built in 223ms
exit 0
```

### G2〜G4

```text
$ node scripts/verify-v4-migration.js --app=url-encoder
✅ url-encoder

検証: 1 / 1 PASS
exit 0
```

primaryの独立抽出結果:

```json
{"count":2,"values":["oklch(55% .18 255)","oklch(72% .14 255)"],"light":{"lightness":0.55,"chroma":0.18,"hue":255}}
```

### G5

```text
$ node scripts/check-asset-paths.js
vite.config.ts : 346 / 346 が base: './'
ビルド成果物   : 346 アプリを検査、違反 0 件
✅ 問題なし
exit 0
```

### G8

```text
$ pnpm exec vp test apps/url-encoder/src
Test Files  5 passed (5)
Tests  55 passed (55)
exit 0
```

```text
$ pnpm exec vp test packages/design-tokens/src
Test Files  2 passed (2)
Tests  26 passed (26)
exit 0
```

url-encoder実行時の`TimeoutNaNWarning`はテスト結果と分離して記録した。

contrast単体:

```text
$ pnpm exec vp test packages/design-tokens/src/__tests__/contrast.test.ts --reporter=verbose
Test Files  1 passed (1)
Tests  10 passed (10)
exit 0
```

次のnegative値を含む10件がすべてPASSした。

- 閉じ括弧なし: `oklch(1 0 0`
- 末尾garbage: `oklch(1 0 0)garbage`
- alpha値: `oklch(1 0 0 / 10%)`
- 不正alpha: `oklch(1 0 0 / nope)`

### G9

```text
$ pnpm exec vp check packages/design-tokens/package.json packages/design-tokens/tsconfig.json packages/design-tokens/src/contrast.ts packages/design-tokens/src/__tests__/contrast.test.ts packages/design-tokens/src/__tests__/tokens.test.ts apps/url-encoder/package.json apps/url-encoder/src/index.css pnpm-lock.yaml scripts/verify-v4-migration.js
pass: All 8 files are correctly formatted
pass: Found no warnings, lint errors, or type errors in 4 files
exit 0
```

### G10

```text
$ node scripts/design-audit.js --app=url-encoder
❌ url-encoder (1件)
DS-002  src/App.tsx  "← Tools トップに戻る" バックリンクがない
違反あり (MUST): 1 / 1 (1件)
警告あり (SHOULD): 0 / 1 (0件)
exit 1
```

期待されたbaseline違反のみであるためG10はPASS。

直後に実行:

```text
$ git restore --source=HEAD -- .docs/design-audit-result.json
exit 0
```

復元確認:

- before/after blob: `1f9b823b2d4f350fbccdb11e90a6b3c62edc173b`
- before/after SHA-256: `f15ba1393d9f837e3df4b8dc48f92b50f97ed4dac8b7057261cc68e51f50efe0`
- `git diff -- .docs/design-audit-result.json`: 出力なし

## 最終レビュー5件に対する追加確認

### 1. strict OKLCH parser

- `parseOklch`は文字列全体へstrict matchする。
- 末尾garbage・不完全値・alpha付き値を含むnegative testsが10/10 PASS。
- alphaを不透明色として誤計算する将来経路を遮断した。

### 2. 空・重複・unknown・path separatorのCLI拒否

| ケース | exit | 実測出力 | PASS表示へ進行 |
|---|---:|---|---|
| `--app=` | 1 | `引数エラー: --app の値が空である` | なし |
| `--app=url-encoder --app=does-not-exist` | 1 | `引数エラー: --app は1回だけ指定できる` | なし |
| `--app=url-encoder --unknown-option` | 1 | `引数エラー: 未知の option: --unknown-option` | なし |
| `--app=url-encoder/../url-encoder` | 1 | `引数エラー: --app に path separator は指定できない` | なし |

正常なno-argument全移行済みappモードはexit 0、`検証: 1 / 1 PASS`。

### 3. コメント内importの誤認防止

repo版スクリプトを`/tmp` fixtureへコピーし、SHA-256が双方とも次の値で一致することを確認した。

```text
1487eac20943c08a5d1fa02f0035c634ae52a15ecaf38459864554fb1111b314
```

コメントだけのfixture:

```css
/* @import "@tools/design-tokens"; */
```

実行結果:

```text
$ node /tmp/sp1-final-gate-82ee0db6/fixture/scripts/verify-v4-migration.js --app=comment-only
comment-only は未移行、または存在しない
exit 1
```

### 4. primaryの後勝ちoverride検出

同じ`/tmp` fixtureで3件目のprimaryを追加した生成CSSを検査した。

```text
$ node /tmp/sp1-final-gate-82ee0db6/fixture/scripts/verify-v4-migration.js --app=override
❌ override (1件)
G4  生成 CSS の --primary 宣言は light/dark の2件でなければならない: 3件（共有token外再定義）
検証: 0 / 1 PASS
exit 1
```

positive pathでも実生成CSSのprimaryが正確に2宣言であることを独立抽出済み。

### 5. package test script削除

```text
{"scripts":null,"hasTest":false}
exit 0
```

`packages/design-tokens/package.json`に`test` scriptはない。

## 実測で確定した未知5項目

| # | 項目 | 判定 | 実測結果 |
|---|---|---|---|
| 1 | v4コンテンツ自動検出 | PASS | app側`src/index.css`はdesign-tokens importの1行。clean build後の生成CSSにApp固有`.max-w-6xl`が実在した。 |
| 2 | Rolldown-Vite × `@tailwindcss/vite` | PASS | `plugins: [react(), tailwindcss()]`でVite 8.0.16のclean buildがexit 0。 |
| 3 | `shadcn/tailwind.css`とv3前提UI | **部分確定** | importを解決してbuild成功。button/card/inputの直接testはPASS。`Toaster`はAppでmountされApp testもPASS。SelectはApp・5 test areasから参照されず、実装本体とstoriesのみなので未検証。 |
| 4 | `tw-animate-css`置換 | PASS | tokens内import、lockfileの`tw-animate-css@1.4.0`、生成CSS内の`animate-in`、`slide-in-from-top-2`、`zoom-in-95`、`fade-in-0`を実検出。 |
| 5 | `base: './'`維持 | PASS | source exact記述、asset gate 346/346、成果物違反0、working-tree blobとHEAD blob一致。 |

## スコープ確認

`git diff --name-status main..HEAD -- apps/`の実測結果:

```text
M apps/url-encoder/package.json
D apps/url-encoder/postcss.config.js
M apps/url-encoder/src/index.css
D apps/url-encoder/tailwind.config.js
M apps/url-encoder/vite.config.ts
```

- appsディレクトリ数: 346
- apps差分: url-encoderの5パスのみ
- 他345アプリの差分: なし
- `git diff --check main..HEAD`: exit 0、出力なし
- source `base: './'`: 維持
- repo内`*.tmp`: なし

## 三方向導出のクロスチェック結果

- コードから:
  - CLI引数の空・重複・unknown・path separator分岐。
  - block comment除去後のactive import判定。
  - G2 utility欠落、G3 legacy color、G4 primary宣言数・数値、G5 base、V3設定残存の各分岐。
  - strict OKLCH parserの完全一致条件。
- 画面から:
  - light 6観点、dark 4観点を既存visual reportとPNG実体で照合。
  - 2枚とも`view_image(detail=original)`で開いて確認。
- 型・設定から:
  - package dependencies、Vite plugin、tokens imports、lockfile、scoped check、asset gateを照合。
  - API/OpenAPIスキーマ対象ではないため、APIパラメータのクロスチェックは該当なし。
- コードにあるが画面から到達できない分岐:
  - Selectのopen/close、keyboard、portal、animation。
  - verifierのV3設定残存やCSS不存在などの各異常分岐。
- 画面から入力できるがコードで検証していない値:
  - 今回の移行範囲で新たな漏れは観測していない。
- スキーマにあるがコードで扱っていないパラメータ:
  - API対象外のため該当なし。

## 未到達分岐（網羅の穴・機械的な証拠）

- `readBuiltCss()`がCSS不存在を返す分岐。
- G2の使用utility欠落分岐。
- G3の`oklch(`不存在・`hsl(var(--`残存分岐。
- G5のbase不存在・不一致分岐。
- V3設定ファイル残存分岐。
- Selectのopen/close、keyboard操作、portal表示、animation遷移。
- コメント内import拒否、3件目primary拒否、CLI引数4異常、strict parser negativeは今回到達済み。

## 想定と違った点

- build時に`vite:react-swc`の`esbuild` option deprecated warningが出た。buildはexit 0で生成CSS実体も確認できたため、G1判定とは分離した。
- url-encoder test時に`TimeoutNaNWarning`が出た。5 files/55 testsは全件PASSしており、警告は別記録とした。
- override fixtureの初版で`base`を1行オブジェクトにしたため、製品の行単位base検査にも到達した。実製品と同じ複数行形式へfixtureを修正して再実行し、G4の3宣言だけでexit 1となることを確認した。これは検証経路側の偽失敗としてURISK-046を適用した。
- G10は期待どおりexit 1であり、成功表示やexit 0へ読み替えていない。

## 未列挙・未検証の残（正直な限界）

- pre-migration screenshotがないため、移行前後の直接画像比較は未実施。
- 今回は新しいdev serverを起動せず、保存済みlight/dark PNGをfreshに実見した。
- Selectを含むunused componentsのruntime interactionは未実施。
- root全体checkはrubricどおり未実行。
- fixtureはverifier自体のhash同一性を確認したが、製品repoのsourceやdistを破壊して異常系を再現したものではない。

## 復元不変条件・クリーンアップ

- 最終HEAD: `82ee0db612e7cf366313531965572ea51efc79f4`。開始時と一致。
- 最終branch: `feature/design-tokens-v4-pilot`。開始時と一致。
- 最終`git status --short --untracked-files=all`: 出力なし。
- staged差分: なし。
- 監査JSON最終blob: `1f9b823b2d4f350fbccdb11e90a6b3c62edc173b`。開始時と一致。
- 監査JSON最終SHA-256: `f15ba1393d9f837e3df4b8dc48f92b50f97ed4dac8b7057261cc68e51f50efe0`。開始時と一致。
- 監査JSON diff: なし。
- Vite設定HEAD/working-tree blob: `428e6ce7492216bead87ea945533190d2ca6f1ae`。一致。
- Vite設定diff: なし。
- source base: `9:  base: './',`。
- repo内`*.tmp`: なし。
- `apps/url-encoder/dist`はclean build成果物へ再生成済み。
- 検証fixture・ログ・画像コピーは`/tmp/sp1-final-gate-82ee0db6`だけに保存した。
- repo内ファイルの作成・編集・stage・commit、deploy、外部送信、他app変更、外部プロセス停止は実施していない。

## evidence

- `/tmp/sp1-final-gate-82ee0db6/case01-12-command-results.md`
- `/tmp/sp1-final-gate-82ee0db6/case06-light.png`
- `/tmp/sp1-final-gate-82ee0db6/case07-dark.png`
- `/tmp/sp1-final-gate-82ee0db6/case06-07-visual-check.md`
- `/tmp/sp1-final-gate-82ee0db6/fixture/`

## 申し送り候補

- `.docs/actions/`登録候補: Selectなど未使用v3 UI componentを、それらを使うSP2対象appで直接render・操作検証する。
- brain記録候補: なし。fixtureの実装形状が製品検査経路と異なる場合に起きる偽失敗はURISK-046で既に扱える。
