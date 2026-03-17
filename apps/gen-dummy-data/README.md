# Dummy Data

ダミーデータ(JSON/CSV)の生成。ブラウザ上で完結するクライアントサイドツール。

**URL**: https://tools.elchika.app/gen-dummy-data

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
cd apps/gen-dummy-data
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
apps/gen-dummy-data/
  src/
    App.tsx          # メインコンポーネント
    main.tsx         # エントリポイント
    components/ui/   # shadcn/ui コンポーネント
    utils/           # ユーティリティ関数
      dummyData.ts
  index.html
  package.json
  vite.config.ts
  tailwind.config.js
  tsconfig.json
  postcss.config.js
  wrangler.toml
```

## ライセンス

MIT
