# SP2: 345 アプリへの Tailwind v4 + oklch トークン一括移行 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** SP1 で確定した変換手順を機械化し、未移行の 345 アプリすべてを Tailwind v4 + `@tools/design-tokens` へ移行して、全アプリが検証ゲートを通る状態にする。

**Architecture:** 冪等・再開可能な変換スクリプトで機械変換し、`scripts/verify-v4-migration.js` の単一 exit code で全アプリを検証する。既定形と完全一致するアプリだけを機械変換の対象とし、一致しないアプリはスクリプトが停止して報告する（fail-closed）。個別対応が必要な 6 アプリは手作業で扱う。

**Tech Stack:** Node.js (CommonJS scripts) / Tailwind CSS v4 (`@tailwindcss/vite@^4.3`) / Vite+ 8 (Rolldown) / pnpm workspaces

**参照:**
- 変換手順の正本: `.docs/plans/tailwind-v4-migration-guide.md`
- SP1 の spec: `docs/superpowers/specs/2026-07-29-design-standards-adoption-design.md`
- SP1 の完了ゲート記録: `.docs/verification/2026-07-29-sp1-completion-gate.md`

## Global Constraints

- **`apps/*/vite.config.ts` の `base` は `'./'` のまま。** 値もクォート種別も変えない。
  `'/'` にすると全アプリが白画面になる（HTML は 200 を返すため気づけない）。正本は `.docs/ASSET_PATH_INCIDENT.md`。
- **`apps/*/vite.config.ts` を整形対象に含めない。** Oxfmt がクォートを変える。
  gate 自体は PR #849 でクォート非依存になったが、差分を最小に保つため整形しない。
- **`packages/design-tokens/tokens.css` を変更しない。** standards テンプレートとの diff が正本。
- **リポジトリ全体の `pnpm check` / `check:fix` を使わない。** 移行前から 9074 ファイルに既存の
  formatting issue があり exit 1 になる。変更ファイルを明示列挙した `pnpm exec vp check <paths...>` を使う。
- **テストは必ずリポジトリルートから `pnpm exec vp test <パス>` で実行する。**
  `pnpm --filter <app> test` は root の test 設定を失う。**build と dev の filter 実行は正しい。**
- **検証コマンドを `;` や `&&` で連結しない。** 各コマンドを単独実行し、そのコマンド自身の exit code を見る。
  別実行の `echo $?` はシェルが独立しているため無効。
- **`scripts/design-audit.js` 実行後は `git checkout -- .docs/design-audit-result.json` で戻す。**
  コミットに含めない。
- **ビルド成果物を検証する前に必ず再ビルドする。** `dist` は gitignore 対象で、
  古い成果物が残っていると「ソースは移行済みなのに成果物が古い」状態で偽の失敗を出す。
- **UI の再設計をしない。** 本移行は実装方式の置換である。レイアウト・機能・コンポーネントの変更を含めない。
- **本番デプロイをしない。** 本計画はブランチ上で完結する。

---

## 実測済みの前提（この計画を書く前に確認した）

| 項目 | 実測値 |
|---|---|
| 未移行アプリ | 345（`tailwindcss@^3` を持つもの） |
| 移行済み | 1（url-encoder） |
| `postcss.config.js` を持つ | 344（`text-code-case` のみ持たない） |
| `tailwind.config.js` を持つ | 344（同上） |
| `tailwind.config.js` が既定形と一致 | 343 / 344（`image-transparent` のみ chart 定義を欠く） |
| `vite.config.ts` の plugins 形状 | `[react()]` 341 件 / `[react(), wasm()]` 4 件（`bcrypt-hash` / `hash-crc32` / `hash-md5` / `zip-creator`） |
| `tailwindcss-animate` を持つ | 345（全未移行アプリ） |
| `src/index.css` が既定形と一致 | 339 / 345 |
| v3 既定形 `index.css` の SHA-256 | `2dc6990ea59b03c14aeada34837ec04166918c9842c984293d242d9615f266a2`（339 件が一致） |
| 1 アプリのビルド時間 | 約 1.4 秒（345 アプリで約 8 分の見込み） |
| `verify-v4-migration.js` の全アプリモード | 移行済み 1 個を検査して PASS |
| `pnpm exec vp test apps`（移行前） | **6 failed / 6815 passed / 5 skipped / 1 error、exit 1**（所要 約 74 秒） |

### テストの移行前ベースライン（重要）

`pnpm exec vp test apps` は**移行前から exit 1 である**。この計画の成功基準は「exit 0」ではなく
「**この既存の失敗から増えていないこと**」とする。内訳は次のとおり。

失敗している 6 テスト（いずれもロジックのテストで、スタイルとは無関係）:

| アプリ | 失敗数 |
|---|---|
| `k8s-yaml-generator` | 1 |
| `geo-distance` | 1 |
| `markdown-to-slides` | 1 |
| `file-rename-batch` | 2 |
| `nato-phonetic` | 1 |

読み込み自体が失敗する 5 ファイル（`Error: "ESM integration proposal for Wasm" is not supported currently.`）:

`bcrypt-hash` / `hash-crc32` / `hash-md5` / `sql-playground` / `zip-creator`

これらは `packages/wasm-utils` に依存するアプリで、`wasm-pack` が未インストールのため
`pkg/` が生成されていないことに起因する（`pnpm install` の postinstall が
`wasm-pack not found` を出す）。**環境依存の既存問題であり、本移行とは無関係。**

## 個別対応が必要な 6 アプリ（実測で確定）

`src/index.css` が既定形と一致しない 6 アプリ。うち `text-code-case` は
`tailwind.config.js` と `postcss.config.js` も持たず、`image-transparent` は
`tailwind.config.js` の chart 定義も欠く。

| アプリ | 差異 | 対応 |
|---|---|---|
| `image-generate` | 末尾に空行 1 つ多いだけ | 機械変換でよい |
| `image-transparent` | `index.css` に chart 定義なし / `tailwind.config.js` にも chart なし | 機械変換でよい（v4 では tokens 側が持つ） |
| `text-code-case` | `index.css` に chart と `.dark` ブロックなし / **`tailwind.config.js` と `postcss.config.js` を持たない** | 削除対象ファイルが存在しない前提で変換 |
| `image-trim` | `index.css` に `.checkerboard` カスタムクラスあり | **カスタム CSS を保持する** |
| `text-counter` | `--destructive` がカスタム値 `0 72% 40%` | standards 値へ統一（下記参照） |
| `text-deduplicate` | 同上 + 末尾空行 | 同上 |

`--destructive` のカスタム値について実計算した結果:

| 値 | 白背景でのコントラスト |
|---|---|
| shadcn 既定 `hsl(0 84.2% 60.2%)`（**344 アプリが使用中**） | **3.76:1 — WCAG AA 未達** |
| `text-counter` / `text-deduplicate` のカスタム値 `hsl(0 72% 40%)` | 6.95:1 |
| standards の `oklch(0.505 0.213 27.518)` | **6.42:1** |

2 アプリのカスタム値は、shadcn 既定が AA を満たさないことへの個別の手当てだった。
standards 値へ統一すると 6.95:1 → 6.42:1 とわずかに下がるが、いずれも AA を満たす。
**移行によって残り 343 アプリが 3.76:1 → 6.42:1 に改善する**ため、統一する。

---

### Task 1: 変換スクリプトの作成と 2 形状での実証

**Files:**
- Create: `scripts/migrate-tailwind-v4.js`
- Modify: `apps/json-formatter/{package.json,src/index.css,vite.config.ts}` / Delete: 同 `{tailwind,postcss}.config.js`
- Modify: `apps/bcrypt-hash/{package.json,src/index.css,vite.config.ts}` / Delete: 同 `{tailwind,postcss}.config.js`
- Modify: `pnpm-lock.yaml`
- Modify: `docs/superpowers/plans/2026-07-30-sp2-tailwind-v4-bulk-migration.md`

**Interfaces:**
- Consumes: `packages/design-tokens`（SP1 で作成済み）、`.docs/plans/tailwind-v4-migration-guide.md` の変換手順
- Produces: CLI `node scripts/migrate-tailwind-v4.js [--app=<name>] [--dry-run]`。
  変換したアプリ名を stdout に 1 行ずつ出力し、スキップしたアプリと理由も出力する。
  1 つでも「既定形と一致しないため変換できない」があれば exit 1。

- [ ] **Step 1: スクリプトを書く**

`scripts/migrate-tailwind-v4.js`:

```js
#!/usr/bin/env node
/**
 * Tailwind v3 → v4 + @tools/design-tokens への一括変換（SP2）
 *
 * 手順の正本: .docs/plans/tailwind-v4-migration-guide.md
 *
 * 設計方針:
 * - 冪等: 移行済みアプリは skip する（index.css の @tools/design-tokens で判定）
 * - fail-closed: 既定形と一致しないファイルは変換せず、理由を出して exit 1 にする。
 *   「たぶん大丈夫」で書き換えると、カスタム CSS を黙って捨てる事故になる
 * - 側面隔離: 1 アプリの失敗で全体を止めない。失敗を集約して最後に報告する
 *
 * 使用方法:
 *   node scripts/migrate-tailwind-v4.js --dry-run
 *   node scripts/migrate-tailwind-v4.js --app=json-formatter
 *   node scripts/migrate-tailwind-v4.js
 */

const fs = require('node:fs');
const { createHash } = require('node:crypto');
const path = require('node:path');

const REPO_ROOT = path.join(__dirname, '..');
const APPS_DIR = path.join(REPO_ROOT, 'apps');

/** 移行後の index.css の全内容 */
const MIGRATED_INDEX_CSS = `@import "@tools/design-tokens";\n`;

/**
 * v3 既定形 index.css の SHA-256。
 * 移行前の apps 配下にある src/index.css のうち 339 件がこの値だった（SP2 着手時の実測）。
 *
 * 実行時に特定アプリのファイルを読んで基準にしてはならない。
 * 基準アプリ自身を変換した瞬間に基準が変わり、以降すべてのアプリが
 * 「一致しない」と判定される（自己破壊）。
 */
const BASELINE_INDEX_CSS_SHA256 =
  '2dc6990ea59b03c14aeada34837ec04166918c9842c984293d242d9615f266a2';

const args = process.argv.slice(2);
const dryRun = args.includes('--dry-run');
const appArg = args.find((a) => a.startsWith('--app='));

if (appArg !== undefined && appArg.slice('--app='.length) === '') {
  console.error('引数エラー: --app の値が空である');
  process.exit(1);
}
const filterApp = appArg ? appArg.slice('--app='.length) : null;
if (filterApp !== null && (filterApp.includes('/') || filterApp.includes(path.sep))) {
  console.error('引数エラー: --app に path separator は指定できない');
  process.exit(1);
}
for (const a of args) {
  if (a !== '--dry-run' && !a.startsWith('--app=')) {
    console.error(`引数エラー: 未知のオプション ${a}`);
    process.exit(1);
  }
}

function read(file) {
  return fs.existsSync(file) ? fs.readFileSync(file, 'utf8') : null;
}

function sha256(source) {
  return createHash('sha256').update(source).digest('hex');
}

/** 移行済みか（冪等性の判定） */
function isMigrated(appDir) {
  const css = read(path.join(appDir, 'src', 'index.css'));
  if (css === null) return false;
  return /^\s*@import\s+["']@tools\/design-tokens["']\s*;/m.test(css);
}

/** package.json を v4 構成へ書き換えた文字列を返す */
function migratePackageJson(source) {
  const pkg = JSON.parse(source);
  pkg.dependencies = pkg.dependencies || {};
  pkg.dependencies['@tools/design-tokens'] = 'workspace:*';
  pkg.dependencies = Object.fromEntries(
    Object.entries(pkg.dependencies).sort(([left], [right]) => left.localeCompare(right))
  );

  const dev = pkg.devDependencies || {};
  delete dev.autoprefixer;
  delete dev.postcss;
  delete dev['tailwindcss-animate'];
  dev.tailwindcss = '^4.3.3';
  dev['@tailwindcss/vite'] = '^4.3.3';
  pkg.devDependencies = Object.fromEntries(
    Object.entries(dev).sort(([left], [right]) => left.localeCompare(right))
  );

  return `${JSON.stringify(pkg, null, 2)}\n`;
}

/** vite.config.ts に tailwindcss プラグインを追加した文字列を返す。base には触らない */
function migrateViteConfig(source) {
  if (source.includes('@tailwindcss/vite')) return source;

  const withImport = source.replace(
    /^(import react from '@vitejs\/plugin-react-swc';)$/m,
    "import tailwindcss from '@tailwindcss/vite';\n$1"
  );
  if (withImport === source) return null;

  const withPlugin = withImport.replace(
    /^(\s*)plugins: \[react\(\)(, wasm\(\))?\],$/m,
    '$1plugins: [react()$2, tailwindcss()],'
  );
  if (withPlugin === withImport) return null;

  return withPlugin;
}

const targets = (filterApp ? [filterApp] : fs.readdirSync(APPS_DIR).sort()).filter((name) => {
  const dir = path.join(APPS_DIR, name);
  return fs.existsSync(dir) && fs.statSync(dir).isDirectory();
});

if (targets.length === 0) {
  console.error(filterApp ? `${filterApp} は存在しない` : 'apps 配下にアプリがない');
  process.exit(1);
}

const migrated = [];
const skipped = [];
const blocked = [];

for (const name of targets) {
  const appDir = path.join(APPS_DIR, name);

  if (isMigrated(appDir)) {
    skipped.push(`${name}: 移行済み`);
    continue;
  }

  const indexCssPath = path.join(appDir, 'src', 'index.css');
  const indexCss = read(indexCssPath);
  if (indexCss === null) {
    blocked.push(`${name}: src/index.css が存在しない`);
    continue;
  }
  if (sha256(indexCss) !== BASELINE_INDEX_CSS_SHA256) {
    blocked.push(`${name}: index.css が既定形と一致しない（個別対応が必要）`);
    continue;
  }

  const pkgPath = path.join(appDir, 'package.json');
  const pkgSource = read(pkgPath);
  if (pkgSource === null) {
    blocked.push(`${name}: package.json が存在しない`);
    continue;
  }

  const viteConfigPath = path.join(appDir, 'vite.config.ts');
  const viteSource = read(viteConfigPath);
  if (viteSource === null) {
    blocked.push(`${name}: vite.config.ts が存在しない`);
    continue;
  }
  const nextVite = migrateViteConfig(viteSource);
  if (nextVite === null) {
    blocked.push(`${name}: vite.config.ts の plugins/import が想定形でないため書き換えられない`);
    continue;
  }

  if (!dryRun) {
    fs.writeFileSync(pkgPath, migratePackageJson(pkgSource));
    fs.writeFileSync(viteConfigPath, nextVite);
    fs.writeFileSync(indexCssPath, MIGRATED_INDEX_CSS);
    for (const f of ['tailwind.config.js', 'postcss.config.js']) {
      const p = path.join(appDir, f);
      if (fs.existsSync(p)) fs.unlinkSync(p);
    }
  }
  migrated.push(name);
}

for (const name of migrated) console.log(`${dryRun ? 'would migrate' : 'migrated'}: ${name}`);
for (const s of skipped) console.log(`skip: ${s}`);
for (const b of blocked) console.error(`blocked: ${b}`);

console.log(
  `\n${dryRun ? '[dry-run] ' : ''}変換 ${migrated.length} / skip ${skipped.length} / blocked ${blocked.length}`
);

process.exit(blocked.length > 0 ? 1 : 0);
```

- [ ] **Step 2: dry-run で対象数を確認する**

Run: `node scripts/migrate-tailwind-v4.js --dry-run`

Expected: 「変換 339 / skip 1 / blocked 6」と表示され exit 1。
blocked の 6 件は `image-generate` / `image-transparent` / `image-trim` /
`text-code-case` / `text-counter` / `text-deduplicate` である。
skip 1 は url-encoder（移行済み）。
`[react(), wasm()]` 形状の 4 アプリも変換対象へ含めた修正後の dry-run で、
この件数と内訳を実測済み（2026-07-30）。

件数が違う場合は作業を止めて報告すること。実測と食い違うのは前提が変わった証拠である。

- [ ] **Step 3: 既定形の代表アプリを実際に変換する**

Run: `node scripts/migrate-tailwind-v4.js --app=json-formatter`

Expected: 「migrated: json-formatter」と表示され exit 0。

- [ ] **Step 4: 変換結果を目で確認する**

Run: `git diff --stat apps/json-formatter`

Expected: `package.json` / `src/index.css` / `vite.config.ts` が変更され、
`tailwind.config.js` と `postcss.config.js` が削除されている。

Run: `git diff apps/json-formatter/vite.config.ts`

Expected: import 行 1 つの追加と plugins 行の変更のみ。**`base: './'` の行に差分がないこと。**

- [ ] **Step 5: 依存をインストールしてビルドする**

Run: `pnpm install`

Expected: exit 0。

Run: `pnpm --filter json-formatter build`

Expected: exit 0。

- [ ] **Step 6: 検証ゲートを通す**

Run: `node scripts/verify-v4-migration.js --app=json-formatter`

Expected: 「✅ json-formatter」/ exit 0。

Run: `node scripts/check-asset-paths.js --config-only`

Expected: 「346 / 346 が base: './'」/ exit 0。

- [ ] **Step 7: 冪等性を確認する**

Run: `node scripts/migrate-tailwind-v4.js --app=json-formatter`

Expected: 「skip: json-formatter: 移行済み」と表示され exit 0。
二重適用されないことの確認である。ここを省略しない。

- [ ] **Step 8: wasm 形状の代表アプリを実証する**

Run: `node scripts/migrate-tailwind-v4.js --dry-run`

Expected: 「変換 338 / skip 2 / blocked 6」と表示され exit 1。
`json-formatter` を移行済みでも基準ハッシュが変わらず、個別対応 6 アプリだけが blocked になること。

Run: `node scripts/migrate-tailwind-v4.js --app=bcrypt-hash`

Expected: 「migrated: bcrypt-hash」と表示され exit 0。

Run: `git diff apps/bcrypt-hash/vite.config.ts`

Expected: import 行 1 つの追加と、plugins の末尾への `tailwindcss()` 追加のみ。
既存の `wasm()` とその順序が保持され、**`base: './'` の行に差分がないこと。**

Run: `pnpm install`

Expected: exit 0。

Run: `pnpm --filter bcrypt-hash build`

Expected: exit 0。

Run: `node scripts/verify-v4-migration.js --app=bcrypt-hash`

Expected: 「✅ bcrypt-hash」/ exit 0。

Run: `node scripts/migrate-tailwind-v4.js --app=bcrypt-hash`

Expected: 「skip: bcrypt-hash: 移行済み」と表示され exit 0。

- [ ] **Step 9: lint を通してコミット**

Run: `pnpm exec vp check scripts/migrate-tailwind-v4.js`

Expected: PASS。formatting issue が出た場合は
`pnpm exec vp check --fix scripts/migrate-tailwind-v4.js` を実行してから再確認する
（新規ファイルなので整形しても無関係な差分は出ない）。

```bash
git add scripts/migrate-tailwind-v4.js apps/json-formatter apps/bcrypt-hash pnpm-lock.yaml docs/superpowers/plans/2026-07-30-sp2-tailwind-v4-bulk-migration.md
git commit -m "feat(scripts): Tailwind v4 一括変換スクリプトを 2 形状で実証

既定形と完全一致するアプリだけを機械変換し、一致しないものは変換せず
理由を出して exit 1 にする（fail-closed）。カスタム CSS を黙って捨てないため。
既定形（json-formatter）と wasm 形状（bcrypt-hash）の両方で動作を確認し、
冪等性（再実行で skip）も実測した。

Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>"
```

---

### Task 2: 既定形の残り 337 アプリの一括変換

**Files:**
- Modify: `apps/<既定形の残り 337 アプリ>/package.json`
- Modify: `apps/<同>/src/index.css`
- Modify: `apps/<同>/vite.config.ts`
- Delete: `apps/<同>/tailwind.config.js`
- Delete: `apps/<同>/postcss.config.js`
- Modify: `pnpm-lock.yaml`

**Interfaces:**
- Consumes: `scripts/migrate-tailwind-v4.js`（Task 1）
- Produces: 既定形アプリがすべて v4 化された状態。Task 4 の全アプリ検証の対象になる

- [ ] **Step 1: 変換前のベースラインを取る**

Run: `node scripts/design-audit.js`

Expected: 全アプリの監査結果が出る。**違反件数を記録すること。** これが Task 4 の比較基準になる。

Run: `git checkout -- .docs/design-audit-result.json`

Expected: exit 0。監査の副作用を戻す。

Run: `pnpm exec vp test apps`

Expected: exit 1。**failed / passed / skipped / error の各件数を記録すること。**
この計画を書いた時点の実測は 6 failed / 6815 passed / 5 skipped / 1 error である。
数字が違っていたら、その実測値を以降の比較基準にすること
（他の作業で状況が変わっている可能性があるため、計画の数字を信じず自分で測った値を使う）。

- [ ] **Step 2: 一括変換する**

Run: `node scripts/migrate-tailwind-v4.js`

Expected: 「変換 337 / skip 3 / blocked 6」と表示され exit 1
（json-formatter と bcrypt-hash は Task 1、url-encoder は SP1 で移行済みのため skip 側にある）。
blocked 6 件は Task 3 で個別対応するため、この exit 1 は想定どおりである。

blocked の内訳が Task 1 Step 2 と同じ 6 アプリであることを確認すること。
増えていたら作業を止めて報告すること。

- [ ] **Step 3: 変更範囲を確認する**

Run: `git status --short`

Expected: 変更は `apps/` 配下と `pnpm-lock.yaml` のみ。
`packages/` `scripts/` `.docs/` に変更がないこと。

Run: `git diff --stat apps/ | tail -1`

Expected: 変更ファイル数が想定どおりであること（残り 337 アプリ × 5 ファイル前後）。

- [ ] **Step 4: base が全アプリで維持されていることを確認する**

Run: `node scripts/check-asset-paths.js --config-only`

Expected: 「346 / 346 が base: './'」/ exit 0。

**ここが落ちたら即座に `git checkout -- apps/` で全て戻し、原因を報告すること。**
この事故はこのリポジトリで過去 2 回起きている。

- [ ] **Step 5: 依存をインストールする**

Run: `pnpm install`

Expected: exit 0。

- [ ] **Step 6: コミット**

```bash
git add -A apps/ pnpm-lock.yaml
git commit -m "feat: 既定形の残り 337 アプリを Tailwind v4 + oklch トークンへ移行

scripts/migrate-tailwind-v4.js による機械変換。index.css が既定形と
完全一致するアプリのみを対象とし、一致しない 6 アプリは対象外。

Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>"
```

---

### Task 3: 個別対応が必要な 6 アプリの移行

**Files:**
- Modify: `apps/image-generate/{package.json,src/index.css,vite.config.ts}` / Delete: 同 `{tailwind,postcss}.config.js`
- Modify: `apps/image-transparent/{package.json,src/index.css,vite.config.ts}` / Delete: 同 `{tailwind,postcss}.config.js`
- Modify: `apps/text-code-case/{package.json,src/index.css,vite.config.ts}`（削除対象の config は存在しない）
- Modify: `apps/image-trim/{package.json,src/index.css,vite.config.ts}` / Delete: 同 `{tailwind,postcss}.config.js`
- Modify: `apps/text-counter/{package.json,src/index.css,vite.config.ts}` / Delete: 同 `{tailwind,postcss}.config.js`
- Modify: `apps/text-deduplicate/{package.json,src/index.css,vite.config.ts}` / Delete: 同 `{tailwind,postcss}.config.js`

**Interfaces:**
- Consumes: Task 2 で移行済みのアプリ群（`index.css` の最終形の参考になる）
- Produces: 全 346 アプリが移行済みの状態

- [ ] **Step 1: 差分の内容を再確認する**

Run: `diff apps/url-encoder/src/index.css apps/image-trim/src/index.css`

Expected: `image-trim` 側に `.checkerboard` のカスタムクラスが存在する。
**このカスタム CSS は移行後も残す必要がある。**

Run: `diff apps/url-encoder/src/index.css apps/text-counter/src/index.css`

Expected: `--destructive` の値が `0 72% 40%` である。

- [ ] **Step 2: カスタム CSS を持たない 4 アプリを変換する**

`image-generate` / `image-transparent` / `text-code-case` / `text-deduplicate` は
`index.css` を移行後の形へ置換してよい（`text-deduplicate` のカスタム `--destructive` は
standards 値へ統一する方針のため保持しない）。

各アプリについて次を行う。`<app>` を順に置き換えて実行すること。

1. `apps/<app>/src/index.css` の全内容を次に置換する:

```css
@import "@tools/design-tokens";
```

2. `apps/<app>/package.json` を編集する:
   - `dependencies` に `"@tools/design-tokens": "workspace:*"` を追加
   - `devDependencies` から `autoprefixer` / `postcss` / `tailwindcss-animate` を削除
   - `devDependencies` の `tailwindcss` を `"^4.3.3"` に変更
   - `devDependencies` に `"@tailwindcss/vite": "^4.3.3"` を追加

3. `apps/<app>/vite.config.ts` を編集する:
   - `import tailwindcss from '@tailwindcss/vite';` を `import react from '@vitejs/plugin-react-swc';` の直前に追加
   - `plugins: [react()],` を `plugins: [react(), tailwindcss()],` に変更
   - **`base: './'` には触らない**

4. `apps/<app>/tailwind.config.js` と `apps/<app>/postcss.config.js` を削除する。
   **`text-code-case` にはこの 2 ファイルが存在しない**ため、削除は不要（エラーにしない）。

- [ ] **Step 3: `image-trim` のカスタム CSS を保持して変換する**

`apps/image-trim/src/index.css` を次の形にする。`@import` を先頭に置き、
既存の `.checkerboard` 定義をその後ろに残す:

```css
@import "@tools/design-tokens";

/* 透過画像プレビュー用のチェッカーボード背景 */
.checkerboard {
  background-image: linear-gradient(45deg, #e0e0e0 25%, transparent 25%),
    linear-gradient(-45deg, #e0e0e0 25%, transparent 25%),
    linear-gradient(45deg, transparent 75%, #e0e0e0 75%),
    linear-gradient(-45deg, transparent 75%, #e0e0e0 75%);
  background-size: 16px 16px;
  background-position:
    0 0,
    0 8px,
    8px -8px,
    -8px 0px;
}
```

**元ファイルの `.checkerboard` 定義を実際に読み、上記が完全一致することを確認してから置換すること。**
一致しない場合は元の定義をそのまま使うこと。上のコードは実測時点の写しである。

package.json / vite.config.ts / config 削除は Step 2 と同じ手順で行う。

- [ ] **Step 4: `text-counter` を変換する**

`index.css` を `@import "@tools/design-tokens";` の 1 行に置換する。
カスタムの `--destructive: 0 72% 40%` は保持しない。standards の
`oklch(0.505 0.213 27.518)` に統一される。

この判断の根拠（コミットメッセージに書くこと）:
- shadcn 既定 `hsl(0 84.2% 60.2%)` は白背景で 3.76:1 で WCAG AA 未達
- カスタム値 `hsl(0 72% 40%)` は 6.95:1
- standards 値は 6.42:1
- 統一により残り 343 アプリが 3.76:1 → 6.42:1 に改善する。
  カスタム値からはわずかに下がるが、いずれも AA を満たす

package.json / vite.config.ts / config 削除は Step 2 と同じ手順で行う。

- [ ] **Step 5: 変換漏れがないことを確認する**

Run: `node scripts/migrate-tailwind-v4.js --dry-run`

Expected: 「変換 0 / skip 346 / blocked 0」と表示され exit 0。
全アプリが移行済みと判定されることの確認である。

- [ ] **Step 6: 依存をインストールする**

Run: `pnpm install`

Expected: exit 0。

- [ ] **Step 7: コミット**

```bash
git add -A apps/ pnpm-lock.yaml
git commit -m "feat: 個別対応が必要な 6 アプリを Tailwind v4 へ移行

- image-trim: .checkerboard のカスタム CSS を保持
- text-code-case: tailwind/postcss config を持たない構成に対応
- text-counter / text-deduplicate: カスタム --destructive を standards 値へ統一
  shadcn 既定 3.76:1（AA 未達）→ standards 6.42:1。カスタム値 6.95:1 からは
  わずかに下がるがいずれも AA を満たし、残り 343 アプリが改善する
- image-generate / image-transparent: 既定形との差異は空行と chart 定義のみ

Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>"
```

---

### Task 4: 全 346 アプリのビルドと検証

**Files:**
- Create: `.docs/verification/2026-07-30-sp2-bulk-migration.md`

**Interfaces:**
- Consumes: Task 2・Task 3 で移行された全アプリ
- Produces: 全アプリが検証ゲートを通ることの証跡。Task 5 のデプロイ準備の前提になる

- [ ] **Step 1: 全アプリの dist を消す**

Run: `find apps -maxdepth 2 -name dist -type d -exec rm -r {} +`

Expected: exit 0。

古い成果物が残っていると「ソースは移行済みなのに成果物が古い」状態になり、
検証が偽の失敗を出す（SP1 で実際に発生した）。

Run: `find apps -maxdepth 2 -name dist -type d`

Expected: 出力なし。

- [ ] **Step 2: 全アプリをビルドする**

Run: `bash scripts/build-all.sh`

Expected: exit 0。約 8 分かかる見込み（1 アプリ約 1.4 秒 × 346）。

`build-all.sh` は `set -e` で 1 つ失敗すると全体が止まる。
止まった場合は、そのアプリ名と実際のエラー出力を記録して報告すること。
残りのアプリを飛ばして続行しないこと。どこまで成功したかが分からなくなる。

- [ ] **Step 3: 全アプリの移行を機械検証する**

Run: `node scripts/verify-v4-migration.js`

Expected: 「検証: 346 / 346 PASS」/ exit 0。

1 件でも失敗した場合、そのアプリ名と violation 内容を記録すること。
**失敗を無視して次へ進まないこと。**

- [ ] **Step 4: アセットパスを検査する**

Run: `node scripts/check-asset-paths.js`

Expected: 「vite.config.ts : 346 / 346」「ビルド成果物 : 346 アプリを検査、違反 0 件」「✅ 問題なし」/ exit 0。

- [ ] **Step 5: 全アプリのテストを実行する**

Run: `pnpm exec vp test apps`

Expected: **exit 1**。ただし失敗の内容が移行前ベースラインと**同一**であること。

- 6 failed（`k8s-yaml-generator` 1 / `geo-distance` 1 / `markdown-to-slides` 1 /
  `file-rename-batch` 2 / `nato-phonetic` 1）
- 1 error（wasm 依存の 5 ファイル: `bcrypt-hash` / `hash-crc32` / `hash-md5` /
  `sql-playground` / `zip-creator`）
- passed 数がベースラインの 6815 から減っていないこと

**exit 1 であること自体は失敗ではない。**移行前から exit 1 である。
判定するのは「失敗が増えていないか」である。

失敗が増えている場合、増えた分が移行由来かを切り分けること。
切り分けは Task 2 Step 1 で取ったベースラインとの差分で行う。
新たに失敗したアプリ名を特定し、そのアプリだけ `git stash` で移行前に戻して
同じテストを実行し、同じ失敗が出るかで判定する。切り分けた結果を報告に含めること。

- [ ] **Step 6: デザイン監査の非回帰を確認する**

Run: `node scripts/design-audit.js`

Expected: 違反件数が Task 2 Step 1 で記録したベースラインと同数以下。

Run: `git checkout -- .docs/design-audit-result.json`

Expected: exit 0。

- [ ] **Step 7: 目視サンプリング**

次の 5 アプリを実際にブラウザで開き、light / dark 両方を確認する。
**agent-browser を使う。Claude-in-Chrome の MCP ツールは直接呼ばない。**

| アプリ | 選定理由 |
|---|---|
| `json-formatter` | 既定形の代表 |
| `image-trim` | カスタム CSS（`.checkerboard`）を保持したアプリ |
| `text-counter` | `--destructive` を standards 値へ統一したアプリ |
| `text-code-case` | config を持たない構成だったアプリ |
| 日本語本文を持つアプリ 1 つ | 和文フォールバックの確認。`grep -l '[ぁ-んァ-ヶ一-龠]' apps/*/src/App.tsx` で選ぶ |

各アプリで確認すること:
- ボタンが青地に白文字（light）/ 明るい青地に暗い文字（dark）
- 本文とラベルが読める
- 入力欄・カードの枠線が見える
- 角丸が付いている
- 透明度合成によるコントラスト崩壊がない
- **有効状態のボタンで確認する**（disabled は opacity がかかり実色を誤判定する）
- `image-trim` は `.checkerboard` が描画されていること
- 日本語アプリは和文が自然に描画されていること

dev サーバーのポートは固定値を前提にせず、起動ログが示すポートを使う。

各アプリの light / dark のスクリーンショットを
`.docs/verification/sp2-screenshots/<app>-<light|dark>.png` に保存する。

- [ ] **Step 8: 検証レポートを書く**

`.docs/verification/2026-07-30-sp2-bulk-migration.md` に次を記載する。

- 実行環境（日時・HEAD・branch・Node/pnpm バージョン）
- Step 1〜6 の各コマンドと**そのコマンド自身の exit code**、主要な出力
- Step 7 のサンプリング結果。**5 / 346 アプリを目視し、341 アプリは未目視であることを明記する**
- Task 5 テストで移行由来と既存を切り分けた結果
- 想定と違った点

**目視した数と未目視の数を必ず書くこと。** サンプリングの事実を書かないと
「全部見た」と読まれる。

- [ ] **Step 9: コミット**

```bash
git add .docs/verification packages/router/public
git commit -m "docs(verification): SP2 全アプリ移行の検証結果を記録

346/346 が検証ゲートを通過。目視は 5 アプリのサンプリング（341 は未目視）。

Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>"
```

---

### Task 5: ドキュメントの更新

**Files:**
- Modify: `CLAUDE.md`
- Modify: `.docs/plans/tailwind-v4-migration-guide.md`

**Interfaces:**
- Consumes: Task 4 の検証結果
- Produces: 移行完了後の状態を反映したドキュメント

- [ ] **Step 1: CLAUDE.md の技術スタック記述を更新する**

現在の記述:

```markdown
- **スタイリング**: Tailwind CSS + shadcn/ui (Radix UI)
  - `url-encoder` のみ **v4**(`@tailwindcss/vite` + `@tools/design-tokens` の oklch トークン)。
    残り 345 アプリは **3.4**(hsl 変数 + `tailwind.config.js`)。移行は SP2 で全アプリへ展開する。
    手順は `.docs/plans/tailwind-v4-migration-guide.md` が正本
```

これを次に置き換える:

```markdown
- **スタイリング**: Tailwind CSS v4 (`@tailwindcss/vite`) + shadcn/ui (Radix UI)
  - 全 346 アプリが v4。カラートークンは `@tools/design-tokens` の oklch 定義が唯一の正本で、
    各アプリの `src/index.css` は `@import "@tools/design-tokens";` の 1 行のみ
  - `tailwind.config.js` / `postcss.config.js` は持たない（v4 は CSS-first 設定）
```

- [ ] **Step 2: 整形対象外の記述から不要になった項目を確認する**

`CLAUDE.md` の「整形してはいけないファイルが 3 種類ある」の
`apps/*/vite.config.ts` の項を確認する。

PR #849 で `check-asset-paths.js` はクォート非依存になったため、
整形しても gate は落ちなくなった。ただし差分を最小に保つ理由は残る。
項目を削除せず、理由を次の趣旨へ更新すること:

「`apps/*/vite.config.ts` — gate は PR #849 でクォート非依存になったが、
346 ファイルに無関係な整形差分が出るため対象に含めない」

- [ ] **Step 3: 移行手順書に完了を追記する**

`.docs/plans/tailwind-v4-migration-guide.md` の冒頭に次を追記する:

```markdown
> **状態**: SP2 で全 346 アプリの移行が完了した（2026-07-30）。
> 本書は新規アプリ作成時の参照と、移行時に判明した地雷の記録として残す。
> 新規アプリは最初から v4 構成で作る（`scripts/create-app.js` のテンプレートを参照）。
```

あわせて、移行前の `vite.config.ts` には `[react()]` と `[react(), wasm()]` の 2 形状があり、
後者では既存の `wasm()` を保持したまま末尾に `tailwindcss()` を追加する必要があることを記録する。
また、一括変換スクリプトの判定基準を変換対象ファイルから実行時に読んではならないこと、
基準アプリを変換した瞬間に基準が変わる自己破壊を避けるため、ハッシュ等の不変な定数として
保持する必要があることを記録する。

- [ ] **Step 4: lint を通してコミット**

Run: `pnpm exec vp check --no-fmt CLAUDE.md .docs/plans/tailwind-v4-migration-guide.md`

Expected: PASS。Markdown はフォーマット対象外のため `--no-fmt` を使う。

```bash
git add CLAUDE.md .docs/plans/tailwind-v4-migration-guide.md
git commit -m "docs: SP2 完了に伴い技術スタックの記述を更新

全 346 アプリが Tailwind v4 + @tools/design-tokens になった。

Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>"
```

---

### Task 6: 完了ゲート

**Files:**
- Modify: `docs/superpowers/plans/2026-07-30-sp2-tailwind-v4-bulk-migration.md`（本ファイルのチェックボックス）

**Interfaces:**
- Consumes: Task 1〜5 のすべての成果物
- Produces: SP2 完了の判定

- [ ] **Step 1: クリーンな状態から全アプリを再ビルドする**

Run: `find apps -maxdepth 2 -name dist -type d -exec rm -r {} +`

Expected: exit 0。

Run: `bash scripts/build-all.sh`

Expected: exit 0。

- [ ] **Step 2: 全ゲートを通しで実行する**

各コマンドを**単独で**実行し、そのコマンド自身の exit code を確認する。連結しない。

Run: `node scripts/verify-v4-migration.js`
Expected: 「検証: 346 / 346 PASS」/ exit 0

Run: `node scripts/check-asset-paths.js`
Expected: 「✅ 問題なし」/ exit 0

Run: `pnpm exec vp test apps`
Expected: exit 1。ただし失敗が Task 2 Step 1 のベースラインと同一で、passed 数が減っていないこと。
移行前から exit 1 であるため、exit 1 自体は失敗ではない

Run: `pnpm exec vp test packages/design-tokens/src`
Expected: 2 files / 26 tests PASS / exit 0

Run: `node scripts/design-audit.js`
Expected: 違反件数が Task 2 Step 1 のベースライン以下

Run: `git checkout -- .docs/design-audit-result.json`
Expected: exit 0

- [ ] **Step 3: 移行の完全性を確認する**

Run: `node scripts/migrate-tailwind-v4.js --dry-run`

Expected: 「変換 0 / skip 346 / blocked 0」/ exit 0。未移行が 1 つも残っていないこと。

Run: `ls apps/*/tailwind.config.js`

Expected: 該当なし（exit 1 で「No such file or directory」）。v3 の設定ファイルが 1 つも残っていないこと。

Run: `ls apps/*/postcss.config.js`

Expected: 該当なし。

- [ ] **Step 4: 未コミットの変更がないことを確認する**

Run: `git status --short`

Expected: 出力なし。

- [ ] **Step 5: 結果を報告する**

次を含めて報告すること。

- Step 1〜4 の各コマンドと exit code、主要な出力
- 目視した 5 アプリと、未目視の 341 アプリという事実
- テスト失敗があった場合の移行由来 / 既存の切り分け結果
- 想定と違った点
- ACCEPTED_RISKS（あれば理由とともに）

---

## 完了時の状態

- 全 346 アプリが Tailwind v4 + `@tools/design-tokens` へ移行済み
- 各アプリの `src/index.css` は `@import "@tools/design-tokens";` の 1 行
- `tailwind.config.js` / `postcss.config.js` が 1 つも残っていない
- `verify-v4-migration.js` が 346 / 346 PASS
- `check-asset-paths.js` が 346 / 346・違反 0
- `packages/router/public/` が全アプリの新しいビルド成果物で更新済み
- 目視サンプリング 5 アプリの証跡がある（未目視 341 も記録済み）

## スコープ外（この計画では実施しない）

- **本番デプロイ。** 本計画はブランチ上で完結する。
  なおこのリポジトリには現在 `.github` ディレクトリが存在せず、CI/CD ワークフローがない。
  デプロイ手段の確認は別途必要（`.docs/actions/after-deploy-pr837-deploy-workflow-verify.md` を参照）
- ThemeToggle の実装・展開（SP3）
- `.docs/DESIGN.md` / `design-audit.js` の standards 準拠への改訂（SP4）
- フォーカスリングの standards §5 準拠（`.docs/actions/next-session-focus-ring-standards.md` に起票済み。SP3 と併せて実施）
- 検証スクリプトのテスト整備（`.docs/actions/next-session-verify-script-tests.md` に起票済み）
- 各アプリのレイアウト・機能の変更
- **新規アプリ作成テンプレートの v4 化**（`templates/react-spa/`）。
  現状このテンプレートは `postcss.config.js` と `tailwind.config.js` を持つ v3 構成であり、
  **SP2 完了後に新しいアプリを作ると v3 で生成されて混在が復活する**。
  本計画のスコープ外だが、SP2 完了直後に対応する必要がある。Task 6 の報告で明示的に申し送ること
