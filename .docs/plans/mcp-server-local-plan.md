# ローカル stdio MCP サーバー Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Claude Code から `run(tool, input)` 1ツールで Elchika Tools のユーティリティ関数群を呼び出せるローカル stdio MCP サーバーを構築する。

**Architecture:** `packages/mcp-server/` に TypeScript で MCP サーバーを実装し、`apps/*/src/utils/` の純粋関数を `registry.ts` に集約する。`tsx` で直実行（ビルドステップなし）。`.mcp.json` に登録するとこのリポジトリを開いた Claude Code が自動認識する。

**Tech Stack:** `@modelcontextprotocol/sdk`, `tsx`, `zod`, TypeScript, Vitest

---

## ファイル構成

| ファイル | 操作 | 責務 |
|---------|------|------|
| `packages/mcp-server/package.json` | 新規作成 | 依存関係・スクリプト定義 |
| `packages/mcp-server/tsconfig.json` | 新規作成 | TypeScript 設定（base 拡張） |
| `packages/mcp-server/src/registry.ts` | 新規作成 | ツール名 → 純粋関数マッピング（30 ツール） |
| `packages/mcp-server/src/index.ts` | 新規作成 | MCP stdio サーバーエントリポイント |
| `packages/mcp-server/src/__tests__/registry.test.ts` | 新規作成 | registry の入出力ユニットテスト |
| `.mcp.json` | 修正 | `elchika-tools` サーバー登録を追加 |

---

## Task 1: パッケージスキャフォールド

**Files:**
- Create: `packages/mcp-server/package.json`
- Create: `packages/mcp-server/tsconfig.json`

- [ ] **Step 1: `packages/mcp-server/package.json` を作成する**

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

- [ ] **Step 2: `packages/mcp-server/tsconfig.json` を作成する**

```json
{
  "extends": "../../tsconfig.base.json",
  "compilerOptions": {
    "module": "ESNext",
    "moduleResolution": "bundler",
    "noEmit": true
  },
  "include": ["src"],
  "exclude": ["src/**/__tests__/**", "src/**/*.test.ts"]
}
```

- [ ] **Step 3: 依存関係をインストールする**

```bash
pnpm install
```

Expected: `packages/mcp-server/node_modules/` が作成される。

- [ ] **Step 4: コミットする**

```bash
git add packages/mcp-server/package.json packages/mcp-server/tsconfig.json
git commit -m "chore: scaffold mcp-server package"
```

---

## Task 2: `registry.ts` — テキスト変換ツール（TDD）

**Files:**
- Create: `packages/mcp-server/src/__tests__/registry.test.ts`（テキスト系のみ）
- Create: `packages/mcp-server/src/registry.ts`（テキスト系のみ）

登録する 13 ツール:

| ツール名 | 説明 | 元関数 |
|---------|------|--------|
| `upper-case` | テキストを大文字に変換 | `toUpperCase` |
| `lower-case` | テキストを小文字に変換 | `toLowerCase` |
| `title-case` | タイトルケースに変換 | `toTitleCase` |
| `sentence-case` | センテンスケースに変換 | `toSentenceCase` |
| `camel-case` | camelCase に変換 | `toCamelCase` |
| `pascal-case` | PascalCase に変換 | `toPascalCase` |
| `snake-case` | snake_case に変換 | `toSnakeCase` |
| `kebab-case` | kebab-case に変換 | `toKebabCase` |
| `reverse-chars` | 文字単位で反転 | `reverseCharacters` |
| `reverse-words` | 単語順序を反転 | `reverseWords` |
| `reverse-lines` | 行順序を反転 | `reverseLines` |
| `slugify` | URL スラッグに変換 | `slugify` |
| `sort-lines` | 行を昇順ソート | `sortText` |
| `to-katakana` | ひらがな→カタカナ | `toKatakana` |
| `to-hiragana` | カタカナ→ひらがな | `toHiragana` |

- [ ] **Step 1: テストファイルを作成する（失敗するテスト）**

`packages/mcp-server/src/__tests__/registry.test.ts` を作成:

```typescript
import { describe, expect, test } from 'vitest';
import { REGISTRY, TOOL_NAMES } from '../registry.js';

describe('text transform tools', () => {
  test('upper-case', () => {
    expect(REGISTRY['upper-case']('hello world')).toBe('HELLO WORLD');
  });
  test('lower-case', () => {
    expect(REGISTRY['lower-case']('HELLO WORLD')).toBe('hello world');
  });
  test('title-case', () => {
    expect(REGISTRY['title-case']('hello world')).toBe('Hello World');
  });
  test('sentence-case', () => {
    expect(REGISTRY['sentence-case']('hello world')).toBe('Hello world');
  });
  test('camel-case', () => {
    expect(REGISTRY['camel-case']('hello world')).toBe('helloWorld');
  });
  test('pascal-case', () => {
    expect(REGISTRY['pascal-case']('hello world')).toBe('HelloWorld');
  });
  test('snake-case', () => {
    expect(REGISTRY['snake-case']('hello world')).toBe('hello_world');
  });
  test('kebab-case', () => {
    expect(REGISTRY['kebab-case']('hello world')).toBe('hello-world');
  });
  test('reverse-chars', () => {
    expect(REGISTRY['reverse-chars']('hello')).toBe('olleh');
  });
  test('reverse-words', () => {
    expect(REGISTRY['reverse-words']('hello world')).toBe('world hello');
  });
  test('reverse-lines', () => {
    expect(REGISTRY['reverse-lines']('a\nb\nc')).toBe('c\nb\na');
  });
  test('slugify', () => {
    const result = REGISTRY['slugify']('Hello World');
    expect(result).toBe('hello-world');
  });
  test('sort-lines', () => {
    expect(REGISTRY['sort-lines']('b\na\nc')).toBe('a\nb\nc');
  });
  test('to-katakana', () => {
    expect(REGISTRY['to-katakana']('あいう')).toBe('アイウ');
  });
  test('to-hiragana', () => {
    expect(REGISTRY['to-hiragana']('アイウ')).toBe('あいう');
  });
  test('TOOL_NAMES includes text tools', () => {
    expect(TOOL_NAMES).toContain('upper-case');
    expect(TOOL_NAMES).toContain('kebab-case');
  });
});
```

- [ ] **Step 2: テストが失敗することを確認する**

```bash
cd packages/mcp-server && npx vitest run
```

Expected: FAIL — `Cannot find module '../registry.js'`

- [ ] **Step 3: `packages/mcp-server/src/registry.ts` を作成する（テキスト系のみ）**

```typescript
import {
  toLowerCase,
  toSentenceCase,
  toTitleCase,
  toUpperCase,
} from '../../apps/text-case-converter/src/utils/caseConverter.js';
import {
  toCamelCase,
  toKebabCase,
  toPascalCase,
  toSnakeCase,
} from '../../apps/text-code-case/src/utils/codeCase.js';
import {
  reverseCharacters,
  reverseLines,
  reverseWords,
} from '../../apps/text-reverse/src/utils/textReverse.js';
import {
  DEFAULT_OPTIONS as SLUGIFY_DEFAULTS,
  slugify,
} from '../../apps/text-slugify/src/utils/slugify.js';
import { DEFAULT_SORT_OPTIONS, sortText } from '../../apps/text-sort/src/utils/textSort.js';
import {
  toHiragana,
  toKatakana,
} from '../../apps/text-kana-converter/src/utils/kanaConverter.js';

type ToolFn = (input: string) => string;

export const REGISTRY: Record<string, ToolFn> = {
  'upper-case': (t) => toUpperCase(t),
  'lower-case': (t) => toLowerCase(t),
  'title-case': (t) => toTitleCase(t),
  'sentence-case': (t) => toSentenceCase(t),
  'camel-case': (t) => toCamelCase(t),
  'pascal-case': (t) => toPascalCase(t),
  'snake-case': (t) => toSnakeCase(t),
  'kebab-case': (t) => toKebabCase(t),
  'reverse-chars': (t) => reverseCharacters(t),
  'reverse-words': (t) => reverseWords(t),
  'reverse-lines': (t) => reverseLines(t),
  'slugify': (t) => slugify(t, SLUGIFY_DEFAULTS),
  'sort-lines': (t) => sortText(t, DEFAULT_SORT_OPTIONS),
  'to-katakana': (t) => toKatakana(t),
  'to-hiragana': (t) => toHiragana(t),
};

export const TOOL_NAMES = Object.keys(REGISTRY) as [string, ...string[]];
```

- [ ] **Step 4: テストが通ることを確認する**

```bash
cd packages/mcp-server && npx vitest run
```

Expected: 16 tests passed

- [ ] **Step 5: コミットする**

```bash
git add packages/mcp-server/src/registry.ts packages/mcp-server/src/__tests__/registry.test.ts
git commit -m "feat(mcp-server): add text transform tools to registry"
```

---

## Task 3: `registry.ts` — エンコード・フォーマット・暗号ツール（TDD）

**Files:**
- Modify: `packages/mcp-server/src/__tests__/registry.test.ts`（テスト追加）
- Modify: `packages/mcp-server/src/registry.ts`（ツール追加）

追加する 17 ツール:

| ツール名 | 説明 | 元関数 |
|---------|------|--------|
| `base64-encode` | Base64 エンコード | `encodeBase64` |
| `base64-decode` | Base64 デコード | `decodeBase64` |
| `html-entity-encode` | HTML エンティティ エンコード | `encodeHTMLEntities` |
| `html-entity-decode` | HTML エンティティ デコード | `decodeHTMLEntities` |
| `uuencode` | UUEncode エンコード | `uuencode` |
| `uudecode` | UUEncode デコード | `uudecode` |
| `json-format` | JSON を整形（indent=2） | `formatJSON` |
| `json-minify` | JSON を最小化 | `minifyJSON` |
| `xml-format` | XML を整形 | `formatXml` |
| `html-format` | HTML を整形 | `formatHtml` |
| `html-minify` | HTML を最小化 | `minifyHtml` |
| `yaml-to-json` | YAML → JSON | `yamlToJson` |
| `json-to-yaml` | JSON → YAML | `jsonToYaml` |
| `xml-to-json` | XML → JSON | `convert` |
| `toml-to-json` | TOML → JSON | `parse` |
| `atbash` | Atbash 暗号化/復号 | `atbash` |
| `caesar-encrypt` | Caesar 暗号（shift=3）。`{"text":"...","shift":N}` も受け付ける | `caesarEncrypt` |
| `uuid-v4` | UUID v4 を生成（input 無視） | `generateUUIDv4` |
| `ulid` | ULID を生成（input 無視） | `generateULID` |

- [ ] **Step 1: テストを追加する**

`packages/mcp-server/src/__tests__/registry.test.ts` に以下の describe ブロックを追記する:

```typescript
describe('encode tools', () => {
  test('base64-encode', () => {
    expect(REGISTRY['base64-encode']('hello')).toBe('aGVsbG8=');
  });
  test('base64-decode', () => {
    expect(REGISTRY['base64-decode']('aGVsbG8=')).toBe('hello');
  });
  test('html-entity-encode', () => {
    expect(REGISTRY['html-entity-encode']('<div>')).toContain('&lt;');
  });
  test('html-entity-decode', () => {
    expect(REGISTRY['html-entity-decode']('&lt;div&gt;')).toBe('<div>');
  });
  test('uuencode roundtrip', () => {
    const encoded = REGISTRY['uuencode']('hello');
    expect(encoded).toContain('begin');
    expect(REGISTRY['uudecode'](encoded)).toContain('hello');
  });
});

describe('format tools', () => {
  test('json-format', () => {
    const result = REGISTRY['json-format']('{"a":1}');
    expect(result).toContain('"a": 1');
  });
  test('json-minify', () => {
    const result = REGISTRY['json-minify']('{\n  "a": 1\n}');
    expect(result).toBe('{"a":1}');
  });
  test('xml-format', () => {
    const result = REGISTRY['xml-format']('<root><child/></root>');
    expect(result).toContain('  <child');
  });
  test('html-format', () => {
    const result = REGISTRY['html-format']('<div><p>hello</p></div>');
    expect(result).toContain('  <p>');
  });
  test('html-minify', () => {
    const result = REGISTRY['html-minify']('<div>\n  <p>hello</p>\n</div>');
    expect(result.length).toBeLessThan(30);
  });
  test('yaml-to-json', () => {
    const result = REGISTRY['yaml-to-json']('key: value');
    expect(JSON.parse(result)).toEqual({ key: 'value' });
  });
  test('json-to-yaml', () => {
    const result = REGISTRY['json-to-yaml']('{"key":"value"}');
    expect(result).toContain('key:');
  });
  test('xml-to-json', () => {
    const result = REGISTRY['xml-to-json']('<root><item>1</item></root>');
    expect(result).toContain('"item"');
  });
  test('toml-to-json', () => {
    const result = REGISTRY['toml-to-json']('[section]\nkey = "value"');
    const obj = JSON.parse(result);
    expect(obj.section.key).toBe('value');
  });
});

describe('crypto tools', () => {
  test('atbash', () => {
    expect(REGISTRY['atbash']('abc')).toBe('zyx');
  });
  test('caesar-encrypt plain string (shift=3)', () => {
    expect(REGISTRY['caesar-encrypt']('abc')).toBe('def');
  });
  test('caesar-encrypt JSON input', () => {
    expect(REGISTRY['caesar-encrypt']('{"text":"abc","shift":1}')).toBe('bcd');
  });
});

describe('generate tools', () => {
  test('uuid-v4 returns UUID format', () => {
    const result = REGISTRY['uuid-v4']('');
    expect(result).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/);
  });
  test('ulid returns 26 chars', () => {
    expect(REGISTRY['ulid']('').length).toBe(26);
  });
});
```

- [ ] **Step 2: テストが失敗することを確認する**

```bash
cd packages/mcp-server && npx vitest run
```

Expected: 先ほどの 16 tests は PASS、新しいテストは FAIL

- [ ] **Step 3: `registry.ts` にツールを追記する**

`registry.ts` の import セクションに以下を追加する:

```typescript
import {
  decodeBase64,
  encodeBase64,
} from '../../apps/encode-base64-string/src/utils/base64.js';
import {
  decodeHTMLEntities,
  encodeHTMLEntities,
} from '../../apps/encode-html-entity/src/utils/htmlEntity.js';
import { uudecode, uuencode } from '../../apps/uuencode/src/utils/uuencode.js';
import {
  formatJSON,
  minifyJSON,
} from '../../apps/json-formatter/src/utils/jsonFormatter.js';
import { formatXml } from '../../apps/xml-formatter/src/utils/xmlFormatter.js';
import {
  formatHtml,
  minifyHtml,
} from '../../apps/html-formatter/src/utils/htmlFormatter.js';
import {
  jsonToYaml,
  yamlToJson,
} from '../../apps/yaml-formatter/src/utils/yamlFormatter.js';
import { convert as xmlToJsonConvert } from '../../apps/xml-to-json/src/utils/xmlToJson.js';
import { parse as parseToml } from '../../apps/toml-to-json/src/utils/tomlParser.js';
import { caesarEncrypt } from '../../apps/crypto-caesar/src/utils/caesar.js';
import { atbash } from '../../apps/crypto-atbash/src/utils/atbash.js';
import {
  generateULID,
  generateUUIDv4,
} from '../../apps/uuid-generator/src/utils/uuidGenerator.js';
```

`REGISTRY` オブジェクトに以下のエントリを追加する:

```typescript
  // Encode
  'base64-encode': (t) => encodeBase64(t),
  'base64-decode': (t) => decodeBase64(t),
  'html-entity-encode': (t) => encodeHTMLEntities(t),
  'html-entity-decode': (t) => decodeHTMLEntities(t),
  'uuencode': (t) => uuencode(t),
  'uudecode': (t) => uudecode(t),
  // Format
  'json-format': (t) => formatJSON(t, 2).formatted,
  'json-minify': (t) => minifyJSON(t).formatted,
  'xml-format': (t) => formatXml(t),
  'html-format': (t) => formatHtml(t),
  'html-minify': (t) => minifyHtml(t),
  'yaml-to-json': (t) => yamlToJson(t),
  'json-to-yaml': (t) => jsonToYaml(t),
  'xml-to-json': (t) => xmlToJsonConvert(t),
  'toml-to-json': (t) => JSON.stringify(parseToml(t), null, 2),
  // Crypto
  'atbash': (t) => atbash(t),
  'caesar-encrypt': (t) => {
    try {
      const { text, shift } = JSON.parse(t) as { text: string; shift: number };
      return caesarEncrypt(text, shift);
    } catch {
      return caesarEncrypt(t, 3);
    }
  },
  // Generate
  'uuid-v4': () => generateUUIDv4(),
  'ulid': () => generateULID(),
```

- [ ] **Step 4: テストがすべて通ることを確認する**

```bash
cd packages/mcp-server && npx vitest run
```

Expected: 全テスト PASS（30+ tests）

- [ ] **Step 5: コミットする**

```bash
git add packages/mcp-server/src/registry.ts packages/mcp-server/src/__tests__/registry.test.ts
git commit -m "feat(mcp-server): add encode/format/crypto/generate tools to registry"
```

---

## Task 4: `index.ts` — MCP サーバーエントリポイント

**Files:**
- Create: `packages/mcp-server/src/index.ts`

- [ ] **Step 1: `packages/mcp-server/src/index.ts` を作成する**

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
    '`tool` に操作名を指定し、`input` に処理対象テキストを渡す。',
    '複数パラメータが必要なツール（caesar-encrypt など）は `input` を JSON 文字列にする。',
    '利用可能なツール: ' + TOOL_NAMES.join(', '),
  ].join('\n'),
  {
    tool: z.enum(TOOL_NAMES).describe('実行するツール名'),
    input: z.string().describe('処理対象テキスト（複数パラメータは JSON 文字列）'),
  },
  async ({ tool, input }) => {
    try {
      const fn = REGISTRY[tool] as (input: string) => string;
      const result = fn(input);
      return { content: [{ type: 'text' as const, text: String(result) }] };
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      return {
        content: [{ type: 'text' as const, text: `Error: ${msg}` }],
        isError: true,
      };
    }
  }
);

const transport = new StdioServerTransport();
await server.connect(transport);
```

- [ ] **Step 2: 起動確認（3 秒で Ctrl+C）**

```bash
cd packages/mcp-server && timeout 3 npx tsx src/index.ts || true
```

Expected: エラーなく起動し、stdin 待機状態になる（timeout で終了、exit code 非ゼロは正常）

- [ ] **Step 3: コミットする**

```bash
git add packages/mcp-server/src/index.ts
git commit -m "feat(mcp-server): add MCP stdio server entry point"
```

---

## Task 5: `.mcp.json` 登録 + スモークテスト

**Files:**
- Modify: `.mcp.json`

- [ ] **Step 1: `.mcp.json` に elchika-tools を追記する**

`.mcp.json` を以下の内容に書き換える:

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

- [ ] **Step 2: Claude Code から認識されることを確認する**

Claude Code で `/mcp` を実行して `elchika-tools` が一覧に表示されることを確認する。

Expected:
```
elchika-tools  connected
  run  Elchika Tools のユーティリティを実行する...
```

- [ ] **Step 3: ツール呼び出しを手動テストする**

Claude Code 内でプロンプトを送って動作を確認する:

```
run tool with elchika-tools: tool=base64-encode, input=hello
```

Expected: `aGVsbG8=` が返る

- [ ] **Step 4: コミットする**

```bash
git add .mcp.json
git commit -m "feat: register elchika-tools MCP server in .mcp.json"
```

---

## 完了確認チェックリスト

```bash
# 全テスト通過
cd packages/mcp-server && npx vitest run
# Expected: 30+ tests passed

# サーバー起動確認
timeout 3 npx tsx packages/mcp-server/src/index.ts || true
# Expected: エラーなく起動

# MCP 登録確認
cat .mcp.json | grep elchika-tools
# Expected: "elchika-tools": { ... }
```
