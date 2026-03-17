# Image Generator

ダミー画像・カスタム画像の生成。ブラウザ上で完結するクライアントサイドツール。

**URL**: https://tools.elchika.app/image-generate

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
cd apps/image-generate
bun run dev

# ビルド
bun run build

# デプロイ
bun run deploy
```

## ディレクトリ構成

```
apps/image-generate/
  src/
    App.tsx          # メインコンポーネント
    main.tsx         # エントリポイント
    components/ui/   # shadcn/ui コンポーネント
    utils/           # ユーティリティ関数
      inputValidation.ts
      canvasGenerator.ts
  index.html
  package.json
  vite.config.ts
  wrangler.toml
```

## ライセンス

MIT
