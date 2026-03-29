# Router

Cloudflare Workers 上で動作するリバースプロキシルーター。`tools.elchika.app/<tool-name>` へのリクエストを各ツールの Cloudflare Pages プロジェクトにプロキシする。

## アーキテクチャ

```
tools.elchika.app
  ├── /              → ツール一覧ページ (HTML)
  ├── /health        → ヘルスチェック (JSON)
  ├── /<tool-name>/* → 各ツールの Cloudflare Pages へプロキシ
  └── 404            → エラーレスポンス (JSON)
```

各ツールは `tools-<tool-name>.elchika.app` に個別デプロイされており、このルーターが単一ドメインでのアクセスを提供する。

## 技術スタック

- **ランタイム**: Cloudflare Workers
- **フレームワーク**: [Hono](https://hono.dev/) v4
- **言語**: TypeScript
- **デプロイ**: Wrangler

## 開発

```bash
# 依存関係のインストール (ルートから)
bun install

# 開発サーバー起動
cd packages/router
bun run dev

# 型チェック
bun run type-check

# デプロイ
bun run deploy
```

## テスト

```bash
bun test
```

## ディレクトリ構成

```
packages/router/
  src/
    index.ts              # エントリポイント (Hono app)
    config/
      apps.ts             # ツール一覧定義 (パス, URL, 表示名)
    utils/
      proxy.ts            # プロキシハンドラー
      __tests__/           # ユニットテスト
    views/
      ToolsListView.ts    # ツール一覧HTML生成
    __tests__/             # 統合テスト
  package.json
  tsconfig.json
  wrangler.toml
```

## ツールの追加方法

`src/config/apps.ts` の `APPS_CONFIG` 配列にエントリを追加する:

```typescript
{
  path: '/new-tool',
  url: 'https://tools-new-tool.elchika.app',
  name: 'ツール名',
  icon: '🔧',
  displayName: 'New Tool',
  description: 'ツールの説明',
}
```

## ライセンス

MIT
