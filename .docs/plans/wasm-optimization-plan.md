# WASM最適化 実装計画

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 7アプリのWASM化・機能拡張・Web Crypto API移行により、パフォーマンス改善と機能強化を実現する

**Architecture:** Rust -> wasm-pack -> pnpm workspace パッケージ (`packages/wasm-utils`) を共通基盤とし、各アプリの utils 層でラッパーを提供。sql.js と kuromoji.js は独立した npm パッケージとして各アプリに導入。

**Tech Stack:** Rust, wasm-pack, wasm-bindgen, md-5, crc32fast, bcrypt, flate2, sql.js, kuromoji.js, vite-plugin-wasm, Web Crypto API

**Spec:** `.docs/plans/wasm-optimization-design.md`

**注意:** 各 Task のコミット前に `vp check --fix` を実行して lint/format を適用すること。

---

## File Structure

### 新規作成

```
packages/wasm-utils/
  Cargo.toml
  src/lib.rs
  src/md5.rs
  src/crc32.rs
  src/bcrypt.rs
  src/deflate.rs
  package.json
  build.sh
  .gitignore
scripts/build-all.sh
```

### 変更

```
package.json                                      # pnpm.onlyBuiltDependencies 追加
apps/hash-md5/src/utils/md5.ts                    # 純JS -> WASM ラッパー
apps/hash-md5/src/utils/__tests__/md5.test.ts     # sync -> async
apps/hash-md5/src/App.tsx                         # useMemo -> useEffect+useState
apps/hash-md5/package.json                        # wasm-utils 依存追加
apps/hash-md5/vite.config.ts                      # wasm プラグイン追加
apps/hash-crc32/src/utils/crc32.ts                # 純JS -> WASM ラッパー
apps/hash-crc32/src/utils/__tests__/crc32.test.ts # sync -> async
apps/hash-crc32/src/App.tsx                       # useMemo -> useEffect+useState
apps/hash-crc32/package.json                      # wasm-utils 依存追加
apps/hash-crc32/vite.config.ts                    # wasm プラグイン追加
apps/bcrypt-hash/src/utils/bcryptHash.ts          # bcryptjs -> WASM ラッパー
apps/bcrypt-hash/src/utils/__tests__/bcryptHash.test.ts  # async 化
apps/bcrypt-hash/src/App.tsx                      # 非同期対応
apps/bcrypt-hash/package.json                     # bcryptjs 削除, wasm-utils 追加
apps/bcrypt-hash/vite.config.ts                   # wasm プラグイン追加
apps/zip-creator/src/utils/zipCreator.ts          # Store -> Deflate 圧縮追加
apps/zip-creator/src/App.tsx                      # 圧縮オプション UI 追加
apps/zip-creator/package.json                     # wasm-utils 依存追加
apps/zip-creator/vite.config.ts                   # wasm プラグイン追加
apps/sql-playground/src/utils/sqlEngine.ts        # 全廃 -> sql.js
apps/sql-playground/src/utils/__tests__/sqlEngine.test.ts  # 全面書き直し
apps/sql-playground/src/App.tsx                   # sql.js 初期化対応
apps/sql-playground/package.json                  # sql.js 追加
apps/morpheme-analyzer/src/utils/morpheme.ts      # 全廃 -> kuromoji.js
apps/morpheme-analyzer/src/utils/__tests__/morpheme.test.ts  # 全面書き直し
apps/morpheme-analyzer/src/App.tsx                # kuromoji 初期化対応
apps/morpheme-analyzer/package.json               # kuromoji 追加
apps/des-encrypt/src/utils/des.ts                 # AES-256-GCM 追加(既存3DES維持)
apps/des-encrypt/src/utils/__tests__/des.test.ts  # AES テスト追加(既存3DESテスト維持)
apps/des-encrypt/src/App.tsx                      # アルゴリズム切り替え UI
```

---

### Task 1: packages/wasm-utils Rust 実装

**Files:**
- Create: `packages/wasm-utils/Cargo.toml`
- Create: `packages/wasm-utils/src/lib.rs`
- Create: `packages/wasm-utils/src/md5.rs`
- Create: `packages/wasm-utils/src/crc32.rs`
- Create: `packages/wasm-utils/src/bcrypt.rs`
- Create: `packages/wasm-utils/src/deflate.rs`
- Create: `packages/wasm-utils/package.json`
- Create: `packages/wasm-utils/build.sh`
- Create: `packages/wasm-utils/.gitignore`
- Modify: `package.json` (ルート)

- [ ] **Step 1: プロジェクトスキャフォールド作成**

```bash
mkdir -p packages/wasm-utils/src
```

`packages/wasm-utils/Cargo.toml` を設計書の通りに作成(L91-118)。
`packages/wasm-utils/.gitignore`, `build.sh`, `package.json` を設計書の通りに作成(L353-372)。

- [ ] **Step 2: pnpm workspace に packages/* が含まれていることを確認**

Run: `cat pnpm-workspace.yaml`
Expected: `packages/*` が含まれている

- [ ] **Step 3: md5.rs 実装 + テスト**

`packages/wasm-utils/src/md5.rs`:
```rust
use md5::{Md5, Digest};

pub fn compute_md5(input: &str) -> String {
    let mut hasher = Md5::new();
    hasher.update(input.as_bytes());
    let result = hasher.finalize();
    // md-5 crate の GenericArray に対して hex エンコード
    result.iter().map(|b| format!("{:02x}", b)).collect()
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_empty() {
        assert_eq!(compute_md5(""), "d41d8cd98f00b204e9800998ecf8427e");
    }

    #[test]
    fn test_hello() {
        assert_eq!(compute_md5("hello"), "5d41402abc4b2a76b9719d911017c592");
    }

    #[test]
    fn test_hello_world() {
        assert_eq!(compute_md5("Hello World"), "b10a8db164e0754105b7a99be72e3fe5");
    }
}
```

- [ ] **Step 4: md5 テスト実行**

Run: `cd packages/wasm-utils && cargo test md5`
Expected: 3 tests pass

- [ ] **Step 5: crc32.rs 実装 + テスト**

`packages/wasm-utils/src/crc32.rs`:
```rust
use crc32fast::Hasher;

pub fn compute_crc32_hex(input: &str) -> String {
    let mut hasher = Hasher::new();
    hasher.update(input.as_bytes());
    format!("{:08x}", hasher.finalize())
}

pub fn compute_crc32_raw(input: &[u8]) -> u32 {
    let mut hasher = Hasher::new();
    hasher.update(input);
    hasher.finalize()
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_crc32_hex_empty() {
        assert_eq!(compute_crc32_hex(""), "00000000");
    }

    #[test]
    fn test_crc32_hex_hello() {
        assert_eq!(compute_crc32_hex("hello"), "3610a686");
    }

    #[test]
    fn test_crc32_raw() {
        assert_eq!(compute_crc32_raw(b"hello"), 0x3610a686);
    }
}
```

- [ ] **Step 6: crc32 テスト実行**

Run: `cd packages/wasm-utils && cargo test crc32`
Expected: 3 tests pass

- [ ] **Step 7: bcrypt.rs 実装 + テスト**

`packages/wasm-utils/src/bcrypt.rs`:
```rust
pub fn hash_password(password: &str, cost: u32) -> Result<String, String> {
    bcrypt::hash(password, cost).map_err(|e| e.to_string())
}

pub fn verify_password(password: &str, hash: &str) -> bool {
    bcrypt::verify(password, hash).unwrap_or(false)
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_hash_and_verify() {
        let hash = hash_password("test123", 4).unwrap();
        assert!(hash.starts_with("$2b$04$"));
        assert!(verify_password("test123", &hash));
        assert!(!verify_password("wrong", &hash));
    }

    #[test]
    fn test_verify_2a_hash() {
        // bcrypt crate は $2a$ プレフィックスのハッシュも検証可能
        // 実装時に bcryptjs で実際に生成した $2a$ ハッシュを使って検証すること
        let hash = hash_password("compat_test", 4).unwrap();
        assert!(verify_password("compat_test", &hash));
    }
}
```

- [ ] **Step 8: bcrypt テスト実行**

Run: `cd packages/wasm-utils && cargo test bcrypt`
Expected: 2 tests pass

- [ ] **Step 9: deflate.rs 実装 + テスト**

`packages/wasm-utils/src/deflate.rs`:
```rust
use flate2::write::{DeflateEncoder, DeflateDecoder};
use flate2::Compression;
use std::io::Write;

pub fn compress(input: &[u8], level: u8) -> Vec<u8> {
    let compression = Compression::new(level as u32);
    let mut encoder = DeflateEncoder::new(Vec::new(), compression);
    encoder.write_all(input).expect("deflate write failed");
    encoder.finish().expect("deflate finish failed")
}

pub fn decompress(input: &[u8]) -> Result<Vec<u8>, String> {
    let mut decoder = DeflateDecoder::new(Vec::new());
    decoder.write_all(input).map_err(|e| e.to_string())?;
    decoder.finish().map_err(|e| e.to_string())
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_roundtrip() {
        let original = b"Hello, World! Hello, World! Hello, World!";
        let compressed = compress(original, 6);
        assert!(compressed.len() < original.len());
        let decompressed = decompress(&compressed).unwrap();
        assert_eq!(decompressed, original);
    }

    #[test]
    fn test_store_level() {
        let original = b"test data";
        let compressed = compress(original, 0);
        let decompressed = decompress(&compressed).unwrap();
        assert_eq!(decompressed, original);
    }
}
```

- [ ] **Step 10: deflate テスト実行**

Run: `cd packages/wasm-utils && cargo test deflate`
Expected: 2 tests pass

- [ ] **Step 11: lib.rs で wasm_bindgen エクスポート作成**

`packages/wasm-utils/src/lib.rs`:
```rust
mod md5;
mod crc32;
mod bcrypt;
mod deflate;

use wasm_bindgen::prelude::*;

#[wasm_bindgen]
pub fn md5(input: &str) -> String {
    md5::compute_md5(input)
}

#[wasm_bindgen]
pub fn crc32_hex(input: &str) -> String {
    crc32::compute_crc32_hex(input)
}

#[wasm_bindgen]
pub fn crc32_raw(input: &[u8]) -> u32 {
    crc32::compute_crc32_raw(input)
}

#[wasm_bindgen]
pub fn bcrypt_hash(password: &str, rounds: u32) -> Result<String, JsValue> {
    bcrypt::hash_password(password, rounds)
        .map_err(|e| JsValue::from_str(&e))
}

#[wasm_bindgen]
pub fn bcrypt_verify(password: &str, hash: &str) -> bool {
    bcrypt::verify_password(password, hash)
}

#[wasm_bindgen]
pub fn deflate(input: &[u8], level: u8) -> Vec<u8> {
    deflate::compress(input, level)
}

#[wasm_bindgen]
pub fn inflate(input: &[u8]) -> Result<Vec<u8>, JsValue> {
    deflate::decompress(input)
        .map_err(|e| JsValue::from_str(&e))
}
```

注: `bcrypt_hash` と `inflate` は `Result<T, JsValue>` を返す(設計書の `String`/`Vec<u8>` とは異なるが、エラーハンドリングのために必要)。JS側ではPromiseのreject として扱われる。

- [ ] **Step 12: 全 Rust テスト実行**

Run: `cd packages/wasm-utils && cargo test`
Expected: all tests pass

- [ ] **Step 13: WASM ビルド**

Run: `cd packages/wasm-utils && chmod +x build.sh && bash build.sh`
Expected: `pkg/` に `wasm_utils.js`, `wasm_utils_bg.wasm`, `wasm_utils.d.ts` が生成

- [ ] **Step 14: wasm-pack test で WASM 環境テスト**

Run: `cd packages/wasm-utils && wasm-pack test --node`
Expected: all tests pass in WASM environment

- [ ] **Step 15: ルート package.json に pnpm 設定追加**

`package.json` (ルート) に追加:
```json
"pnpm": {
  "onlyBuiltDependencies": ["wasm-utils"]
}
```

- [ ] **Step 16: pnpm install で workspace 認識確認**

Run: `pnpm install`
Expected: `wasm-utils` が workspace パッケージとして認識される

- [ ] **Step 17: コミット**

```bash
cd packages/wasm-utils && vp check --fix; cd ../..
git add packages/wasm-utils/ package.json pnpm-lock.yaml
git commit -m "feat: add packages/wasm-utils Rust WASM package with md5, crc32, bcrypt, deflate"
```

---

### Task 2: hash-md5 POC (WASM統合検証)

**Files:**
- Modify: `apps/hash-md5/package.json`
- Modify: `apps/hash-md5/vite.config.ts`
- Modify: `apps/hash-md5/src/utils/md5.ts`
- Modify: `apps/hash-md5/src/utils/__tests__/md5.test.ts`
- Create: `apps/hash-md5/src/utils/__tests__/setup.ts`
- Modify: `apps/hash-md5/src/App.tsx`

このタスクは Vite+/Rolldown での WASM 動作検証を兼ねる POC。ここで確立したパターンを Task 3-5 で再利用する。

- [ ] **Step 1: 依存インストール**

Run: `cd apps/hash-md5 && pnpm add -D vite-plugin-wasm vite-plugin-top-level-await && pnpm add wasm-utils@workspace:*`

- [ ] **Step 2: vite.config.ts に wasm プラグイン追加**

`apps/hash-md5/vite.config.ts` に `wasm()` と `topLevelAwait()` プラグインを追加。
`test.setupFiles` に `'./src/utils/__tests__/setup.ts'` を追加。

- [ ] **Step 3: テストを async に書き換え**

`apps/hash-md5/src/utils/__tests__/md5.test.ts` の全テストケースを `async/await` に変換:
```typescript
import { describe, expect, test } from 'vitest';
import { md5 } from '../md5';

describe('md5', () => {
  test('empty string', async () => {
    expect(await md5('')).toBe('d41d8cd98f00b204e9800998ecf8427e');
  });
  test('hello', async () => {
    expect(await md5('hello')).toBe('5d41402abc4b2a76b9719d911017c592');
  });
  test('Hello World', async () => {
    expect(await md5('Hello World')).toBe('b10a8db164e0754105b7a99be72e3fe5');
  });
  test('abc', async () => {
    expect(await md5('abc')).toBe('900150983cd24fb0d6963f7d28e17f72');
  });
  test('returns 32 char hex', async () => {
    expect(await md5('test')).toMatch(/^[0-9a-f]{32}$/);
  });
  test('same input same output', async () => {
    expect(await md5('test')).toBe(await md5('test'));
  });
  test('different input different output', async () => {
    expect(await md5('a')).not.toBe(await md5('b'));
  });
});
```

- [ ] **Step 4: テスト実行で失敗確認**

Run: `cd apps/hash-md5 && vp test`
Expected: FAIL (md5 は現在まだ同期関数)

- [ ] **Step 5: md5.ts を WASM ラッパーに差し替え**

`apps/hash-md5/src/utils/md5.ts` を全置換:
```typescript
import init, { md5 as wasmMd5 } from 'wasm-utils';

let ready: Promise<void> | null = null;

function ensure(): Promise<void> {
  if (!ready) {
    ready = init().catch((err) => {
      ready = null;
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

- [ ] **Step 6: Vitest WASM セットアップ追加**

`apps/hash-md5/src/utils/__tests__/setup.ts`:
```typescript
import { beforeAll } from 'vitest';
import init from 'wasm-utils';
beforeAll(async () => { await init(); });
```

- [ ] **Step 7: テスト PASS 確認 (POC検証)**

Run: `cd apps/hash-md5 && vp test`
Expected: 7 tests PASS

**注意:** ここで失敗した場合は設計書の R8 に従い調整。POC の目的はこのパターンを確立すること。

- [ ] **Step 8: App.tsx を非同期対応に修正**

`useMemo` -> `useEffect` + `useState`:
```typescript
const [hash, setHash] = useState('');
const [error, setError] = useState('');
useEffect(() => {
  if (!input) { setHash(''); return; }
  md5(input).then(setHash).catch((e) => setError(String(e)));
}, [input]);
```

- [ ] **Step 9: lint + コミット**

```bash
cd apps/hash-md5 && vp check --fix
git add apps/hash-md5/
git commit -m "feat(hash-md5): replace pure JS MD5 with WASM implementation"
```

---

### Task 3: hash-crc32 (WASM統合)

**Files:**
- Modify: `apps/hash-crc32/package.json`, `vite.config.ts`, `src/utils/crc32.ts`, `src/utils/__tests__/crc32.test.ts`, `src/App.tsx`
- Create: `apps/hash-crc32/src/utils/__tests__/setup.ts`

Task 2 で確立したパターンをそのまま適用する。

- [ ] **Step 1: 依存追加 + vite.config.ts 更新**

Run: `cd apps/hash-crc32 && pnpm add -D vite-plugin-wasm vite-plugin-top-level-await && pnpm add wasm-utils@workspace:*`

Task 2 と同じパターンで `vite.config.ts` に wasm プラグイン + test.setupFiles を追加。

- [ ] **Step 2: テストを async に書き換え**

`apps/hash-crc32/src/utils/__tests__/crc32.test.ts` を読み、全テストケースを `async/await` に変換。
例:
```typescript
test('empty string', async () => {
  expect(await crc32('')).toBe('00000000');
});
```
期待ハッシュ値はそのまま維持。

- [ ] **Step 3: テスト実行で失敗確認**

Run: `cd apps/hash-crc32 && vp test`
Expected: FAIL

- [ ] **Step 4: crc32.ts を WASM ラッパーに差し替え**

```typescript
import init, { crc32_hex as wasmCrc32Hex } from 'wasm-utils';

let ready: Promise<void> | null = null;
function ensure(): Promise<void> {
  if (!ready) {
    ready = init().catch((err) => { ready = null; throw err; });
  }
  return ready;
}

export async function crc32(text: string): Promise<string> {
  await ensure();
  return wasmCrc32Hex(text);
}
```

- [ ] **Step 5: setup.ts 作成 + テスト PASS 確認**

setup.ts は Task 2 と同一パターン。

Run: `cd apps/hash-crc32 && vp test`
Expected: all tests PASS

- [ ] **Step 6: App.tsx を非同期対応に修正**

Task 2 と同じパターン(`useMemo` -> `useEffect` + `useState`)。

- [ ] **Step 7: lint + コミット**

```bash
cd apps/hash-crc32 && vp check --fix
git add apps/hash-crc32/
git commit -m "feat(hash-crc32): replace pure JS CRC32 with WASM implementation"
```

---

### Task 4: bcrypt-hash (WASM統合)

**Files:**
- Modify: `apps/bcrypt-hash/package.json`, `vite.config.ts`, `src/utils/bcryptHash.ts`, `src/utils/__tests__/bcryptHash.test.ts`, `src/App.tsx`
- Create: `apps/bcrypt-hash/src/utils/__tests__/setup.ts`

- [ ] **Step 1: 依存変更(bcryptjs 削除 + wasm-utils 追加)**

Run: `cd apps/bcrypt-hash && pnpm remove bcryptjs @types/bcryptjs && pnpm add -D vite-plugin-wasm vite-plugin-top-level-await && pnpm add wasm-utils@workspace:*`

- [ ] **Step 2: vite.config.ts 更新 + setup.ts 作成**

Task 2 と同じ wasm プラグインパターン適用。

- [ ] **Step 3: 既存テストを async に書き換え**

`apps/bcrypt-hash/src/utils/__tests__/bcryptHash.test.ts` を読み、`generateHash`/`verifyHash` の呼び出しを全て `await` に変更:
```typescript
test('generates valid bcrypt hash', async () => {
  const hash = await generateHash('password', 10);
  expect(hash).toMatch(/^\$2[aby]\$\d{2}\$.{53}$/);
});
test('verifies correct password', async () => {
  const hash = await generateHash('password', 4);
  expect(await verifyHash('password', hash)).toBe(true);
});
// ... 他のテストも同様に async 化
```

- [ ] **Step 4: テスト実行で失敗確認 (Red)**

Run: `cd apps/bcrypt-hash && vp test`
Expected: FAIL (generateHash/verifyHash は現在まだ同期)

- [ ] **Step 5: bcryptHash.ts を WASM ラッパーに差し替え**

```typescript
import init, { bcrypt_hash as wasmBcryptHash, bcrypt_verify as wasmBcryptVerify } from 'wasm-utils';

let ready: Promise<void> | null = null;
function ensure(): Promise<void> {
  if (!ready) {
    ready = init().catch((err) => { ready = null; throw err; });
  }
  return ready;
}

export async function generateHash(password: string, rounds: number): Promise<string> {
  await ensure();
  return wasmBcryptHash(password, rounds);
}

export async function verifyHash(password: string, hash: string): Promise<boolean> {
  await ensure();
  return wasmBcryptVerify(password, hash);
}
```

注: `wasmBcryptHash` は `Result<String, JsValue>` を返すため、エラー時は Promise が reject される。呼び出し側で `.catch()` ハンドリングが必要。

- [ ] **Step 6: テスト PASS 確認 + バージョン識別子互換性検証**

Run: `cd apps/bcrypt-hash && vp test`
Expected: all tests PASS

bcrypt のバージョン識別子(`$2a$` vs `$2b$`)の互換性は Rust 側のテスト(Task 1 Step 7)で検証済み。
問題がある場合は Rust 側で `bcrypt::Version::TwoA` を使うように修正。

- [ ] **Step 7: App.tsx を非同期対応に修正**

`generateHash`/`verifyHash` の呼び出し箇所を `await` 対応に。エラーハンドリングも追加(WASM の bcrypt_hash が reject した場合のキャッチ)。

- [ ] **Step 8: lint + コミット**

```bash
cd apps/bcrypt-hash && vp check --fix
git add apps/bcrypt-hash/
git commit -m "feat(bcrypt-hash): replace bcryptjs with Rust WASM bcrypt implementation"
```

---

### Task 5: zip-creator (Deflate圧縮追加)

**Files:**
- Modify: `apps/zip-creator/package.json`, `vite.config.ts`, `src/utils/zipCreator.ts`, `src/App.tsx`
- Create: `apps/zip-creator/src/utils/__tests__/setup.ts`
- Create: `apps/zip-creator/src/utils/__tests__/zipCreator.test.ts`

- [ ] **Step 1: 依存追加 + vite.config.ts + setup.ts**

Run: `cd apps/zip-creator && pnpm add -D vite-plugin-wasm vite-plugin-top-level-await && pnpm add wasm-utils@workspace:*`

Task 2 と同じパターンで `vite.config.ts`, `setup.ts` を設定。

- [ ] **Step 2: 圧縮テスト作成(サイズ比較 + ラウンドトリップ)**

`apps/zip-creator/src/utils/__tests__/zipCreator.test.ts`:
```typescript
import { describe, expect, test } from 'vitest';
import { createZip } from '../zipCreator';
import { extractZip, getEntryData } from '../../../../zip-extractor/src/utils/zipExtractor';

describe('zipCreator', () => {
  test('createZip with compression produces smaller output', async () => {
    const content = new TextEncoder().encode('Hello '.repeat(100));
    const file = new File([content], 'test.txt', { type: 'text/plain' });
    const uncompressed = await createZip([file], false);
    const compressed = await createZip([file], true);
    expect(compressed.size).toBeLessThan(uncompressed.size);
  });

  test('createZip without compression preserves Store method', async () => {
    const content = new TextEncoder().encode('test');
    const file = new File([content], 'test.txt', { type: 'text/plain' });
    const blob = await createZip([file], false);
    expect(blob.size).toBeGreaterThan(0);
  });

  test('compressed zip can be extracted with correct content', async () => {
    const originalContent = 'Hello, World! '.repeat(50);
    const content = new TextEncoder().encode(originalContent);
    const file = new File([content], 'test.txt', { type: 'text/plain' });
    const blob = await createZip([file], true);
    const buffer = await blob.arrayBuffer();
    const entries = extractZip(buffer);
    expect(entries).toHaveLength(1);
    expect(entries[0].name).toBe('test.txt');
    const data = await getEntryData(entries[0]);
    expect(new TextDecoder().decode(data)).toBe(originalContent);
  });
});
```

- [ ] **Step 3: テスト実行で失敗確認**

Run: `cd apps/zip-creator && vp test`
Expected: FAIL (createZip に compress パラメータがまだない)

- [ ] **Step 4: zipCreator.ts の createZip にシグネチャ変更追加**

`createZip(files: File[], compress?: boolean)` にシグネチャを変更。`compress` がない場合は既存動作(Store)を維持。

- [ ] **Step 5: zipCreator.ts の内部 crc32 を wasm-utils に置換**

内部の `crc32()` 関数を `wasm-utils` の `crc32_raw()` に置換。

- [ ] **Step 6: zipCreator.ts に Deflate 圧縮ロジック追加**

`compress === true` の場合:
- `deflate(data, 6)` で圧縮
- Local File Header の compression method を 8 (Deflate) に設定
- Central Directory の compression method も 8 に設定
- compressed size と uncompressed size を正しく分離

- [ ] **Step 7: テスト PASS 確認**

Run: `cd apps/zip-creator && vp test`
Expected: all tests PASS

- [ ] **Step 8: App.tsx に圧縮オプション UI 追加**

チェックボックスで「圧縮する」オプション追加。デフォルト: `true`。

- [ ] **Step 9: lint + コミット**

```bash
cd apps/zip-creator && vp check --fix
git add apps/zip-creator/
git commit -m "feat(zip-creator): add Deflate compression via WASM"
```

---

### Task 6: sql-playground (sql.js 導入)

**Files:**
- Modify: `apps/sql-playground/package.json`
- Modify: `apps/sql-playground/src/utils/sqlEngine.ts` (全廃 + 新規)
- Modify: `apps/sql-playground/src/utils/__tests__/sqlEngine.test.ts` (全面書き直し)
- Modify: `apps/sql-playground/src/App.tsx`

- [ ] **Step 1: sql.js インストール**

Run: `cd apps/sql-playground && pnpm add sql.js`

- [ ] **Step 2: sql-wasm.wasm をローカルにコピー**

pnpm workspace では node_modules がhoistされるため、正確なパスを確認:
Run: `find $(pnpm root) -name "sql-wasm.wasm" -path "*/sql.js/*" 2>/dev/null | head -1`
そのパスから `apps/sql-playground/public/` にコピー:
Run: `mkdir -p apps/sql-playground/public && cp <found-path> apps/sql-playground/public/`

- [ ] **Step 3: テスト作成**

`apps/sql-playground/src/utils/__tests__/sqlEngine.test.ts` (全面書き直し):
```typescript
import { describe, expect, test, beforeAll, afterEach } from 'vitest';
import { initDatabase, executeQuery, resetDatabase } from '../sqlEngine';

beforeAll(async () => {
  await initDatabase();
});

afterEach(() => {
  try { executeQuery('DROP TABLE IF EXISTS test_table'); } catch {}
});

describe('sqlEngine (sql.js)', () => {
  test('CREATE TABLE + INSERT + SELECT', () => {
    executeQuery('CREATE TABLE test_table (id INTEGER PRIMARY KEY, name TEXT)');
    executeQuery("INSERT INTO test_table VALUES (1, 'Alice')");
    const results = executeQuery('SELECT * FROM test_table');
    expect(results[0].columns).toEqual(['id', 'name']);
    expect(results[0].values).toEqual([[1, 'Alice']]);
  });

  test('UPDATE', () => {
    executeQuery('CREATE TABLE test_table (id INTEGER, name TEXT)');
    executeQuery("INSERT INTO test_table VALUES (1, 'Alice')");
    executeQuery("UPDATE test_table SET name = 'Bob' WHERE id = 1");
    const results = executeQuery('SELECT name FROM test_table WHERE id = 1');
    expect(results[0].values[0][0]).toBe('Bob');
  });

  test('DELETE', () => {
    executeQuery('CREATE TABLE test_table (id INTEGER, name TEXT)');
    executeQuery("INSERT INTO test_table VALUES (1, 'Alice')");
    executeQuery('DELETE FROM test_table WHERE id = 1');
    const results = executeQuery('SELECT * FROM test_table');
    expect(results).toHaveLength(0);
  });

  test('invalid SQL throws', () => {
    expect(() => executeQuery('INVALID SQL')).toThrow();
  });
});
```

- [ ] **Step 4: テスト実行で失敗確認**

Run: `cd apps/sql-playground && vp test`
Expected: FAIL

- [ ] **Step 5: sqlEngine.ts を sql.js で全面書き直し**

設計書 L230-267 の API 設計を実装。CDNフォールバックは以下のパターン:

```typescript
export async function initDatabase(): Promise<void> {
  const SQL = await initSqlJs({
    locateFile: (file: string) => {
      // CDN URL を返す。sql.js は内部で fetch する。
      // CDN 失敗時のフォールバックは initSqlJs のリトライで対応
      return `https://sql.js.org/dist/${file}`;
    }
  }).catch(() => {
    // CDN 失敗時はローカルフォールバック
    return initSqlJs({
      locateFile: (file: string) => `/${file}`
    });
  });
  db = new SQL.Database();
}
```

- [ ] **Step 6: テスト PASS 確認**

Run: `cd apps/sql-playground && vp test`
Expected: all tests PASS

- [ ] **Step 7: App.tsx を sql.js 初期化対応に修正**

`initDatabase()` を `useEffect` で呼び出し、ローディング状態を管理。

- [ ] **Step 8: lint + コミット**

```bash
cd apps/sql-playground && vp check --fix
git add apps/sql-playground/
git commit -m "feat(sql-playground): replace custom SQL parser with sql.js (SQLite WASM)"
```

---

### Task 7: morpheme-analyzer (kuromoji.js 導入)

**Files:**
- Modify: `apps/morpheme-analyzer/package.json`
- Modify: `apps/morpheme-analyzer/src/utils/morpheme.ts` (全廃 + 新規)
- Modify: `apps/morpheme-analyzer/src/utils/__tests__/morpheme.test.ts` (全面書き直し)
- Modify: `apps/morpheme-analyzer/src/App.tsx`
- Create: `apps/morpheme-analyzer/public/dict/` (kuromoji 辞書)

- [ ] **Step 1: kuromoji インストール + 辞書配置**

Run: `cd apps/morpheme-analyzer && pnpm add kuromoji`

辞書ファイルを `public/dict/` にコピー:
Run: `mkdir -p apps/morpheme-analyzer/public/dict && cp $(pnpm root)/kuromoji/dict/* apps/morpheme-analyzer/public/dict/`

見つからない場合: `find $(pnpm root) -name "*.dat.gz" -path "*/kuromoji/*" | head -1` で辞書のパスを特定。

- [ ] **Step 2: テスト作成**

`apps/morpheme-analyzer/src/utils/__tests__/morpheme.test.ts` (全面書き直し):
```typescript
import { describe, expect, test, beforeAll } from 'vitest';
import path from 'node:path';
import { initTokenizer, analyze } from '../morpheme';

beforeAll(async () => {
  // テスト環境では node_modules 内の辞書パスを使用
  // (ブラウザでは '/dict/' を使うが、Node.js テストではファイルシステムパスが必要)
  const dictPath = path.resolve(__dirname, '../../../../../../node_modules/kuromoji/dict/');
  await initTokenizer(undefined, dictPath);
}, 30000);

describe('morpheme (kuromoji)', () => {
  test('basic tokenization', () => {
    const tokens = analyze('東京は日本の首都です');
    expect(tokens.length).toBeGreaterThan(0);
    expect(tokens[0].surface).toBe('東京');
    expect(tokens[0].pos).toBe('名詞');
  });

  test('reading', () => {
    const tokens = analyze('漢字');
    expect(tokens[0].reading).toBe('カンジ');
  });

  test('empty string', () => {
    const tokens = analyze('');
    expect(tokens).toHaveLength(0);
  });
});
```

- [ ] **Step 3: テスト実行で失敗確認**

Run: `cd apps/morpheme-analyzer && vp test`
Expected: FAIL

- [ ] **Step 4: morpheme.ts を kuromoji.js で全面書き直し**

設計書 L282-319 の API 設計を実装。テスト用に `dictPath` パラメータを `initTokenizer` に追加:

```typescript
export async function initTokenizer(
  onProgress?: (message: string) => void,
  dictPath: string = '/dict/'
): Promise<void> {
  return new Promise((resolve, reject) => {
    onProgress?.('辞書データを読み込み中...');
    kuromoji.builder({ dicPath: dictPath }).build((err, t) => {
      if (err) { reject(err); return; }
      tokenizer = t;
      resolve();
    });
  });
}
```

- [ ] **Step 5: テスト PASS 確認**

Run: `cd apps/morpheme-analyzer && vp test`
Expected: all tests PASS

- [ ] **Step 6: App.tsx を kuromoji 初期化対応に修正**

`initTokenizer(onProgress)` を `useEffect` で呼び出し、プログレスバーとリトライボタンを実装。

- [ ] **Step 7: lint + コミット**

```bash
cd apps/morpheme-analyzer && vp check --fix
git add apps/morpheme-analyzer/
git commit -m "feat(morpheme-analyzer): replace Unicode detection with kuromoji.js morphological analysis"
```

---

### Task 8: des-encrypt (AES-256-GCM 追加)

**Files:**
- Modify: `apps/des-encrypt/src/utils/des.ts` (既存3DES関数はそのまま残し、AES関数を追加)
- Modify: `apps/des-encrypt/src/utils/__tests__/des.test.ts` (既存3DESテストはそのまま残し、AESテストを追加)
- Modify: `apps/des-encrypt/src/App.tsx`

- [ ] **Step 1: AES テストを既存テストファイルに追加**

`apps/des-encrypt/src/utils/__tests__/des.test.ts` に AES テストを **追記** (既存の3DESテストは維持):

```typescript
import { aesEncrypt, aesDecrypt } from '../des';

describe('AES-256-GCM', () => {
  test('encrypt and decrypt roundtrip', async () => {
    const plaintext = 'Hello, World!';
    const key = 'my-secret-key-123';
    const encrypted = await aesEncrypt(plaintext, key);
    const decrypted = await aesDecrypt(encrypted, key);
    expect(decrypted).toBe(plaintext);
  });

  test('wrong key fails to decrypt', async () => {
    const encrypted = await aesEncrypt('secret', 'key1');
    await expect(aesDecrypt(encrypted, 'key2')).rejects.toThrow();
  });

  test('empty string roundtrip', async () => {
    const encrypted = await aesEncrypt('', 'key');
    const decrypted = await aesDecrypt(encrypted, 'key');
    expect(decrypted).toBe('');
  });
});
```

- [ ] **Step 2: テスト実行で失敗確認 (AES部分のみ)**

Run: `cd apps/des-encrypt && vp test`
Expected: 既存3DESテスト PASS、AESテスト FAIL (aesEncrypt/aesDecrypt 未定義)

- [ ] **Step 3: des.ts に AES-256-GCM 実装追加**

既存の `desEncrypt`/`desDecrypt` はそのまま残し、`aesEncrypt`/`aesDecrypt` を追加:

```typescript
export async function aesEncrypt(plaintext: string, passphrase: string): Promise<string> {
  const encoder = new TextEncoder();
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const keyMaterial = await crypto.subtle.importKey(
    'raw', encoder.encode(passphrase), 'PBKDF2', false, ['deriveBits', 'deriveKey']
  );
  const key = await crypto.subtle.deriveKey(
    { name: 'PBKDF2', salt, iterations: 100000, hash: 'SHA-256' },
    keyMaterial, { name: 'AES-GCM', length: 256 }, false, ['encrypt']
  );
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const encrypted = await crypto.subtle.encrypt(
    { name: 'AES-GCM', iv }, key, encoder.encode(plaintext)
  );
  const combined = new Uint8Array(salt.length + iv.length + new Uint8Array(encrypted).length);
  combined.set(salt, 0);
  combined.set(iv, salt.length);
  combined.set(new Uint8Array(encrypted), salt.length + iv.length);
  return btoa(String.fromCharCode(...combined));
}

export async function aesDecrypt(ciphertext: string, passphrase: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = Uint8Array.from(atob(ciphertext), c => c.charCodeAt(0));
  const salt = data.slice(0, 16);
  const iv = data.slice(16, 28);
  const encrypted = data.slice(28);
  const keyMaterial = await crypto.subtle.importKey(
    'raw', encoder.encode(passphrase), 'PBKDF2', false, ['deriveBits', 'deriveKey']
  );
  const key = await crypto.subtle.deriveKey(
    { name: 'PBKDF2', salt, iterations: 100000, hash: 'SHA-256' },
    keyMaterial, { name: 'AES-GCM', length: 256 }, false, ['decrypt']
  );
  const decrypted = await crypto.subtle.decrypt(
    { name: 'AES-GCM', iv }, key, encrypted
  );
  return new TextDecoder().decode(decrypted);
}
```

- [ ] **Step 4: テスト PASS 確認 (全テスト: 3DES + AES)**

Run: `cd apps/des-encrypt && vp test`
Expected: all tests PASS (既存3DES + 新AES)

- [ ] **Step 5: App.tsx にアルゴリズム切り替え UI 追加**

Select で「推奨: AES-256-GCM」と「レガシー: 3DES」を切り替え。デフォルト AES-256。

- [ ] **Step 6: lint + コミット**

```bash
cd apps/des-encrypt && vp check --fix
git add apps/des-encrypt/
git commit -m "feat(des-encrypt): add AES-256-GCM via Web Crypto API as recommended option"
```

---

### Task 9: ビルドスクリプト + MCP設計書更新

**Files:**
- Create: `scripts/build-all.sh`
- Modify: `.docs/plans/mcp-server-design.md`

- [ ] **Step 1: build-all.sh 新規作成**

`scripts/build-all.sh` は現在存在しない(CLAUDE.md に参照はあるが未作成)。設計書 L417-433 の内容で新規作成。

```bash
chmod +x scripts/build-all.sh
```

- [ ] **Step 2: MCP設計書に async 注記追加**

`.docs/plans/mcp-server-design.md` の `hash_md5`, `hash_crc32` ツール記述に `(async)` の注記を追加。

- [ ] **Step 3: コミット**

```bash
git add scripts/build-all.sh .docs/plans/mcp-server-design.md
git commit -m "chore: add build-all.sh and update MCP design for async hash functions"
```
