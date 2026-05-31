# elchika-tools Plugin Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** `naoto24kawa-claude-plugins` に `elchika-tools` プラグインを追加し、MCP サーバーソースを同梱することで任意マシンへの plugin install だけで Claude Code に 34 ツールを提供できるようにする。

**Architecture:** プラグインリポジトリ（`~/.claude/plugins/marketplaces/naoto24kawa-claude-plugins/`）に `plugins/elchika-tools/` を追加。MCP サーバーソースを `mcp-server/` に同梱し、`utils/` に全ユーティリティ関数を自己完結型でまとめる。プラグインの `.mcp.json` は `${PLUGIN_DIR}` 変数で自分のインストールパスを参照し初回のみ `npm install` を実行する。

**Tech Stack:** Claude Code Plugin System, `@modelcontextprotocol/sdk` ^1.12.0, `zod` ^3.25.0, `tsx` ^4.19.0, `vitest` ^4.1.0, TypeScript ^5.9.3

---

## ファイルマップ

**プラグインリポジトリ** (`~/.claude/plugins/marketplaces/naoto24kawa-claude-plugins/`)

| ファイル | 操作 |
|---------|------|
| `plugins/elchika-tools/.claude-plugin/plugin.json` | 新規作成 |
| `plugins/elchika-tools/.mcp.json` | 新規作成 |
| `plugins/elchika-tools/mcp-server/package.json` | 新規作成 |
| `plugins/elchika-tools/mcp-server/tsconfig.json` | 新規作成 |
| `plugins/elchika-tools/mcp-server/vitest.config.ts` | 新規作成 |
| `plugins/elchika-tools/mcp-server/src/utils/text.ts` | 新規作成 |
| `plugins/elchika-tools/mcp-server/src/utils/encode.ts` | 新規作成 |
| `plugins/elchika-tools/mcp-server/src/utils/format.ts` | 新規作成 |
| `plugins/elchika-tools/mcp-server/src/utils/crypto.ts` | 新規作成 |
| `plugins/elchika-tools/mcp-server/src/utils/generate.ts` | 新規作成 |
| `plugins/elchika-tools/mcp-server/src/registry.ts` | 新規作成 |
| `plugins/elchika-tools/mcp-server/src/index.ts` | 新規作成 |
| `plugins/elchika-tools/mcp-server/src/__tests__/utils.test.ts` | 新規作成 |
| `plugins/elchika-tools/README.md` | 新規作成 |
| `.claude-plugin/marketplace.json` | `elchika-tools` エントリ追加 |

**tools リポジトリ** (`/Users/nishikawa/projects/naoto24kawa/tools/`)

| ファイル | 操作 |
|---------|------|
| `.mcp.json` | `elchika-tools` エントリ削除 |

---

## Task 1: プラグイン基盤ファイルの作成

**Files:**
- Create: `~/.claude/plugins/marketplaces/naoto24kawa-claude-plugins/plugins/elchika-tools/.claude-plugin/plugin.json`
- Create: `~/.claude/plugins/marketplaces/naoto24kawa-claude-plugins/plugins/elchika-tools/.mcp.json`
- Create: `~/.claude/plugins/marketplaces/naoto24kawa-claude-plugins/plugins/elchika-tools/mcp-server/package.json`
- Create: `~/.claude/plugins/marketplaces/naoto24kawa-claude-plugins/plugins/elchika-tools/mcp-server/tsconfig.json`
- Create: `~/.claude/plugins/marketplaces/naoto24kawa-claude-plugins/plugins/elchika-tools/mcp-server/vitest.config.ts`
- Create: `~/.claude/plugins/marketplaces/naoto24kawa-claude-plugins/plugins/elchika-tools/README.md`
- Modify: `~/.claude/plugins/marketplaces/naoto24kawa-claude-plugins/.claude-plugin/marketplace.json`

- [ ] **Step 1: plugin.json を作成する**

```json
{
  "name": "elchika-tools",
  "version": "1.0.0",
  "description": "Local MCP server exposing 34 Elchika Tools utilities (text, encode, format, crypto, generate). All processing happens locally — no data leaves your machine.",
  "author": {
    "name": "naoto24kawa",
    "email": "naoto24kawa@gmail.com"
  },
  "license": "MIT"
}
```

保存先: `~/.claude/plugins/marketplaces/naoto24kawa-claude-plugins/plugins/elchika-tools/.claude-plugin/plugin.json`

- [ ] **Step 2: .mcp.json を作成する**

```json
{
  "mcpServers": {
    "elchika-tools": {
      "command": "sh",
      "args": [
        "-c",
        "cd '${PLUGIN_DIR}/mcp-server' && [ -d node_modules ] || npm install --silent && npx tsx src/index.ts"
      ]
    }
  }
}
```

保存先: `~/.claude/plugins/marketplaces/naoto24kawa-claude-plugins/plugins/elchika-tools/.mcp.json`

- [ ] **Step 3: mcp-server/package.json を作成する**

```json
{
  "name": "elchika-tools-mcp",
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
    "vitest": "^4.1.0"
  }
}
```

保存先: `~/.claude/plugins/marketplaces/naoto24kawa-claude-plugins/plugins/elchika-tools/mcp-server/package.json`

- [ ] **Step 4: mcp-server/tsconfig.json を作成する**

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "noEmit": true
  },
  "include": ["src"],
  "exclude": ["src/**/__tests__/**", "src/**/*.test.ts"]
}
```

保存先: `~/.claude/plugins/marketplaces/naoto24kawa-claude-plugins/plugins/elchika-tools/mcp-server/tsconfig.json`

- [ ] **Step 5: mcp-server/vitest.config.ts を作成する**

```typescript
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node',
  },
});
```

保存先: `~/.claude/plugins/marketplaces/naoto24kawa-claude-plugins/plugins/elchika-tools/mcp-server/vitest.config.ts`

- [ ] **Step 6: README.md を作成する**

```markdown
# elchika-tools

Local MCP server for Claude Code that exposes 34 Elchika Tools utilities as a single `run` tool. All processing happens locally — no data leaves your machine.

## Tools

| Category | Tool names |
|----------|-----------|
| Text     | upper-case, lower-case, title-case, sentence-case, camel-case, pascal-case, snake-case, kebab-case, reverse-chars, reverse-words, reverse-lines, slugify, sort-lines, to-katakana, to-hiragana |
| Encode   | base64-encode, base64-decode, html-entity-encode, html-entity-decode, uuencode, uudecode |
| Format   | json-format, json-minify, xml-format, html-format, html-minify, yaml-to-json, json-to-yaml, xml-to-json, toml-to-json |
| Crypto   | atbash, caesar-encrypt |
| Generate | uuid-v4, ulid |

## Usage

```
run({ tool: "json-format", input: '{"a":1}' })
// → '{\n  "a": 1\n}'

run({ tool: "caesar-encrypt", input: '{"text":"hello","shift":3}' })
// → "khoor"
```

## Setup

Installed automatically via Claude Code plugin system. On first use, `npm install` runs once in the `mcp-server/` directory.
```

保存先: `~/.claude/plugins/marketplaces/naoto24kawa-claude-plugins/plugins/elchika-tools/README.md`

- [ ] **Step 7: marketplace.json に elchika-tools エントリを追加する**

`~/.claude/plugins/marketplaces/naoto24kawa-claude-plugins/.claude-plugin/marketplace.json` の `plugins` 配列に追加:

```json
{
  "name": "elchika-tools",
  "description": "Local MCP server exposing 34 Elchika Tools utilities. Text transform, encode/decode, format, crypto, and generate tools — all running locally, no data leaves your machine.",
  "version": "1.0.0",
  "author": {
    "name": "naoto24kawa",
    "email": "naoto24kawa@gmail.com"
  },
  "source": "./plugins/elchika-tools",
  "category": "productivity"
}
```

- [ ] **Step 8: コミットする**

```bash
cd ~/.claude/plugins/marketplaces/naoto24kawa-claude-plugins
git add plugins/elchika-tools/ .claude-plugin/marketplace.json
git commit -m "feat: add elchika-tools plugin scaffold"
```

---

## Task 2: utils/text.ts — テキスト変換 15 ツール

**Files:**
- Create: `~/.claude/plugins/marketplaces/naoto24kawa-claude-plugins/plugins/elchika-tools/mcp-server/src/utils/text.ts`
- Create (test): `~/.claude/plugins/marketplaces/naoto24kawa-claude-plugins/plugins/elchika-tools/mcp-server/src/__tests__/utils.test.ts` (text セクション)

- [ ] **Step 1: テストを書く（失敗することを確認）**

`~/.claude/plugins/marketplaces/naoto24kawa-claude-plugins/plugins/elchika-tools/mcp-server/src/__tests__/utils.test.ts` を作成:

```typescript
import { describe, expect, test } from 'vitest';
import {
  toUpperCase, toLowerCase, toTitleCase, toSentenceCase,
  toCamelCase, toPascalCase, toSnakeCase, toKebabCase,
  reverseCharacters, reverseWords, reverseLines,
  slugify, SLUGIFY_DEFAULTS,
  sortText, DEFAULT_SORT_OPTIONS,
  toKatakana, toHiragana,
} from '../utils/text.js';

describe('text utils', () => {
  test('toUpperCase', () => expect(toUpperCase('hello')).toBe('HELLO'));
  test('toLowerCase', () => expect(toLowerCase('HELLO')).toBe('hello'));
  test('toTitleCase', () => expect(toTitleCase('hello world')).toBe('Hello World'));
  test('toSentenceCase', () => expect(toSentenceCase('hello world')).toBe('Hello world'));
  test('toCamelCase', () => expect(toCamelCase('hello world')).toBe('helloWorld'));
  test('toPascalCase', () => expect(toPascalCase('hello world')).toBe('HelloWorld'));
  test('toSnakeCase', () => expect(toSnakeCase('hello world')).toBe('hello_world'));
  test('toKebabCase', () => expect(toKebabCase('hello world')).toBe('hello-world'));
  test('reverseCharacters', () => expect(reverseCharacters('hello')).toBe('olleh'));
  test('reverseWords', () => expect(reverseWords('hello world')).toBe('world hello'));
  test('reverseLines', () => expect(reverseLines('a\nb')).toBe('b\na'));
  test('slugify', () => expect(slugify('Hello World', SLUGIFY_DEFAULTS)).toBe('hello-world'));
  test('sortText', () => expect(sortText('b\na', DEFAULT_SORT_OPTIONS)).toBe('a\nb'));
  test('toKatakana', () => expect(toKatakana('あいう')).toBe('アイウ'));
  test('toHiragana', () => expect(toHiragana('アイウ')).toBe('あいう'));
});
```

- [ ] **Step 2: テストが失敗することを確認する**

```bash
cd ~/.claude/plugins/marketplaces/naoto24kawa-claude-plugins/plugins/elchika-tools/mcp-server
npm install
npx vitest run
```

Expected: FAIL with "Cannot find module '../utils/text.js'"

- [ ] **Step 3: utils/text.ts を作成する**

```typescript
// ---- Case conversion ----
export function toUpperCase(text: string): string {
  return text.toUpperCase();
}

export function toLowerCase(text: string): string {
  return text.toLowerCase();
}

export function toTitleCase(text: string): string {
  return text.replace(/\w\S*/g, (word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase());
}

export function toSentenceCase(text: string): string {
  return text.toLowerCase().replace(/(^\s*\w|[.!?]\s+\w)/g, (match) => match.toUpperCase());
}

// ---- Code case conversion ----
function splitWords(text: string): string[] {
  return text
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .replace(/([A-Z]+)([A-Z][a-z])/g, '$1 $2')
    .replace(/([a-zA-Z])(\d)/g, '$1 $2')
    .replace(/(\d)([a-zA-Z])/g, '$1 $2')
    .replace(/[_\-./\\]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .split(' ')
    .filter((w) => w.length > 0);
}

export function toCamelCase(text: string): string {
  const words = splitWords(text);
  if (words.length === 0) return '';
  return words
    .map((w, i) => i === 0 ? w.toLowerCase() : w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join('');
}

export function toPascalCase(text: string): string {
  return splitWords(text).map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join('');
}

export function toSnakeCase(text: string): string {
  return splitWords(text).map((w) => w.toLowerCase()).join('_');
}

export function toKebabCase(text: string): string {
  return splitWords(text).map((w) => w.toLowerCase()).join('-');
}

// ---- Reverse ----
export function reverseCharacters(text: string): string {
  return [...text].reverse().join('');
}

export function reverseWords(text: string): string {
  return text.split('\n').map((line) => line.split(' ').reverse().join(' ')).join('\n');
}

export function reverseLines(text: string): string {
  return text.split('\n').reverse().join('\n');
}

// ---- Slugify ----
export interface SlugifyOptions {
  separator: string;
  lowercase: boolean;
  removeSpecialChars: boolean;
  maxLength: number;
}

export const SLUGIFY_DEFAULTS: SlugifyOptions = {
  separator: '-',
  lowercase: true,
  removeSpecialChars: true,
  maxLength: 0,
};

const ROMANIZE_MAP: Record<string, string> = {
  'あ': 'a', 'い': 'i', 'う': 'u', 'え': 'e', 'お': 'o',
  'か': 'ka', 'き': 'ki', 'く': 'ku', 'け': 'ke', 'こ': 'ko',
  'さ': 'sa', 'し': 'shi', 'す': 'su', 'せ': 'se', 'そ': 'so',
  'た': 'ta', 'ち': 'chi', 'つ': 'tsu', 'て': 'te', 'と': 'to',
  'な': 'na', 'に': 'ni', 'ぬ': 'nu', 'ね': 'ne', 'の': 'no',
  'は': 'ha', 'ひ': 'hi', 'ふ': 'fu', 'へ': 'he', 'ほ': 'ho',
  'ま': 'ma', 'み': 'mi', 'む': 'mu', 'め': 'me', 'も': 'mo',
  'や': 'ya', 'ゆ': 'yu', 'よ': 'yo',
  'ら': 'ra', 'り': 'ri', 'る': 'ru', 'れ': 're', 'ろ': 'ro',
  'わ': 'wa', 'を': 'wo', 'ん': 'n',
  'が': 'ga', 'ぎ': 'gi', 'ぐ': 'gu', 'げ': 'ge', 'ご': 'go',
  'ざ': 'za', 'じ': 'ji', 'ず': 'zu', 'ぜ': 'ze', 'ぞ': 'zo',
  'だ': 'da', 'ぢ': 'di', 'づ': 'du', 'で': 'de', 'ど': 'do',
  'ば': 'ba', 'び': 'bi', 'ぶ': 'bu', 'べ': 'be', 'ぼ': 'bo',
  'ぱ': 'pa', 'ぴ': 'pi', 'ぷ': 'pu', 'ぺ': 'pe', 'ぽ': 'po',
};

function romanize(text: string): string {
  let result = '';
  const hiragana = text.replace(/[ァ-ヶ]/g, (c) => String.fromCharCode(c.charCodeAt(0) - 0x60));
  for (const char of hiragana) result += ROMANIZE_MAP[char] ?? char;
  return result;
}

export function slugify(text: string, options: SlugifyOptions): string {
  const { separator, lowercase, removeSpecialChars, maxLength } = options;
  let result = romanize(text);
  if (lowercase) result = result.toLowerCase();
  if (removeSpecialChars) result = result.replace(/[^\w\s-]/g, '');
  const sep = separator.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  result = result.replace(/\s+/g, separator);
  result = result.replace(new RegExp(`${sep}+`, 'g'), separator);
  result = result.replace(new RegExp(`^${sep}|${sep}$`, 'g'), '');
  if (maxLength > 0 && result.length > maxLength) {
    result = result.slice(0, maxLength).replace(new RegExp(`${sep}$`), '');
  }
  return result;
}

// ---- Sort ----
export interface SortOptions {
  order: 'asc' | 'desc';
  numeric: boolean;
  caseSensitive: boolean;
  removeDuplicates: boolean;
  trimLines: boolean;
  removeEmpty: boolean;
}

export const DEFAULT_SORT_OPTIONS: SortOptions = {
  order: 'asc',
  numeric: false,
  caseSensitive: true,
  removeDuplicates: false,
  trimLines: false,
  removeEmpty: false,
};

export function sortText(input: string, options: SortOptions): string {
  let lines = input.split('\n');
  if (options.trimLines) lines = lines.map((l) => l.trim());
  if (options.removeEmpty) lines = lines.filter((l) => l.length > 0);
  if (options.removeDuplicates) lines = [...new Set(lines)];
  lines.sort((a, b) => {
    let ca = a, cb = b;
    if (!options.caseSensitive) { ca = a.toLowerCase(); cb = b.toLowerCase(); }
    if (options.numeric) {
      const na = Number.parseFloat(ca), nb = Number.parseFloat(cb);
      if (!Number.isNaN(na) && !Number.isNaN(nb)) return options.order === 'asc' ? na - nb : nb - na;
    }
    const r = ca.localeCompare(cb);
    return options.order === 'asc' ? r : -r;
  });
  return lines.join('\n');
}

// ---- Kana ----
export function toKatakana(text: string): string {
  return text.replace(/[ぁ-ゖゝ-ゟ]/g, (c) => String.fromCharCode(c.charCodeAt(0) + 0x60));
}

export function toHiragana(text: string): string {
  return text.replace(/[ァ-ヶヽ-ヿ]/g, (c) => String.fromCharCode(c.charCodeAt(0) - 0x60));
}
```

保存先: `~/.claude/plugins/marketplaces/naoto24kawa-claude-plugins/plugins/elchika-tools/mcp-server/src/utils/text.ts`

- [ ] **Step 4: テストが通ることを確認する**

```bash
cd ~/.claude/plugins/marketplaces/naoto24kawa-claude-plugins/plugins/elchika-tools/mcp-server
npx vitest run
```

Expected: `Tests 15 passed`

- [ ] **Step 5: コミットする**

```bash
cd ~/.claude/plugins/marketplaces/naoto24kawa-claude-plugins
git add plugins/elchika-tools/mcp-server/src/
git commit -m "feat(elchika-tools): add utils/text.ts with 15 text transform functions"
```

---

## Task 3: utils/encode.ts — エンコード 6 ツール

**Files:**
- Create: `~/.claude/plugins/marketplaces/naoto24kawa-claude-plugins/plugins/elchika-tools/mcp-server/src/utils/encode.ts`
- Modify (test): `src/__tests__/utils.test.ts` に encode セクションを追加

- [ ] **Step 1: テストに encode セクションを追加する（失敗を確認）**

`utils.test.ts` に追記:

```typescript
import {
  encodeBase64, decodeBase64,
  encodeHTMLEntities, decodeHTMLEntities,
  uuencode, uudecode,
} from '../utils/encode.js';

describe('encode utils', () => {
  test('base64 round-trip', () => {
    expect(encodeBase64('hello')).toBe('aGVsbG8=');
    expect(decodeBase64('aGVsbG8=')).toBe('hello');
  });
  test('html-entity round-trip', () => {
    expect(encodeHTMLEntities('<b>')).toBe('&lt;b&gt;');
    expect(decodeHTMLEntities('&lt;b&gt;')).toBe('<b>');
  });
  test('uuencode round-trip', () => {
    const encoded = uuencode('hello');
    expect(uudecode(encoded)).toBe('hello');
  });
});
```

- [ ] **Step 2: テストが失敗することを確認する**

```bash
cd ~/.claude/plugins/marketplaces/naoto24kawa-claude-plugins/plugins/elchika-tools/mcp-server
npx vitest run
```

Expected: FAIL with "Cannot find module '../utils/encode.js'"

- [ ] **Step 3: utils/encode.ts を作成する**

```typescript
export function encodeBase64(text: string): string {
  const bytes = new TextEncoder().encode(text);
  let binary = '';
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary);
}

export function decodeBase64(encoded: string): string {
  const binary = atob(encoded);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return new TextDecoder().decode(bytes);
}

const NAMED_ENTITIES: Record<string, string> = {
  '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;',
  ' ': '&nbsp;', '©': '&copy;', '®': '&reg;', '™': '&trade;',
  '…': '&hellip;', '—': '&mdash;', '–': '&ndash;',
  '‘': '&lsquo;', '’': '&rsquo;', '“': '&ldquo;', '”': '&rdquo;',
};

const REVERSE_NAMED: Record<string, string> = {};
for (const [char, entity] of Object.entries(NAMED_ENTITIES)) REVERSE_NAMED[entity] = char;

export function encodeHTMLEntities(text: string): string {
  return text.replace(/[&<>"' ©®™…—–‘’“”]/g,
    (char) => NAMED_ENTITIES[char] ?? char);
}

export function decodeHTMLEntities(text: string): string {
  return text
    .replace(/&\w+;/g, (entity) => REVERSE_NAMED[entity] ?? entity)
    .replace(/&#(\d+);/g, (_m, code) => String.fromCodePoint(Number(code)))
    .replace(/&#x([0-9a-fA-F]+);/g, (_m, hex) => String.fromCodePoint(Number.parseInt(hex, 16)));
}

export function uuencode(input: string): string {
  const bytes = new TextEncoder().encode(input);
  const lines: string[] = ['begin 644 data'];
  for (let offset = 0; offset < bytes.length; offset += 45) {
    const chunk = bytes.slice(offset, Math.min(offset + 45, bytes.length));
    const len = chunk.length;
    let line = String.fromCharCode(len + 32);
    for (let j = 0; j < chunk.length; j += 3) {
      const b1 = chunk[j] ?? 0, b2 = chunk[j + 1] ?? 0, b3 = chunk[j + 2] ?? 0;
      line += String.fromCharCode(((b1 >> 2) & 0x3f) + 32);
      line += String.fromCharCode((((b1 << 4) | (b2 >> 4)) & 0x3f) + 32);
      line += String.fromCharCode((((b2 << 2) | (b3 >> 6)) & 0x3f) + 32);
      line += String.fromCharCode((b3 & 0x3f) + 32);
    }
    lines.push(line);
  }
  lines.push('`', 'end');
  return lines.join('\n');
}

export function uudecode(input: string): string {
  const lines = input.split('\n');
  const allBytes: number[] = [];
  let started = false;
  for (const line of lines) {
    if (line.startsWith('begin ')) { started = true; continue; }
    if (!started || line === '`' || line === 'end' || line.length === 0) continue;
    const expectedLen = line.charCodeAt(0) - 32;
    if (expectedLen <= 0) continue;
    const decoded: number[] = [];
    const chars = line.slice(1);
    for (let i = 0; i < chars.length; i += 4) {
      const c1 = (chars.charCodeAt(i) - 32) & 0x3f;
      const c2 = (chars.charCodeAt(i + 1) - 32) & 0x3f;
      const c3 = (chars.charCodeAt(i + 2) - 32) & 0x3f;
      const c4 = (chars.charCodeAt(i + 3) - 32) & 0x3f;
      decoded.push((c1 << 2) | (c2 >> 4));
      decoded.push(((c2 << 4) | (c3 >> 2)) & 0xff);
      decoded.push(((c3 << 6) | c4) & 0xff);
    }
    allBytes.push(...decoded.slice(0, expectedLen));
  }
  return new TextDecoder().decode(new Uint8Array(allBytes));
}
```

保存先: `~/.claude/plugins/marketplaces/naoto24kawa-claude-plugins/plugins/elchika-tools/mcp-server/src/utils/encode.ts`

- [ ] **Step 4: テストが通ることを確認する**

```bash
npx vitest run
```

Expected: `Tests 18 passed`（text 15 + encode 3）

- [ ] **Step 5: コミットする**

```bash
cd ~/.claude/plugins/marketplaces/naoto24kawa-claude-plugins
git add plugins/elchika-tools/mcp-server/src/
git commit -m "feat(elchika-tools): add utils/encode.ts with 6 encode/decode functions"
```

---

## Task 4: utils/format.ts — フォーマット 9 ツール

**Files:**
- Create: `~/.claude/plugins/marketplaces/naoto24kawa-claude-plugins/plugins/elchika-tools/mcp-server/src/utils/format.ts`
- Modify (test): `src/__tests__/utils.test.ts` に format セクションを追加

- [ ] **Step 1: テストに format セクションを追加する（失敗を確認）**

`utils.test.ts` に追記:

```typescript
import {
  formatJSON, minifyJSON, formatXml, formatHtml, minifyHtml,
  yamlToJson, jsonToYaml, simpleXmlToJson, tomlToJson,
} from '../utils/format.js';

describe('format utils', () => {
  test('formatJSON', () => expect(formatJSON('{"a":1}', 2)).toContain('"a": 1'));
  test('formatJSON throws on invalid', () => expect(() => formatJSON('{bad}', 2)).toThrow());
  test('minifyJSON', () => expect(minifyJSON('{ "a": 1 }')).toBe('{"a":1}'));
  test('formatXml', () => expect(formatXml('<a><b>1</b></a>')).toContain('  <b>1</b>'));
  test('formatHtml', () => expect(formatHtml('<div><p>hi</p></div>')).toContain('  <p>hi</p>'));
  test('minifyHtml', () => expect(minifyHtml('<div>  <p>hi</p>  </div>')).not.toContain('  '));
  test('yaml-to-json round-trip', () => {
    const json = yamlToJson('name: Alice\nage: 30');
    expect(JSON.parse(json)).toEqual({ name: 'Alice', age: 30 });
  });
  test('json-to-yaml', () => expect(jsonToYaml('{"name":"Alice"}')).toContain('name: Alice'));
  test('simpleXmlToJson', () => {
    const result = JSON.parse(simpleXmlToJson('<root><item>1</item></root>'));
    expect(result).toHaveProperty('root');
  });
  test('tomlToJson', () => {
    const result = JSON.parse(tomlToJson('name = "Alice"\nage = 30'));
    expect(result).toEqual({ name: 'Alice', age: 30 });
  });
});
```

- [ ] **Step 2: テストが失敗することを確認する**

```bash
npx vitest run
```

Expected: FAIL with "Cannot find module '../utils/format.js'"

- [ ] **Step 3: utils/format.ts を作成する**

```typescript
// ---- JSON ----
export function formatJSON(input: string, indent: number): string {
  if (!input.trim()) return '';
  const result = JSON.parse(input);
  return JSON.stringify(result, null, indent);
}

export function minifyJSON(input: string): string {
  if (!input.trim()) return '';
  return JSON.stringify(JSON.parse(input));
}

// ---- XML ----
function classifyXmlPart(part: string): 'processing' | 'closing' | 'selfClosing' | 'opening' | 'other' {
  if (part.startsWith('<?')) return 'processing';
  if (part.startsWith('</')) return 'closing';
  if (part.endsWith('/>')) return 'selfClosing';
  if (part.startsWith('<') && !part.startsWith('<!--')) return 'opening';
  return 'other';
}

export function formatXml(xml: string, indentSize = 2): string {
  const indent = ' '.repeat(indentSize);
  let level = 0;
  const lines: string[] = [];
  for (const rawPart of xml.replace(/>\s*</g, '>\n<').split('\n')) {
    const part = rawPart.trim();
    if (!part) continue;
    const type = classifyXmlPart(part);
    if (type === 'closing') level = Math.max(0, level - 1);
    lines.push(indent.repeat(level) + part);
    if (type === 'opening' && !part.includes('</')) level++;
  }
  return lines.join('\n');
}

// ---- HTML ----
const VOID_ELEMENTS = new Set(['area','base','br','col','embed','hr','img','input','link','meta','param','source','track','wbr']);
const INDENT_AFTER = new Set(['html','head','body','div','section','article','aside','header','footer','main','nav','ul','ol','li','table','thead','tbody','tfoot','tr','form','fieldset','select','details','summary','dialog','template','blockquote','figure','figcaption','dl','dd','dt']);

function shouldIndentAfterTag(tag: string): boolean {
  const m = tag.match(/^<([a-zA-Z][a-zA-Z0-9]*)/);
  if (!m) return false;
  const name = m[1].toLowerCase();
  return !VOID_ELEMENTS.has(name) && !tag.endsWith('/>') && INDENT_AFTER.has(name);
}

function processHtmlPart(part: string, level: number, indent: string, lines: string[]): number {
  const t = part.trim();
  if (!t) return level;
  if (t.startsWith('</')) { const nl = Math.max(0, level - 1); lines.push(indent.repeat(nl) + t); return nl; }
  if (t.startsWith('<')) { lines.push(indent.repeat(level) + t); return shouldIndentAfterTag(t) ? level + 1 : level; }
  lines.push(indent.repeat(level) + t);
  return level;
}

export function formatHtml(html: string, indentSize = 2): string {
  const trimmed = html.trim();
  if (!trimmed) return '';
  const indent = ' '.repeat(indentSize);
  let level = 0;
  const lines: string[] = [];
  for (const rawToken of trimmed.replace(/>\s+</g, '>\n<').split('\n')) {
    const token = rawToken.trim();
    if (!token) continue;
    for (const part of token.match(/<[^>]+>|[^<]+/g) || [token]) {
      level = processHtmlPart(part, level, indent, lines);
    }
  }
  return lines.join('\n');
}

export function minifyHtml(html: string): string {
  const t = html.trim();
  if (!t) return '';
  return t.replace(/\n/g, '').replace(/\s{2,}/g, ' ').replace(/>\s+</g, '><').trim();
}

// ---- YAML ----
function getIndent(line: string): number {
  return line.match(/^(\s*)/)?.[1].length ?? 0;
}

function parseYamlValue(val: string): unknown {
  if (val === 'true') return true;
  if (val === 'false') return false;
  if (val === 'null' || val === '~') return null;
  if (/^-?\d+$/.test(val)) return Number.parseInt(val, 10);
  if (/^-?\d+\.\d+$/.test(val)) return Number.parseFloat(val);
  if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) return val.slice(1, -1);
  return val;
}

interface YamlParseResult { value: unknown; consumed: number; }

function parseYamlListItems(lines: string[], start: number, base: number): YamlParseResult {
  const arr: unknown[] = [];
  let i = start;
  while (i < lines.length && (lines[i]?.trim().startsWith('- ') ?? false) && getIndent(lines[i] ?? '') === base) {
    arr.push(parseYamlValue((lines[i] ?? '').trim().slice(2)));
    i++;
  }
  return { value: arr, consumed: i - start };
}

function parseYamlKeyValue(lines: string[], index: number, base: number, result: Record<string, unknown>, trimmed: string): number {
  const ci = trimmed.indexOf(':');
  if (ci <= 0) return index + 1;
  const key = trimmed.slice(0, ci).trim();
  const vp = trimmed.slice(ci + 1).trim();
  if (vp) { result[key] = parseYamlValue(vp); return index + 1; }
  const next = index + 1;
  if (next < lines.length && getIndent(lines[next] ?? '') > base) {
    const nested = parseYamlLines(lines, next);
    result[key] = nested.value;
    return next + nested.consumed;
  }
  result[key] = null;
  return next;
}

function parseYamlLines(lines: string[], start: number): YamlParseResult {
  const result: Record<string, unknown> = {};
  let i = start;
  const base = getIndent(lines[i] ?? '');
  while (i < lines.length) {
    if (getIndent(lines[i] ?? '') !== base) break;
    const t = (lines[i] ?? '').trim();
    if (t.startsWith('- ')) return parseYamlListItems(lines, i, base);
    i = parseYamlKeyValue(lines, i, base, result, t);
  }
  return { value: result, consumed: i - start };
}

export function yamlToJson(yaml: string): string {
  const lines = yaml.split('\n').filter((l) => l.trim() && !l.trim().startsWith('#'));
  if (lines.length === 0) return '{}';
  return JSON.stringify(parseYamlLines(lines, 0).value, null, 2);
}

function toYaml(obj: unknown, level: number): string {
  const indent = '  '.repeat(level);
  if (obj === null || obj === undefined) return 'null';
  if (typeof obj === 'boolean' || typeof obj === 'number') return String(obj);
  if (typeof obj === 'string') return obj.includes(':') || obj.includes('#') ? `"${obj}"` : obj;
  if (Array.isArray(obj)) {
    if (obj.length === 0) return '[]';
    return obj.map((item) => {
      if (typeof item === 'object' && item !== null && !Array.isArray(item)) {
        const inner = toYaml(item, level + 1);
        const [first, ...rest] = inner.split('\n');
        return `${indent}- ${first}${rest.length ? `\n${rest.join('\n')}` : ''}`;
      }
      return `${indent}- ${toYaml(item, level + 1)}`;
    }).join('\n');
  }
  if (typeof obj === 'object') {
    const entries = Object.entries(obj as Record<string, unknown>);
    if (entries.length === 0) return '{}';
    return entries.map(([k, v]) =>
      typeof v === 'object' && v !== null ? `${indent}${k}:\n${toYaml(v, level + 1)}` : `${indent}${k}: ${toYaml(v, level + 1)}`
    ).join('\n');
  }
  return String(obj);
}

export function jsonToYaml(json: string): string {
  return toYaml(JSON.parse(json), 0);
}

// ---- XML to JSON (inline, no DOMParser) ----
export function simpleXmlToJson(xml: string): string {
  const trimmed = xml.trim();
  if (!trimmed) throw new Error('Input is empty');
  if (/<(!--|!\[CDATA\[|\?)/.test(xml)) throw new Error('xml-to-json: comments, CDATA, and processing instructions are not supported');

  function tokenize(str: string): string[] {
    const tokens: string[] = [];
    let i = 0;
    while (i < str.length) {
      if (str[i] === '<') {
        let j = i + 1;
        while (j < str.length && str[j] !== '>') j++;
        tokens.push(str.slice(i, j + 1));
        i = j + 1;
      } else {
        let j = i;
        while (j < str.length && str[j] !== '<') j++;
        const text = str.slice(i, j).trim();
        if (text) tokens.push(text);
        i = j;
      }
    }
    return tokens;
  }

  function parse(tokens: string[], pos: number): [unknown, number] {
    const token = tokens[pos];
    if (!token) return [null, pos + 1];
    if (token.startsWith('<') && token.endsWith('/>')) {
      const tag = token.match(/^<([^\s/>]+)/)?.[1] ?? 'unknown';
      return [{ [tag]: null }, pos + 1];
    }
    if (token.startsWith('<') && !token.startsWith('</')) {
      const tag = token.match(/^<([^\s>]+)/)?.[1] ?? 'unknown';
      const children: Record<string, unknown> = {};
      let textContent = '';
      let cur = pos + 1;
      while (cur < tokens.length) {
        const t = tokens[cur];
        if (t === `</${tag}>`) { cur++; break; }
        if (t?.startsWith('<') && !t.startsWith('</')) {
          const [child, next] = parse(tokens, cur);
          const co = child as Record<string, unknown>;
          for (const [k, v] of Object.entries(co)) {
            children[k] = k in children ? (Array.isArray(children[k]) ? [...(children[k] as unknown[]), v] : [children[k], v]) : v;
          }
          cur = next;
        } else { textContent += (t ?? ''); cur++; }
      }
      const value = Object.keys(children).length > 0 ? children : (textContent.trim() || null);
      return [{ [tag]: value }, cur];
    }
    return [null, pos + 1];
  }

  const tokens = tokenize(trimmed);
  const [result] = parse(tokens, 0);
  return JSON.stringify(result, null, 2);
}

// ---- TOML ----
function parseTomlValue(value: string): unknown {
  const t = value.trim();
  if (t === 'true') return true;
  if (t === 'false') return false;
  if (t.startsWith('"') && t.endsWith('"')) return t.slice(1, -1).replace(/\\n/g, '\n').replace(/\\t/g, '\t').replace(/\\"/g, '"').replace(/\\\\/g, '\\');
  if (t.startsWith("'") && t.endsWith("'")) return t.slice(1, -1);
  if (t.startsWith('[') && t.endsWith(']')) return parseTomlArray(t);
  if (t.startsWith('{') && t.endsWith('}')) return parseTomlInlineTable(t);
  if (/^\d{4}-\d{2}-\d{2}/.test(t)) return t;
  if (/^[+-]?\d+\.\d+([eE][+-]?\d+)?$/.test(t)) return parseFloat(t);
  if (/^[+-]?\d[\d_]*$/.test(t)) return parseInt(t.replace(/_/g, ''), 10);
  if (/^0x[0-9a-fA-F_]+$/.test(t)) return parseInt(t.replace(/_/g, ''), 16);
  return t;
}

function parseTomlArray(str: string): unknown[] {
  const inner = str.slice(1, -1).trim();
  if (!inner) return [];
  const items: unknown[] = [];
  let depth = 0, start = 0, inStr = false;
  for (let i = 0; i < inner.length; i++) {
    const c = inner[i];
    if (c === '"' && inner[i - 1] !== '\\') inStr = !inStr;
    if (!inStr) { if (c === '[' || c === '{') depth++; else if (c === ']' || c === '}') depth--; }
    if (c === ',' && depth === 0 && !inStr) { items.push(parseTomlValue(inner.slice(start, i))); start = i + 1; }
  }
  if (start < inner.length) items.push(parseTomlValue(inner.slice(start)));
  return items;
}

function parseTomlInlineTable(str: string): Record<string, unknown> {
  const inner = str.slice(1, -1).trim();
  if (!inner) return {};
  const result: Record<string, unknown> = {};
  for (const pair of inner.split(',')) {
    const eqIdx = pair.indexOf('=');
    if (eqIdx > 0) result[pair.slice(0, eqIdx).trim()] = parseTomlValue(pair.slice(eqIdx + 1));
  }
  return result;
}

function setNestedPath(obj: Record<string, unknown>, path: string[], value: unknown): void {
  let cur = obj;
  for (let i = 0; i < path.length - 1; i++) {
    const key = path[i] as string;
    if (!(key in cur)) cur[key] = {};
    const next = cur[key];
    if (Array.isArray(next)) { cur = next[next.length - 1] as Record<string, unknown>; }
    else cur = next as Record<string, unknown>;
  }
  const last = path[path.length - 1] as string;
  cur[last] = value;
}

export function tomlToJson(input: string): string {
  const result: Record<string, unknown> = {};
  let currentPath: string[] = [];
  for (const rawLine of input.split('\n')) {
    const line = rawLine.replace(/#.*$/, '').trim();
    if (!line) continue;
    if (line.startsWith('[[')) {
      const key = line.slice(2, -2).trim();
      currentPath = [key];
      const arr = (result[key] as unknown[]) ?? [];
      arr.push({});
      result[key] = arr;
    } else if (line.startsWith('[')) {
      currentPath = line.slice(1, -1).trim().split('.');
      let cur = result;
      for (const key of currentPath) { if (!(key in cur)) cur[key] = {}; cur = cur[key] as Record<string, unknown>; }
    } else {
      const eqIdx = line.indexOf('=');
      if (eqIdx > 0) {
        const key = line.slice(0, eqIdx).trim();
        const val = parseTomlValue(line.slice(eqIdx + 1));
        if (currentPath.length === 0) result[key] = val;
        else setNestedPath(result, [...currentPath, key], val);
      }
    }
  }
  return JSON.stringify(result, null, 2);
}
```

保存先: `~/.claude/plugins/marketplaces/naoto24kawa-claude-plugins/plugins/elchika-tools/mcp-server/src/utils/format.ts`

- [ ] **Step 4: テストが通ることを確認する**

```bash
npx vitest run
```

Expected: `Tests 28 passed`（text 15 + encode 3 + format 10）

- [ ] **Step 5: コミットする**

```bash
cd ~/.claude/plugins/marketplaces/naoto24kawa-claude-plugins
git add plugins/elchika-tools/mcp-server/src/
git commit -m "feat(elchika-tools): add utils/format.ts with 9 format/convert functions"
```

---

## Task 5: utils/crypto.ts + utils/generate.ts — 暗号・生成 4 ツール

**Files:**
- Create: `~/.claude/plugins/marketplaces/naoto24kawa-claude-plugins/plugins/elchika-tools/mcp-server/src/utils/crypto.ts`
- Create: `~/.claude/plugins/marketplaces/naoto24kawa-claude-plugins/plugins/elchika-tools/mcp-server/src/utils/generate.ts`
- Modify (test): `src/__tests__/utils.test.ts` に crypto + generate セクションを追加

- [ ] **Step 1: テストに crypto + generate セクションを追加する（失敗を確認）**

`utils.test.ts` に追記:

```typescript
import { atbash, caesarEncrypt } from '../utils/crypto.js';
import { generateUUIDv4, generateULID } from '../utils/generate.js';

describe('crypto utils', () => {
  test('atbash', () => expect(atbash('abc')).toBe('zyx'));
  test('atbash is its own inverse', () => expect(atbash(atbash('Hello'))).toBe('Hello'));
  test('caesarEncrypt shift 3', () => expect(caesarEncrypt('abc', 3)).toBe('def'));
  test('caesarEncrypt wraps', () => expect(caesarEncrypt('xyz', 3)).toBe('abc'));
});

describe('generate utils', () => {
  test('generateUUIDv4 format', () => {
    expect(generateUUIDv4()).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/);
  });
  test('generateULID length', () => {
    expect(generateULID()).toHaveLength(26);
  });
});
```

- [ ] **Step 2: テストが失敗することを確認する**

```bash
npx vitest run
```

Expected: FAIL

- [ ] **Step 3: utils/crypto.ts を作成する**

```typescript
export function atbash(text: string): string {
  return [...text].map((c) => {
    if (c >= 'A' && c <= 'Z') return String.fromCharCode(90 - (c.charCodeAt(0) - 65));
    if (c >= 'a' && c <= 'z') return String.fromCharCode(122 - (c.charCodeAt(0) - 97));
    return c;
  }).join('');
}

export function caesarEncrypt(text: string, shift: number): string {
  const s = ((shift % 26) + 26) % 26;
  return [...text].map((char) => {
    const code = char.charCodeAt(0);
    if (code >= 65 && code <= 90) return String.fromCharCode(((code - 65 + s) % 26) + 65);
    if (code >= 97 && code <= 122) return String.fromCharCode(((code - 97 + s) % 26) + 97);
    return char;
  }).join('');
}
```

保存先: `~/.claude/plugins/marketplaces/naoto24kawa-claude-plugins/plugins/elchika-tools/mcp-server/src/utils/crypto.ts`

- [ ] **Step 4: utils/generate.ts を作成する**

```typescript
export function generateUUIDv4(): string {
  const bytes = new Uint8Array(16);
  crypto.getRandomValues(bytes);
  bytes[6] = (bytes[6] & 0x0f) | 0x40;
  bytes[8] = (bytes[8] & 0x3f) | 0x80;
  const hex = Array.from(bytes, (b) => b.toString(16).padStart(2, '0')).join('');
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
}

const CROCKFORD = '0123456789ABCDEFGHJKMNPQRSTVWXYZ';

export function generateULID(): string {
  const now = Date.now();
  let timestamp = '';
  let t = now;
  for (let i = 0; i < 10; i++) { timestamp = (CROCKFORD[t % 32] ?? '0') + timestamp; t = Math.floor(t / 32); }
  const randomBytes = new Uint8Array(10);
  crypto.getRandomValues(randomBytes);
  let random = '';
  let bits = 0, val = 0, ri = 0;
  for (let i = 0; i < 16; i++) {
    while (bits < 5 && ri < randomBytes.length) { val = (val << 8) | (randomBytes[ri++] ?? 0); bits += 8; }
    bits -= 5;
    random += CROCKFORD[(val >> bits) & 0x1f] ?? '0';
  }
  return timestamp + random;
}
```

保存先: `~/.claude/plugins/marketplaces/naoto24kawa-claude-plugins/plugins/elchika-tools/mcp-server/src/utils/generate.ts`

- [ ] **Step 5: テストが通ることを確認する**

```bash
npx vitest run
```

Expected: `Tests 34 passed`（text 15 + encode 3 + format 10 + crypto 4 + generate 2）

- [ ] **Step 6: コミットする**

```bash
cd ~/.claude/plugins/marketplaces/naoto24kawa-claude-plugins
git add plugins/elchika-tools/mcp-server/src/
git commit -m "feat(elchika-tools): add utils/crypto.ts and utils/generate.ts"
```

---

## Task 6: registry.ts + index.ts — MCP サーバー本体

**Files:**
- Create: `~/.claude/plugins/marketplaces/naoto24kawa-claude-plugins/plugins/elchika-tools/mcp-server/src/registry.ts`
- Create: `~/.claude/plugins/marketplaces/naoto24kawa-claude-plugins/plugins/elchika-tools/mcp-server/src/index.ts`

このタスクでのテストは不要（index.ts は MCP プロトコル層のラッパーであり SDK が保証。registry.ts の各ツールは Task 2-5 のユニットテストで間接的に検証済み）。

- [ ] **Step 1: registry.ts を作成する**

```typescript
import {
  toUpperCase, toLowerCase, toTitleCase, toSentenceCase,
  toCamelCase, toPascalCase, toSnakeCase, toKebabCase,
  reverseCharacters, reverseWords, reverseLines,
  slugify, SLUGIFY_DEFAULTS,
  sortText, DEFAULT_SORT_OPTIONS,
  toKatakana, toHiragana,
} from './utils/text.js';
import {
  encodeBase64, decodeBase64,
  encodeHTMLEntities, decodeHTMLEntities,
  uuencode, uudecode,
} from './utils/encode.js';
import {
  formatJSON, minifyJSON, formatXml, formatHtml, minifyHtml,
  yamlToJson, jsonToYaml, simpleXmlToJson, tomlToJson,
} from './utils/format.js';
import { atbash, caesarEncrypt } from './utils/crypto.js';
import { generateUUIDv4, generateULID } from './utils/generate.js';

export type ToolFn = (input: string) => string | Promise<string>;

export const REGISTRY: Record<string, ToolFn> = {
  // Text
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
  // Encode
  'base64-encode': (t) => encodeBase64(t),
  'base64-decode': (t) => decodeBase64(t),
  'html-entity-encode': (t) => encodeHTMLEntities(t),
  'html-entity-decode': (t) => decodeHTMLEntities(t),
  'uuencode': (t) => uuencode(t),
  'uudecode': (t) => uudecode(t),
  // Format
  'json-format': (t) => formatJSON(t, 2),
  'json-minify': (t) => minifyJSON(t),
  'xml-format': (t) => formatXml(t),
  'html-format': (t) => formatHtml(t),
  'html-minify': (t) => minifyHtml(t),
  'yaml-to-json': (t) => yamlToJson(t),
  'json-to-yaml': (t) => jsonToYaml(t),
  'xml-to-json': (t) => simpleXmlToJson(t),
  'toml-to-json': (t) => tomlToJson(t),
  // Crypto
  'atbash': (t) => atbash(t),
  'caesar-encrypt': (t) => {
    try {
      const parsed: unknown = JSON.parse(t);
      if (typeof parsed === 'object' && parsed !== null && 'text' in parsed && 'shift' in parsed &&
          typeof (parsed as Record<string, unknown>).text === 'string' &&
          typeof (parsed as Record<string, unknown>).shift === 'number') {
        return caesarEncrypt((parsed as Record<string, unknown>).text as string, (parsed as Record<string, unknown>).shift as number);
      }
    } catch { /* not JSON */ }
    return caesarEncrypt(t, 3);
  },
  // Generate
  'uuid-v4': () => generateUUIDv4(),
  'ulid': () => generateULID(),
};

export const TOOL_NAMES = Object.keys(REGISTRY) as [string, ...string[]];
```

保存先: `~/.claude/plugins/marketplaces/naoto24kawa-claude-plugins/plugins/elchika-tools/mcp-server/src/registry.ts`

- [ ] **Step 2: index.ts を作成する**

```typescript
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod';
import { REGISTRY, TOOL_NAMES, type ToolFn } from './registry.js';

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
      const fn = REGISTRY[tool] as ToolFn;
      const result = await fn(input);
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

保存先: `~/.claude/plugins/marketplaces/naoto24kawa-claude-plugins/plugins/elchika-tools/mcp-server/src/index.ts`

- [ ] **Step 3: 全テストを通すことを確認する**

```bash
cd ~/.claude/plugins/marketplaces/naoto24kawa-claude-plugins/plugins/elchika-tools/mcp-server
npx vitest run
```

Expected: `Tests 34 passed`

- [ ] **Step 4: TypeScript 型チェックを通すことを確認する**

```bash
npx tsc --noEmit
```

Expected: エラーなし（または registry.ts の `noUncheckedIndexedAccess` による警告のみ — index.ts の `as ToolFn` キャストで解消済み）

- [ ] **Step 5: コミットする**

```bash
cd ~/.claude/plugins/marketplaces/naoto24kawa-claude-plugins
git add plugins/elchika-tools/mcp-server/src/registry.ts plugins/elchika-tools/mcp-server/src/index.ts
git commit -m "feat(elchika-tools): add registry.ts and index.ts to complete MCP server"
```

---

## Task 7: tools/.mcp.json の elchika-tools エントリ削除

**Files:**
- Modify: `/Users/nishikawa/projects/naoto24kawa/tools/.mcp.json`

- [ ] **Step 1: .mcp.json から elchika-tools を削除する**

`/Users/nishikawa/projects/naoto24kawa/tools/.mcp.json` を以下に変更:

```json
{
  "mcpServers": {
    "playwright": {
      "command": "npx",
      "args": ["@playwright/mcp@latest"]
    }
  }
}
```

- [ ] **Step 2: コミットする**

```bash
cd /Users/nishikawa/projects/naoto24kawa/tools
git add .mcp.json
git commit -m "chore: remove elchika-tools from .mcp.json (moved to plugin)"
```

- [ ] **Step 3: プラグインリポジトリを push する**

```bash
cd ~/.claude/plugins/marketplaces/naoto24kawa-claude-plugins
git push origin main
```

- [ ] **Step 4: tools リポジトリを push する**

```bash
cd /Users/nishikawa/projects/naoto24kawa/tools
git push origin main
```
