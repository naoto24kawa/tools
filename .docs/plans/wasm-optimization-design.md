# WASM最適化設計書

## 概要

Elchika Tools の既存アプリのうち、WASM化やWeb API移行で改善できるものを特定し、パフォーマンス改善・機能拡張を行う。

## 目的

- 計算集約的な純JS実装をWASM化してパフォーマンス向上
- 既存ライブラリのWASM版(sql.js, kuromoji)で機能を大幅強化
- レガシーなJS暗号ライブラリ(crypto-js)についてはAES-256-GCM(Web Crypto API)を推奨オプションとして追加。3DESはWeb Crypto APIが非サポートのため、des-encryptアプリ内にのみcrypto-jsを残存させる

## 対象アプリ(7アプリ)

### パフォーマンス改善型(WASM置換)

| アプリ | 現状 | 改善内容 | 期待効果 |
|--------|------|---------|---------|
| hash-md5 | 180行の純JSビット演算 | Rust WASM に置換 | 大容量テキストで5-10x |
| hash-crc32 | 18行の純JS(テーブル+ループ) | Rust WASM に置換 | 大容量データで3-5x |
| bcrypt-hash | bcryptjs(純JS) | Rust WASM に置換 | 高ラウンドで10-20x |

### 機能拡張型(WASMで新機能追加)

| アプリ | 現状 | 改善内容 | 期待効果 |
|--------|------|---------|---------|
| zip-creator | 圧縮なし(Store only) | WASM deflateで圧縮追加 | 実用的なZIP作成 |
| sql-playground | 正規表現ベースの簡易SQLインタプリタ(388行) | sql.js(SQLite WASM)導入 | 本物のSQL実行 |
| morpheme-analyzer | Unicode範囲判定のみ | kuromoji.js導入 | 本格的形態素解析 |

### Web Crypto API移行

| アプリ | 現状 | 改善内容 |
|--------|------|---------|
| des-encrypt | crypto-js TripleDES | 3DES維持 + AES-256-GCM追加(Web Crypto API) |

## WASM化しないアプリ(調査済み)

以下は調査の結果、既に最適化済みまたはWASM化の恩恵が小さいと判断。

| アプリ | 理由 |
|--------|------|
| hash-sha1 | Web Crypto API (`crypto.subtle.digest`) 使用済み |
| hash-sha256 | Web Crypto API 使用済み |
| hash-hmac | Web Crypto API (`crypto.subtle.sign`) 使用済み |
| aes-encrypt | Web Crypto API 使用済み |
| rsa-keygen | Web Crypto API 使用済み |
| image-compress / image-convert | Canvas API(ブラウザネイティブコーデック) |
| image-ocr | tesseract.js(既にWASM使用) |
| image-ascii-art | 27行の単純計算、WASMオーバーヘッドの方が大きい |
| video-to-gif | フレーム抽出のみ(GIFエンコード機能なし) |
| zip-extractor | DecompressionStream API 使用済み |

## 実装順序

WASM対象アプリには依存関係があるため、以下の順序で実装する:

1. **packages/wasm-utils** - Rust実装 + `cargo test` + `wasm-pack build`
2. **hash-md5 で POC** - Vite+/Rolldown でのWASM動作検証を兼ねる。ここで `vite-plugin-wasm` 等の必要性を確定
3. **hash-crc32** - POC で確立したパターンを適用
4. **bcrypt-hash** - bcrypt バージョン識別子互換性テストを含む
5. **zip-creator** - deflate圧縮追加(wasm-utils の deflate + crc32 を使用)
6. **sql-playground** - sql.js 導入(wasm-utils とは独立)
7. **morpheme-analyzer** - kuromoji.js 導入(wasm-utils とは独立)
8. **des-encrypt** - Web Crypto API追加(WASM不要、独立作業)

Step 2 の POC 結果により、Vite プラグイン設定等の共通パターンが確定してから Step 3 以降に進む。

## アーキテクチャ

### packages/wasm-utils

Rust で実装し、`wasm-pack` でビルド。pnpm workspace パッケージとして各アプリから利用。

```
packages/wasm-utils/
  Cargo.toml              # Rust プロジェクト定義
  src/
    lib.rs                # wasm-bindgen エントリポイント
    md5.rs                # MD5 実装
    crc32.rs              # CRC32 実装
    bcrypt.rs             # bcrypt 実装
    deflate.rs            # Deflate 圧縮/展開
  pkg/                    # wasm-pack build 出力 (gitignore)
  package.json            # npm パッケージ定義 (pkg/ を参照)
  build.sh                # wasm-pack build --target bundler
```

### Cargo.toml

```toml
[package]
name = "wasm-utils"
version = "0.1.0"
edition = "2021"

[lib]
crate-type = ["cdylib", "rlib"]

[dependencies]
wasm-bindgen = "0.2"
md-5 = "0.10"                    # RustCrypto MD5 (純Rust、MIT/Apache-2.0)
crc32fast = "1.4"                # 高速CRC32 (純Rust、MIT/Apache-2.0)
bcrypt = "0.16"                  # bcryptハッシュ (MIT/Apache-2.0)
flate2 = { version = "1.0", default-features = false, features = ["rust_backend"] }
# flate2 のデフォルトバックエンドは miniz (C FFI) で wasm32-unknown-unknown では
# コンパイル不可。rust_backend を指定して純Rust実装を使用する。
getrandom = { version = "0.2", features = ["wasm_js"] }
# bcrypt crate は rand -> getrandom に依存する。wasm32-unknown-unknown では
# getrandom がデフォルトでコンパイルを拒否するため、wasm_js feature で
# ブラウザ/Workers の crypto.getRandomValues() を使うように指定する。

[dev-dependencies]
wasm-bindgen-test = "0.3"

[profile.release]
opt-level = "s"     # サイズ最適化
lto = true
```

### エクスポートAPI

```rust
use wasm_bindgen::prelude::*;

/// MD5ハッシュを計算(16進数文字列を返す)
#[wasm_bindgen]
pub fn md5(input: &str) -> String { ... }

/// CRC32チェックサムを計算(16進数文字列を返す)
/// 注: hash-crc32 アプリ用。内部では u32 で計算し、
/// format!("{:08x}", value) で16進数文字列に変換して返す。
#[wasm_bindgen]
pub fn crc32_hex(input: &str) -> String { ... }

/// CRC32チェックサムを計算(数値を返す)
/// 注: zip-creator アプリ用。バイト列を受け取り u32 を返す。
#[wasm_bindgen]
pub fn crc32_raw(input: &[u8]) -> u32 { ... }

#[wasm_bindgen]
pub fn bcrypt_hash(password: &str, rounds: u32) -> String { ... }

#[wasm_bindgen]
pub fn bcrypt_verify(password: &str, hash: &str) -> bool { ... }

/// Deflate圧縮(level: 0=無圧縮, 1=最速, 6=デフォルト, 9=最高圧縮)
#[wasm_bindgen]
pub fn deflate(input: &[u8], level: u8) -> Vec<u8> { ... }

#[wasm_bindgen]
pub fn inflate(input: &[u8]) -> Vec<u8> { ... }
```

CRC32 を2つの関数に分ける理由:
- `crc32_hex(input: &str) -> String` : hash-crc32 アプリ用。既存の `crc32(text: string): string` と同じシグネチャを維持
- `crc32_raw(input: &[u8]) -> u32` : zip-creator アプリ用。既存の内部 `crc32(data: Uint8Array): number` と同じシグネチャを維持

### JS側ラッパーパターン

各アプリの `utils/*.ts` でWASM関数をラップし、既存インターフェースを維持:

```typescript
// apps/hash-md5/src/utils/md5.ts (差し替え後)
import init, { md5 as wasmMd5 } from 'wasm-utils';

let ready: Promise<void> | null = null;

function ensure(): Promise<void> {
  if (!ready) {
    ready = init().catch((err) => {
      ready = null; // 失敗時はリセットしてリトライ可能にする
      throw err;
    });
  }
  return ready;
}

export async function md5(text: string): Promise<string> {
  await ensure();
  return wasmMd5(text);
}
```

WASM初期化失敗時の方針:
- `ensure()` で init() が reject された場合、`ready` を `null` にリセットして次回リトライ可能にする
- 各アプリの App.tsx では `useEffect` 内で `catch` してエラーステートを設定し、UIにエラーメッセージを表示する
- JS版へのグレースフルデグラデーションは行わない(WASM非対応環境はターゲット外)

### 各アプリの改修詳細

#### hash-md5

- 純JS実装(180行)を削除し、`wasm-utils` の `md5()` ラッパーに置換
- 同期 -> 非同期に変更
- App.tsx: `useMemo` -> `useEffect` + `useState`
- テスト: `expect(md5(...))` -> `expect(await md5(...))`
- 期待ハッシュ値は同一(アルゴリズム不変)

#### hash-crc32

- 純JS実装(18行)を削除し、`wasm-utils` の `crc32_hex()` ラッパーに置換
- 同期 -> 非同期に変更
- ラッパー: `export async function crc32(text: string): Promise<string>` -> 内部で `crc32_hex(text)` を呼ぶ

#### bcrypt-hash

- `bcryptjs` 依存を削除し、`wasm-utils` のラッパーに置換
- 既存関数名 `generateHash()`/`verifyHash()` -> WASM関数 `bcrypt_hash()`/`bcrypt_verify()` のマッピングをラッパーで吸収
- 関数シグネチャ維持可能(WASM内で計算完結)
- bcrypt バージョン識別子互換性: Rust `bcrypt` crateは `$2b$` を出力、`bcryptjs` は `$2a$` を出力。実装時に以下を検証:
  - WASM版で生成したハッシュを `bcryptjs` で検証できるか
  - `bcryptjs` で生成したハッシュをWASM版で検証できるか
  - 互換性がない場合は `bcrypt` crate の `Version::TwoA` 指定で `$2a$` を出力する

#### zip-creator

- `wasm-utils` の `deflate()` + `crc32_raw()` を使用
- ZIP Local File Header と Central Directory の compression method を 0 (Store) -> 8 (Deflate) に変更
- 関数シグネチャ変更: `createZip(files: File[]): Promise<Blob>` -> `createZip(files: File[], compress?: boolean): Promise<Blob>`
- `compress` パラメータが `true` の場合は Deflate(level 6)、`false` の場合は Store(現行動作)
- テストでの展開検証: 既存の `zip-extractor` の `getEntryData()` (DecompressionStream API使用)で展開し、内容一致を確認

#### sql-playground

- 既存の `sqlEngine.ts`(388行の正規表現ベース簡易SQLインタプリタ)を **全廃** し、`sql.js` で置換
- 既存テスト(`sqlEngine.test.ts`)は全面書き直し
- 新しいAPI設計:

```typescript
// apps/sql-playground/src/utils/sqlEngine.ts (新)
import initSqlJs, { type Database } from 'sql.js';

let db: Database | null = null;

export async function initDatabase(): Promise<void> {
  const SQL = await initSqlJs({
    locateFile: (file: string) => {
      // CDN優先、失敗時はローカルフォールバック
      return `https://sql.js.org/dist/${file}`;
    }
  });
  db = new SQL.Database();
}

export interface QueryResult {
  columns: string[];
  values: unknown[][];
  changes: number;
}

export function executeQuery(sql: string): QueryResult[] {
  if (!db) throw new Error('Database not initialized');
  const results = db.exec(sql);
  // getRowsModified() は最後に実行された DML の変更行数を返す。
  // SELECT 結果には changes=0、DML 結果には実行後の変更行数を付与する。
  const changes = db!.getRowsModified();
  return results.map((r, i) => ({
    columns: r.columns,
    values: r.values,
    changes: i === results.length - 1 ? changes : 0,
  }));
}

export function resetDatabase(): void {
  if (db) { db.close(); db = null; }
}
```

- sql.js WASM ファイル (~1MB) のロード方針:
  - 優先: CDN (`https://sql.js.org/dist/sql-wasm.wasm`) からロード
  - フォールバック: `apps/sql-playground/public/sql-wasm.wasm` からロード(ビルド時に `node_modules/sql.js/dist/sql-wasm.wasm` をコピー)
  - CDN fetch がエラーまたは5秒タイムアウトした場合にフォールバックへ切り替え
- sql.js のバージョンは `package.json` で固定(例: `"sql.js": "^1.10.0"`)

#### morpheme-analyzer

- 既存の `morpheme.ts`(Unicode コードポイント範囲チェックによる文字種分割)を **全廃** し、`kuromoji.js` で置換
- 既存テスト(`morpheme.test.ts`)は全面書き直し
- 新しいAPI設計:

```typescript
// apps/morpheme-analyzer/src/utils/morpheme.ts (新)
import kuromoji from 'kuromoji';

export interface MorphemeToken {
  surface: string;    // 表層形
  pos: string;        // 品詞
  pos_detail: string; // 品詞細分類
  reading: string;    // 読み
  baseForm: string;   // 原形
}

let tokenizer: kuromoji.Tokenizer<kuromoji.IpadicFeatures> | null = null;

export async function initTokenizer(
  onProgress?: (message: string) => void
): Promise<void> {
  return new Promise((resolve, reject) => {
    onProgress?.('辞書データを読み込み中...');
    kuromoji.builder({ dicPath: '/dict/' }).build((err, t) => {
      if (err) { reject(err); return; }
      tokenizer = t;
      resolve();
    });
  });
}

export function analyze(text: string): MorphemeToken[] {
  if (!tokenizer) throw new Error('Tokenizer not initialized');
  const tokens = tokenizer.tokenize(text);
  return tokens.map(t => ({
    surface: t.surface_form,
    pos: t.pos,
    pos_detail: t.pos_detail_1,
    reading: t.reading || '',
    baseForm: t.basic_form,
  }));
}
```

- 辞書データ(~20MB)は `apps/morpheme-analyzer/public/dict/` に配置
- `vite build` 時に `public/` の内容は `dist/` にコピーされるため、デプロイ後は `/dict/` パスで辞書にアクセス可能
- 辞書ロード失敗時の挙動:
  - App.tsx にエラーステートを表示(「辞書の読み込みに失敗しました。ページを再読み込みしてください。」)
  - 旧来の文字種判定ロジックへのフォールバックは行わない(機能が根本的に異なるため)
  - リトライボタンを表示して `initTokenizer()` を再実行可能にする

#### des-encrypt

- 既存の3DES(crypto-js)はそのまま維持(暗号化済みデータの復号互換)
- Web Crypto API には 3DES のサポートがないため、crypto-js は des-encrypt アプリ内にのみ残存させる
- 将来的に 3DES の需要がなくなった時点で crypto-js 依存を削除する見通し
- AES-256-GCM を Web Crypto API で追加実装
- UIで「推奨: AES-256」と「レガシー: 3DES」を切り替え可能に

## ビルドパイプライン

### WASM ビルド

```bash
cd packages/wasm-utils
wasm-pack build --target bundler --out-dir pkg
```

`--target bundler` を使用する理由: `--target web` は `fetch()` でWASMを読み込むコードを生成するが、CF Workers環境では `fetch()` でローカルWASMファイルを読み込めない。`--target bundler` はバンドラー(Vite/Wrangler)にWASMの読み込み方法を委ねるため、ブラウザ(Vite)とCF Workers(Wrangler)の両方で動作する。

生成物: `pkg/wasm_utils.js`, `pkg/wasm_utils_bg.wasm`, `pkg/wasm_utils.d.ts`

### pnpm workspace 統合

```jsonc
// packages/wasm-utils/package.json
{
  "name": "wasm-utils",
  "version": "0.1.0",
  "private": true,
  "type": "module",
  "files": ["pkg"],
  "main": "./pkg/wasm_utils.js",
  "types": "./pkg/wasm_utils.d.ts",
  "exports": {
    ".": {
      "types": "./pkg/wasm_utils.d.ts",
      "default": "./pkg/wasm_utils.js"
    }
  },
  "scripts": {
    "build": "wasm-pack build --target bundler --out-dir pkg",
    "postinstall": "[ -d pkg ] || (command -v wasm-pack >/dev/null 2>&1 && pnpm run build || echo 'wasm-pack not found: run pnpm run build in packages/wasm-utils after installing wasm-pack')"
  }
}
```

pnpm v10 は依存関係の `postinstall` をデフォルトでブロックするため、ルートの `package.json` に以下を追加:

```jsonc
// ルート package.json に追加
{
  "pnpm": {
    "onlyBuiltDependencies": ["wasm-utils"]
  }
}
```

各アプリの依存: `"wasm-utils": "workspace:*"`

**実装チェックリスト** (ルート package.json への変更):
- [ ] `pnpm.onlyBuiltDependencies` に `"wasm-utils"` を追加(postinstall 許可に必須)

### Vite+ でのWASM読み込み

`wasm-pack --target bundler` の出力は ESM モジュールとして生成される。Vite + `--target bundler` の組み合わせでは `vite-plugin-wasm` と `vite-plugin-top-level-await` が必要になる(Vite GitHub Discussion #2584, #4551 で広く報告されている問題)。

Vite+/Rolldown での対応は Step 2 (hash-md5 POC) で検証する。具体的には:

1. `vite-plugin-wasm` + `vite-plugin-top-level-await` をインストールしてテスト
2. Rolldown のWASMバンドル対応状況を確認
3. 動作しない場合の代替: `--target web` に変更し、各アプリで `init(wasmUrl)` を明示的に呼ぶ方式

対象アプリの `vite.config.ts` に追加するプラグイン設定例:

```typescript
import wasm from 'vite-plugin-wasm';
import topLevelAwait from 'vite-plugin-top-level-await';

export default defineConfig({
  plugins: [react(), wasm(), topLevelAwait()],
  // ... 既存設定
});
```

### ビルドスクリプト

現時点で `scripts/build-all.sh` は存在しない(CLAUDE.md に記載はあるが未作成)。WASMビルドステップを含むビルドスクリプトを新規作成する:

```bash
#!/bin/bash
# scripts/build-all.sh
set -e

# Step 0: WASM ビルド(アプリビルドの前に)
echo "Building wasm-utils..."
(cd packages/wasm-utils && pnpm run build)

# Step 1: 各アプリビルド -> packages/router/public/ にコピー
for app in apps/*/; do
  app_name=$(basename "$app")
  echo "Building $app_name..."
  (cd "$app" && pnpm run build)
  mkdir -p "packages/router/public/$app_name"
  cp -r "$app/dist/"* "packages/router/public/$app_name/"
done
```

### Cloudflare Workers (MCP Server) との互換性

MCP Server は `apps/*/src/utils/` を直接 import する方針。WASM化により以下の影響がある:

**型シグネチャの変更**: `md5(text)` が `string` -> `Promise<string>` に変わるため、MCP Server の tool handler で `await` が必要になる。MCP tool handler は元々 `async` なので動作上は問題ないが、TypeScript strict mode で型エラーとなるため明示的に `await` を追加する必要がある。`hash_crc32` も同様。

**MCP設計書への反映事項**: `hash_md5`, `hash_crc32` ツールの記述に以下を追記:
- 関数が `async` であること(戻り値が `Promise<string>`)
- tool handler 内で `await` が必要であること

**WASMバイナリの読み込み**: `--target bundler` を使用することで、Wrangler がバンドル時にWASMバイナリを自動的に組み込む。MCP Server の `wrangler.toml` に `wasm_modules` バインディングの追加は不要(`--target bundler` がバンドラーに処理を委ねるため)。

## テスト戦略

### packages/wasm-utils

1. `cargo test` - Rust 単体テスト(アルゴリズムの正確性)
2. `wasm-pack test --node` - WASM 環境テスト

### 既存アプリテスト

同期->非同期化の影響:

| アプリ | 変更 |
|--------|------|
| hash-md5 | `expect(md5(...))` -> `expect(await md5(...))` |
| hash-crc32 | `expect(crc32(...))` -> `expect(await crc32(...))` |
| bcrypt-hash | シグネチャ維持可能 |

テスト値(期待ハッシュ値)は不変。

### 全面書き直しが必要なテスト

| アプリ | 理由 |
|--------|------|
| sql-playground | sqlEngine.ts が全廃され sql.js API に変わるため |
| morpheme-analyzer | morpheme.ts が全廃され kuromoji.js API に変わるため |

### Vitest WASM セットアップ

```typescript
// setup.ts
import { beforeAll } from 'vitest';
import init from 'wasm-utils';
beforeAll(async () => { await init(); });
```

```typescript
// vite.config.ts (wasm-utils を使うアプリ)
import wasm from 'vite-plugin-wasm';
import topLevelAwait from 'vite-plugin-top-level-await';

export default defineConfig({
  plugins: [react(), wasm(), topLevelAwait()],
  // ...
  test: {
    setupFiles: ['./src/utils/__tests__/setup.ts'],
    // Vitest の Node 環境で WASM をロードするための設定
    // POC (Step 2) で必要な追加設定を確定する
  },
});
```

### 新規テスト

| アプリ | テスト対象 | 検証内容 |
|--------|----------|---------|
| sql-playground | `executeQuery()` | SELECT/INSERT/UPDATE/DELETE の CRUD 操作、エラーSQL の例外、テーブル作成と結合 |
| morpheme-analyzer | `analyze()` | 既知日本語テキスト(例: "すもももももももものうち")の品詞・読み・原形の正確性 |
| des-encrypt | `aesEncrypt()`/`aesDecrypt()` | 暗号化->復号のラウンドトリップ、異なるキーでの復号失敗 |
| zip-creator | `createZip(files, true)` | Deflate圧縮ZIP作成->zip-extractor の `getEntryData()` で展開->内容一致 |

### 実行順序

```bash
cargo test                           # Rust テスト
wasm-pack build --target bundler     # WASM ビルド
cd apps/hash-md5 && vp test          # アプリテスト
pnpm test:e2e                        # E2E テスト
```

## リスクと緩和策

| # | リスク | 影響度 | 緩和策 |
|---|--------|--------|--------|
| R1 | Rust / wasm-pack がCIやローカルに未導入 | 高 | ビルド済み `pkg/` をgit管理する選択肢を用意。CIにRustインストールステップ追加。postinstall はwasm-pack未検出時にメッセージ表示して続行 |
| R2 | WASMバイナリによるバンドルサイズ増加 | 中 | md5+crc32+bcrypt+deflateで推定~100-200KB(gzip後~40-80KB)。実測値はPOCで確認 |
| R3 | 同期->非同期化でApp.tsx側の変更漏れ | 中 | TypeScript strict modeで型エラーとして検出。テストで担保 |
| R4 | kuromoji辞書(~20MB)のロード時間 | 高 | プログレスバー表示。辞書をlazy loadしてUIは即表示。ロード失敗時はエラー表示+リトライボタン |
| R5 | sql.js CDN依存の可用性リスク | 低 | CDN fetch 5秒タイムアウト後にローカルフォールバック。`public/sql-wasm.wasm` にWASM同梱 |
| R6 | 古いブラウザのWASM非対応 | 低 | モダンブラウザ95%+サポート。非対応時はエラーメッセージ表示 |
| R7 | MCP Server のWASM互換 | 低 | MCP実装時にCF Workers WASM対応を検証。必要ならJS版維持 |
| R8 | Vite+/Rolldown のWASMプラグイン互換性 | 中 | hash-md5 POC (Step 2) で検証。失敗時は `--target web` に切替え |

### 受容するリスク

- R2: gzip後~40-80KBの増加は軽微(POCで実測確認)
- R6: ターゲットはモダンブラウザのみ(既存方針と一致)

### ロールバック戦略

- `packages/wasm-utils` を依存から外し、旧JS実装(git履歴から復元)に戻す
- App.tsx の非同期対応コード(`useEffect` + `useState`)も同時に `useMemo` に戻す必要あり
- ロールバック対象ファイル: `utils/*.ts` + `App.tsx` + `package.json`(依存削除) + `vite.config.ts`(wasm プラグイン削除)
- 各アプリは独立SPAなので、1アプリだけ旧版に戻すことも可能

## 外部ライブラリ依存

### Rust Crates (packages/wasm-utils 内)

| クレート | 用途 | 選定理由 | ライセンス |
|---------|------|---------|-----------|
| wasm-bindgen | Rust-JS バインディング | wasm-pack 標準 | Apache-2.0/MIT |
| md-5 | MD5ハッシュ | RustCrypto プロジェクト、純Rust、広く使用 | Apache-2.0/MIT |
| crc32fast | CRC32チェックサム | 純Rust、SIMD最適化あり | Apache-2.0/MIT |
| bcrypt | bcryptハッシュ | 純Rust、getrandom 経由でブラウザ RNG 使用 | Apache-2.0/MIT |
| flate2 | Deflate圧縮 | rust_backend feature で純Rust動作 | Apache-2.0/MIT |
| getrandom | 暗号学的乱数 | wasm_js feature でブラウザ crypto.getRandomValues() 使用 | Apache-2.0/MIT |

### npm パッケージ

| パッケージ | 用途 | サイズ | ライセンス |
|-----------|------|--------|-----------|
| wasm-pack | Rust->WASMビルドツール | CLI | Apache-2.0/MIT |
| sql.js | SQLite WASM | ~1MB | MIT |
| kuromoji.js | 日本語形態素解析 | ~20MB(辞書含) | Apache-2.0 |
| vite-plugin-wasm | Vite WASMサポート | ~5KB | MIT |
| vite-plugin-top-level-await | Vite top-level await | ~5KB | MIT |
