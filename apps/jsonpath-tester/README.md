# JSONPath Tester

JSONPath式のテスト・検証。ブラウザ上で完結するクライアントサイドツール。

**URL**: https://tools.elchika.app/jsonpath-tester

## 技術スタック

- React 18 + TypeScript
- Vite 6
- Tailwind CSS 3.4 + shadcn/ui
- Cloudflare Pages

## 開発

```bash
# 依存関係のインストール (ルートから)
bun install

# 開発サーバー起動
cd apps/jsonpath-tester
bun run dev

# ビルド
bun run build

# デプロイ
bun run deploy
```

## テスト

```bash
bun test
```

## ディレクトリ構成

```
apps/jsonpath-tester/
  src/
    App.tsx          # メインコンポーネント
    main.tsx         # エントリポイント
    components/ui/   # shadcn/ui コンポーネント
    utils/           # ユーティリティ関数
      jsonpath.ts
  index.html
  package.json
  vite.config.ts
  wrangler.toml
```

## ライセンス

MIT
