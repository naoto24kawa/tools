# Image Assets

SNS/デバイス向け画像一括リサイズ。ブラウザ上で完結するクライアントサイドツール。

**URL**: https://tools.elchika.app/image-assets

## 技術スタック

- React 18 + TypeScript
- Vite 6
- Tailwind CSS 3.4 + shadcn/ui
- Cloudflare Pages

### 主要ライブラリ

- `jszip`

## 開発

```bash
# 依存関係のインストール (ルートから)
bun install

# 開発サーバー起動
cd apps/image-assets
bun run dev

# ビルド
bun run build

# デプロイ
bun run deploy
```

## ディレクトリ構成

```
apps/image-assets/
  src/
    App.tsx          # メインコンポーネント
    main.tsx         # エントリポイント
    components/ui/   # shadcn/ui コンポーネント
    utils/           # ユーティリティ関数
      exportImage.ts
      fileSizeCalculator.ts
      assetGenerator.ts
      imageResize.ts
  index.html
  package.json
  vite.config.ts
  wrangler.toml
```

## ライセンス

MIT
