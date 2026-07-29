# MCP Server Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Elchika Tools のテキスト系ツール 39 個を MCP サーバーとして Cloudflare Workers 上に公開する

**Architecture:** `packages/mcp-server/` に Hono + MCP SDK (Streamable HTTP) のサーバーを新規作成し、各 `apps/*/src/utils/` の純粋関数を MCP Tool として登録する。CF Workers は Fetch API ベースのため `fetch-to-node` で Node.js 互換の req/res に変換する。

**Tech Stack:** Hono, @modelcontextprotocol/sdk, fetch-to-node, zod, Cloudflare Workers, Vitest

**Spec:** `.docs/plans/mcp-server-design.md`

---

## File Structure

```
packages/mcp-server/          # 新規パッケージ
  src/
    index.ts                   # Hono エントリポイント + Streamable HTTP
    mcp.ts                     # McpServer 生成 + 全ツール登録
    empty.ts                   # wrangler alias 用空モジュール
    tools/
      encode.ts                # Encode 系 20 tools
      hash.ts                  # Hash 系 5 tools
      crypto.ts                # Crypto 系 12 tools
      text.ts                  # Text 系 2 tools (wrapper 含む)
    __tests__/
      encode.test.ts           # Encode ツール統合テスト
      hash.test.ts             # Hash ツール統合テスト
      crypto.test.ts           # Crypto ツール統合テスト
      text.test.ts             # Text ツール統合テスト
  package.json
  wrangler.toml
  tsconfig.json
```

---

### Task 1: パッケージスキャフォールド

**Files:**

- Create: `packages/mcp-server/package.json`
- Create: `packages/mcp-server/tsconfig.json`
- Create: `packages/mcp-server/wrangler.toml`
- Create: `packages/mcp-server/src/empty.ts`

- [ ] **Step 1: package.json を作成**

```json
{
  "name": "mcp-server",
  "version": "1.0.0",
  "private": true,
  "description": "MCP server for Elchika Tools",
  "main": "src/index.ts",
  "scripts": {
    "dev": "wrangler dev",
    "deploy": "wrangler deploy",
    "test": "vitest run",
    "test:watch": "vitest"
  },
  "dependencies": {
    "@modelcontextprotocol/sdk": "^1.12.0",
    "fetch-to-node": "^2.1.0",
    "hono": "^4.6.14",
    "zod": "^3.24.0"
  },
  "devDependencies": {
    "@cloudflare/workers-types": "^4.20241205.0",
    "vitest": "^3.0.0",
    "wrangler": "^4.0.0"
  }
}
```

- [ ] **Step 2: tsconfig.json を作成**

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

- [ ] **Step 3: wrangler.toml を作成**

```toml
name = "tools-mcp-server"
main = "src/index.ts"
compatibility_date = "2025-04-22"
compatibility_flags = ["nodejs_compat"]

[alias]
"raw-body" = "./src/empty.ts"
"content-type" = "./src/empty.ts"

[[routes]]
pattern = "mcp.tools.elchika.app"
custom_domain = true
```

- [ ] **Step 4: empty.ts を作成**

```typescript
export default function noop() {}
export const parse = noop;
```

- [ ] **Step 5: 依存関係をインストール**

Run: `cd /Users/nishikawa/projects/naoto24kawa/tools && pnpm install`
Expected: packages/mcp-server の依存関係がインストールされる

- [ ] **Step 6: コミット**

```bash
git add packages/mcp-server/package.json packages/mcp-server/tsconfig.json packages/mcp-server/wrangler.toml packages/mcp-server/src/empty.ts pnpm-lock.yaml
git commit -m "feat(mcp-server): scaffold package with config files"
```

---

### Task 2: エントリポイントと MCP サーバー基盤

**Files:**

- Create: `packages/mcp-server/src/index.ts`
- Create: `packages/mcp-server/src/mcp.ts`
- Create: `packages/mcp-server/src/tools/encode.ts` (最小: encode_base64 のみ)

- [ ] **Step 1: mcp.ts を作成(空のツール登録)**

```typescript
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";

export function createMcpServer(): McpServer {
  const server = new McpServer({
    name: "elchika-tools",
    version: "1.0.0",
  });

  return server;
}
```

- [ ] **Step 2: index.ts を作成**

```typescript
import { Hono } from "hono";
import { toReqRes, toFetchResponse } from "fetch-to-node";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import { createMcpServer } from "./mcp";

const app = new Hono();

const MAX_BODY_SIZE = 1024 * 1024;

app.post("/mcp", async (c) => {
  const contentLength = Number(c.req.header("content-length") || 0);
  if (contentLength > MAX_BODY_SIZE) {
    return c.json({ error: "Request body too large" }, 413);
  }

  const server = createMcpServer();
  const transport = new StreamableHTTPServerTransport({ sessionIdGenerator: undefined });
  await server.connect(transport);

  const body = await c.req.json();
  const { req, res } = toReqRes(c.req.raw);
  await transport.handleRequest(req, res, body);
  return toFetchResponse(res);
});

app.get("/mcp", async (c) => {
  c.header("Allow", "POST");
  return c.text("SSE not supported in stateless mode", 405);
});

app.delete("/mcp", async (c) => {
  return c.json({ ok: true }, 200);
});

app.get("/health", (c) => c.json({ status: "ok" }));

export default app;
```

- [ ] **Step 3: wrangler dev で起動確認**

Run: `cd packages/mcp-server && npx wrangler dev`
Expected: localhost でサーバーが起動。`curl http://localhost:8787/health` が `{"status":"ok"}` を返す

- [ ] **Step 4: コミット**

```bash
git add packages/mcp-server/src/index.ts packages/mcp-server/src/mcp.ts
git commit -m "feat(mcp-server): add Hono entry point with MCP Streamable HTTP"
```

---

### Task 3: Encode ツール + テスト

**Files:**

- Create: `packages/mcp-server/src/tools/encode.ts`
- Create: `packages/mcp-server/src/__tests__/encode.test.ts`

- [ ] **Step 1: テストを書く**

`packages/mcp-server/src/__tests__/encode.test.ts`:

```typescript
import { describe, test, expect } from "vitest";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { InMemoryTransport } from "@modelcontextprotocol/sdk/inMemory.js";
import { createMcpServer } from "../mcp";

async function callTool(name: string, args: Record<string, unknown>) {
  const server = createMcpServer();
  const [clientTransport, serverTransport] = InMemoryTransport.createLinkedPair();
  await server.connect(serverTransport);
  const client = new Client({ name: "test", version: "1.0.0" });
  await client.connect(clientTransport);
  return client.callTool({ name, arguments: args });
}

describe("encode tools", () => {
  test("encode_base64", async () => {
    const result = await callTool("encode_base64", { text: "Hello" });
    expect(result.content).toEqual([{ type: "text", text: "SGVsbG8=" }]);
  });

  test("decode_base64", async () => {
    const result = await callTool("decode_base64", { text: "SGVsbG8=" });
    expect(result.content).toEqual([{ type: "text", text: "Hello" }]);
  });

  test("encode_binary", async () => {
    const result = await callTool("encode_binary", { text: "AB" });
    expect(result.content).toEqual([{ type: "text", text: "01000001 01000010" }]);
  });

  test("decode_binary", async () => {
    const result = await callTool("decode_binary", { text: "01000001 01000010" });
    expect(result.content).toEqual([{ type: "text", text: "AB" }]);
  });

  test("encode_hex", async () => {
    const result = await callTool("encode_hex", { text: "AB" });
    expect(result.content).toEqual([{ type: "text", text: "41 42" }]);
  });

  test("encode_decimal", async () => {
    const result = await callTool("encode_decimal", { text: "AB" });
    expect(result.content).toEqual([{ type: "text", text: "65 66" }]);
  });

  test("encode_html_entity", async () => {
    const result = await callTool("encode_html_entity", { text: "<div>" });
    expect(result.content).toEqual([{ type: "text", text: "&lt;div&gt;" }]);
  });

  test("encode_morse", async () => {
    const result = await callTool("encode_morse", { text: "SOS" });
    expect(result.content).toEqual([{ type: "text", text: "... --- ..." }]);
  });

  test("encode_url", async () => {
    const result = await callTool("encode_url", { text: "hello world" });
    expect(result.content).toEqual([{ type: "text", text: "hello%20world" }]);
  });

  test("decode_url", async () => {
    const result = await callTool("decode_url", { text: "hello%20world" });
    expect(result.content).toEqual([{ type: "text", text: "hello world" }]);
  });

  test("decode_base64 error returns isError", async () => {
    const result = await callTool("decode_base64", { text: "!!!invalid!!!" });
    expect(result.isError).toBe(true);
  });
});
```

- [ ] **Step 2: テスト実行 -> 失敗を確認**

Run: `cd packages/mcp-server && npx vitest run src/__tests__/encode.test.ts`
Expected: FAIL (encode tools not registered)

- [ ] **Step 3: encode.ts を実装**

`packages/mcp-server/src/tools/encode.ts`:

```typescript
import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { encodeBase64, decodeBase64 } from "../../../../apps/encode-base64-string/src/utils/base64";
import {
  textToBinary,
  binaryToText,
  textToHex,
  hexToText,
  textToDecimal,
  decimalToText,
} from "../../../../apps/encode-binary/src/utils/binary";
import {
  encodeHTMLEntities,
  decodeHTMLEntities,
} from "../../../../apps/encode-html-entity/src/utils/htmlEntity";
import { textToMorse, morseToText } from "../../../../apps/encode-morse/src/utils/morse";
import {
  domainToASCII,
  domainFromASCII,
} from "../../../../apps/encode-punycode/src/utils/punycode";
import {
  textToUnicodeEscape,
  unicodeEscapeToText,
} from "../../../../apps/encode-unicode/src/utils/unicode";

function tool(
  server: McpServer,
  name: string,
  description: string,
  schema: Record<string, unknown>,
  fn: (args: Record<string, string>) => string,
) {
  server.tool(name, description, schema, async (args) => {
    try {
      const result = fn(args as Record<string, string>);
      return { content: [{ type: "text" as const, text: result }] };
    } catch (e) {
      return {
        isError: true,
        content: [
          { type: "text" as const, text: `Error: ${e instanceof Error ? e.message : String(e)}` },
        ],
      };
    }
  });
}

export function registerEncodeTools(server: McpServer) {
  const textInput = { text: z.string().describe("Input text") };
  const domainInput = { domain: z.string().describe("Domain name") };

  // Base64
  tool(server, "encode_base64", "Base64 encode", textInput, ({ text }) => encodeBase64(text));
  tool(server, "decode_base64", "Base64 decode", textInput, ({ text }) => decodeBase64(text));

  // Base32 - import は InMemoryTransport テスト時に確認。初期実装では省略可能。
  // 実装時に apps/encode-base32/src/utils/base32.ts の export 名を確認すること。

  // Binary / Hex / Decimal
  tool(server, "encode_binary", "Text to binary", textInput, ({ text }) => textToBinary(text));
  tool(server, "decode_binary", "Binary to text", textInput, ({ text }) => binaryToText(text));
  tool(server, "encode_hex", "Text to hex", textInput, ({ text }) => textToHex(text));
  tool(server, "decode_hex", "Hex to text", textInput, ({ text }) => hexToText(text));
  tool(server, "encode_decimal", "Text to decimal code points", textInput, ({ text }) =>
    textToDecimal(text),
  );
  tool(server, "decode_decimal", "Decimal code points to text", textInput, ({ text }) =>
    decimalToText(text),
  );

  // HTML Entity
  tool(server, "encode_html_entity", "Encode HTML special chars", textInput, ({ text }) =>
    encodeHTMLEntities(text),
  );
  tool(server, "decode_html_entity", "Decode HTML entities", textInput, ({ text }) =>
    decodeHTMLEntities(text),
  );

  // Morse
  tool(server, "encode_morse", "Text to Morse code", textInput, ({ text }) => textToMorse(text));
  tool(server, "decode_morse", "Morse code to text", textInput, ({ text }) => morseToText(text));

  // Punycode
  tool(server, "encode_punycode", "Domain to ASCII (Punycode)", domainInput, ({ domain }) =>
    domainToASCII(domain),
  );
  tool(server, "decode_punycode", "ASCII domain to Unicode", domainInput, ({ domain }) =>
    domainFromASCII(domain),
  );

  // Unicode escape
  tool(server, "encode_unicode_escape", "Text to Unicode escape", textInput, ({ text }) =>
    textToUnicodeEscape(text),
  );
  tool(server, "decode_unicode_escape", "Unicode escape to text", textInput, ({ text }) =>
    unicodeEscapeToText(text),
  );

  // URL
  tool(server, "encode_url", "URL encode", textInput, ({ text }) => encodeURIComponent(text));
  tool(server, "decode_url", "URL decode", textInput, ({ text }) => decodeURIComponent(text));
}
```

注: Base32 の import は `apps/encode-base32/src/utils/base32.ts` の実際の export 名を確認してから追加すること。

- [ ] **Step 4: mcp.ts に encode ツール登録を追加**

`packages/mcp-server/src/mcp.ts` を編集:

```typescript
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { registerEncodeTools } from "./tools/encode";

export function createMcpServer(): McpServer {
  const server = new McpServer({
    name: "elchika-tools",
    version: "1.0.0",
  });

  registerEncodeTools(server);

  return server;
}
```

- [ ] **Step 5: テスト実行 -> パスを確認**

Run: `cd packages/mcp-server && npx vitest run src/__tests__/encode.test.ts`
Expected: ALL PASS

- [ ] **Step 6: Base32 の export 名を確認して追加**

Run: `head -20 apps/encode-base32/src/utils/base32.ts` で export 名を確認し、encode.ts に import と tool 登録を追加。

- [ ] **Step 7: コミット**

```bash
git add packages/mcp-server/src/tools/encode.ts packages/mcp-server/src/__tests__/encode.test.ts packages/mcp-server/src/mcp.ts
git commit -m "feat(mcp-server): add encode tools (20 tools) with tests"
```

---

### Task 4: Hash ツール + テスト

**Files:**

- Create: `packages/mcp-server/src/tools/hash.ts`
- Create: `packages/mcp-server/src/__tests__/hash.test.ts`

- [ ] **Step 1: テストを書く**

`packages/mcp-server/src/__tests__/hash.test.ts`:

```typescript
import { describe, test, expect } from "vitest";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { InMemoryTransport } from "@modelcontextprotocol/sdk/inMemory.js";
import { createMcpServer } from "../mcp";

async function callTool(name: string, args: Record<string, unknown>) {
  const server = createMcpServer();
  const [clientTransport, serverTransport] = InMemoryTransport.createLinkedPair();
  await server.connect(serverTransport);
  const client = new Client({ name: "test", version: "1.0.0" });
  await client.connect(clientTransport);
  return client.callTool({ name, arguments: args });
}

describe("hash tools", () => {
  test("hash_md5", async () => {
    const result = await callTool("hash_md5", { text: "hello" });
    expect(result.content).toEqual([{ type: "text", text: "5d41402abc4b2a76b9719d911017c592" }]);
  });

  test("hash_crc32", async () => {
    const result = await callTool("hash_crc32", { text: "hello" });
    expect(result.content).toEqual([{ type: "text", text: "3610a686" }]);
  });

  test("hash_sha1", async () => {
    const result = await callTool("hash_sha1", { text: "hello" });
    const text = (result.content as Array<{ type: string; text: string }>)[0].text;
    expect(text).toMatch(/^[0-9a-f]{40}$/);
  });

  test("hash_sha with SHA-256", async () => {
    const result = await callTool("hash_sha", { text: "hello", algorithm: "SHA-256" });
    const text = (result.content as Array<{ type: string; text: string }>)[0].text;
    expect(text).toMatch(/^[0-9a-f]{64}$/);
  });

  test("hash_hmac", async () => {
    const result = await callTool("hash_hmac", {
      message: "hello",
      secret: "key",
      algorithm: "SHA-256",
    });
    const text = (result.content as Array<{ type: string; text: string }>)[0].text;
    expect(text).toMatch(/^[0-9a-f]+$/);
  });
});
```

- [ ] **Step 2: テスト実行 -> 失敗を確認**

Run: `cd packages/mcp-server && npx vitest run src/__tests__/hash.test.ts`
Expected: FAIL

- [ ] **Step 3: hash.ts を実装**

`packages/mcp-server/src/tools/hash.ts`:

```typescript
import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { md5 } from "../../../../apps/hash-md5/src/utils/md5";
import { crc32 } from "../../../../apps/hash-crc32/src/utils/crc32";
import { generateSHA1 } from "../../../../apps/hash-sha1/src/utils/sha1";
import { generateSHA } from "../../../../apps/hash-sha256/src/utils/sha";
import { generateHMAC } from "../../../../apps/hash-hmac/src/utils/hmac";

export function registerHashTools(server: McpServer) {
  // MD5
  server.tool("hash_md5", "Generate MD5 hash", { text: z.string() }, async ({ text }) => {
    try {
      return { content: [{ type: "text", text: md5(text) }] };
    } catch (e) {
      return {
        isError: true,
        content: [{ type: "text", text: `Error: ${e instanceof Error ? e.message : String(e)}` }],
      };
    }
  });

  // CRC32
  server.tool("hash_crc32", "Generate CRC32 checksum", { text: z.string() }, async ({ text }) => {
    try {
      return { content: [{ type: "text", text: crc32(text) }] };
    } catch (e) {
      return {
        isError: true,
        content: [{ type: "text", text: `Error: ${e instanceof Error ? e.message : String(e)}` }],
      };
    }
  });

  // SHA-1
  server.tool("hash_sha1", "Generate SHA-1 hash", { text: z.string() }, async ({ text }) => {
    try {
      return { content: [{ type: "text", text: await generateSHA1(text) }] };
    } catch (e) {
      return {
        isError: true,
        content: [{ type: "text", text: `Error: ${e instanceof Error ? e.message : String(e)}` }],
      };
    }
  });

  // SHA-256/384/512
  server.tool(
    "hash_sha",
    "Generate SHA-256/384/512 hash",
    {
      text: z.string(),
      algorithm: z.enum(["SHA-256", "SHA-384", "SHA-512"]).describe("Hash algorithm"),
    },
    async ({ text, algorithm }) => {
      try {
        return { content: [{ type: "text", text: await generateSHA(text, algorithm) }] };
      } catch (e) {
        return {
          isError: true,
          content: [{ type: "text", text: `Error: ${e instanceof Error ? e.message : String(e)}` }],
        };
      }
    },
  );

  // HMAC
  server.tool(
    "hash_hmac",
    "Generate HMAC authentication code",
    {
      message: z.string().describe("Message to sign"),
      secret: z.string().describe("Secret key"),
      algorithm: z.enum(["SHA-256", "SHA-384", "SHA-512", "SHA-1"]).describe("HMAC algorithm"),
    },
    async ({ message, secret, algorithm }) => {
      try {
        return {
          content: [{ type: "text", text: await generateHMAC(message, secret, algorithm) }],
        };
      } catch (e) {
        return {
          isError: true,
          content: [{ type: "text", text: `Error: ${e instanceof Error ? e.message : String(e)}` }],
        };
      }
    },
  );
}
```

- [ ] **Step 4: mcp.ts に hash ツール登録を追加**

```typescript
import { registerHashTools } from "./tools/hash";
// ... createMcpServer 内に追加:
registerHashTools(server);
```

- [ ] **Step 5: テスト実行 -> パスを確認**

Run: `cd packages/mcp-server && npx vitest run src/__tests__/hash.test.ts`
Expected: ALL PASS (SHA/HMAC は crypto.subtle が vitest 環境で使えるか要確認。WebCrypto polyfill が必要な場合は vitest.config.ts で設定)

- [ ] **Step 6: コミット**

```bash
git add packages/mcp-server/src/tools/hash.ts packages/mcp-server/src/__tests__/hash.test.ts packages/mcp-server/src/mcp.ts
git commit -m "feat(mcp-server): add hash tools (5 tools) with tests"
```

---

### Task 5: Crypto ツール + テスト

**Files:**

- Create: `packages/mcp-server/src/tools/crypto.ts`
- Create: `packages/mcp-server/src/__tests__/crypto.test.ts`

- [ ] **Step 1: テストを書く**

`packages/mcp-server/src/__tests__/crypto.test.ts`:

```typescript
import { describe, test, expect } from "vitest";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { InMemoryTransport } from "@modelcontextprotocol/sdk/inMemory.js";
import { createMcpServer } from "../mcp";

async function callTool(name: string, args: Record<string, unknown>) {
  const server = createMcpServer();
  const [clientTransport, serverTransport] = InMemoryTransport.createLinkedPair();
  await server.connect(serverTransport);
  const client = new Client({ name: "test", version: "1.0.0" });
  await client.connect(clientTransport);
  return client.callTool({ name, arguments: args });
}

describe("crypto tools", () => {
  test("cipher_caesar_encrypt", async () => {
    const result = await callTool("cipher_caesar_encrypt", { text: "HELLO", shift: 3 });
    expect(result.content).toEqual([{ type: "text", text: "KHOOR" }]);
  });

  test("cipher_caesar_decrypt", async () => {
    const result = await callTool("cipher_caesar_decrypt", { text: "KHOOR", shift: 3 });
    expect(result.content).toEqual([{ type: "text", text: "HELLO" }]);
  });

  test("cipher_caesar_bruteforce returns JSON array", async () => {
    const result = await callTool("cipher_caesar_bruteforce", { text: "KHOOR" });
    const text = (result.content as Array<{ type: string; text: string }>)[0].text;
    const parsed = JSON.parse(text);
    expect(parsed).toHaveLength(26);
    expect(parsed[3]).toEqual({ shift: 3, result: "HELLO" });
  });

  test("cipher_rot with rot13", async () => {
    const result = await callTool("cipher_rot", { text: "HELLO", variant: "rot13" });
    expect(result.content).toEqual([{ type: "text", text: "URYYB" }]);
  });

  test("cipher_atbash", async () => {
    const result = await callTool("cipher_atbash", { text: "ABC" });
    expect(result.content).toEqual([{ type: "text", text: "ZYX" }]);
  });

  test("cipher_vigenere_encrypt", async () => {
    const result = await callTool("cipher_vigenere_encrypt", { text: "HELLO", key: "KEY" });
    const text = (result.content as Array<{ type: string; text: string }>)[0].text;
    expect(text).toBeTruthy();
  });

  test("cipher_affine_encrypt with invalid a returns error", async () => {
    const result = await callTool("cipher_affine_encrypt", { text: "HELLO", a: 2, b: 3 });
    expect(result.isError).toBe(true);
  });

  test("cipher_rail_fence round trip", async () => {
    const encrypted = await callTool("cipher_rail_fence_encrypt", {
      text: "HELLO WORLD",
      rails: 3,
    });
    const encText = (encrypted.content as Array<{ type: string; text: string }>)[0].text;
    const decrypted = await callTool("cipher_rail_fence_decrypt", { text: encText, rails: 3 });
    expect(decrypted.content).toEqual([{ type: "text", text: "HELLO WORLD" }]);
  });

  test("cipher_enigma with defaults", async () => {
    const result = await callTool("cipher_enigma", { text: "HELLO" });
    const text = (result.content as Array<{ type: string; text: string }>)[0].text;
    expect(text).toHaveLength(5);
    expect(text).not.toBe("HELLO");
  });
});
```

- [ ] **Step 2: テスト実行 -> 失敗を確認**

Run: `cd packages/mcp-server && npx vitest run src/__tests__/crypto.test.ts`
Expected: FAIL

- [ ] **Step 3: crypto.ts を実装**

`packages/mcp-server/src/tools/crypto.ts`:

```typescript
import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import {
  caesarEncrypt,
  caesarDecrypt,
  bruteForce,
} from "../../../../apps/crypto-caesar/src/utils/caesar";
import { rot13, rot18, rot47 } from "../../../../apps/crypto-rot13/src/utils/rot";
import {
  vigenereEncrypt,
  vigenereDecrypt,
} from "../../../../apps/crypto-vigenere/src/utils/vigenere";
import { atbash } from "../../../../apps/crypto-atbash/src/utils/atbash";
import {
  affineEncrypt,
  affineDecrypt,
  isValidA,
} from "../../../../apps/crypto-affine/src/utils/affine";
import {
  railFenceEncrypt,
  railFenceDecrypt,
} from "../../../../apps/crypto-rail-fence/src/utils/railFence";
import { enigmaEncrypt, DEFAULT_CONFIG } from "../../../../apps/enigma-cipher/src/utils/enigma";
import type { EnigmaConfig, RotorName } from "../../../../apps/enigma-cipher/src/utils/enigma";

function wrapSync(fn: () => string) {
  try {
    return { content: [{ type: "text" as const, text: fn() }] };
  } catch (e) {
    return {
      isError: true,
      content: [
        { type: "text" as const, text: `Error: ${e instanceof Error ? e.message : String(e)}` },
      ],
    };
  }
}

export function registerCryptoTools(server: McpServer) {
  // Caesar
  server.tool(
    "cipher_caesar_encrypt",
    "Caesar cipher encrypt",
    {
      text: z.string(),
      shift: z.number().describe("Shift amount (0-25)"),
    },
    async ({ text, shift }) => wrapSync(() => caesarEncrypt(text, shift)),
  );

  server.tool(
    "cipher_caesar_decrypt",
    "Caesar cipher decrypt",
    {
      text: z.string(),
      shift: z.number().describe("Shift amount (0-25)"),
    },
    async ({ text, shift }) => wrapSync(() => caesarDecrypt(text, shift)),
  );

  server.tool(
    "cipher_caesar_bruteforce",
    "Caesar cipher brute force all shifts",
    {
      text: z.string(),
    },
    async ({ text }) => wrapSync(() => JSON.stringify(bruteForce(text), null, 2)),
  );

  // ROT
  server.tool(
    "cipher_rot",
    "ROT13/18/47 transform",
    {
      text: z.string(),
      variant: z.enum(["rot13", "rot18", "rot47"]).describe("ROT variant"),
    },
    async ({ text, variant }) => {
      const fns = { rot13, rot18, rot47 };
      return wrapSync(() => fns[variant](text));
    },
  );

  // Vigenere
  server.tool(
    "cipher_vigenere_encrypt",
    "Vigenere cipher encrypt",
    {
      text: z.string(),
      key: z.string().describe("Cipher key (letters only)"),
    },
    async ({ text, key }) => wrapSync(() => vigenereEncrypt(text, key)),
  );

  server.tool(
    "cipher_vigenere_decrypt",
    "Vigenere cipher decrypt",
    {
      text: z.string(),
      key: z.string().describe("Cipher key (letters only)"),
    },
    async ({ text, key }) => wrapSync(() => vigenereDecrypt(text, key)),
  );

  // Atbash
  server.tool(
    "cipher_atbash",
    "Atbash cipher (symmetric)",
    {
      text: z.string(),
    },
    async ({ text }) => wrapSync(() => atbash(text)),
  );

  // Affine
  server.tool(
    "cipher_affine_encrypt",
    "Affine cipher encrypt",
    {
      text: z.string(),
      a: z
        .number()
        .describe("Multiplier (must be coprime with 26: 1,3,5,7,9,11,15,17,19,21,23,25)"),
      b: z.number().describe("Shift amount"),
    },
    async ({ text, a, b }) => {
      if (!isValidA(a)) {
        return {
          isError: true,
          content: [{ type: "text", text: `Invalid a=${a}. Must be coprime with 26.` }],
        };
      }
      return wrapSync(() => affineEncrypt(text, a, b));
    },
  );

  server.tool(
    "cipher_affine_decrypt",
    "Affine cipher decrypt",
    {
      text: z.string(),
      a: z.number().describe("Multiplier (same as used for encryption)"),
      b: z.number().describe("Shift amount (same as used for encryption)"),
    },
    async ({ text, a, b }) => {
      if (!isValidA(a)) {
        return {
          isError: true,
          content: [{ type: "text", text: `Invalid a=${a}. Must be coprime with 26.` }],
        };
      }
      return wrapSync(() => affineDecrypt(text, a, b));
    },
  );

  // Rail Fence
  server.tool(
    "cipher_rail_fence_encrypt",
    "Rail fence cipher encrypt",
    {
      text: z.string(),
      rails: z.number().min(2).describe("Number of rails"),
    },
    async ({ text, rails }) => wrapSync(() => railFenceEncrypt(text, rails)),
  );

  server.tool(
    "cipher_rail_fence_decrypt",
    "Rail fence cipher decrypt",
    {
      text: z.string(),
      rails: z.number().min(2).describe("Number of rails"),
    },
    async ({ text, rails }) => wrapSync(() => railFenceDecrypt(text, rails)),
  );

  // Enigma
  server.tool(
    "cipher_enigma",
    "Enigma machine cipher (symmetric)",
    {
      text: z.string(),
      rotors: z
        .array(z.enum(["I", "II", "III"]))
        .length(3)
        .optional()
        .describe("Three rotors"),
      positions: z
        .array(z.number().min(0).max(25))
        .length(3)
        .optional()
        .describe("Starting positions [0-25]"),
    },
    async ({ text, rotors, positions }) => {
      const config: EnigmaConfig = {
        rotors: (rotors as [RotorName, RotorName, RotorName]) ?? DEFAULT_CONFIG.rotors,
        positions: (positions as [number, number, number]) ?? DEFAULT_CONFIG.positions,
      };
      return wrapSync(() => enigmaEncrypt(text, config));
    },
  );
}
```

- [ ] **Step 4: mcp.ts に crypto ツール登録を追加**

```typescript
import { registerCryptoTools } from "./tools/crypto";
// createMcpServer 内:
registerCryptoTools(server);
```

- [ ] **Step 5: テスト実行 -> パスを確認**

Run: `cd packages/mcp-server && npx vitest run src/__tests__/crypto.test.ts`
Expected: ALL PASS

- [ ] **Step 6: コミット**

```bash
git add packages/mcp-server/src/tools/crypto.ts packages/mcp-server/src/__tests__/crypto.test.ts packages/mcp-server/src/mcp.ts
git commit -m "feat(mcp-server): add crypto tools (12 tools) with tests"
```

---

### Task 6: Text ツール (wrapper) + テスト

**Files:**

- Create: `packages/mcp-server/src/tools/text.ts`
- Create: `packages/mcp-server/src/__tests__/text.test.ts`

注: `textAnalysis.ts` と `deduplicate.ts` は `@types` パスエイリアスに依存するため、直接 import せずロジックをインライン複製する。

- [ ] **Step 1: テストを書く**

`packages/mcp-server/src/__tests__/text.test.ts`:

```typescript
import { describe, test, expect } from "vitest";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { InMemoryTransport } from "@modelcontextprotocol/sdk/inMemory.js";
import { createMcpServer } from "../mcp";

async function callTool(name: string, args: Record<string, unknown>) {
  const server = createMcpServer();
  const [clientTransport, serverTransport] = InMemoryTransport.createLinkedPair();
  await server.connect(serverTransport);
  const client = new Client({ name: "test", version: "1.0.0" });
  await client.connect(clientTransport);
  return client.callTool({ name, arguments: args });
}

describe("text tools", () => {
  test("text_analyze returns JSON with all fields", async () => {
    const result = await callTool("text_analyze", { text: "Hello World" });
    const text = (result.content as Array<{ type: string; text: string }>)[0].text;
    const stats = JSON.parse(text);
    expect(stats).toHaveProperty("charsWithSpaces");
    expect(stats).toHaveProperty("charsWithoutSpaces");
    expect(stats).toHaveProperty("words");
    expect(stats).toHaveProperty("lines");
    expect(stats).toHaveProperty("paragraphs");
    expect(stats).toHaveProperty("bytes");
    expect(stats).toHaveProperty("readingTimeMinutes");
    expect(stats.charsWithSpaces).toBe(11);
    expect(stats.charsWithoutSpaces).toBe(10);
  });

  test("text_analyze with Japanese", async () => {
    const result = await callTool("text_analyze", { text: "こんにちは", language: "ja" });
    const stats = JSON.parse((result.content as Array<{ type: string; text: string }>)[0].text);
    expect(stats.charsWithSpaces).toBe(5);
  });

  test("text_deduplicate removes duplicate lines", async () => {
    const result = await callTool("text_deduplicate", { text: "a\nb\na\nc\nb" });
    expect(result.content).toEqual([{ type: "text", text: "a\nb\nc" }]);
  });

  test("text_deduplicate with case insensitive", async () => {
    const result = await callTool("text_deduplicate", {
      text: "Hello\nhello\nHELLO",
      caseSensitive: false,
    });
    expect(result.content).toEqual([{ type: "text", text: "Hello" }]);
  });
});
```

- [ ] **Step 2: テスト実行 -> 失敗を確認**

Run: `cd packages/mcp-server && npx vitest run src/__tests__/text.test.ts`
Expected: FAIL

- [ ] **Step 3: text.ts を実装**

`packages/mcp-server/src/tools/text.ts` - ロジックを `apps/text-counter/src/utils/textAnalysis.ts` と `apps/text-deduplicate/src/utils/deduplicate.ts` からインライン複製する。

実装時に以下のファイルを参照:

- `apps/text-counter/src/utils/textAnalysis.ts` (analyzeText のロジック)
- `apps/text-counter/src/types/index.ts` (CountSettings, TextStats 型)
- `apps/text-counter/src/config/constants.ts` (READING_SPEED)
- `apps/text-deduplicate/src/utils/deduplicate.ts` (deduplicateLines のロジック)
- `apps/text-deduplicate/src/types/index.ts` (DeduplicateSettings 型)

- [ ] **Step 4: mcp.ts に text ツール登録を追加**

```typescript
import { registerTextTools } from "./tools/text";
// createMcpServer 内:
registerTextTools(server);
```

- [ ] **Step 5: テスト実行 -> パスを確認**

Run: `cd packages/mcp-server && npx vitest run src/__tests__/text.test.ts`
Expected: ALL PASS

- [ ] **Step 6: コミット**

```bash
git add packages/mcp-server/src/tools/text.ts packages/mcp-server/src/__tests__/text.test.ts packages/mcp-server/src/mcp.ts
git commit -m "feat(mcp-server): add text tools (2 tools) with inline wrappers and tests"
```

---

### Task 7: 全テスト実行 + wrangler dev 動作確認

**Files:**

- 変更なし (既存ファイルの動作確認)

- [ ] **Step 1: 全テスト実行**

Run: `cd packages/mcp-server && npx vitest run`
Expected: ALL PASS (encode + hash + crypto + text)

- [ ] **Step 2: wrangler dev 起動**

Run: `cd packages/mcp-server && npx wrangler dev`
Expected: ローカルサーバー起動

- [ ] **Step 3: MCP ツール一覧を確認**

```bash
curl -X POST http://localhost:8787/mcp \
  -H 'Content-Type: application/json' \
  -d '{"jsonrpc":"2.0","id":1,"method":"tools/list"}'
```

Expected: 39 tools が返却される

- [ ] **Step 4: 実際のツール呼び出しを確認**

```bash
curl -X POST http://localhost:8787/mcp \
  -H 'Content-Type: application/json' \
  -d '{"jsonrpc":"2.0","id":2,"method":"tools/call","params":{"name":"encode_base64","arguments":{"text":"Hello"}}}'
```

Expected: `SGVsbG8=` が含まれるレスポンス

- [ ] **Step 5: コミット (修正があれば)**

```bash
git add -u
git commit -m "fix(mcp-server): address integration issues from manual testing"
```

---

### Task 8: デプロイ

**Files:**

- 変更なし

- [ ] **Step 1: wrangler deploy でデプロイ**

Run: `cd packages/mcp-server && npx wrangler deploy`
Expected: デプロイ成功、URL が表示される

- [ ] **Step 2: 本番環境で動作確認**

```bash
curl https://mcp.tools.elchika.app/health
```

Expected: `{"status":"ok"}`

```bash
curl -X POST https://mcp.tools.elchika.app/mcp \
  -H 'Content-Type: application/json' \
  -d '{"jsonrpc":"2.0","id":1,"method":"tools/list"}'
```

Expected: 39 tools

- [ ] **Step 3: Claude Code の MCP 設定を追加して動作確認**

`~/.claude/settings.json` (または `.claude/settings.json`) に以下を追加:

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

Claude Code を再起動し、MCP ツールが認識されることを確認。

- [ ] **Step 4: 最終コミット + PR 作成**

```bash
git add -A
git commit -m "feat(mcp-server): complete MCP server with 39 tools"
```

PR を作成:

```bash
gh pr create --title "feat: add MCP server for text tools" --body "..."
```
