# Router

Cloudflare Workers リバースプロキシ。`tools.elchika.app/<tool-name>` を各ツールの Cloudflare Pages にルーティング。

## アーキテクチャ

- Cloudflare Workers + Hono v4
- TypeScript
- 各ツールは `tools-<tool-name>.elchika.app` に個別デプロイ
- このルーターが `tools.elchika.app` のカスタムドメインで単一エントリポイントを提供

## 主要ファイル

- `src/index.ts` - Hono app エントリポイント (ミドルウェア, ルーティング, エラーハンドリング)
- `src/config/apps.ts` - ツール一覧定義 (APPS_CONFIG 配列)
- `src/utils/proxy.ts` - プロキシハンドラー (createProxyHandler)
- `src/views/ToolsListView.ts` - ルートページHTML生成

## コマンド

```bash
bun run dev        # Wrangler dev server
bun run type-check # 型チェック
bun run deploy     # ビルド + Wrangler deploy
bun test           # テスト
```

## ツール追加手順

1. `src/config/apps.ts` の `APPS_CONFIG` 配列にエントリ追加
2. `bun run deploy` でルーター再デプロイ

## Gotchas

- CORS は全オリジン許可 (`origin: '*'`)。本番で制限が必要な場合は `src/index.ts` を修正
- ルーターはプロキシのみ。各ツールのビルド/デプロイは `apps/<tool-name>` で個別に行う
- `wrangler.toml` の `pattern = "tools.elchika.app"` がカスタムドメイン設定
