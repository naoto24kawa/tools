# WASM最適化設計書

## 概要

Elchika Tools の既存アプリのうち、WASM化やWeb API移行で改善できるものを特定し、パフォーマンス改善・機能拡張を行う。

## 目的

- 計算集約的な純JS実装をWASM化してパフォーマンス向上
- 既存ライブラリのWASM版(sql.js, kuromoji)で機能を大幅強化
- レガシーなJS暗号ライブラリ(crypto-js)をWeb Crypto APIに移行

## 対象アプリ(7アプリ)

### パフォーマンス改善型(WASM置換)

| アプリ | 現状 | 改善内容 | 期待効果 |
|--------|------|---------|---------|
| hash-md5 | 180行の純JSビット演算 | Rust WASM に置換 | 大容量テキストで5-10x |
| hash-crc32 | 19行の純JS(テーブル+ループ) | Rust WASM に置換 | 大容量データで3-5x |
| bcrypt-hash | bcryptjs(純JS) | Rust WASM に置換 | 高ラウンドで10-20x |

### 機能拡張型(WASMで新機能追加)

| アプリ | 現状 | 改善内容 | 期待効果 |
|--------|------|---------|---------|
| zip-creator | 圧縮なし(Store only) | WASM deflateで圧縮追加 | 実用的なZIP作成 |
| sql-playground | カスタムSQLパーサー | sql.js(SQLite WASM)導入 | 本物のSQL実行 |
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

### エクスポートAPI

```rust
#[wasm_bindgen]
pub fn md5(input: &str) -> String { ... }

#[wasm_bindgen]
pub fn crc32(input: &[u8]) -> u32 { ... }

#[wasm_bindgen]
pub fn bcrypt_hash(password: &str, rounds: u32) -> String { ... }

#[wasm_bindgen]
pub fn bcrypt_verify(password: &str, hash: &str) -> bool { ... }

#[wasm_bindgen]
pub fn deflate(input: &[u8], level: u8) -> Vec<u8> { ... }

#[wasm_bindgen]
pub fn inflate(input: &[u8]) -> Vec<u8> { ... }
```

### JS側ラッパーパターン

各アプリの `utils/*.ts` でWASM関数をラップし、既存インターフェースを維持:

```typescript
// apps/hash-md5/src/utils/md5.ts (差し替え後)
import init, { md5 as wasmMd5 } from 'wasm-utils';

let ready: Promise<void> | null = null;
function ensure() { return (ready ??= init()); }

export async function md5(text: string): Promise<string> {
  await ensure();
  return wasmMd5(text);
}
```

### 各アプリの改修詳細

#### hash-md5, hash-crc32

- 純JS実装を削除し、`wasm-utils` のラッパーに置換
- 同期 → 非同期に変更
- App.tsx: `useMemo` → `useEffect` + `useState`
- テスト: `expect(md5(...))` → `expect(await md5(...))`
- 期待ハッシュ値は同一(アルゴリズム不変)

#### bcrypt-hash

- `bcryptjs` 依存を削除し、`wasm-utils` のラッパーに置換
- 既存関数名 `generateHash()`/`verifyHash()` → WASM関数 `bcrypt_hash()`/`bcrypt_verify()` のマッピングをラッパーで吸収
- 関数シグネチャ維持可能(WASM内で計算完結)
- bcrypt バージョン識別子(`$2a$` vs `$2b$` vs `$2y$`)の互換性テストを実施。Rust `bcrypt` crateは `$2b$` を出力するため、`bcryptjs` の `$2a$` 出力との相互検証が必要

#### zip-creator

- `wasm-utils` の `deflate()` + `crc32()` を使用
- ZIP compression method を 0 (Store) → 8 (Deflate) に変更
- ユーザーが圧縮レベルを選べるUI追加(Store / Deflate)

#### sql-playground

- `sql.js`(SQLite WASM npm パッケージ)で本物のSQL実行に置換
- WASMは CDN (`sql.js.org`) から動的ロード
- フォールバックとして `public/` にWASM同梱

#### morpheme-analyzer

- `kuromoji.js` で本格的な形態素解析に置換
- 辞書データ(~20MB)は `apps/morpheme-analyzer/public/dict/` に配置
- 初回ロード時にプログレスバー表示、UIは即表示(lazy load)

#### des-encrypt

- 既存の3DES(crypto-js)はそのまま維持(暗号化済みデータの復号互換)
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
  "type": "module",
  "files": ["pkg"],
  "main": "./pkg/wasm_utils.js",
  "types": "./pkg/wasm_utils.d.ts",
  "scripts": {
    "build": "wasm-pack build --target bundler --out-dir pkg",
    "postinstall": "[ -d pkg ] || npm run build"
  }
}
```

`postinstall` スクリプトにより、`pnpm install` 時に `pkg/` が未生成であれば自動ビルドする。CI環境ではRust/wasm-packが必要。

各アプリの依存: `"wasm-utils": "workspace:*"`

### Vite+ でのWASM読み込み

`wasm-pack --target bundler` の出力はESMモジュールとして生成される。Vite+/Rolldownでの動作は実装時に検証が必要。互換性問題が発生した場合は `vite-plugin-wasm` の導入で対応する。

### build-all.sh への追加

```bash
# Step 0: WASM ビルド(アプリビルドの前に)
echo "Building wasm-utils..."
cd packages/wasm-utils && pnpm run build && cd ../..

# Step 1: 各アプリビルド(既存)
for app in apps/*/; do ...
```

### Cloudflare Workers (MCP Server) との互換性

MCP Server は `apps/*/src/utils/` を直接 import する方針。WASM化により以下の影響がある:

**型シグネチャの変更**: `md5(text)` が `string` → `Promise<string>` に変わるため、MCP Server の tool handler で `await` が必要になる。MCP tool handler は元々 `async` なので動作上は問題ないが、TypeScript strict mode で型エラーとなるため明示的に `await` を追加する必要がある。

**WASMバイナリの読み込み**: `--target bundler` を使用することで、Wrangler がバンドル時にWASMバイナリを自動的に組み込む。MCP Server の `wrangler.toml` に `wasm_modules` バインディングの追加は不要(`--target bundler` がバンドラーに処理を委ねるため)。

**MCP設計書への影響**: `hash_md5`, `hash_crc32` ツールの import 元が非同期になるため、MCP設計書の該当箇所に `await` 追加の注記が必要。

## テスト戦略

### packages/wasm-utils

1. `cargo test` - Rust 単体テスト(アルゴリズムの正確性)
2. `wasm-pack test --node` - WASM 環境テスト

### 既存アプリテスト

同期→非同期化の影響:

| アプリ | 変更 |
|--------|------|
| hash-md5 | `expect(md5(...))` → `expect(await md5(...))` |
| hash-crc32 | `expect(crc32(...))` → `expect(await crc32(...))` |
| bcrypt-hash | シグネチャ維持可能 |

テスト値(期待ハッシュ値)は不変。

### Vitest WASM セットアップ

```typescript
// setup.ts
import { beforeAll } from 'vitest';
import init from 'wasm-utils';
beforeAll(async () => { await init(); });
```

```typescript
// vite.config.ts
test: { setupFiles: ['./src/utils/__tests__/setup.ts'] }
```

### 新規テスト

| アプリ | テスト対象 |
|--------|----------|
| sql-playground | `executeQuery()` - CRUD操作テスト |
| morpheme-analyzer | `analyze()` - 既知テキストの形態素解析結果検証 |
| des-encrypt | `aesEncrypt()`/`aesDecrypt()` - ラウンドトリップテスト |
| zip-creator | `createZip()` - 圧縮ZIP作成→展開→内容一致確認 |

### 実行順序

```bash
cargo test                        # Rust テスト
wasm-pack build --target bundler      # WASM ビルド
cd apps/hash-md5 && vp test       # アプリテスト
pnpm test:e2e                     # E2E テスト
```

## リスクと緩和策

| # | リスク | 影響度 | 緩和策 |
|---|--------|--------|--------|
| R1 | Rust / wasm-pack がCIやローカルに未導入 | 高 | ビルド済み `pkg/` をgit管理する選択肢を用意。CIにRustインストールステップ追加 |
| R2 | WASMバイナリによるバンドルサイズ増加 | 中 | md5+crc32+bcrypt+deflateで推定~100KB(gzip後~40KB)。許容範囲 |
| R3 | 同期→非同期化でApp.tsx側の変更漏れ | 中 | TypeScript strict modeで型エラーとして検出。テストで担保 |
| R4 | kuromoji辞書(~20MB)のロード時間 | 高 | プログレスバー表示。辞書をlazy loadしてUIは即表示 |
| R5 | sql.js CDN依存の可用性リスク | 低 | フォールバックとして `public/` にWASM同梱 |
| R6 | 古いブラウザのWASM非対応 | 低 | モダンブラウザ95%+サポート。非対応時はエラーメッセージ表示 |
| R7 | MCP Server のWASM互換 | 低 | MCP実装時にCF Workers WASM対応を検証。必要ならJS版維持 |

### 受容するリスク

- R2: gzip後~40KBの増加は軽微
- R6: ターゲットはモダンブラウザのみ(既存方針と一致)

### ロールバック戦略

- `packages/wasm-utils` を依存から外し、旧JS実装(git履歴から復元)に戻す
- App.tsx の非同期対応コード(`useEffect` + `useState`)も同時に `useMemo` に戻す必要あり
- ロールバック対象ファイル: `utils/*.ts` + `App.tsx` + `package.json`(依存削除)
- 各アプリは独立SPAなので、1アプリだけ旧版に戻すことも可能

## 外部ライブラリ依存

| ライブラリ | 用途 | サイズ | ライセンス |
|-----------|------|--------|-----------|
| wasm-pack | Rust→WASMビルド | ビルドツール | Apache-2.0/MIT |
| wasm-bindgen | Rust-JS バインディング | ~50KB | Apache-2.0/MIT |
| sql.js | SQLite WASM | ~1MB | MIT |
| kuromoji.js | 日本語形態素解析 | ~20MB(辞書含) | Apache-2.0 |
| flate2 (Rust) | Deflate圧縮 | WASM内 | Apache-2.0/MIT |
| bcrypt (Rust) | bcryptハッシュ | WASM内 | Apache-2.0/MIT |
