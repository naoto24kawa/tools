# elchika-tools Plugin — 設計書

**Goal:** `packages/mcp-server/` の MCP サーバーを `naoto24kawa-claude-plugins` に `elchika-tools` プラグインとして同梱し、plugin install だけで任意マシンの Claude Code に `run` ツールを提供できるようにする。

**Architecture:** `naoto24kawa-claude-plugins/plugins/elchika-tools/` に MCP サーバーソースをすべて同梱。プラグインの `.mcp.json` が `${PLUGIN_DIR}` 変数で自分自身のインストールパスを参照し、初回のみ `npm install` を実行する shell ラッパー経由で起動する。

**Tech Stack:** Claude Code Plugin System, stdio MCP, `@modelcontextprotocol/sdk`, `tsx`, TypeScript, `zod`

---

## ファイル構成

```
naoto24kawa-claude-plugins/
  plugins/
    elchika-tools/
      .claude-plugin/
        plugin.json              # プラグインマニフェスト
      mcp-server/
        src/
          index.ts               # MCP サーバーエントリポイント（tools/packages/mcp-server と同一）
          registry.ts            # ツール名 → 関数マッピング（import を ./utils/* に変更）
          utils/
            text.ts              # case-converter / slugify / sort / reverse / kana 等
            encode.ts            # base64 / html-entity / uuencode
            format.ts            # json / xml / html-format / yaml-json 変換 / toml-json
            crypto.ts            # atbash / caesar
            generate.ts          # uuid-v4 / ulid
        package.json             # dependencies: @modelcontextprotocol/sdk, zod; devDep: tsx
        tsconfig.json
      .mcp.json                  # ${PLUGIN_DIR} 参照 + 初回 npm install ラッパー
      README.md
  .claude-plugin/
    marketplace.json             # elchika-tools エントリを追加
```

---

## `.mcp.json` 設計

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

- `${PLUGIN_DIR}` は Claude Code がプラグインインストールパスに展開する
- `[ -d node_modules ] || npm install --silent` — 初回のみインストール、以降はスキップ
- `npx tsx src/index.ts` — TypeScript を直実行（ビルドステップなし）

---

## `utils/` 設計

`packages/mcp-server/src/registry.ts` が `../../apps/*/src/utils/` を相対 import していた依存を切り離し、プラグイン内 `utils/` にすべての純粋関数を集約する。

| ファイル | 収録する関数 | 元の import 元 |
|---------|------------|--------------|
| `utils/text.ts` | `toUpperCase`, `toLowerCase`, `toTitleCase`, `toSentenceCase`, `toCamelCase`, `toPascalCase`, `toSnakeCase`, `toKebabCase`, `reverseCharacters`, `reverseWords`, `reverseLines`, `slugify`, `sortText`, `toKatakana`, `toHiragana` | apps/case-converter, text-slugify, text-reverse, text-sort, kana-converter |
| `utils/encode.ts` | `encodeBase64`, `decodeBase64`, `encodeHTMLEntities`, `decodeHTMLEntities`, `uuencode`, `uudecode` | apps/encode-base64-string, html-entity-encoder, uuencode |
| `utils/format.ts` | `formatJSON`, `minifyJSON`, `formatXml`, `formatHtml`, `minifyHtml`, `yamlToJson`, `jsonToYaml`, `simpleXmlToJson`, `parseToml` | apps/json-formatter, xml-formatter, html-formatter, yaml-to-json, xml-to-json, toml-to-json |
| `utils/crypto.ts` | `atbash`, `caesarEncrypt` | apps/atbash-cipher, caesar-cipher |
| `utils/generate.ts` | `generateUUIDv4`, `generateULID` | apps/uuid-generator, ulid-generator |

---

## `plugin.json` 設計

```json
{
  "name": "elchika-tools",
  "version": "1.0.0",
  "description": "Elchika Tools MCP server — exposes 34 local utilities (text, encode, format, crypto, generate) as a single Claude Code MCP tool. Data never leaves your machine.",
  "author": {
    "name": "naoto24kawa",
    "email": "naoto24kawa@gmail.com"
  },
  "license": "MIT"
}
```

---

## `marketplace.json` 変更

`plugins` 配列に追加:

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

---

## `tools` リポジトリの `.mcp.json` 対応

プラグイン化後、`tools/.mcp.json` の `elchika-tools` エントリは削除する（プラグインが代替するため）。プラグインがインストールされていない環境向けにフォールバックとして残す選択肢もあるが、混在による混乱を避けるため削除を推奨。

`packages/mcp-server/` はそのまま保持し、開発・テスト用ワークスペースとして活用する（`../../apps/*/src/utils/` への相対 import が生きた参照として機能し続ける）。

---

## 成功基準

1. `naoto24kawa-claude-plugins` に `elchika-tools` プラグインが追加されている
2. プラグインインストール後、`/mcp` コマンドで `elchika-tools` サーバーが表示される
3. `run({ tool: "json-format", input: '{"a":1}' })` が整形済み JSON を返す
4. 別パス（別マシン想定）でもインストールパスが正しく解決される
5. データがネットワークに送出されない
