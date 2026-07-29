# Tailwind v4 移行手順書（SP2 の仕様）

SP1（url-encoder パイロット）で実測して確定した手順。SP2 の
`scripts/migrate-tailwind-v4.js` はこの手順を機械化する。

## 実測で確定した事実

| # | 未知だった項目 | 実測結果 |
|---|---|---|
| 1 | v4 のコンテンツ自動検出がアプリの src/ を走査するか | 機能した。`src/index.css` を `@import "@tools/design-tokens";` の1行だけにして build し、`App.tsx:52` に実在する `max-w-6xl` が生成CSSに1件あった。`@source` は不要である。初回の `max-w-7xl` 0件は、sourceに存在しないclassをprobeにした偽陰性であり撤回済みである。 |
| 2 | Rolldown-Vite で `@tailwindcss/vite` が動くか | 機能した。`plugins: [react(), tailwindcss()]` のまま `pnpm --filter url-encoder build` がexit 0となり、Vite 8.0.16がCSSを生成した。 |
| 3 | shadcn/tailwind.css の import が必要か / v3 前提の components/ui が動くか | `@import "shadcn/tailwind.css"` は `@tools/design-tokens` 内で解決して build がexit 0となった。既存のv3前提のToast / Selectを含む5 test files / 55 testsもPASSした。 |
| 4 | `tailwindcss-animate` → `tw-animate-css` で既存 className が壊れないか | 壊れなかった。生成CSSに既存componentの `animate-in`、`slide-in-from-top-2`、`zoom-in-95`、`fade-in-0` が各1件あり、`tw-animate-css` の実在も確認した。 |
| 5 | `base: './'` が維持されるか | 維持された。`apps/url-encoder/vite.config.ts` は `base: './',` のままで、`check-asset-paths.js` は346 / 346の `base: './'`、違反0件を報告した。 |

## standards テンプレート由来の既知差分

light の `--warning-foreground` は standards テンプレートの暗色値だと warning 背景との
コントラストが 3.92:1 で WCAG AA 未達になるため、明色へ変更している。
standards 側が修正されたら、この差分は解消する。

## 1 アプリあたりの変換手順

### package.json

- dependencies に追加: `"@tools/design-tokens": "workspace:*"`
- devDependencies から削除: `autoprefixer` / `postcss` / `tailwindcss-animate`
- devDependencies を変更: `"tailwindcss": "^4.3.3"`
- devDependencies に追加: `"@tailwindcss/vite": "^4.3.3"`

### vite.config.ts

- import 追加: `import tailwindcss from '@tailwindcss/vite';`
- plugins に `tailwindcss()` を追加
- **`base: './'` は変更しない**

### src/index.css

全内容を以下に置換する。

```css
@import "@tools/design-tokens";
```

`@source` は追加しない。

### 削除するファイル

- `tailwind.config.js`
- `postcss.config.js`

SP1 の実測では `apps/` 配下の旧設定は688件すべて `.js` であり、`.cjs` / `.mjs` /
`.ts` は0件だった。SP2 はこの2ファイル名だけを削除対象とし、他拡張子の設定ファイルが
実在すると確認できた場合にだけ対象を追加する。

## 例外対応が必要なアプリ

移行前の346個の `src/index.css` のうち340個がshadcn既定とmd5一致し、次の6アプリは
一致せず個別確認が必要だった。url-encoderは一致した340個の1つである。

- `image-generate`
- `image-transparent`
- `image-trim`
- `text-code-case`
- `text-counter`
- `text-deduplicate`

## 検証

移行後に必ず個別に実行する。

```bash
pnpm --filter <app> build
node scripts/verify-v4-migration.js --app=<app>
node scripts/check-asset-paths.js
node scripts/design-audit.js --app=<app>
pnpm exec vp test apps/<app>/src
```

各コマンドは個別に実行し、そのコマンド自身の終了コードと出力を確認する。`;`、`&&`、pipe、末尾の `printf` で検証を連結してはならない。別shell の `echo $?` も当該コマンドの終了コードを示さないため使わない。SP2 の346アプリ検証は人手で連結せず、`verify-v4-migration.js` の単一exit codeへ集約する。

`pnpm --filter <app> build` はアプリ自身のVite設定を使うため正しい。テストはリポジトリルートから
`pnpm exec vp test apps/<app>/src` で実行する。使わないのは `pnpm --filter <app> test` だけであり、
これはアプリ cwd の `vite.config.ts` を使い、root の test 設定（`environment: happy-dom` / `setupFiles`）を失うためである。
リポジトリ内のファイルをテストから読む場合は `import.meta.url` を使わず、
`process.cwd()` 基準の `path.resolve` を使う。Vite+ の transform 下では
`import.meta.url` が `file:` スキームにならず、`fileURLToPath` が失敗するためである。

`design-audit.js` は `.docs/design-audit-result.json` を更新する副作用がある。実行後は
`git checkout -- .docs/design-audit-result.json` でこのファイルをexactに戻し、commit対象に含めない。

## format 対象外と検証方法

リポジトリ全体の check は移行前から9074ファイルの既存 formatting issueでexit 1となるため、変更ファイルを明示した scoped check を使う。必要なlint/type検査は `vp check --no-fmt` を使う。

| 対象外 | 理由 | 検証方法 |
|---|---|---|
| `.md` | Markdownはformat対象外である。 | `git diff --check` とreviewで確認する。 |
| standards同期のdesign tokens CSS | formatterではなく、standardsテンプレートとの差分とbehavior testで検証する。 | diff + reviewで確認する。 |
| `apps/*/vite.config.ts` | Oxfmtのquote変更はruntimeでは同値でも、source文字列を比較するasset gateを偽失敗させる。 | `vp check --no-fmt`、literal diff/text読み取り、asset gateで確認する。 |

`check-asset-paths.js` のsource文字列依存gateは、url-encoderだけで `base: './'` がOxfmtにより `base: "./"` に変わったとき、1件を違反判定する偽失敗を起こした。SP2の前提条件として、このgateをquote-independentに直す。

## SP2 で踏む地雷

- 新規workspaceパッケージには `../../tsconfig.base.json` をextendsした `tsconfig.json` が必要である。root `tsconfig.json` はCloudflare型だけに限定され、Nodeの型を持たないため継承しない。Node APIを使うpackageは `compilerOptions.types` に `node` を明示する。
- G4はexact stringから `parseFloat` と緩いregex、`Number` と `\S+`、decimal grammar + `Number` へ段階的に厳密化した。数値パースは変換関数だけでなく字句文法でも決まり、検証コード自体が壊れやすい。negativeとpositiveの両方で証明する。
- focus外縁は実測4pxで、344アプリが共有する既存のv3時代shadcn実装である。standards §5の3pxはSHOULDであり、SP1の対象外として別ticketにした。SP2でこの実装の修正を要求しない。
- secondary buttonはlight背景との面の比が1.09:1、dark背景との面の比が1.31:1、secondary前景text比が16.42:1だった。形は判別しづらいがtext/functionは明確である。standards値であり移行回帰ではないためissue化しない。secondaryを多用するアプリはSP2のsampling判断材料とする。

## SP2 の変換スクリプトへの要求

- **冪等**: 移行済みアプリに再実行しても二重適用しない（`index.css` の `@tools/design-tokens` の有無で判定する）。
- **再開可能**: 途中で失敗しても完了済みアプリをskipして再開できる。
- **側面隔離**: 1アプリの失敗で全体を止めない。失敗したアプリ名を記録して続行する。
- **サイレントな打ち切りの禁止**: 目視をsamplingする場合、何個確認して何個未確認かを必ずlogに出す。

## 目視で見るべき観点

- dev serverのポートは固定しない。Viteの起動ログが示す実ポートで起動時のHTTP 200と停止後の接続失敗を確認する。SP1では5173が外部 `com.docker` に占有され、Viteが5174へ自動退避した。
- 和文fallbackは日本語本文を持つアプリで確認する。url-encoderの `App.tsx` は日本語0件だったため一時DOM probeで補助確認しただけであり、SP2のsamplingには日本語本文を持つアプリを最低1つ含める。
- light/darkとも、有効状態のprimary buttonでforegroundとopacityを確認する。disabled状態だけでは実色を誤判定しうる。
- darkのborder/inputで使用する半透明白は、実背景上で画面とcomputed styleの両方を確認する。
