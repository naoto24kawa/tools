# MCP Server 設計書

## 概要

Elchika Tools の既存テキスト系ツールのコアロジック(純粋関数)を MCP (Model Context Protocol) サーバーとして公開する。Cloudflare Workers 上にデプロイし、Streamable HTTP トランスポートで提供する。

## 目的

- AI エージェント(Claude Code 等)からテキスト変換・エンコード・ハッシュ・暗号化ツールを直接呼び出せるようにする
- 将来的に REST API も同一基盤上に追加可能な構成にする

## スコープ

### 含む

- テキスト系ツール(encode, hash, crypto, text)の MCP Tool 化
- Cloudflare Workers へのデプロイ
- 基本的な統合テスト

### 含まない

- 画像系ツール(Canvas API 依存)
- 認証・レート制限(将来追加)
- REST API エンドポイント(将来追加)
- 既存アプリのリファクタ

## アーキテクチャ

### ディレクトリ構成

```
packages/mcp-server/
  src/
    index.ts              # Hono + Streamable HTTP エントリポイント
    mcp.ts                # McpServer インスタンス生成・全ツール登録
    tools/
      encode.ts           # encode系 MCP Tool 定義
      hash.ts             # hash系 MCP Tool 定義
      crypto.ts           # 暗号系 MCP Tool 定義
      text.ts             # テキスト系 MCP Tool 定義 (wrapper 含む)
    empty.ts              # alias 用空モジュール (wrangler alias 参照先)
    __tests__/
      tools.test.ts       # 統合テスト
  package.json
  wrangler.toml
  tsconfig.json
```

### tsconfig.json

`packages/router/tsconfig.json` と同じパターン:

```json
{
  "extends": "../../tsconfig.base.json",
  "compilerOptions": {
    "types": ["@cloudflare/workers-types"]
  },
  "include": ["src"],
  "exclude": ["src/**/__tests__/**", "src/**/*.test.ts"]
}
```

### 処理フロー

```
MCP Client (Claude Code, etc.)
  -> POST /mcp (Streamable HTTP)
    -> Hono Router
      -> MCP Server (tool dispatch)
        -> apps/*/src/utils/ の純粋関数
          -> MCP Response (text content)
```

### 依存関係

```
packages/mcp-server/
  dependencies:
    @modelcontextprotocol/sdk    # MCP プロトコル
    hono                         # HTTP フレームワーク (router と統一)
    fetch-to-node                # Fetch API -> Node.js req/res 変換 (CF Workers 互換)
    zod                          # スキーマ定義 (MCP SDK の peer dependency)
  devDependencies:
    @cloudflare/workers-types    # CF Workers 型定義
    wrangler                     # デプロイ・開発ツール
    vitest                       # テストフレームワーク
  internal (相対パス import):
    apps/*/src/utils/*           # コアロジック (パスエイリアス非依存のもののみ)
```

## MCP Tool 定義一覧

### 命名規約

ツール名は `{category}_{action}` 形式で統一する。

- Encode 系: `encode_{format}`, `decode_{format}`
- Hash 系: `hash_{algorithm}`
- Crypto 系: `cipher_{name}_{action}` (対称暗号で暗号化=復号の場合は action 省略: `cipher_rot`, `cipher_atbash`)
- Text 系: `text_{action}`

### Encode 系 (20 tools)

| Tool 名 | Description | ソース | 関数 | 入力 |
|---------|-------------|--------|------|------|
| `encode_base64` | Base64 エンコード | `apps/encode-base64-string/src/utils/base64.ts` | `encodeBase64(text)` | `text: string` |
| `decode_base64` | Base64 デコード | 同上 | `decodeBase64(encoded)` | `text: string` |
| `encode_base32` | Base32 エンコード | `apps/encode-base32/src/utils/base32.ts` | `encodeBase32(input)` | `text: string` |
| `decode_base32` | Base32 デコード | 同上 | `decodeBase32(encoded)` | `text: string` |
| `encode_binary` | テキストを2進数に変換 | `apps/encode-binary/src/utils/binary.ts` | `textToBinary(text)` | `text: string` |
| `decode_binary` | 2進数をテキストに変換 | 同上 | `binaryToText(binary)` | `text: string` |
| `encode_hex` | テキストを16進数に変換 | 同上 | `textToHex(text)` | `text: string` |
| `decode_hex` | 16進数をテキストに変換 | 同上 | `hexToText(hex)` | `text: string` |
| `encode_decimal` | テキストを10進数(文字コード)に変換 | 同上 | `textToDecimal(text)` | `text: string` |
| `decode_decimal` | 10進数(文字コード)をテキストに変換 | 同上 | `decimalToText(decimal)` | `text: string` |
| `encode_html_entity` | HTML 特殊文字をエンティティに変換 | `apps/encode-html-entity/src/utils/htmlEntity.ts` | `encodeHTMLEntities(text)` | `text: string` |
| `decode_html_entity` | HTML エンティティをデコード | 同上 | `decodeHTMLEntities(text)` | `text: string` |
| `encode_morse` | テキストをモールス符号に変換 | `apps/encode-morse/src/utils/morse.ts` | `textToMorse(text)` | `text: string` |
| `decode_morse` | モールス符号をテキストに変換 | 同上 | `morseToText(morse)` | `text: string` |
| `encode_punycode` | ドメインを ASCII(Punycode)に変換 | `apps/encode-punycode/src/utils/punycode.ts` | `domainToASCII(domain)` | `domain: string` |
| `decode_punycode` | Punycode ドメインを Unicode に変換 | 同上 | `domainFromASCII(domain)` | `domain: string` |
| `encode_unicode_escape` | テキストを Unicode エスケープに変換 | `apps/encode-unicode/src/utils/unicode.ts` | `textToUnicodeEscape(text)` | `text: string` |
| `decode_unicode_escape` | Unicode エスケープをテキストに変換 | 同上 | `unicodeEscapeToText(escaped)` | `text: string` |
| `encode_url` | URL エンコード | 組み込み | `encodeURIComponent(text)` | `text: string` |
| `decode_url` | URL デコード | 組み込み | `decodeURIComponent(text)` | `text: string` |

### Hash 系 (5 tools)

| Tool 名 | Description | ソース | 関数 | 入力 |
|---------|-------------|--------|------|------|
| `hash_md5` | MD5 ハッシュを生成 (async, WASM) | `apps/hash-md5/src/utils/md5.ts` | `md5(text)` | `text: string` |
| `hash_crc32` | CRC32 チェックサムを生成(16進数文字列で返却) (async, WASM) | `apps/hash-crc32/src/utils/crc32.ts` | `crc32(text)` | `text: string` |
| `hash_sha1` | SHA-1 ハッシュを生成 (async) | `apps/hash-sha1/src/utils/sha1.ts` | `generateSHA1(text)` | `text: string` |
| `hash_sha` | SHA-256/384/512 ハッシュを生成 (async) | `apps/hash-sha256/src/utils/sha.ts` | `generateSHA(text, algorithm)` | `text: string, algorithm: "SHA-256" \| "SHA-384" \| "SHA-512"` |
| `hash_hmac` | HMAC 認証コードを生成 (async) | `apps/hash-hmac/src/utils/hmac.ts` | `generateHMAC(message, secret, algorithm)` | `message: string, secret: string, algorithm: "SHA-256" \| "SHA-384" \| "SHA-512" \| "SHA-1"` |

### Crypto 系 (12 tools)

| Tool 名 | Description | ソース | 関数 | 入力 |
|---------|-------------|--------|------|------|
| `cipher_caesar_encrypt` | シーザー暗号で暗号化 | `apps/crypto-caesar/src/utils/caesar.ts` | `caesarEncrypt(text, shift)` | `text: string, shift: number` |
| `cipher_caesar_decrypt` | シーザー暗号を復号 | 同上 | `caesarDecrypt(text, shift)` | `text: string, shift: number` |
| `cipher_caesar_bruteforce` | シーザー暗号の全シフト総当たり | 同上 | `bruteForce(text)` | `text: string` |
| `cipher_rot` | ROT13/18/47 変換 | `apps/crypto-rot13/src/utils/rot.ts` | `rot13()`, `rot18()`, `rot47()` | `text: string, variant: "rot13" \| "rot18" \| "rot47"` |
| `cipher_vigenere_encrypt` | ヴィジュネル暗号で暗号化 | `apps/crypto-vigenere/src/utils/vigenere.ts` | `vigenereEncrypt(text, key)` | `text: string, key: string` |
| `cipher_vigenere_decrypt` | ヴィジュネル暗号を復号 | 同上 | `vigenereDecrypt(text, key)` | `text: string, key: string` |
| `cipher_atbash` | アトバシュ暗号(暗号化=復号) | `apps/crypto-atbash/src/utils/atbash.ts` | `atbash(text)` | `text: string` |
| `cipher_affine_encrypt` | アフィン暗号で暗号化 | `apps/crypto-affine/src/utils/affine.ts` | `affineEncrypt(text, a, b)` | `text: string, a: number, b: number` |
| `cipher_affine_decrypt` | アフィン暗号を復号 | 同上 | `affineDecrypt(text, a, b)` | `text: string, a: number, b: number` |
| `cipher_rail_fence_encrypt` | レールフェンス暗号で暗号化 | `apps/crypto-rail-fence/src/utils/railFence.ts` | `railFenceEncrypt(text, rails)` | `text: string, rails: number` |
| `cipher_rail_fence_decrypt` | レールフェンス暗号を復号 | 同上 | `railFenceDecrypt(text, rails)` | `text: string, rails: number` |
| `cipher_enigma` | Enigma 暗号マシンで暗号化(対称暗号) | `apps/enigma-cipher/src/utils/enigma.ts` | `enigmaEncrypt(text, config)` | `text: string, rotors?: [RotorName, RotorName, RotorName] (RotorName = "I"\|"II"\|"III"), positions?: [number, number, number]` (wrapper で `EnigmaConfig` を組み立て、未指定時は `DEFAULT_CONFIG {rotors:["I","II","III"], positions:[0,0,0]}` を使用) |

### Text 系 (2 tools)

| Tool 名 | Description | ソース | 関数 | 入力 |
|---------|-------------|--------|------|------|
| `text_analyze` | テキストの文字数・単語数・行数等を分析 | wrapper (後述) | `analyzeText(text, settings)` | `text: string, language?: "ja" \| "en" \| "auto"` |
| `text_deduplicate` | テキストの重複行を削除 | wrapper (後述) | `deduplicateLines(text, settings)` | `text: string, caseSensitive?: boolean, trimWhitespace?: boolean, keepEmptyLines?: boolean` |

### 合計: 39 tools

## ツール登録パターン

```typescript
// tools/encode.ts
import { z } from 'zod';
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { encodeBase64, decodeBase64 } from '../../../../apps/encode-base64-string/src/utils/base64';

export function registerEncodeTools(server: McpServer) {
  server.tool(
    'encode_base64',
    'Base64 エンコード',
    { text: z.string().describe('エンコードするテキスト') },
    async ({ text }) => ({
      content: [{ type: 'text', text: encodeBase64(text) }],
    })
  );

  server.tool(
    'decode_base64',
    'Base64 デコード',
    { text: z.string().describe('デコードする Base64 文字列') },
    async ({ text }) => ({
      content: [{ type: 'text', text: decodeBase64(text) }],
    })
  );

  // ... 他の encode ツール
}
```

## エラーハンドリング

MCP ツールでエラーが発生した場合、`isError: true` でエラーメッセージを返す。例外をスローしない。

```typescript
server.tool(
  'decode_base64',
  'Base64 デコード',
  { text: z.string() },
  async ({ text }) => {
    try {
      return { content: [{ type: 'text', text: decodeBase64(text) }] };
    } catch (e) {
      return {
        isError: true,
        content: [{ type: 'text', text: `デコードエラー: ${e instanceof Error ? e.message : String(e)}` }],
      };
    }
  }
);
```

全ツールの handler を try-catch で囲み、不正入力時は `isError: true` + エラーメッセージを返す。

### 特殊な戻り値のシリアライズ

- `cipher_caesar_bruteforce`: 戻り値 `{shift: number, result: string}[]` を `JSON.stringify(result, null, 2)` で text content に変換
- `text_analyze`: 戻り値 `TextStats` オブジェクトを `JSON.stringify(result, null, 2)` で text content に変換
- `cipher_rot`: 実装で `variant` に基づく switch dispatch が必要 (元関数は `rot13`/`rot18`/`rot47` 個別 export)
- `cipher_enigma`: `EnigmaConfig` オブジェクトを MCP パラメータから組み立てる wrapper が必要

## mcp.ts (McpServer 定義)

```typescript
// src/mcp.ts
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { registerEncodeTools } from './tools/encode';
import { registerHashTools } from './tools/hash';
import { registerCryptoTools } from './tools/crypto';
import { registerTextTools } from './tools/text';

export function createMcpServer(): McpServer {
  const server = new McpServer({
    name: 'elchika-tools',
    version: '1.0.0',
  });

  registerEncodeTools(server);
  registerHashTools(server);
  registerCryptoTools(server);
  registerTextTools(server);

  return server;
}
```

## エントリポイント

CF Workers は Fetch API ベースのため、MCP SDK の `StreamableHTTPServerTransport` (Node.js `http.IncomingMessage` 前提) を直接使えない。`fetch-to-node` で変換する。

`@modelcontextprotocol/sdk` が内部依存する `raw-body` と `content-type` は CF Workers で不要なため、wrangler の alias で空モジュールに差し替える(バンドルサイズ削減)。

```typescript
// src/index.ts
import { Hono } from 'hono';
import { toReqRes, toFetchResponse } from 'fetch-to-node';
import { StreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/streamableHttp.js';
import { createMcpServer } from './mcp';

const app = new Hono();

// 入力サイズ制限 (1MB)
const MAX_BODY_SIZE = 1024 * 1024;

// MCP Streamable HTTP エンドポイント
app.post('/mcp', async (c) => {
  const contentLength = Number(c.req.header('content-length') || 0);
  if (contentLength > MAX_BODY_SIZE) {
    return c.json({ error: 'Request body too large' }, 413);
  }

  const server = createMcpServer();
  const transport = new StreamableHTTPServerTransport({ sessionIdGenerator: undefined });
  await server.connect(transport);

  // 注: body を先に読んでから toReqRes を呼ぶ。
  // transport.handleRequest の第3引数(parsedBody)に渡すことで、
  // transport は stream を読まず parsed body を使う。
  // (参照: mcp-hono-stateless の実装パターン)
  const body = await c.req.json();
  const { req, res } = toReqRes(c.req.raw);
  await transport.handleRequest(req, res, body);
  return toFetchResponse(res);
});

app.get('/mcp', async (c) => {
  c.header('Allow', 'POST');
  return c.text('SSE not supported in stateless mode', 405);
});

app.delete('/mcp', async (c) => {
  return c.json({ ok: true }, 200);
});

app.get('/health', (c) => c.json({ status: 'ok' }));

export default app;
```

## デプロイ

### wrangler.toml

```toml
name = "tools-mcp-server"
main = "src/index.ts"
compatibility_date = "2025-04-22"
compatibility_flags = ["nodejs_compat"]

# MCP SDK の Node.js 依存モジュールを空モジュールに差し替え
# StreamableHTTPServerTransport が parsedBody 引数を使う場合、
# raw-body は body 読み取りに使われない。content-type も同様。
# (参照: mcp-hono-stateless の実装パターン)
# 実装時に SDK ソースで実際の呼び出し有無を確認すること。
[alias]
"raw-body" = "./src/empty.ts"
"content-type" = "./src/empty.ts"

# Custom Domain (packages/router と同じパターン)
# wrangler deploy 時に Cloudflare DNS に自動で AAAA レコードが作成される
[[routes]]
pattern = "mcp.tools.elchika.app"
custom_domain = true
```

`src/empty.ts` (CJS/ESM 両方の import パターンに対応):
```typescript
export default function noop() {}
export const parse = noop;
```

### URL

- MCP エンドポイント: `https://mcp.tools.elchika.app/mcp`
- ヘルスチェック: `https://mcp.tools.elchika.app/health`
- Workers プロジェクト名: `tools-mcp-server`
- MCP サーバー識別名: `elchika-tools` (クライアント設定で使用)

### MCP クライアント設定例

```json
{
  "mcpServers": {
    "elchika-tools": {
      "type": "url",
      "url": "https://mcp.tools.elchika.app/mcp"
    }
  }
}
```

## テスト戦略

- 既存の `apps/*/src/utils/__tests__/` ユニットテストはそのまま維持
- `packages/mcp-server/src/__tests__/tools.test.ts` に MCP 層の統合テスト追加
  - テスト時は `McpServer` + `InMemoryTransport` で Transport 層をモック
    ```typescript
    // 注: import パスは SDK バージョンにより変わる可能性あり。
    // 実装時に node_modules/@modelcontextprotocol/sdk/package.json の
    // exports フィールドを確認すること。
    import { InMemoryTransport } from '@modelcontextprotocol/sdk/inMemory.js';
    ```
  - 各ツールの正常呼び出し -> 期待レスポンス確認
  - エラーケース: 不正入力時に `isError: true` が返ること
  - async ツール (`hash_sha1`, `hash_sha`, `hash_hmac`) の await 確認
  - `cipher_caesar_bruteforce` の JSON シリアライズ結果が有効な JSON であること
  - `text_analyze` の JSON 戻り値に全フィールドが含まれること
  - 入力サイズ超過時の 413 レスポンス確認

## セキュリティ考慮

- 初回リリースは認証なし(全ツールが公開情報の変換のみで、秘密情報を扱わないため)
- 入力サイズ制限: 1MB (DoS 防止、`content-length` ヘッダーチェック + CF Workers のデフォルトボディサイズ上限 100MB がフォールバック。`content-length` ヘッダーは省略可能なため、本チェックは best-effort である点に留意)
- CORS: 全オリジン許可(MCP クライアントからの利用を想定)
- Host ヘッダー検証: CF Workers Custom Domain が自動的に不正な Host を拒否する
- 将来: API キー認証、レート制限を追加可能

## 将来の拡張パス

1. **REST API 追加**: `/api/v1/<tool-name>` エンドポイント
2. **ツール追加**: 日時系・CSS系・コード系ツール
3. **認証**: API キー / OAuth
4. **shared-utils 抽出**: apps と mcp-server の共有パッケージ化
5. **MCP Resources**: ツール一覧やカテゴリ情報の Resource 提供

## 注意事項

### Import 戦略

大部分のツールは apps の utils を相対パスで直接 import する。ただし `@types` パスエイリアスや相対パス import にトランジティブ依存する 2 ファイルは例外。

**直接 import 可能** (パスエイリアス非依存):
- `apps/encode-*/src/utils/*.ts` - 全て純粋関数、外部依存なし
- `apps/hash-*/src/utils/*.ts` - `crypto.subtle` のみ (CF Workers ネイティブ)
- `apps/crypto-*/src/utils/*.ts` - 全て純粋関数、外部依存なし
- `apps/enigma-cipher/src/utils/enigma.ts` - 型定義は同ファイル内

**wrapper が必要** (`@types` パスエイリアス依存):

1. `apps/text-counter/src/utils/textAnalysis.ts`
   - `@types` から `CountSettings`, `Language`, `TextStats` を import
   - `../config/constants` から `READING_SPEED` を import (constants.ts 自体も `@types` に依存)
   - **対応**: `tools/text.ts` に型・定数をインライン定義し、`analyzeText` 相当のロジックを wrapper として再実装

2. `apps/text-deduplicate/src/utils/deduplicate.ts`
   - `@types` から `DeduplicateSettings` を import
   - **対応**: `tools/text.ts` に `DeduplicateSettings` をインライン定義し、`deduplicateLines` 相当のロジックを wrapper として再実装

### wrapper の具体例 (text.ts)

```typescript
// tools/text.ts

// --- text_analyze ---
// CountSettings (apps/text-counter/src/types/index.ts より)
interface CountSettings {
  includeSpaces: boolean;
  includeLineBreaks: boolean;
  includeSymbols: boolean;
  language: 'ja' | 'en' | 'auto';
}

// READING_SPEED (apps/text-counter/src/config/constants.ts より)
const READING_SPEED = { ja: 500, en: 225 } as const;

// analyzeText は textAnalysis.ts を直接 import せず、
// ロジックをインラインで再実装(依存チェーンを断ち切るため)
// MCP ツールの入力は `language` のみ。
// CountSettings の includeSpaces/includeLineBreaks/includeSymbols は
// MCP では常に true 固定とする(全文字をカウントする標準的な動作)。
// これらをMCPパラメータとして公開しない理由:
// - AIエージェントの主要ユースケースはフルカウントであり、部分除外の需要が低い
// - パラメータを増やすとツール選択の認知負荷が上がる
function analyzeTextLocal(text: string, language: 'ja' | 'en' | 'auto' = 'auto') {
  const settings: CountSettings = {
    includeSpaces: true,
    includeLineBreaks: true,
    includeSymbols: true,
    language,
  };
  // ... textAnalysis.ts のロジックを複製
  // 注: 元ファイルの変更時は手動同期が必要
}

// --- text_deduplicate ---
// DeduplicateSettings (apps/text-deduplicate/src/types/index.ts より)
interface DeduplicateSettings {
  caseSensitive: boolean;
  trimWhitespace: boolean;
  keepEmptyLines: boolean;
}

// deduplicateLines は deduplicate.ts を直接 import せず、ロジックをインラインで再実装
function deduplicateLinesLocal(text: string, settings: DeduplicateSettings): string {
  // ... deduplicate.ts のロジックを複製
}
```

### その他

- `hash-sha1`, `hash-sha`, `hash-hmac` は async 関数 (`crypto.subtle` 使用)。MCP tool handler は async なので問題なし
- `url-encoder` は utils 分離されていないため、組み込み `encodeURIComponent`/`decodeURIComponent` を直接使用
- `cipher_rot` は `variant` パラメータに基づく switch dispatch を実装側で行う(元関数は `rot13`/`rot18`/`rot47` 個別 export)
- `cipher_enigma` は `EnigmaConfig` 型のオブジェクトを構築する wrapper が必要。MCP パラメータ `rotors` と `positions` からデフォルト値付きで組み立てる
- `cipher_affine` の `a` パラメータは 26 と互いに素である必要がある(有効値: 1,3,5,7,9,11,15,17,19,21,23,25)。バリデーションを tool handler 内で行う
- `bruteForce` の戻り値 `{shift: number, result: string}[]` は `JSON.stringify` で text content に変換する

### スコープ外とした関数

以下の関数は意図的にスコープ外とした:

- `encodeAllHTMLEntities` (htmlEntity.ts) - `encodeHTMLEntities` で主要ユースケースをカバー。全文字数値参照は需要が限定的
- `textToCodePoints` (unicode.ts) - Unicode エスケープと機能が重複。将来追加可能
- `detectLanguage` (textAnalysis.ts) - `text_analyze` の内部処理で使用。単独ツールとしての需要は低い
- `getRemovedLineCount` (deduplicate.ts) - `text_deduplicate` のレスポンスに付加情報として含めることは将来検討
- `isValidA`, `VALID_A_VALUES` (affine.ts) - `cipher_affine_encrypt` 内のバリデーションで使用。単独公開は不要
- `text-encryption` (AES-GCM 暗号化) - パスフレーズベースの暗号化は MCP 経由で秘密情報を送るリスクがあるため除外
