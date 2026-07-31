# standards デザイン要件の適用 — 設計ドキュメント

**対象**: SP1（基盤 + パイロット実証）
**上位文脈**: `elchika-inc/standards` の `DESIGN.md` を Elchika Tools（346 アプリ）へ適用する
**作成日**: 2026-07-29

---

## 1. 背景と現状の実測

standards `DESIGN.md` は React SPA の UI デザインルールを定めており、Elchika Tools の 346 アプリはその適用対象である。適用にあたり現状を実測した。

| 項目 | standards の規定 | tools 実測値 | 差 |
|---|---|---|---|
| Tailwind | v4（`@tailwindcss/vite`）MUST | 3.4 × 346 アプリすべて | 大 |
| カラー | oklch CSS 変数 + `@theme inline` MUST | hsl 変数 + `tailwind.config.js` 参照 | 大 |
| ダークモード | class 切替 MUST・未保存時 `prefers-color-scheme` | トークンと `darkMode: ['class']` は 345 アプリにあるが、切替の実装は 4 アプリのみ | 大 |
| `success` / `warning` トークン | 標準セットに含む | 未定義 | 中 |
| フォント | Geist Variable SHOULD・和文フォールバック | 未設定（OS 依存） | 中 |
| `--radius` | 0.625rem・7 段階スケール | 0.5rem・段階なし | 小 |
| ブランドノブ（`--primary` の hue） | 立ち上げ時に決める SHOULD | 無彩色デフォルトのまま（ブランド判断が未実施） | 小 |
| §11 shadcn 判断基準 / §12 ブランド性格 | 規定あり | tools の DS-001〜010 に該当なし | 中（文書） |
| i18n（ja デフォルト）/ Storybook | MUST / SHOULD | 充足済み | — |

補足となる実測:

- `src/index.css` は **340 アプリが md5 完全一致**（shadcn デフォルト）。残り 6 個のみ差分を持つ。機械変換が効く構造。
- ダークモードの切替を実装しているのは `depth-of-field` / `golden-ratio` / `html-to-markdown` / `xml-to-json` の 4 アプリのみ。残り 342 は `.dark` トークンを持ちながら `.dark` が付く経路が存在せず、**定義が死んでいる**。
- ブランド色のハードコード（16 進カラー）はコードベースに 1 件も存在しない。
- ランタイムは Vite 8.0.0（Rolldown）。移行に必要な npm パッケージはすべて実在を確認済み（`@tailwindcss/vite@4.3.3` / `tw-animate-css@1.4.0` / `@fontsource-variable/geist@5.3.0` / `shadcn@4.16.0`）。

## 2. 決定事項

| # | 決定 | 選択理由 |
|---|---|---|
| D1 | Tailwind v4 + oklch へ**全面移行**する | standards への完全準拠を優先する判断 |
| D2 | トークンは `packages/design-tokens` に**共通化**する | 次回以降のトークン変更を 1 ファイルで済ませる。346 ファイル一括書き換えの再発を防ぐ |
| D3 | 共有 ThemeToggle を**全アプリのヘッダへ展開**する | standards §4 を完全に満たし、死んでいる `.dark` トークンを生かす |
| D4 | `--primary` は**青系** `oklch(0.55 0.18 255)` | 開発者向けユーティリティの定番。status 色との意味衝突が起きにくく、リンク色とも整合する |
| D5 | 文書は **standards を正本**とし、`.docs/DESIGN.md` は差分のみ持つ | 二重管理によるドリフトを避ける |

## 3. 全体の分解

346 アプリ × ビルド構成変更は 1 スペックに収まらないため 4 つのサブプロジェクトに分割する。**本 spec が扱うのは SP1 のみ**。

```
SP1  基盤 + パイロット実証         ← 本 spec の範囲
      packages/design-tokens 新設
      url-encoder 1 アプリを v4 へ移行し、ビルド〜目視まで通す
      「Rolldown × @tailwindcss/vite が動くか」を実測で確定させる
        ↓ 実測データ（触るファイル・地雷）を SP2 の入力にする
SP2  346 アプリ一括移行（変換スクリプト + 検証ゲート + デプロイ）
        ↓
SP3  ThemeToggle 展開（packages/ui + 346 個の index.html への FOUC 対策）
        ↓
SP4  文書・監査の再編（.docs/DESIGN.md 差分化・design-audit.js の v4 対応）
```

**SP1 を先に切る理由**: 全面移行の方針は決定済みだが、`vite base` 起因で 346 アプリ全白画面という事故が実際に 2 回起きているリポジトリで、未実測のビルド構成変更を 346 個へ同時展開すると検証ゲートが機能しない。SP1 は移行の可否を再検討する場ではなく、**移行手順を実測で確定させる**フェーズである。

## 4. `packages/design-tokens` の設計

### 構成

```
packages/design-tokens/
  package.json     # name: @tools/design-tokens, exports: { ".": "./tokens.css" }
  tokens.css       # oklch トークンの唯一の正本
  README.md        # standards テンプレートとの同期ポリシー
```

移行後、各アプリの `src/index.css` は全 346 個が次の 1 行になる（`@import "tailwindcss"` はトークン側が持つ）。

```css
@import '@tools/design-tokens';
```

### `tokens.css` = standards テンプレート + ブランドノブ差分のみ

正準ソースは standards `templates/design-tokens.css`。tools 側で**変更する行を以下 4 行に限定する**。限定することで、standards テンプレート改訂時の差分マージが機械的に済む。

```css
:root {
  --primary: oklch(0.55 0.18 255);            /* 青 */
  --primary-foreground: oklch(0.985 0 0);
}
.dark {
  --primary: oklch(0.72 0.14 255);            /* 明るい青 */
  --primary-foreground: oklch(0.145 0 0);     /* 暗色テキスト */
}
```

それ以外（`success` / `warning` / `destructive` / `chart-1..5` の無彩色ランプ / `--radius: 0.625rem` の 7 段階 / Geist + 和文フォールバック / `prefers-reduced-motion` ブロック）は standards テンプレートをそのまま採用する。

### コントラスト実計算（standards §3 ブランドノブの MUST）

`--primary` を上書きしたため、WCAG コントラストを実計算で検証した（oklch → sRGB → WCAG 相対輝度）。

| 組み合わせ | 実測比 | 判定 |
|---|---|---|
| light `--primary` × `--primary-foreground` | **4.72:1** | PASS（MUST の 4.5:1 充足） |
| light `--primary` をテキスト色として `--background` 上 | 4.93:1 | PASS |
| light `--primary` をテキスト色として `--muted` 上 | 4.52:1 | PASS（余裕はほぼ無い） |
| dark `--primary` × `--primary-foreground`（暗色） | **7.97:1** | PASS |
| dark で明るい青 + 白文字とした場合（不採用案） | 3.12:1 | FAIL |

この計算から導かれる制約:

- light の L 値 0.55 は**上げられない**。0.57 まで上げると 4.5:1 を割る。この値は固定値として扱う。
- tools の DS-002 は「← Tools トップに戻る」を `text-primary` で描いており、**primary はテキスト色としても使われる**。muted 背景上で 4.52:1 と余裕が乏しいため、`--muted` の値を変更する場合は再計算が必要。
- dark は「明るい primary + 暗い foreground」型を採る（standards テンプレートと同形）。

### 現状トークンからの視覚的変化

| トークン | 現在 (hsl) | 移行後 (oklch) | 影響 |
|---|---|---|---|
| `--primary` | ほぼ黒の濃紺 | 青 | 全アプリのボタン・リンク・フォーカスリングが青に |
| `--radius` | 0.5rem | 0.625rem + 7 段階 | 角がわずかに丸く。`rounded-xl` 等が使用可能に |
| `--muted-foreground` | L 46.9% | 0.54（4.5:1 検証済） | 説明文がわずかに濃く |
| `--success` / `--warning` | 存在しない | 追加 | 現在 `text-green-600` 等で代用している箇所を移行可能に |
| `--chart-1..5` | カラフル | 無彩色ランプ | チャート使用アプリは色のみによる系列識別が不可になる（standards §5 MUST） |
| フォント | 未指定 | Geist + 和文フォールバック | 欧文の見た目が全アプリで変わる |

## 5. SP1 パイロット移行

### 対象

`apps/url-encoder`。最初期テンプレートであり多くのアプリのコピー元。ここで通れば残り 345 個の変換パターンをそのまま定義できる。

### 変更するファイル（1 アプリあたり 5 個）

| ファイル | 操作 |
|---|---|
| `package.json` | `tailwindcss@^3.4` → `^4.3`、`@tailwindcss/vite` 追加、`tailwindcss-animate` → `tw-animate-css`、`@tools/design-tokens: workspace:*` 追加、`postcss` / `autoprefixer` 削除 |
| `vite.config.ts` | `@tailwindcss/vite` プラグイン追加。**`base: './'` は触らない** |
| `tailwind.config.js` | 削除（v4 は CSS-first 設定） |
| `postcss.config.js` | 削除 |
| `src/index.css` | `@import '@tools/design-tokens';` の 1 行に置換 |

### 実測で確定させる未知

推測で設計を固めず、パイロットで実際に動かして確定させる項目。

1. **v4 のコンテンツ自動検出**が `node_modules/@tools/design-tokens/tokens.css` から `@import "tailwindcss"` した場合にアプリの `src/` を走査するか。走査しなければ `@source '../src'` の明示が必要になり、アプリ側 `index.css` は 2 行になる。
2. **Rolldown-Vite × `@tailwindcss/vite`** が動作するか（Vite 8.0.0 / plugin 4.3.3）。
3. `@import "shadcn/tailwind.css"` の実体と、v3 前提で書かれた `src/components/ui/*.tsx` がそのまま動作するか。
4. `tailwindcss-animate` → `tw-animate-css` の置換で既存アニメーション className が壊れないか。
5. `base: './'` が維持されるか（`vite.config.ts` を触るため、既知の白画面事故の直撃点）。

### 検証ゲート — 成功基準 rubric

「ビルドが通った」を完了の根拠にしない。**全項目 PASS で初めて SP1 完了**とする。検証コマンドに pipe を挟まない。

| # | 検証項目 | 判定方法 |
|---|---|---|
| G1 | ビルドが成立 | `vp build` が exit 0 かつ `dist/assets/*.css` が生成される |
| G2 | **コンテンツ検出が効いている** | 生成 CSS に `App.tsx` 固有クラス（例 `max-w-7xl`）の定義が実在する。検出が外れると CSS は生成されるがユーティリティが空になり、**ビルド成功のまま画面が崩れる**。v4 移行最大の静かな失敗点 |
| G3 | oklch へ移行済み | 生成 CSS に `oklch(` が出現し、`hsl(var(--` が残っていない |
| G4 | 青が適用されている | 生成 CSS 中の `--primary` の定義に `oklch(0.55 0.18 255)` が現れる（ビルダが sRGB フォールバックを併記する可能性があるため完全一致ではなく含有で判定する） |
| G5 | アセットパス無事 | `node scripts/check-asset-paths.js` が PASS |
| G6 | light 目視 | ブラウザで実際に開き、ヘッダ・ボタン・入力欄が意図通り。スクリーンショットを証跡として残す |
| G7 | dark 目視 | `.dark` を付与した状態で同上。透明度合成によるコントラスト崩壊がないこと |
| G8 | 既存テスト | `vp test` が exit 0 |
| G9 | lint / format | `vp check` が PASS |
| G10 | 既存 DS ルール非回帰 | `node scripts/design-audit.js --app=url-encoder` の違反数が移行前と同数以下 |

### 失敗時の扱い

- **G2 が落ちる** → `@source` ディレクティブの明示を試す。アプリ側 `index.css` が 2 行になるだけでスコープ内。
- **Rolldown 非対応が判明** → `@tailwindcss/postcss` 経由を試す。それも不可なら事実を `.docs/risk-registry.md` に記録し、その時点でスコープ判断を相談する。
- **G5 が落ちる** → 即ロールバック。この事故は過去 2 回再発しており、`.docs/ASSET_PATH_INCIDENT.md` が正本。

### 作業形態と成果物

`feature/design-tokens-v4-pilot` ブランチで作業する。SP1 の成果物は次の 3 点。

1. `packages/design-tokens`
2. 移行済みの `url-encoder` 1 アプリ
3. 実測で確定した変換手順書（SP2 の変換スクリプトの仕様となる）

**残り 345 アプリには触らない。**

## 6. 後続サブプロジェクトの概要

本 spec のスコープ外だが、SP1 の設計判断に影響するため概要を記録する。

### SP2：346 アプリ一括移行

- `scripts/migrate-tailwind-v4.js` を作る。**冪等**（再実行で二重適用しない）・**再開可能**（途中失敗でも完了済みアプリを skip）。
- 340 アプリは `index.css` が md5 完全一致のため機械変換が効く。残り 6 個は差分を読んだうえで個別対応する。
- SP1 の rubric を全アプリへ自動実行する。G6 / G7（目視）は全数実施が不可能なためサンプリングし、**何個確認して何個未確認かを必ず log に出す**（サイレントな打ち切りは「全部見た」と読まれるため）。
- `build-all.sh` → `packages/router/public/` 更新 → デプロイ後に参照 URL を実 GET して content-type まで確認する（CLAUDE.md「デプロイ後の確認」）。

### SP3：ThemeToggle 展開

- `packages/ui` に `ThemeToggle` / `useTheme` を追加する。
- localStorage キーは `tools-theme`（standards §4 の `<product>-theme`、slug はリポジトリ名）。未保存時は `prefers-color-scheme` に従う。
- 346 アプリはすべて `tools.elchika.app` の同一オリジンで配信されるため、**localStorage が全アプリで共有される**。1 つのアプリでテーマを選ぶと他アプリにも引き継がれる。
- **FOUC 対策**: React マウント後に `.dark` を付けると初期表示が一瞬白く光る。`index.html` の `<head>` に同期 inline script を置いて初期クラスを決める必要があり、346 個の `index.html` を触る作業になる。
- DS-002 でヘッダ構造が統一されているため、トグルの挿入位置は機械的に決まる。

### SP4：文書・監査の再編

- `.docs/DESIGN.md` を「standards `DESIGN.md` が正本」のポインタ + tools 固有 DS（バックリンク・OGP・meta description・コンテナ幅）に絞る。
- standards §12 に従い、**Elchika Tools のブランド性格を 4〜6 行**で tools 側 `DESIGN.md` に記述する（青を選んだ意図の言語化）。
- `design-audit.js` を v4 前提へ更新する（`hsl(var(` 残存検知、arbitrary value 検知、`ring-[3px]` を standards §5 の許可済み例外として除外）。
- `CLAUDE.md` の技術スタック記述（Tailwind CSS 3.4）を更新する。

## 7. スコープ境界

**含む**: SP1 のみ — `packages/design-tokens` の新設、`url-encoder` 1 アプリの移行、変換手順書の確定。

**含まない（明示的に除外）**:

- 残り 345 アプリへの適用（SP2）
- ThemeToggle の実装・展開（SP3）
- 文書と監査スクリプトの改訂（SP4）
- 各アプリのレイアウト・機能の変更（本移行は実装方式の置換であり、UI 再設計ではない）
- 本番デプロイ（SP1 はブランチ上で完結。デプロイは SP2 で 346 個が揃ってから）
- standards 側の改訂（適用中に standards の不備を見つけた場合は記録に留め、別途起票する）

## 8. リスク

| リスク | 内容 | 対応 |
|---|---|---|
| R1 | **設計まで到達して展開されない**。`.docs/plans/ui-commonization-design.md` は 328 アプリの shadcn コンポーネントを `packages/ui` へ集約する設計だったが、実際に依存しているアプリは 3 個にとどまり展開されていない | SP1 の成果物に「変換手順書」を含め、SP2 が仕様の再設計から始まらないようにする。トークン共通化は CSS の `@import` 1 行で解決され、コンポーネント共通化のような React 二重ロード（URISK-006）や型解決の問題を持たないため、展開の技術的障壁は低い |
| R2 | アセットパス破壊による全アプリ白画面 | `vite.config.ts` の `base: './'` を触らない。G5 で機械検査（`.docs/ASSET_PATH_INCIDENT.md` が正本） |
| R3 | v4 のコンテンツ検出漏れによる無言の CSS 欠落 | G2 を検証ゲートに組み込む。ビルド成功を根拠にしない |
| R4 | Rolldown が `@tailwindcss/vite` に非対応 | SP1 で早期に判明する。`@tailwindcss/postcss` 経由を代替として試す |
| R5 | チャート使用アプリで系列が判別不能になる | `chart-1..5` が無彩色ランプになるため、standards §5 の MUST（色のみで系列を区別しない）に従い直接ラベル・パターンを併用する。SP2 で対象アプリを洗い出す |
| R6 | Geist 導入による欧文の見た目変化 | 意図した変化。G6 / G7 の目視で許容範囲か確認する |
