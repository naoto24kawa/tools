# Tailwind v4 移行手順書（SP2 の仕様）

> **状態**: SP2 で全 346 アプリの移行が完了した（2026-07-30）。
> 本書は新規アプリ作成時の参照と、移行時に判明した地雷の記録として残す。
>
> **ただし `templates/react-spa/` は 2026-07-30 時点でまだ v3 構成である**
> （`tailwind.config.js` と `postcss.config.js` を持つ）。`node scripts/create-app.js` の
> React テンプレートはこれをコピーするため、**新規アプリは v3 で生成され、混在が復活する**。
> テンプレートが v4 化されるまでは、作成した直後に
> `node scripts/migrate-tailwind-v4.js --app=<name>` を実行して v4 へ揃えること。

SP1（url-encoder パイロット）で実測して確定した手順。SP2 の
`scripts/migrate-tailwind-v4.js` はこの手順を機械化する。

## 実測で確定した事実

| # | 未知だった項目 | 実測結果 |
|---|---|---|
| 1 | v4 のコンテンツ自動検出がアプリの src/ を走査するか | 機能した。`src/index.css` を `@import "@tools/design-tokens";` の1行だけにして build し、`App.tsx:52` に実在する `max-w-6xl` が生成CSSに1件あった。`@source` は不要である。初回の `max-w-7xl` 0件は、sourceに存在しないclassをprobeにした偽陰性であり撤回済みである。 |
| 2 | Rolldown-Vite で `@tailwindcss/vite` が動くか | 機能した。`plugins: [react(), tailwindcss()]` のまま `pnpm --filter url-encoder build` がexit 0となり、Vite 8.0.16がCSSを生成した。 |
| 3 | shadcn/tailwind.css の import が必要か / v3 前提の components/ui が動くか | **部分確定**。`@import "shadcn/tailwind.css"` は `@tools/design-tokens` 内で解決して build がexit 0となった。button / card / input の直接testはPASSし、`Toaster` は `App.tsx` でmountされApp testもPASSした。`Select` はurl-encoderでは未使用でstoriesのみのため未検証であり、v3前提components全体の互換性は完全確定として扱わない。 |
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

- verifier の引数はapps scanより前に全件をparse・validateする。SP1では空の `--app=` が引数なしmodeへfallbackし、重複 `--app` と未知optionが無視され、path separator付きの値が正規化されて、いずれも別modeまたは別targetとして偽PASSした。不正入力をall-migrated modeへ落としてはならない。
- 移行済み判定はcomment除去後のactiveな完全 `@import "@tools/design-tokens";` statementで行う。substring判定ではcomment内だけの文字列でもstaleなbuild成果物を検査して偽PASSした。single/double quoteと合理的なwhitespaceだけを許容し、SP1の1-line契約を広げない。
- G4は正しい値が1件あるかを `some()` で見るのではなく、生成CSSの `--primary` 宣言がlight/darkの2件だけであることを先に検証する。SP1では正しいlight/dark宣言の後に別の `:root` 再定義を追加しても `some()` が真となり、cascade後の値が誤っていても偽PASSした。
- contrast用のOKLCH parserは入力全体をdecimal grammarで照合し、終了括弧なし・末尾garbage・alpha付き値を拒否する。SP1のalpha付き値はdarkの `--border` と `--input` だけでcontrast testの計算対象外だったが、prefix matchのままでは将来の未対応値を有効色として偽解析する。
- packageに壊れたtest scriptを公開しない。`@tools/design-tokens` のpackage cwdではrootのVite+ test設定を失うため、testの正本はリポジトリルートから実行する `pnpm exec vp test packages/design-tokens/src` とし、package側の `test` scriptは置かない。
- 新規workspaceパッケージには `../../tsconfig.base.json` をextendsした `tsconfig.json` が必要である。root `tsconfig.json` はCloudflare型だけに限定され、Nodeの型を持たないため継承しない。Node APIを使うpackageは `compilerOptions.types` に `node` を明示する。
- G4はexact stringから `parseFloat` と緩いregex、`Number` と `\S+`、decimal grammar + `Number` へ段階的に厳密化した。数値パースは変換関数だけでなく字句文法でも決まり、検証コード自体が壊れやすい。negativeとpositiveの両方で証明する。
- focus外縁は実測4pxで、344アプリが共有する既存のv3時代shadcn実装である。standards §5の3pxはSHOULDであり、SP1の対象外として別ticketにした。SP2でこの実装の修正を要求しない。
- secondary buttonはlight背景との面の比が1.09:1、dark背景との面の比が1.31:1、secondary前景text比が16.42:1だった。形は判別しづらいがtext/functionは明確である。standards値であり移行回帰ではないためissue化しない。secondaryを多用するアプリはSP2のsampling判断材料とする。

## SP2 の実施で判明したこと

- **移行前の `vite.config.ts` には 2 形状があった。** `plugins: [react()]` が 341 件、
  `plugins: [react(), wasm()]` が 4 件（`bcrypt-hash` / `hash-crc32` / `hash-md5` / `zip-creator`）である。
  後者は既存の `wasm()` を保持したまま**末尾に** `tailwindcss()` を追加する必要がある。
  `[react()]` だけを想定した置換は wasm 系 4 アプリを黙って取りこぼすか、`wasm()` を消す。
  `scripts/migrate-tailwind-v4.js` は `/^(\s*)plugins: \[react\(\)(, wasm\(\))?\],$/m` で
  両形状を 1 つの正規表現で扱い、どちらにも一致しないアプリは blocked として停止する（fail-closed）。
- **一括変換スクリプトの判定基準を、変換対象のファイルから実行時に読んではならない。**
  「既定形かどうか」を実在アプリの `index.css` を読んで基準にすると、
  **基準アプリ自身を変換した瞬間に基準が変わり**、以降のすべてのアプリが「一致しない」と判定される（自己破壊）。
  基準は SHA-256 のような不変の定数としてスクリプト内に持つ
  （`BASELINE_INDEX_CSS_SHA256 = 2dc6990ea59b03c14aeada34837ec04166918c9842c984293d242d9615f266a2`）。
  これは一括変換に固有の罠で、1 アプリずつ手作業していた SP1 では顕在化しなかった。

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
- SP1で検証済みはbutton / card / input / Toasterのみである。Select / Dialog / Accordion等の未使用shadcn componentsは未検証であり、それらを使うapp移行時に目視+testを実施し、未検証を検証済み扱いしない。
