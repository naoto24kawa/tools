# JSON Diff

2つのJSONの差分比較。ブラウザ上で完結するクライアントサイドツール。

**URL**: https://tools.elchika.app/json-diff

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
cd apps/json-diff
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
apps/json-diff/
  src/
    App.tsx          # メインコンポーネント
    main.tsx         # エントリポイント
    components/ui/   # shadcn/ui コンポーネント
    utils/           # ユーティリティ関数
      jsonDiff.ts
  index.html
  package.json
  vite.config.ts
  wrangler.toml
```

## ライセンス

MIT
