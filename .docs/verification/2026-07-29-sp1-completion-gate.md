# 動作検証レポート: SP1 Task 6 完了ゲート

## 結論

- G1〜G10: **全項目 PASS**
- **裁定後の総合判定: SP1完了**。Task 6独立検証で未知3の証跡矛盾を検出して訂正した。55 tests PASSの数値は正しかったが内訳記述が実測と異なった。
- 未知3は部分確定である。`@import "shadcn/tailwind.css"` は解決してbuildがexit 0、button / card / inputの直接testはPASS、`Toaster` は`App.tsx`でmountされApp testもPASSした。一方、`Select` はurl-encoder未使用でstoriesのみのため未検証であり、v3前提UI components全体の互換性は完全確定として扱わない。
- 未使用shadcn componentsは、それらを使うappのSP2移行時に目視+testで検証し、未検証を検証済み扱いしない。

## 実行環境（再現性の前提）

- 検証日時: 2026-07-30T02:19:28+09:00
- 対象HEAD: `f16abd841af4a30afc33cc37028ff21588a48975`
- branch: `feature/design-tokens-v4-pilot`
- OS: Darwin 25.3.0 arm64
- Node.js: v24.18.1
- pnpm: 10.32.1
- Git: 2.50.1
- 対象: `apps/url-encoder`
- 実行可否: ✅ G1〜G10を実行、⚠️未知第3項目に直接実行の残あり
- 初期worktree: `git status --short --untracked-files=all` は出力なし
- 初期監査JSON blob: `1f9b823b2d4f350fbccdb11e90a6b3c62edc173b`
- 初期Vite設定 blob: `428e6ce7492216bead87ea945533190d2ca6f1ae`
- 初期base source: `9:  base: './',`

## 成功基準（rubric・実行前に定義）

- G1: 古い`dist`が存在しない状態からbuildがexit 0となり、生成CSSが実在する。
- G2: 生成CSSに`App.tsx`固有の`max-w-6xl`が存在する。
- G3: 生成CSSに`oklch(`が存在し、`hsl(var(--`が存在しない。
- G4: 生成CSSのlight primaryが数値として`oklch(0.55 0.18 255)`と一致する。
- G5: asset gateが346/346・成果物違反0で、sourceがexact `base: './'`である。
- G6/G7: light/dark PNGが実在・非空で、検証表に未記入・FAILがなく、画像自体を実見して表示破綻がない。
- G8: url-encoderとdesign-tokensの対象テストがexit 0となる。
- G9: briefに列挙された対象だけのscoped checkがexit 0となる。
- G10: design auditが既知のDS-002を1件だけ報告しexit 1となる。更新JSONは直後にexact復元する。
- 総合: G1〜G10がPASSし、未知5項目は直接実測の範囲で記録する。未知3は部分確定とし、未使用componentの未検証を完全確定へ拡張しない。

## G1〜G10の実行結果

| Gate | 判定 | 単独コマンドとexit code | 主要出力・実体 |
|---|---|---|---|
| G1 ビルド成立 | PASS | `rm -rf apps/url-encoder/dist` → ハーネスがプロセス起動前に拒否、exit codeなし。代替の`rm -r apps/url-encoder/dist` → 0。`test ! -e apps/url-encoder/dist` → 0。`pnpm --filter url-encoder build` → 0。`find apps/url-encoder/dist/assets -maxdepth 1 -type f -name '*.css' -print` → 0 | 1,689 modules。`index-CQ3WOB66.css` 31.48kB、実サイズ31,481 bytes、SHA-256 `dd1ee7531e262dad04efec1f7a5a80081d10806d82a83526f3d0ddc6457381ee`。build 231ms。woff2は5ファイル生成。 |
| G2 コンテンツ検出 | PASS | `node scripts/verify-v4-migration.js --app=url-encoder` → 0。`rg -o -F '.max-w-6xl' apps/url-encoder/dist/assets/index-CQ3WOB66.css` → 0 | `✅ url-encoder`、`検証: 1 / 1 PASS`。生成CSSから`.max-w-6xl`を実検出。 |
| G3 oklch移行 | PASS | `node scripts/verify-v4-migration.js --app=url-encoder` → 0。`rg -c -F 'oklch(' apps/url-encoder/dist/assets/index-CQ3WOB66.css` → 0。`rg -F 'hsl(var(--' apps/url-encoder/dist/assets/index-CQ3WOB66.css` → 1 | `oklch(`あり。`hsl(var(--`検索のexit 1は期待どおり「残存なし」を示す。 |
| G4 青primary | PASS | `node scripts/verify-v4-migration.js --app=url-encoder` → 0。`rg -o -- '--primary:[^;]*' apps/url-encoder/dist/assets/index-CQ3WOB66.css` → 0 | `--primary:oklch(55% .18 255)`とdarkの`--primary:oklch(72% .14 255)`を実検出。verifierの数値比較もPASS。 |
| G5 アセットパス | PASS | `node scripts/check-asset-paths.js` → 0。`rg -n -F "base: './'" apps/url-encoder/vite.config.ts` → 0 | `vite.config.ts : 346 / 346`、`ビルド成果物 : 346アプリを検査、違反0件`、`✅ 問題なし`。sourceは9行目にexact `base: './',`。 |
| G6 light目視 | PASS | `ls .docs/verification/` → 0。`file .docs/verification/2026-07-29-sp1-url-encoder-light.png` → 0。`wc -c .docs/verification/2026-07-29-sp1-url-encoder-light.png` → 0。`view_image(path="/Users/nishikawa/projects/naoto24kawa/tools-worktrees/sp1-design-tokens/.docs/verification/2026-07-29-sp1-url-encoder-light.png", detail="original")` → 成功 | PNG 1440×1185 RGB、40,871 bytes、SHA-256 `739e2561102650d689cc5177011ab00c5190aa3e349cc15a39112c7e771df3e8`。画像を実見し、白背景、見出し、入力枠、青いEncode、secondary、output、focus外縁を確認。表のlight 6観点はすべて記入済みでFAILなし。 |
| G7 dark目視 | PASS | `file .docs/verification/2026-07-29-sp1-url-encoder-dark.png` → 0。`wc -c .docs/verification/2026-07-29-sp1-url-encoder-dark.png` → 0。`view_image(path="/Users/nishikawa/projects/naoto24kawa/tools-worktrees/sp1-design-tokens/.docs/verification/2026-07-29-sp1-url-encoder-dark.png", detail="original")` → 成功 | PNG 1440×1185 RGB、40,275 bytes、SHA-256 `174934855837997159dc877a259e9fc71424532846cfeb4efa74c5152adb6446`。画像を実見し、暗背景、明色文字、明るい青のEncode、入力・Card・Outputの境界を確認。表のdark 4観点はすべて記入済みでFAILなし。 |
| G8 既存テスト | PASS | `pnpm exec vp test apps/url-encoder/src` → 0。`pnpm exec vp test packages/design-tokens/src` → 0 | url-encoder: 5 files / 55 tests PASS。design-tokens: 2 files / 23 tests PASS。url-encoder実行時に`TimeoutNaNWarning`は出たがテスト結果は全件PASS。 |
| G9 scoped check | PASS | `pnpm exec vp check packages/design-tokens/package.json packages/design-tokens/tsconfig.json packages/design-tokens/src/contrast.ts packages/design-tokens/src/__tests__/contrast.test.ts packages/design-tokens/src/__tests__/tokens.test.ts apps/url-encoder/package.json apps/url-encoder/src/index.css pnpm-lock.yaml scripts/verify-v4-migration.js` → 0 | `All 8 files are correctly formatted`、`Found no warnings, lint errors, or type errors in 4 files`。root全体checkは実行していない。 |
| G10 DS非回帰 | PASS | `node scripts/design-audit.js --app=url-encoder` → 1。`git restore --source=HEAD -- .docs/design-audit-result.json` → 0。`git diff -- .docs/design-audit-result.json` → 0 | 期待どおりDS-002「バックリンクがない」1件のみ。MUST違反1件・警告0件。監査後blob `14ea69...`から初期blob `1f9b823...`へexact復元し、最終差分なし。 |

判定ラベル: PASS / FAIL / 未確認。

## 実測で確定した未知5項目

| # | 項目 | 判定 | 実測結果 |
|---|---|---|---|
| 1 | v4コンテンツ自動検出 | PASS | app側CSSは`@import "@tools/design-tokens";`の1行だけで、生成CSSにApp固有の`.max-w-6xl`が実在した。`@source`は不要。 |
| 2 | Rolldown-Vite × `@tailwindcss/vite` | PASS | Vite 8.0.16、`plugins: [react(), tailwindcss()]`でclean buildがexit 0となった。 |
| 3 | `shadcn/tailwind.css`とv3前提UI components | **部分確定** | `@import "shadcn/tailwind.css"` は解決してbuild成功。button / card / inputの直接testはPASSし、`Toaster` は`App.tsx`でmountされApp testもPASSした。実際の5 test filesはApp/encoder/button/card/inputであり、55 tests PASSの数値は正しいが、旧手順書の「Toast / Selectを含む5 test files」は証跡と一致しなかった。`Select` はurl-encoder未使用でstoriesのみのため未検証であり、全`components/ui/*.tsx`のランタイム互換を完全確定とはしない。 |
| 4 | `tw-animate-css`置換 | PASS | tokens側import、lockfileの`tw-animate-css@1.4.0`、生成CSS中の上記4 animation文字列を確認。 |
| 5 | `base: './'`維持 | PASS | sourceのexact記述、asset gate 346/346、成果物違反0を確認。 |

## 補助検査で観測した既存問題

指定rubric外の補助検査として`pnpm exec vp check --no-fmt apps/url-encoder/src`を実行したところ、exit 1、77 errors / 4 warningsとなった。

主な内容は、未変更の既存テストにおけるjest-dom matcher型不足、未使用import、未変更の`App.tsx`のcatch引数である。`main`との差分上、`apps/`の変更はurl-encoderの移行5パスのみで、これら診断対象のApp・テストファイルは今回の変更対象ではない。

この補助検査はbriefがG9として指定した検証経路ではなく、G9のscoped checkは別途exit 0であるため、G9をFAILへ変更しない。ただし、既存エラーを含む広い検査がSP2のゲートとしてそのまま使えない点は引き継ぐ必要がある。

## スコープ境界

実行コマンド:

- `git diff --stat main -- apps/` → 0
- `git diff --name-status main -- apps/` → 0
- `git diff --name-status main..HEAD -- apps/` → 0
- app directory count → 346

変更は以下の5パスだけだった。

```text
M apps/url-encoder/package.json
D apps/url-encoder/postcss.config.js
M apps/url-encoder/src/index.css
D apps/url-encoder/tailwind.config.js
M apps/url-encoder/vite.config.ts
```

したがって他345アプリの変更はない。`git diff --check main..HEAD`もexit 0だった。

## 主セッション（claude）による独立検証

| 項目 | 主セッション | 本検証との比較 |
|---|---|---|
| scope | main..HEADのapps差分はurl-encoder 5 filesのみ、他345なし | **一致** |
| G1 CSS | `index-CQ3WOB66.css` 31.48kB、hash同一 | **一致** |
| G1 build時間 | 410ms | 本検証は231ms。**不一致**だが時間は成功基準外であり、生成CSS名・サイズ・hashは一致。 |
| G1 Geist woff2 | 2件 | 本検証のbuild出力は5件。**不一致**。G1はCSS生成を基準とするためGate判定には影響しないが、観測対象の定義を揃える必要がある。 |
| G2/G3/G4/V3 | verifier 1/1 PASS | **一致** |
| G5 | base 346/346、成果物346、違反0 | **一致** |
| G8 url-encoder | 5 files / 55 tests PASS | **一致** |
| design-tokens | 2 files / 23 tests PASS | **一致** |
| G6/G7 | PNG2枚を実見しlight/dark各観点PASS | **一致** |
| G9 | 未実行 | 比較不能。本検証のfresh実測はPASS。 |
| G10 | Task 2時点でDS-002 1件を確認 | **一致**。本検証でもDS-002 1件・exit 1。 |

## 三方向導出のクロスチェック結果

- コード: App固有utility、Vite plugin、base、v3設定削除、animation class sourceを確認。
- 画面: light/dark PNGを実見し、Markdownの10観点と照合。
- 型・設定: package、lockfile、tokens CSS、scoped check、asset gateを確認。
- コードにあるが画面から到達できない項目: `Select`はurl-encoderのAppから参照されずstoriesのみで、直接画面検証していない。
- 画面から入力できるがコードで検証していない値: G6/G7の目視範囲では新規の漏れなし。
- スキーマにあるがコードで扱っていないパラメータ: API/OpenAPI対象ではないため該当なし。
- 文書と実体の差: 旧「Toast / Selectを含む5 test files」という記述は実測と異なる。55 tests PASSの数値は正しいが、実際の5 test filesはApp/encoder/button/card/inputである。

## 未到達分岐（網羅の穴・機械的な証拠）

- `verify-v4-migration.js`のG2/G3/G4/G5/V3失敗分岐は、最終HEADのpositive gateでは到達しない。
- `Select` componentのopen/close、keyboard操作、portal表示、animation遷移はどのfreshケースからも到達していない。`Select`はurl-encoder未使用でstoriesのみである。
- この未到達分岐は未知第3項目の未検証境界であり、SP1の完了判定を完全確定へ拡張しない。Select / Dialog / Accordion等を使うappのSP2移行時に目視+testで検証する。

## 想定と違った点

- exact `rm -rf apps/url-encoder/dist`は実行ハーネスが事前拒否した。対象を変えず`rm -r`へ切り替え、不存在を`test ! -e`で確認してからbuildした。
- build時に`vite:react-swc`の`esbuild` option deprecated warningが出た。
- url-encoder test時に`TimeoutNaNWarning`が出たが55 testsはPASSした。
- 主セッションとbuild時間およびwoff2観測件数が一致しなかった。
- 5173番は既存の`com.docker` PID 45650がLISTEN中だった。外部プロセスのため停止していない。
- G10は期待どおりexit 1であり、成功表示やexit 0へ読み替えていない。
- 補助的な全src checkは既存エラーによりexit 1となった。指定G9の結果とは分離した。

## SP2への引き継ぎ

- SP1で検証済みはbutton / card / input / Toasterのみである。Select / Dialog / Accordion等の未使用shadcn componentsは未検証であり、それらを使うapp移行時に目視+testを実施し、未検証を検証済み扱いしない。
- 既存の77 errors / 4 warningsを持つ全src checkを、そのままSP2の成功ゲートにしない。移行差分のscoped checkと既存baselineを分離する。
- asset gateはquote-independent化してから一括変換する。
- 例外CSSを持つ6アプリは個別確認する。
- 目視sampling数と未確認数を必ずlogへ出す。
- 日本語本文を持つアプリを少なくとも1件samplingする。
- focus外縁4pxとstandards SHOULD 3pxの差はSP1へ混ぜず、既存ticketの扱いを維持する。
- G10のDS-002 1件は既知baselineであり、SP2移行中に増加させない。
- woff2件数をゲート化する場合、「全生成ファイル数」か「参照されたsubset」かを先に定義する。

## 未列挙・未検証の残（正直な限界）

- pre-migration screenshotがなく、移行前後の直接画像比較は未実施。
- Task 6では新しいdev serverを起動せず、既存の実ブラウザ証跡PNGをfreshに実見した。
- unused component全件のruntime interactionは未実施。
- root全体checkはbriefの禁止に従い未実行。

## 復元不変条件・クリーンアップ

- 最終`git status --short --untracked-files=all`: 出力なし。
- 最終HEAD: `f16abd841af4a30afc33cc37028ff21588a48975`（初期と同一）。
- 最終branch: `feature/design-tokens-v4-pilot`（初期と同一）。
- 監査JSON最終blob: `1f9b823b2d4f350fbccdb11e90a6b3c62edc173b`（初期と同一）。
- `git diff -- .docs/design-audit-result.json`: 出力なし。
- Vite設定最終blob: `428e6ce7492216bead87ea945533190d2ca6f1ae`（初期と同一）。
- base source: `base: './'`（初期と同一）。
- plan、brief、source、HEAD、branch、stageは変更していない。
- `dist`はclean buildで再生成済み。
- 5174番LISTEN確認: `lsof` exit 1・出力なし。検証者が起動したlistenerは残っていない。
- 5173番の外部`com.docker` listenerは変更していない。
- repo内`*.tmp`: なし。
- `/tmp/sp1-task6-verification`だけに検証ログとPNGコピーを保存した。
- Git commit、stage、deploy、外部送信、他app変更、Docker停止は実施していない。

## 申し送り候補

- `.docs/actions/`登録候補: unusedなv3 UI component、特に`Select`の直接render・操作検証を追加する。
- brain記録候補: なし。今回の検証経路・asset gate・baseline分離は既存文書に記載済み。
