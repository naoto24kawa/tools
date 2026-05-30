# ローカル stdio MCP サーバー — 設計書

**Goal:** Claude Code から Elchika Tools のユーティリティ関数を MCP Tool として透過的に呼び出せるようにする。データはユーザーのマシン外に出ない。

**Architecture:** `packages/mcp-server/` に stdio MCP サーバーを1つ作り、`run(tool, input)` という単一ツールで全ユーティリティを呼び出せるようにする。ビルドステップなし（`tsx` 直実行）。

**Tech Stack:** `@modelcontextprotocol/sdk`, `tsx`, `zod`, TypeScript

---

## 設計方針

- **1ツールのみ**: Claude Code のコンテキスト消費を最小化するため、MCP ツールは `run` の1つだけ
- **列挙ディスパッチ**: `tool` パラメータが全ツール名の enum → Claude が自分で選べる
- **ローカル実行**: stdio トランスポート、デプロイ不要、データ外部非送信
- **ビルドレス**: `npx tsx` で TypeScript を直実行
- **既存 utils 再利用**: `apps/*/src/utils/` の純粋関数をそのまま import

---

## ファイル構成

```
packages/mcp-server/
  src/
    index.ts      # MCP サーバーエントリポイント（~50行）
    registry.ts   # ツール名 → 純粋関数マッピング（~300行）
  package.json
  tsconfig.json
```

---

## データフロー

```
Claude Code
  └─(stdio)─▶ npx tsx packages/mcp-server/src/index.ts
                └─ run({ tool: "json-formatter", input: '{"a":1}' })
                     └─ REGISTRY["json-formatter"]('{"a":1}')
                          └─ apps/json-formatter/src/utils/jsonFormatter.ts
                               └─ '{\n  "a": 1\n}'  ─▶ Claude Code
```

ネットワーク通信: **なし**

---

## `index.ts` 設計

```typescript
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod';
import { REGISTRY, TOOL_NAMES } from './registry.js';

const server = new McpServer({ name: 'elchika-tools', version: '1.0.0' });

server.tool(
  'run',
  [
    'Elchika Tools のユーティリティを実行する。',
    '`tool` に操作名（下記 enum から選択）、`input` に処理対象テキストを渡す。',
    '複数パラメータが必要な場合は `input` を JSON 文字列にする。',
    '戻り値は常に文字列。',
  ].join('\n'),
  {
    tool: z.enum(TOOL_NAMES).describe('実行するツール名'),
    input: z.string().describe('処理対象テキスト（複数パラメータは JSON 文字列）'),
  },
  async ({ tool, input }) => {
    try {
      const result = await REGISTRY[tool](input);
      return { content: [{ type: 'text', text: String(result) }] };
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      return { content: [{ type: 'text', text: `Error: ${msg}` }], isError: true };
    }
  }
);

const transport = new StdioServerTransport();
await server.connect(transport);
```

---

## `registry.ts` 設計

```typescript
// ツール名 → 関数のマッピング
// 関数シグネチャ: (input: string) => string | Promise<string>

import { formatJson } from '../../apps/json-formatter/src/utils/jsonFormatter.js';
import { encodeBase64 } from '../../apps/encode-base64-string/src/utils/base64.js';
// ... 全ツールを import

export const REGISTRY: Record<string, (input: string) => string | Promise<string>> = {
  'json-formatter': (input) => formatJson(input),
  'base64-encode':  (input) => encodeBase64(input),
  // ...
};

export const TOOL_NAMES = Object.keys(REGISTRY) as [string, ...string[]];
```

---

## 登録ツールのスコープ

### ✅ 含む（Node.js 純粋関数 / 推定 ~100 ツール）

| カテゴリ | ツール例 |
|---------|---------|
| テキスト変換 | case-converter, slugify, reverse, deduplicate, kana-converter, line-number, sort, prefix-suffix, replace, word-frequency |
| エンコード | base64-encode/decode, url-encode/decode, html-entity-encode/decode, uuencode/decode |
| ハッシュ | md5, sha-1, sha-256, sha-512, hmac |
| 暗号 | caesar, rot13, atbash, vigenere |
| フォーマット | json-formatter, xml-formatter, yaml-formatter, html-formatter, html-minifier, css-formatter, scss-formatter, markdown-to-html, typescript-formatter |
| バリデーター | html-validator, xml-validator, yaml-validator, toml-validator, package-json-validator, password-checker |
| データ変換 | xml-to-json, json-to-xml, yaml-to-json, json-to-yaml, toml-to-json |
| 計算 | math-percentage, unit-converter, geo-distance, subnet-calculator, cidr-calculator, discount-calculator, tax-calculator |
| その他 | uuid-generator, url-parser, user-agent-parser, lorem-ipsum, diff-checker, readability |

### ❌ 除外（ブラウザ API 依存）

| カテゴリ | 理由 |
|---------|------|
| image-* | Canvas API |
| video-* | MediaRecorder |
| pdf-* | window.print() |
| text-speech | SpeechSynthesis |
| webcam, whiteboard | getUserMedia / Canvas |

---

## `.mcp.json` 設定

```json
{
  "mcpServers": {
    "playwright": {
      "command": "npx",
      "args": ["@playwright/mcp@latest"]
    },
    "elchika-tools": {
      "command": "npx",
      "args": ["tsx", "packages/mcp-server/src/index.ts"]
    }
  }
}
```

---

## `package.json`

```json
{
  "name": "mcp-server",
  "version": "1.0.0",
  "private": true,
  "type": "module",
  "scripts": {
    "start": "tsx src/index.ts",
    "test": "vitest run"
  },
  "dependencies": {
    "@modelcontextprotocol/sdk": "^1.12.0",
    "zod": "^3.25.0"
  },
  "devDependencies": {
    "tsx": "^4.19.0",
    "typescript": "^5.9.3",
    "vitest": "^3.2.0"
  }
}
```

---

## `tsconfig.json`

```json
{
  "extends": "../../tsconfig.base.json",
  "compilerOptions": {
    "module": "NodeNext",
    "moduleResolution": "NodeNext"
  },
  "include": ["src"]
}
```

---

## エラーハンドリング

- ツール関数が例外を投げた場合、`isError: true` で `Error: <message>` を返す
- 不正な JSON input は各ツールが自前でバリデーション（MCP サーバー側は素通し）

---

## テスト方針

- `registry.ts` の関数を直接 import して入出力を検証するユニットテストのみ
- MCP プロトコル層のテストは不要（SDK が保証）

```typescript
// src/__tests__/registry.test.ts
import { REGISTRY } from '../registry.js';

test('json-formatter', () => {
  expect(REGISTRY['json-formatter']('{"a":1}')).toContain('"a": 1');
});
test('base64-encode', () => {
  expect(REGISTRY['base64-encode']('hello')).toBe('aGVsbG8=');
});
```

---

## 成功基準

1. `npx tsx packages/mcp-server/src/index.ts` が起動する
2. `.mcp.json` に登録後、Claude Code が `run` ツールを自動認識する
3. `run({ tool: "json-formatter", input: '{"a":1}' })` が整形済み JSON を返す
4. データがネットワークに送出されない
